import { useCameraRoom } from "@/components/camera/hooks/useCameraRoom";
import { useCameraVideo } from "@/components/camera/hooks/useCameraVideo";
import { useLiveKitStatus } from "@/components/camera/hooks/useLiveKitStatus";
import { AlertTriangle, Loader2, SignalZero } from "lucide-react";

type Props = {
  cameraId: string;
  videoRef: React.RefObject<HTMLVideoElement | null>;
};

export default function LiveKitPlayer({ cameraId, videoRef }: Props) {
  const { room, error } = useCameraRoom(cameraId);
  const status = useLiveKitStatus(cameraId);

  // The <video> element is mounted unconditionally. useCameraVideo resolves the
  // element inside its effect, and an effect that runs while the element is
  // still null never re-runs — so unmounting it during "Connecting…" meant the
  // track was never attached and the tile stayed black. Keeping it in the DOM
  // for the whole lifecycle is what makes the attach land.
  useCameraVideo(room, videoRef);

  return (
    <div className="relative h-full w-full bg-black">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        // contain, so the published frame is never cropped and boxes line up
        className="h-full w-full bg-black object-contain"
      />

      {/* Status is a layer above the video, not a replacement for it, so the
          element never leaves the DOM and the overlay can still measure it. */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-muted/10 text-muted-foreground">
          <AlertTriangle className="mb-1 h-8 w-8 opacity-70" />
          <p className="text-xs">Cannot reach camera</p>
        </div>
      )}

      {!error && status !== "connected" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-muted/10 text-muted-foreground">
          {status === "disconnected" || status === "error" ? (
            <>
              <SignalZero className="mb-1 h-8 w-8 opacity-50" />
              <p className="text-xs">Signal lost</p>
            </>
          ) : (
            <>
              <Loader2 className="mb-1 h-8 w-8 animate-spin opacity-70" />
              <p className="text-xs">
                {status === "reconnecting" ? "Reconnecting…" : "Connecting…"}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
