// src/types/ws/camera-status.ts
import { WS_EVENTS } from "@/constants";
import { type WSIncomingMessage } from "./base";

export type CameraStatusChangedPayload = {
  cameraId: string;
  status: "online" | "offline";
  lastFrameAt: number;
  stoppedAt?: number;
};

export type CameraStatusChangedMessage = WSIncomingMessage<
  typeof WS_EVENTS.CAMERA_STATUS_CHANGED,
  CameraStatusChangedPayload
>;
