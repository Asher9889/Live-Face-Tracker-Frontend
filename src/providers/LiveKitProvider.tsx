import { useCallback, useEffect, useMemo, useRef } from "react";
import { Room, RoomEvent, ConnectionState } from "livekit-client";
import { LiveKitContext } from "./LiveKitContext";
import { envs } from "@/config";
import { getLiveViewerToken } from "@/services";
import type { ILiveViewerCredentials, TTrackConnectionStatus } from "@/types/live";

type StatusListener = (s: TTrackConnectionStatus) => void;

const mapConnectionState = (state: ConnectionState): TTrackConnectionStatus => {
    switch (state) {
        case ConnectionState.Connected:
            return "connected";
        case ConnectionState.Connecting:
        case ConnectionState.SignalReconnecting:
            return "reconnecting";
        case ConnectionState.Disconnected:
            return "disconnected";
        default:
            return "connecting";
    }
};

export default function LiveKitProvider({ children }: { children: React.ReactNode }) {
    const roomsRef = useRef<Map<string, Promise<Room>>>(new Map());
    const credsRef = useRef<Map<string, ILiveViewerCredentials>>(new Map());
    const statusRef = useRef<Map<string, TTrackConnectionStatus>>(new Map());
    const listenersRef = useRef<Map<string, Set<StatusListener>>>(new Map());

    const setStatus = useCallback((code: string, status: TTrackConnectionStatus) => {
        statusRef.current.set(code, status);
        listenersRef.current.get(code)?.forEach((fn) => fn(status));
    }, []);

    const connectRoom = useCallback(
        async (cameraCode: string): Promise<Room> => {
            setStatus(cameraCode, "connecting");

            const creds = await getLiveViewerToken(cameraCode);
            credsRef.current.set(cameraCode, creds);

            // Server is authoritative for the URL; env is only a fallback so a
            // misconfigured build still connects to something.
            const url = creds.url || envs.liveKitUrl;
            if (!url) {
                setStatus(cameraCode, "error");
                throw new Error("LiveKit URL is not configured");
            }

            const room = new Room({
                adaptiveStream: true,
                dynacast: true,
            });

            room.on(RoomEvent.ConnectionStateChanged, (state) => {
                setStatus(cameraCode, mapConnectionState(state));
            });

            try {
                await room.connect(url, creds.token);
            } catch (error) {
                setStatus(cameraCode, "error");
                throw error;
            }

            setStatus(cameraCode, "connected");
            return room;
        },
        [setStatus]
    );

    const getRoom = useCallback(
        (cameraCode: string): Promise<Room> => {
            const existing = roomsRef.current.get(cameraCode);
            if (existing) return existing;

            // The AI service is the sole publisher; the browser must never ask
            // the backend to start a stream. A viewer cannot publish anyway.
            const pending = connectRoom(cameraCode).catch((error) => {
                // Let the next attempt retry instead of caching a failure.
                roomsRef.current.delete(cameraCode);
                throw error;
            });

            roomsRef.current.set(cameraCode, pending);
            return pending;
        },
        [connectRoom]
    );

    const releaseRoom = useCallback((cameraCode: string) => {
        const pending = roomsRef.current.get(cameraCode);
        roomsRef.current.delete(cameraCode);
        credsRef.current.delete(cameraCode);
        statusRef.current.delete(cameraCode);

        if (!pending) return;
        pending
            .then((room) => room.disconnect())
            .catch(() => {
                /* never connected; nothing to tear down */
            });
    }, []);

    const onStatus = useCallback((cameraCode: string, listener: StatusListener) => {
        let set = listenersRef.current.get(cameraCode);
        if (!set) {
            set = new Set();
            listenersRef.current.set(cameraCode, set);
        }
        set.add(listener);

        // Emit the current value so a late subscriber is never stuck on "idle".
        listener(statusRef.current.get(cameraCode) ?? "idle");

        return () => {
            set?.delete(listener);
            if (set && set.size === 0) {
                listenersRef.current.delete(cameraCode);
            }
        };
    }, []);

    const getStatus = useCallback(
        (cameraCode: string) => statusRef.current.get(cameraCode) ?? "idle",
        []
    );

    const getCredentials = useCallback(
        (cameraCode: string) => credsRef.current.get(cameraCode) ?? null,
        []
    );

    // Tear every socket down when the provider goes away, otherwise the grid
    // leaves a LiveKit session open per camera on navigation.
    useEffect(() => {
        const rooms = roomsRef.current;
        return () => {
            rooms.forEach((pending) => {
                pending.then((room) => room.disconnect()).catch(() => {});
            });
            rooms.clear();
        };
    }, []);

    const value = useMemo(
        () => ({ getRoom, releaseRoom, onStatus, getStatus, getCredentials }),
        [getRoom, releaseRoom, onStatus, getStatus, getCredentials]
    );

    return (
        <LiveKitContext.Provider value={value}>
            {children}
        </LiveKitContext.Provider>
    );
}
