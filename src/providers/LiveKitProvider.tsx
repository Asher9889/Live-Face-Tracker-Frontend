import { useRef } from "react";
import { Room } from "livekit-client";
import { LiveKitContext } from "./LiveKitContext";
import { envs } from "@/config";
import { getCameraToken, startCamera } from "@/services";

export default function LiveKitProvider({ children }: { children: React.ReactNode }) {
    const roomsRef = useRef<Map<string, Promise<Room>>>(new Map());

    async function getRoom(cameraId: string): Promise<Room> {
        if (roomsRef.current.has(cameraId)) {
            return roomsRef.current.get(cameraId)!;
        }

        const roomPromise = (async () => {
            // 1️⃣ Ensure backend stream is started
            await startCamera(cameraId);

            // 2️⃣ Fetch token AFTER backend is ready
            const token = await getCameraToken(cameraId);

            // 3️⃣ Create & connect room
            const room = new Room({
                adaptiveStream: true,
                dynacast: true,
            });

            await room.connect(envs.liveKitUrl, token);

            return room;
        })();

        roomsRef.current.set(cameraId, roomPromise);
        return roomPromise;
    }

    return (
        <LiveKitContext.Provider value={{ getRoom }}>
            {children}
        </LiveKitContext.Provider>
    );
}
