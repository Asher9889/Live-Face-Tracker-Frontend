import { useEffect, useRef } from "react";
import type { IFrameState } from "@/types/live";
import {
    LABEL_FONT_PX,
    colorFor,
    displayLabel,
    fitToVideo,
    isPending,
    pickRenderable,
} from "./overlayGeometry";

interface CameraOverlayProps {
  /** Recent frame states, oldest first. Read on every animation frame. */
  bufferRef: React.RefObject<IFrameState[]>;
  videoRef?: React.RefObject<HTMLVideoElement | null>;
}

const CameraOverlay = ({ bufferRef, videoRef }: CameraOverlayProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId = 0;

    const draw = () => {
      const video = videoRef?.current;

      // Match the canvas to what is actually painted, in device pixels.
      const dpr = window.devicePixelRatio || 1;
      const targetW = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const targetH = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const state = pickRenderable(bufferRef.current ?? []);

      if (state && video && video.videoWidth > 0) {
        // Boxes are in published-frame pixels. adaptiveStream may hand us a
        // smaller decode than the source, so scale by the real video size.
        const { dispW, dispH, offX, offY } = fitToVideo(
          canvas.width,
          canvas.height,
          video.videoWidth / video.videoHeight
        );

        const scaleX = dispW / state.frame_width;
        const scaleY = dispH / state.frame_height;

        const fontPx = LABEL_FONT_PX * dpr;
        ctx.font = `600 ${fontPx}px ui-sans-serif, system-ui, sans-serif`;
        ctx.textBaseline = "bottom";
        ctx.lineJoin = "round";

        for (const track of state.tracks) {
          const [x1, y1, x2, y2] = track.bbox;
          const px = offX + x1 * scaleX;
          const py = offY + y1 * scaleY;
          const pw = (x2 - x1) * scaleX;
          const ph = (y2 - y1) * scaleY;

          if (pw <= 0 || ph <= 0) continue;

          const { stroke, text: textColor } = colorFor(track.state, track.label);

          ctx.strokeStyle = stroke;
          ctx.lineWidth = 2 * dpr;
          ctx.strokeRect(px, py, pw, ph);

          // Pending identities are drawn dashed: "we are still working on it".
          if (isPending(track.state)) {
            ctx.setLineDash([6 * dpr, 4 * dpr]);
            ctx.strokeRect(px, py, pw, ph);
            ctx.setLineDash([]);
          }

          const label = displayLabel(track);
          const textW = ctx.measureText(label).width;
          const padX = 5 * dpr;
          const boxH = fontPx + 6 * dpr;
          let labelY = py - 4 * dpr;
          if (labelY - boxH < 0) labelY = py + boxH; // no room above → inside

          ctx.fillStyle = "rgba(2, 6, 23, 0.78)";
          ctx.fillRect(px, labelY - boxH, textW + padX * 2, boxH);

          ctx.fillStyle = textColor;
          ctx.fillText(label, px + padX, labelY - 3 * dpr);
        }
      }

      rafId = requestAnimationFrame(draw);
    };

    rafId = requestAnimationFrame(draw);

    return () => cancelAnimationFrame(rafId);
  }, [bufferRef, videoRef]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-10 h-full w-full"
    />
  );
};

export default CameraOverlay;
