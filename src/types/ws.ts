export type CameraStatusChangedMessage = {
    type: "live-face-tracker:camera-event:status:change" //"CAMERA_STATUS_CHANGED";
    cameraId: string;
    status: "online" | "offline";
    lastFrameAt: number;
    stoppedAt?: number;
};

export type WSMessage = CameraStatusChangedMessage;
