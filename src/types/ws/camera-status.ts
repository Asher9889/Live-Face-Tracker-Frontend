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

export type UIEventNotificationPayload = {
    id: string;
    name: string | null;
    role: string;
    department: string | null;
    avatar: string | null;
    cameraCode: string;
    cameraName: string;
    eventTs: number;
    note: string;
    noteKey: "person_entered" | "person_exited" | "unknown_entered" | "unknown_exited";
};

export type UIEventNotificationMessage = WSIncomingMessage<
  typeof WS_EVENTS.UI_EVENT_NOTIFICATION,
  UIEventNotificationPayload
> & {
  event: "person_entered" | "person_exited" | "unknown_entered" | "unknown_exited";
};