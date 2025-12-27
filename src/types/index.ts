import { type IRuntimeCameraStatus } from "./camera";
import { type FaceBBoxMessage } from "./ws/face-bbox";
import { type CameraStatusChangedMessage } from "./ws/camera-status";
import { type WSIncomingMessage } from "./ws/base";
import { type CameraStreamStatusMessage } from "./ws/camera-stream-status";

export type WSMessage = CameraStatusChangedMessage | FaceBBoxMessage | CameraStreamStatusMessage;

export { type IRuntimeCameraStatus, type FaceBBoxMessage, type CameraStatusChangedMessage, type WSIncomingMessage }