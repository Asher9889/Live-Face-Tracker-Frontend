type TCameraRuntimeStatus = "online" | "offline" | "connecting" | "error";

interface ICameraRuntime {
    code: string;
    status: TCameraRuntimeStatus;
    lastFrameAt: number
    streamStartTs?: number
    fps?: number;

}

interface IRuntimeCameraStatus {
    code: string;
    status: string;
    lastFrameAt: number;
    stoppedAt: number;
    streamStartTs?: number;
}

export type {  IRuntimeCameraStatus, TCameraRuntimeStatus, ICameraRuntime }