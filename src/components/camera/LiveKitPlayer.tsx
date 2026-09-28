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

  useCameraVideo(room, videoRef);

  if (error) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-muted/10 text-muted-foreground">
        <AlertTriangle className="mb-1 h-8 w-8 opacity-70" />
        <p className="text-xs">Cannot reach camera</p>
      </div>
    );
  }

  if (!room || status === "idle" || status === "connecting" || status === "reconnecting") {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-muted/10 text-muted-foreground">
        <Loader2 className="mb-1 h-8 w-8 animate-spin opacity-70" />
        <p className="text-xs">
          {status === "reconnecting" ? "Reconnecting…" : "Connecting…"}
        </p>
      </div>
    );
  }

  if (status === "disconnected" || status === "error") {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-muted/10 text-muted-foreground">
        <SignalZero className="mb-1 h-8 w-8 opacity-50" />
        <p className="text-xs">Signal lost</p>
      </div>
    );
  }

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      playsInline
      // contain, so the published frame is never cropped and boxes line up
      className="h-full w-full bg-black object-contain"
    />
  );
}
