import { WS_EVENTS } from "@/constants";
import type { WSIncomingMessage } from "./base";


type CameraStreamStatusPayload = {
    cameraCode: string,
    streamStartTs: number,
    status: "online" | "offline"
}

export type CameraStreamStatusMessage = WSIncomingMessage<
    typeof WS_EVENTS.CAMERA_STREAM_STARTED,
    CameraStreamStatusPayload
>