import { useContext, useEffect, useState } from "react";
import { Room } from "livekit-client";
import { LiveKitContext } from "@/providers/LiveKitContext";

export function useCameraRoom(cameraId: string) {
  const ctx = useContext(LiveKitContext);
  const [room, setRoom] = useState<Room | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!ctx || !cameraId) return;

    let cancelled = false;

    ctx.getRoom(cameraId)
      .then((room) => {
        if (!cancelled) setRoom(room);
      })
      .catch(setError);

    return () => {
      cancelled = true;
    };
  }, [cameraId, ctx]);

  return { room, error };
}
