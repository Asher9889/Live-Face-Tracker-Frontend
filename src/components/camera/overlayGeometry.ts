import type { IFrameState, IFrameTrack, TTrackState } from "@/types/live";

/**
 * Video and metadata are separate channels, so a `frame_state` can land before
 * its frame is painted. Drawing it immediately puts track A's box on track B's
 * pixels. Falling a little behind is invisible; drawing ahead is not, so we
 * render the newest state that is already old enough to be on screen.
 */
export const OVERLAY_DELAY_MS = 120;

export const LABEL_FONT_PX = 13;

export type TTrackColor = { stroke: string; text: string };

/** Green = identified, amber = unknown, blue = still deciding, grey = nothing yet. */
export function colorFor(state: TTrackState | null, label: string | null): TTrackColor {
    if (state === "MATCHED_KNOWN") return { stroke: "#22c55e", text: "#bbf7d0" };
    if (state === "MATCHED_UNKNOWN" || state === "UPDATING_UNKNOWN") {
        return { stroke: "#f59e0b", text: "#fde68a" };
    }
    if (state === "COLLECTING_KNOWN" || state === "COLLECTING_UNKNOWN") {
        return { stroke: "#38bdf8", text: "#bae6fd" };
    }
    return { stroke: label ? "#a78bfa" : "#94a3b8", text: "#e2e8f0" };
}

export function isPending(state: TTrackState | null): boolean {
    return state === "COLLECTING_KNOWN" || state === "COLLECTING_FRAME";
}

export function displayLabel(track: IFrameTrack): string {
    if (track.label) return track.label;
    if (track.state === "COLLECTING_KNOWN") return "identifying…";
    if (track.state === "COLLECTING_UNKNOWN" || track.state === "COLLECTING_FRAME") {
        return "unidentified";
    }
    return `track ${track.track_id}`;
}

/** Newest buffered state that is at least OVERLAY_DELAY_MS old. */
export function pickRenderable(buffer: IFrameState[], now = Date.now()): IFrameState | null {
    const cutoff = now - OVERLAY_DELAY_MS;
    let chosen: IFrameState | null = null;
    for (const state of buffer) {
        if (state.frameTs <= cutoff) chosen = state;
        else break; // buffer is ordered, so nothing later qualifies
    }
    return chosen;
}

/**
 * The rect the video actually occupies inside the canvas, mirroring what
 * `object-contain` does in CSS.
 *
 * Only the video's own aspect ratio matters: the browser letterboxes it to fit.
 * The bbox coordinate space is scaled separately against frame_width and
 * frame_height, so a published-frame aspect is deliberately not an input.
 */
export function fitToVideo(
    canvasW: number,
    canvasH: number,
    videoAspect: number
): { dispW: number; dispH: number; offX: number; offY: number } {
    const canvasAspect = canvasW / canvasH;

    if (Math.abs(videoAspect - canvasAspect) <= 0.01) {
        return { dispW: canvasW, dispH: canvasH, offX: 0, offY: 0 };
    }

    // Video is proportionally wider than the box → bars top and bottom.
    if (videoAspect > canvasAspect) {
        const dispH = canvasW / videoAspect;
        return { dispW: canvasW, dispH, offX: 0, offY: (canvasH - dispH) / 2 };
    }

    // Video is proportionally taller → bars left and right.
    const dispW = canvasH * videoAspect;
    return { dispW, dispH: canvasH, offX: (canvasW - dispW) / 2, offY: 0 };
}
