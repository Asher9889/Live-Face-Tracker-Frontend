// import { useCameraToken } from "./hooks/useCameraToken";
// import { useLiveKitRoom } from "./hooks/useLiveKitRoom";

// type Props = {
//   cameraId: string;
//   videoRef: React.RefObject<HTMLVideoElement | null>;
// };

// export default function LiveKitPlayer({ cameraId, videoRef }: Props) {

//    const { data, isLoading, error } = useCameraToken(cameraId);
//    useLiveKitRoom({ token: data?.token, videoRef});
//    if (isLoading) return <div>Loading...</div>;
//    if (error) return <div>Error: {error.message}</div>;

//   return (
//     <video
//       width={704}
//       height={576}
//       ref={videoRef}
//       autoPlay
//       playsInline
//       muted
//       className="w-full h-full object-contain bg-black"
//     />
//   );
// }




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

