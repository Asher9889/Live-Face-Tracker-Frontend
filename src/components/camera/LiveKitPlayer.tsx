import { useCameraRoom } from "@/components/camera/hooks/useCameraRoom";
import { useCameraVideo } from "@/components/camera/hooks/useCameraVideo";

type Props = {
  cameraId: string;
  videoRef: React.RefObject<HTMLVideoElement | null>;
};

export default function LiveKitPlayer({ cameraId, videoRef }: Props) {
  const { room, error } = useCameraRoom(cameraId);

  useCameraVideo(room, videoRef);

  if (error) return <div>Error starting camera</div>;
  if (!room) return <div>Starting camera...</div>;

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      playsInline
      className="w-full h-full bg-black"
    />
  );
}

