import { Maximize2, MoreVertical } from 'lucide-react';
import { Card } from '@/components/ui/card';
import LiveKitPlayer from './LiveKitPlayer';
import CameraOverlay from './CameraOverlay';
import { cn } from '@/utils/cn';
import { useRef } from 'react';
import { useFrameState } from './hooks/useFrameState';
import { useLiveKitStatus } from './hooks/useLiveKitStatus';
import { useVideoFps } from './hooks/useVideoFps';

type TLiveCamStatus = "online" | "offline" | "connecting" | "error";

interface LiveCameraCardProps {
  camera: {
    code: string;        // LiveKit room name
    name: string;
    location: string;
    status: TLiveCamStatus;
  };
  onFullscreen?: () => void;
}

const LiveCameraCard = ({ camera, onFullscreen }: LiveCameraCardProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Boxes now arrive on the LiveKit data channel, alongside the video they
  // describe, instead of a shared WebSocket topic.
  const { latest, hasData, bufferRef } = useFrameState(camera.code);
  const connection = useLiveKitStatus(camera.code);
  const fps = useVideoFps(videoRef);

  const live = connection === "connected";
  const pending = connection === "connecting" || connection === "reconnecting" || connection === "idle";
  const peopleCount = latest?.tracks.length ?? 0;

  return (
    <Card className="group relative overflow-hidden border-border/50 bg-black/90">
      {/* The published frame decides its own aspect ratio, so the box must not
          be pinned to a fixed stage size the way the old 704x576 one was. */}
      <div className="relative flex aspect-video items-center justify-center overflow-hidden">
        <LiveKitPlayer videoRef={videoRef} cameraId={camera.code} />
        <CameraOverlay bufferRef={bufferRef} videoRef={videoRef} />
      </div>

      {/* Always-visible status strip: the hover panel is unusable for a wall of
          cameras where you cannot hover each one. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-3">
        <div className="flex items-center gap-2 rounded bg-black/60 px-2 py-1 text-xs text-white">
          <span
            className={cn(
              "h-2 w-2 rounded-full",
              live ? "bg-green-500" : pending ? "animate-pulse bg-amber-400" : "bg-red-500"
            )}
          />
          <span className="font-medium">{camera.name}</span>
          {live && (
            <span className="text-white/60">
              {hasData ? `${peopleCount} in view` : "no detections"}
            </span>
          )}
          {live && (
            <span
              title="Frames per second rendered on this client"
              className={cn(
                "tabular font-medium",
                fps >= 13 ? "text-emerald-300" : fps >= 7 ? "text-amber-400" : "text-red-400"
              )}
            >
              {fps} FPS
            </span>
          )}
        </div>
        <button className="pointer-events-auto rounded-full bg-black/60 p-1.5 text-white">
          <MoreVertical className="h-4 w-4" />
        </button>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/80 to-transparent p-3">
        <p className="text-xs text-white/60">{camera.location}</p>
        <button
          onClick={onFullscreen}
          className="pointer-events-auto rounded-full bg-white/10 p-2 text-white"
        >
          <Maximize2 className="h-4 w-4" />
        </button>
      </div>
    </Card>
  );
};

export default LiveCameraCard;
