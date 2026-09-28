import { createContext } from "react";
import { Room } from "livekit-client";
import type { ILiveViewerCredentials, TTrackConnectionStatus } from "@/types/live";

export type CameraRoomManager = {
  /**
   * Connect (or reuse) the room for a camera. Resolves once connected.
   * Rejects if the camera is unknown, disabled, or the room cannot be reached.
   */
  getRoom: (cameraCode: string) => Promise<Room>;
  /** Forget a room so the next getRoom() reconnects. */
  releaseRoom: (cameraCode: string) => void;
  /** Subscribe to connection status for one camera. Returns an unsubscribe fn. */
  onStatus: (cameraCode: string, listener: (s: TTrackConnectionStatus) => void) => () => void;
  /** Current status snapshot, for reading state before a listener attaches. */
  getStatus: (cameraCode: string) => TTrackConnectionStatus;
  /** Server-provided LiveKit URL, resolved on first connect. */
  getCredentials: (cameraCode: string) => ILiveViewerCredentials | null;
};

export const LiveKitContext = createContext<CameraRoomManager | null>(null);
