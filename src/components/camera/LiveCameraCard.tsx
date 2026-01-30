import { Maximize2, MoreVertical } from 'lucide-react';
import { Card } from '@/components/ui/card';
import LiveKitPlayer from './LiveKitPlayer';
import CameraOverlay from './CameraOverlay';
import { cn } from '@/utils/cn';
import { useEffect, useRef } from 'react';
import { subscribeBBox } from '@/services/ws/bbox';

type TLiveCamStatus = "online" | "offline" | "connecting" | "error";

interface LiveCameraCardProps {
  camera: {
    code: string;        // entry_1 (LiveKit room)
    name: string;
    location: string;
    status: TLiveCamStatus;
  };
  onFullscreen?: () => void;
}

const LiveCameraCard = ({ camera, onFullscreen }: LiveCameraCardProps) => {
  const bboxRef = useRef<any | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const scaleRef = useRef<HTMLDivElement | null>(null);


  useEffect(() => {
    const scaleEl = scaleRef.current;
    const parent = scaleEl?.parentElement;
    if (!scaleEl || !parent) return;

    const ro = new ResizeObserver(() => {
      const scaleX = parent.clientWidth / 704;
      const scaleY = parent.clientHeight / 576;
      const scale = Math.min(scaleX, scaleY);

      scaleEl.style.transform = `scale(${scale})`;
      scaleEl.style.transformOrigin = "center";
    });

    ro.observe(parent);

    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeBBox(camera.code, (payload) => {
      bboxRef.current = {
        ...payload,
        receivedAt: Date.now(),
        visibleAfter: Date.now() + 6000,

      };
    });

    return unsubscribe;
  }, [camera.code]);

  return (
    <Card className="relative overflow-hidden group bg-black/90 border-border/50 ">
      <div className="aspect-video relative flex items-center justify-center overflow-hidden">

        {/* SCALE WRAPPER (participates in layout) */}
        <div ref={scaleRef} className="relative">

          {/* FIXED LOGICAL STAGE (never scaled logically) */}
          <div ref={stageRef} className="relative" style={{ width: 704, height: 576 }}>

            {/* {camera.status === 'online' ? (
              <LiveKitPlayer videoRef={videoRef} cameraId={camera.code} />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-muted/10">
                <SignalZero className="h-12 w-12 mb-2 opacity-50" />
                <p>Signal Lost</p>
              </div>
            )} */}

            <LiveKitPlayer videoRef={videoRef} cameraId={camera.code} />


            <CameraOverlay bboxRef={bboxRef} cameraCode={camera.code} videoRef={videoRef} />



          </div>
        </div>
      </div>

      {/* Hover UI – unchanged */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
        <div className="flex justify-between items-start">
          <div className="bg-black/50 px-2 py-1 rounded text-xs text-white flex items-center gap-2">
            <span className={cn(
              "h-2 w-2 rounded-full animate-pulse",
              camera.status === 'online' ? "bg-green-500" : "bg-red-500"
            )} />
            {camera.status.toUpperCase()} • {"cameraLiveStatus.fps"} FPS
          </div>
          <button className="p-1.5 bg-black/50 rounded-full text-white">
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>

        <div className="flex justify-between items-end">
          <div>
            <h3 className="text-white font-medium text-sm">{camera.name}</h3>
            <p className="text-white/60 text-xs">{camera.location}</p>
          </div>
          <button
            onClick={onFullscreen}
            className="p-2 bg-white/10 rounded-full text-white"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      
    </Card>
  );
};

export default LiveCameraCard;
