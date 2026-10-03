/**
 * Payload of the `frame_state` message published by the AI service on the
 * LiveKit data channel (topic `frame_state`).
 *
 * Bounding boxes are ALREADY scaled into the published frame's pixel space, so
 * they map 1:1 onto the video track. They are not normalised percentages.
 */

type TTrackState =
    | "COLLECTING_FRAME"
    | "COLLECTING_KNOWN"
    | "MATCHED_KNOWN"
    | "COLLECTING_UNKNOWN"
    | "MATCHED_UNKNOWN"
    | "UPDATING_UNKNOWN";

interface IFrameTrack {
    track_id: number;
    /** [x1, y1, x2, y2] in published-frame pixels. */
    bbox: [number, number, number, number];
    state: TTrackState | null;
    /** Employee id, synthetic unknown id, or null while still pending. */
    label: string | null;
    /** Human-readable name for the overlay. Falls back to label when absent. */
    label_name?: string | null;
    label_confidence: number;
    /** null until automatic re-verification lands. */
    label_expires_at: number | null;
    /** For COLLECTING_UNKNOWN: number of frames collected so far. */
    buffer_size?: number;
}

interface IFrameState {
    type: "frame_state";
    camera_code: string;
    seq: number;
    /** Capture time in ms, stamped at decode — not the time the message arrived. */
    frameTs: number;
    frame_width: number;
    frame_height: number;
    tracks: IFrameTrack[];
}

/** Credentials returned by GET /live/cameras/:code/token. */
interface ILiveViewerCredentials {
    url: string;
    token: string;
    room: string;
    identity: string;
    expiresInSeconds: number;
}

type TTrackConnectionStatus =
    | "idle"
    | "connecting"
    | "connected"
    | "reconnecting"
    | "disconnected"
    | "error";

export type {
    IFrameState,
    IFrameTrack,
    ILiveViewerCredentials,
    TTrackState,
    TTrackConnectionStatus,
};
