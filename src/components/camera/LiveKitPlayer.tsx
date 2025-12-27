import { useCameraToken } from "./hooks/useCameraToken";
import { useLiveKitRoom } from "./hooks/useLiveKitRoom";

type Props = {
  cameraId: string;
  videoRef: React.RefObject<HTMLVideoElement | null>;
};

export default function LiveKitPlayer({ cameraId, videoRef }: Props) {

   const { data, isLoading, error } = useCameraToken(cameraId);
   useLiveKitRoom({ token: data?.token, videoRef});
   if (isLoading) return <div>Loading...</div>;
   if (error) return <div>Error: {error.message}</div>;

  return (
    <video
      width={704}
      height={576}
      ref={videoRef}
      autoPlay
      playsInline
      muted
      className="w-full h-full object-contain bg-black"
    />
  );
}

