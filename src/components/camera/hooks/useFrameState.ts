import { useEffect, useRef, useState } from "react";
import { RoomEvent } from "livekit-client";
import { useCameraRoom } from "./useCameraRoom";
import type { IFrameState } from "@/types/live";

const TOPIC = "frame_state";

/** How many recent frame states to retain for the render delay. */
const BUFFER_LIMIT = 12;

/** React re-render interval; the canvas animates between these. */
const STATE_PUSH_MS = 200;

/**
 * `frame_state` messages for a camera, arriving on the LiveKit data channel.
 *
 * This replaces the old WebSocket FACE_BBOX feed: boxes now ride with the video
 * they describe, so they cannot arrive for the wrong camera or a stale frame the
 * way a shared WS topic could.
 *
 * Messages are kept in a ref, not state. The overlay reads the buffer on every
 * animation frame, so pushing 15 messages a second through React would re-render
 * the whole card for nothing.
 */
export function useFrameState(cameraCode: string) {
    const { room } = useCameraRoom(cameraCode);

    /** Recent states, oldest first. Read by the overlay, not by React. */
    const bufferRef = useRef<IFrameState[]>([]);
    const lastPushRef = useRef(0);

    const [latest, setLatest] = useState<IFrameState | null>(null);

    // Derived, not effect-driven: guards against rendering the previous camera's
    // data in the frame before a fresh message lands.
    const current = latest?.camera_code === cameraCode ? latest : null;
    const hasData = current !== null;

    useEffect(() => {
        // Reset whenever the room or camera changes, before any listener fires.
        bufferRef.current = [];
        lastPushRef.current = 0;

        if (!room) return;

        // A new session must not inherit the previous session's high-water mark.
        // The AI numbers frames per process, but the buffer is also cleared on a
        // reconnect so that any numbering discontinuity — publisher restart,
        // counter reset, failover to another instance — is absorbed here rather
        // than silently discarding every message as a duplicate.
        const reset = () => {
            bufferRef.current = [];
            lastPushRef.current = 0;
            setLatest(null);
        };

        const onData = (
            payload: Uint8Array,
            _participant: unknown,
            _kind: unknown,
            topic?: string
        ) => {
            // Older SDK builds omit the topic argument.
            if (topic && topic !== TOPIC) return;

            let parsed: IFrameState;
            try {
                parsed = JSON.parse(new TextDecoder().decode(payload));
            } catch {
                return; // not ours, or truncated
            }

            if (parsed?.type !== TOPIC) return;
            if (parsed.camera_code && parsed.camera_code !== cameraCode) return;

            const buffer = bufferRef.current;
            const last = buffer[buffer.length - 1];
            // The channel is unreliable: duplicates and reordering are possible.
            if (last && parsed.seq <= last.seq) return;

            buffer.push(parsed);
            if (buffer.length > BUFFER_LIMIT) buffer.shift();

            const now = Date.now();
            if (now - lastPushRef.current >= STATE_PUSH_MS) {
                lastPushRef.current = now;
                setLatest(parsed);
            }
        };

        room.on(RoomEvent.DataReceived, onData);
        room.on(RoomEvent.Connected, reset);
        room.on(RoomEvent.Reconnected, reset);
        room.on(RoomEvent.Disconnected, reset);
        return () => {
            room.off(RoomEvent.DataReceived, onData);
            room.off(RoomEvent.Connected, reset);
            room.off(RoomEvent.Reconnected, reset);
            room.off(RoomEvent.Disconnected, reset);
        };
    }, [room, cameraCode]);

    return { latest: current, hasData, bufferRef };
}
