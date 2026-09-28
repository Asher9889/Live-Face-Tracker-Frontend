import { useContext, useEffect, useState } from "react";
import { LiveKitContext } from "@/providers/LiveKitContext";
import type { TTrackConnectionStatus } from "@/types/live";

/** Connection status for one camera's room. */
export function useLiveKitStatus(cameraCode: string): TTrackConnectionStatus {
  const ctx = useContext(LiveKitContext);
  const [status, setStatus] = useState<TTrackConnectionStatus>("idle");

  useEffect(() => {
    if (!ctx) return;
    return ctx.onStatus(cameraCode, setStatus);
  }, [ctx, cameraCode]);

  return status;
}
