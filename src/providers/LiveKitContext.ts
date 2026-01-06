import { createContext } from "react";
import { Room } from "livekit-client";

export type CameraRoomManager = {
  getRoom: (cameraId: string) => Promise<Room>;
};

export const LiveKitContext = createContext<CameraRoomManager | null>(null);
