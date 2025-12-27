import { useEffect, useRef } from "react";

interface CameraOverlayProps {
  cameraCode: string;
  videoRef?: React.RefObject<HTMLVideoElement | null>;
  bboxRef?: React.RefObject<any | null>;
}

const CameraOverlay = ({ videoRef, bboxRef }: CameraOverlayProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef?.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId: number;

    const draw = () => {
      // wait for video metadata
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        rafId = requestAnimationFrame(draw);
        return;
      }

      // sync canvas size
      if (
        canvas.width !== video.videoWidth ||
        canvas.height !== video.videoHeight
      ) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const data = bboxRef?.current;
      const now = Date.now();

      if (data?.bbox && data.visibleAfter <= now) {
        const { x, y, width, height } = data.bbox;

        const px = (x / 100) * canvas.width;
        const py = (y / 100) * canvas.height;
        const pw = (width / 100) * canvas.width;
        const ph = (height / 100) * canvas.height;

        ctx.strokeStyle = "lime";
        ctx.lineWidth = 2;
        ctx.strokeRect(px, py, pw, ph);

        ctx.font = "14px Arial";
        ctx.fillStyle = "lime";
        ctx.fillText(
          `ID ${data.trackId}`,
          px,
          Math.max(py - 6, 12)
        );
      }

      rafId = requestAnimationFrame(draw);
    };

    draw(); // 🔥 ALWAYS start loop

    return () => cancelAnimationFrame(rafId);
  }, [videoRef, bboxRef]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-10"
    />
  );
};

export default CameraOverlay;
