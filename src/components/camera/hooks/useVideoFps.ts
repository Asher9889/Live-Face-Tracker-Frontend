import { useEffect, useState, type RefObject } from "react";

const WINDOW_MS = 1000;
const STALL_MS = 2500;

/**
 * Frames per second a <video> actually paints, i.e. what the viewer sees.
 *
 * requestVideoFrameCallback fires once per frame sent to the compositor, so
 * the count includes every drop that happened upstream — publish throttling,
 * network, decode — unlike WebRTC inbound-rtp stats, which stop at the
 * decoder. Cost is one setState per second per tile; the callback chain does
 * nothing else.
 */
export function useVideoFps(videoRef: RefObject<HTMLVideoElement | null>): number {
  const [fps, setFps] = useState(0);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    let stopped = false;
    let frames = 0;
    let windowStart = performance.now();
    let lastFrameAt = windowStart;
    let handle = 0;
    let timer: number | undefined;

    const emit = (next: number) => setFps((prev) => (prev === next ? prev : next));
    const supportsRVFC =
      typeof el.requestVideoFrameCallback === "function" &&
      typeof el.cancelVideoFrameCallback === "function";

    if (supportsRVFC) {
      const onFrame: VideoFrameRequestCallback = (now) => {
        if (stopped) return;
        lastFrameAt = now;
        frames += 1;
        if (now - windowStart >= WINDOW_MS) {
          emit(Math.round((frames * 1000) / (now - windowStart)));
          frames = 0;
          windowStart = now;
        }
        handle = el.requestVideoFrameCallback(onFrame);
      };
      handle = el.requestVideoFrameCallback(onFrame);

      // Stall (decoder freeze, paused stream, hidden tab) must read 0 rather
      // than freezing on the last value that was measured.
      timer = window.setInterval(() => {
        if (performance.now() - lastFrameAt > STALL_MS) emit(0);
      }, WINDOW_MS);
    } else {
      // Fallback: totalVideoFrames counts frames displayed or dropped since load.
      let lastTotal = el.getVideoPlaybackQuality().totalVideoFrames;
      let lastAt = performance.now();
      timer = window.setInterval(() => {
        if (stopped) return;
        const now = performance.now();
        const total = el.getVideoPlaybackQuality().totalVideoFrames;
        const elapsed = now - lastAt;
        emit(elapsed > 0 ? Math.round(((total - lastTotal) * 1000) / elapsed) : 0);
        lastTotal = total;
        lastAt = now;
      }, WINDOW_MS);
    }

    const onInterrupted = () => emit(0);
    el.addEventListener("pause", onInterrupted);
    el.addEventListener("emptied", onInterrupted);

    return () => {
      stopped = true;
      if (timer !== undefined) window.clearInterval(timer);
      if (supportsRVFC) el.cancelVideoFrameCallback(handle);
      el.removeEventListener("pause", onInterrupted);
      el.removeEventListener("emptied", onInterrupted);
    };
  }, [videoRef]);

  return fps;
}
