import { useState, useEffect } from 'react';
import { Maximize2, MoreVertical, SignalZero } from 'lucide-react';
import { Card } from '@/components/ui/card';
import LiveKitPlayer from './LiveKitPlayer';
import CameraOverlay, { type BoundingBox } from './CameraOverlay';
import { cn } from '@/utils/cn';

interface LiveCameraCardProps {
  camera: {
  id: string;        // entry_1 (LiveKit room)
  name: string;
  status: 'online' | 'offline' | 'error';
};
  onFullscreen?: () => void;
}

type TLiveCamStatus = "online" | "offline" | "connecting";
const LiveCameraCard = ({ camera, onFullscreen }: LiveCameraCardProps) => {
  const [boxes, setBoxes] = useState<BoundingBox[]>([]);
  const [cameraLiveStatus, setCameraLiveStatus] = useState({
    fps: 0,
    bitrate: 0,
    packetLoss: 0,
    status: "offline" as TLiveCamStatus,
  });

  useEffect(() => {
    if (camera.status !== 'online') return;

    const interval = setInterval(() => {
      const hasPerson = Math.random() > 0.5;
      setBoxes(
        hasPerson
          ? [{
              id: Date.now().toString(),
              x: 20,
              y: 20,
              width: 25,
              height: 35,
              label: 'Employee #123',
              confidence: 0.92,
              isKnown: true,
            }]
          : []
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [camera.status]);

  return (
    <Card className="relative overflow-hidden group bg-black/90 border-border/50">
      <div className="aspect-video relative">
        {camera.status === 'online' ? (
          <LiveKitPlayer cameraId={camera.id} setCameraLiveStatus={setCameraLiveStatus} />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-muted/10">
            <SignalZero className="h-12 w-12 mb-2 opacity-50" />
            <p>Signal Lost</p>
          </div>
        )}

        <CameraOverlay boxes={boxes} />

        {/* Hover UI – unchanged */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
          <div className="flex justify-between items-start">
            <div className="bg-black/50 px-2 py-1 rounded text-xs text-white flex items-center gap-2">
              <span className={cn(
                "h-2 w-2 rounded-full animate-pulse",
                cameraLiveStatus.status === 'online' ? "bg-green-500" : "bg-red-500"
              )} />
              {cameraLiveStatus.status.toUpperCase()} • {cameraLiveStatus.fps} FPS
            </div>
            <button className="p-1.5 bg-black/50 rounded-full text-white">
              <MoreVertical className="h-4 w-4" />
            </button>
          </div>

          <div className="flex justify-between items-end">
            <div>
              <h3 className="text-white font-medium text-sm">{camera.name}</h3>
              <p className="text-white/60 text-xs">Main Entrance</p>
            </div>
            <button
              onClick={onFullscreen}
              className="p-2 bg-white/10 rounded-full text-white"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default LiveCameraCard;
