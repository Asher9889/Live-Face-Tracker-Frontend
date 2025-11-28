import { useEffect, useRef } from 'react';

interface JSMpegPlayerProps {
    url: string;
    options?: any;
}

declare global {
    interface Window {
        JSMpeg: any;
    }
}

const JSMpegPlayer = ({ url, options }: JSMpegPlayerProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const playerRef = useRef<any>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        // Destroy existing player if any
        if (playerRef.current) {
            try {
                playerRef.current.destroy();
            } catch (e) {
                console.warn("Error destroying existing JSMpeg player:", e);
            }
            playerRef.current = null;
        }

        if (window.JSMpeg) {
            try {
                playerRef.current = new window.JSMpeg.Player(url, {
                    canvas: canvasRef.current,
                    autoplay: true,
                    audio: false,
                    ...options,
                });
            } catch (e) {
                console.error("Failed to initialize JSMpeg player:", e);
            }
        } else {
            console.error("JSMpeg library not loaded");
        }

        return () => {
            if (playerRef.current) {
                try {
                    playerRef.current.destroy();
                } catch (e) {
                    console.warn("Error destroying JSMpeg player on cleanup:", e);
                }
                playerRef.current = null;
            }
        };
    }, [url, options]);

    return (
        <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
            <canvas
                ref={canvasRef}
                className="w-full h-full object-cover block"
            />
            {/* Overlay logic is handled by parent or separate component */}
        </div>
    );
};

import ErrorBoundary from '@/components/ui/error-boundary';

const JSMpegPlayerWrapper = (props: JSMpegPlayerProps) => (
    <ErrorBoundary>
        <JSMpegPlayer {...props} />
    </ErrorBoundary>
);

export default JSMpegPlayerWrapper;
