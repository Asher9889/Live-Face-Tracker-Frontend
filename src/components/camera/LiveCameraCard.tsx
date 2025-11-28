import { useState, useEffect } from 'react';
import { Maximize2, MoreVertical, SignalZero } from 'lucide-react';
import { Card } from '@/components/ui/card';
import JSMpegPlayer from './JSMpegPlayer';
import CameraOverlay, { type BoundingBox } from './CameraOverlay';
import { cn } from '@/utils/cn';

interface LiveCameraCardProps {
    camera: {
        id: string;
        name: string;
        url: string;
        status: 'online' | 'offline' | 'error';
        fps: number;
    };
    onFullscreen?: () => void;
}

const LiveCameraCard = ({ camera, onFullscreen }: LiveCameraCardProps) => {
    const [boxes, setBoxes] = useState<BoundingBox[]>([]);

    // Mock AI detection updates
    useEffect(() => {
        if (camera.status !== 'online') return;

        const interval = setInterval(() => {
            // Randomly generate bounding boxes for demo
            const hasPerson = Math.random() > 0.5;
            if (hasPerson) {
                setBoxes([
                    {
                        id: Date.now().toString(),
                        x: 20 + Math.random() * 40,
                        y: 20 + Math.random() * 40,
                        width: 15 + Math.random() * 10,
                        height: 25 + Math.random() * 10,
                        label: Math.random() > 0.3 ? 'Employee #123' : 'Unknown',
                        confidence: 0.85 + Math.random() * 0.14,
                        isKnown: Math.random() > 0.3,
                    },
                ]);
            } else {
                setBoxes([]);
            }
        }, 2000);

        return () => clearInterval(interval);
    }, [camera.status]);

    return (
        <Card className="relative overflow-hidden group bg-black/90 border-border/50">
            {/* Video Feed */}
            <div className="aspect-video relative">
                {camera.status === 'online' ? (
                    <JSMpegPlayer url={camera.url} />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-muted/10">
                        <SignalZero className="h-12 w-12 mb-2 opacity-50" />
                        <p>Signal Lost</p>
                    </div>
                )}

                {/* AI Overlay */}
                <CameraOverlay boxes={boxes} />

                {/* Hover Controls */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
                    <div className="flex justify-between items-start">
                        <div className="bg-black/50 backdrop-blur-md px-2 py-1 rounded text-xs font-mono text-white flex items-center gap-2">
                            <span className={cn(
                                "h-2 w-2 rounded-full animate-pulse",
                                camera.status === 'online' ? "bg-green-500" : "bg-red-500"
                            )} />
                            {camera.status.toUpperCase()} • {camera.fps} FPS
                        </div>
                        <button className="p-1.5 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors">
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
                            className="p-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors"
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
