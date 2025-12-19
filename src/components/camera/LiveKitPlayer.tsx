import { useEffect, useRef, useState } from "react";
import { ConnectionState, Room, RoomEvent, Track } from "livekit-client";
import { calculateFPS } from "@/utils";
import { envs } from "@/config";

type Props = {
  cameraId: string;
  setCameraLiveStatus: (metaData: any) => void;
};

export default function LiveKitPlayer({ cameraId, setCameraLiveStatus }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const roomRef = useRef<Room | null>(null);
  const lastFpsRef = useRef<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cameraStatus, setCameraStatus] = useState<'online' | 'offline' | 'connecting' | 'error'>('connecting');

  useEffect(() => {
    let mounted = true;

    async function connect() {
      try {
        // 1️⃣ Fetch viewer token
        const res = await fetch(`http://localhost:4500/api/v1/cameras/${cameraId}/token`);

        if (!res.ok) throw new Error("Failed to fetch token");

        const { data } = await res.json();
        const token  = data.token;
        console.log("Token is", token)

        // 2️⃣ Create room
        const room = new Room({
          adaptiveStream: true,
          dynacast: true,
          videoCaptureDefaults: {
            deviceId: "none"
          },
          publishDefaults: {
            audioPreset: undefined
          }
        });

        roomRef.current = room;

        // 3️⃣ Attach tracks
        /**
         * It does NOT mean:
            FPS changed
            bitrate changed
            packet loss updated
            track.getStats(); to get realTime updated we need to call it manually
         */
        room.on(RoomEvent.TrackSubscribed, (track) => { 
          if (track.kind !== Track.Kind.Video) return;
          if ( track.kind === Track.Kind.Video && videoRef.current) {
            track.attach(videoRef.current);
            const statsInterval = setInterval( async () => {
                const stats = await track.receiver?.getStats();
                const fps = calculateFPS(stats as RTCStatsReport);
                if (fps !== lastFpsRef.current) {
                    lastFpsRef.current = fps;
                     setCameraLiveStatus({
                        fps,
                        status: cameraStatus  
                    })
                }
            }, 1000)
            track.on("ended", () => clearInterval(statsInterval));
          }
        });
        // 4️⃣ Connect to LiveKit
        await room.connect(envs.liveKitUrl, token);

        if (!mounted) room.disconnect();
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      }
    }

    connect();

    return () => {
      mounted = false;
      roomRef.current?.disconnect();
    };
  }, [cameraId]);

  if (error) {
    return (
      <div className="flex items-center justify-center bg-black text-red-500">
        {error}
      </div>
    );
  }

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted
      className="w-full h-full object-cover bg-black"
    />
  );
}
