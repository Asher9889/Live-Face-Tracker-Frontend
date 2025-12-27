import { useQuery } from "@tanstack/react-query";
import { getToken } from "./camera.api";
import { Room, RoomEvent, Track } from "livekit-client";
import { envs } from "@/config";
import { isPending } from "@reduxjs/toolkit";

type props = {
    cameraCode: string;
    roomRef: React.RefObject<Room | null>;
    videoRef: React.RefObject<HTMLVideoElement | null>
}

const useCamera = async ({cameraCode, roomRef, videoRef}: props) => {

    const { data, isLoading, error } = useQuery({
        queryKey: ["cameraCode", cameraCode],
        queryFn: () => getToken(cameraCode), // cameras/${cameraId}/token
    })

    const token = data.token;

    // 2️⃣ Create room
    const room = new Room({
        adaptiveStream: true,
        dynacast: true,
    });

    roomRef.current = room;

    // 3️⃣ Attach video track
    room.on(RoomEvent.TrackSubscribed, (track) => {
        if (track.kind === Track.Kind.Video && videoRef.current) {
            track.attach(videoRef.current);
        }
    });

    // 4️⃣ Detach on unsubscribe
    room.on(RoomEvent.TrackUnsubscribed, (track) => {
        if (track.kind === Track.Kind.Video) {
            track.detach();
        }
    });

    // 5️⃣ Connect
    await room.connect(envs.liveKitUrl, token);


    return { data, isLoading, error, isPending }
}

export default useCamera;