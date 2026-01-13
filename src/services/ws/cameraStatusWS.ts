import { envs } from "@/config";
import { WS_EVENTS } from "@/constants";
import { store } from "@/store";
// import { bboxUpserted, clearCameraBBoxes } from "@/store/slices/cameraBBoxSlice";
import { updateOne, updateStreamStartTs } from "@/store/slices/cameraRuntimeSlice";
import type { WSMessage } from "@/types";
import { emitBBox } from "./bbox";

let socket: WebSocket | null = null;

export default function initCameraStatusWS() {

    if (socket) return;

    socket = new WebSocket(envs.wsUrl);

    socket.addEventListener("open", () => {
        socket?.send(JSON.stringify({
            type: "HELLO",
            payload: {
                role: "viewer",
            },
        }));
    })

    socket.addEventListener("message", (event) => {
        const message: WSMessage = JSON.parse(event.data);
        switch (message.type) {
            case WS_EVENTS.CAMERA_STATUS_CHANGED:
                const { cameraId, status, lastFrameAt } = message.payload; // cameraId // stoppedAt
                store.dispatch(updateOne({
                    code: cameraId,
                    status: status,
                    lastFrameAt: lastFrameAt,
                }))
                break;
    // cameraCode, trackId, bbox, timestamp, personId, similarity
            case WS_EVENTS.FACE_BBOX:
                const { cameraCode, trackId, bbox, personId, similarity, eventTs, frameTs } = message.payload;
                   if(message.payload.event !== "track_lost"){
                    // store.dispatch(bboxUpserted({
                    //     cameraCode,
                    //     trackId,
                    //     bbox,
                    //     personId,
                    //     similarity,
                    //     eventTs,
                    //     frameTs,
                    // }))
                    emitBBox(cameraCode, {trackId, bbox, personId, similarity, eventTs, frameTs})
                   } 
                //    else {
                //     store.dispatch(clearCameraBBoxes({cameraCode, trackId}))
                //    }

                break;
            case WS_EVENTS.CAMERA_STREAM_STARTED: {
                const { cameraCode, streamStartTs} = message.payload;
                store.dispatch(updateStreamStartTs({
                    code: cameraCode,
                    streamStartTs: streamStartTs,
                }))
             break;   
            }
        }
    })

    socket.addEventListener("close", () => {
        console.warn("Websocket connection closed");
        socket = null;
    })

    socket.addEventListener("error", (err) => {
        console.error("❌ WS error", err);
        socket?.close();
    })
}