import { envs } from "@/config";
import { WS_EVENTS } from "@/constants";
import { store } from "@/store";
// import { bboxUpserted, clearCameraBBoxes } from "@/store/slices/cameraBBoxSlice";
import { updateOne, updateStreamStartTs } from "@/store/slices/cameraRuntimeSlice";
import { addNotification } from "@/store/slices/uiEventNotificationSlice";
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
        console.log("Received WS message:", event);
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
                if (message.payload.event !== "track_lost") {
                    // store.dispatch(bboxUpserted({
                    //     cameraCode,
                    //     trackId,
                    //     bbox,
                    //     personId,
                    //     similarity,
                    //     eventTs,
                    //     frameTs,
                    // }))
                    emitBBox(cameraCode, { trackId, bbox, personId, similarity, eventTs, frameTs })
                }
                //    else {
                //     store.dispatch(clearCameraBBoxes({cameraCode, trackId}))
                //    }

                break;
            case WS_EVENTS.CAMERA_STREAM_STARTED: {
                const { cameraCode, streamStartTs } = message.payload;
                store.dispatch(updateStreamStartTs({
                    code: cameraCode,
                    streamStartTs: streamStartTs,
                }))
                break;
            }
            case WS_EVENTS.UI_EVENT_NOTIFICATION: {
                /**
                 * "type": "ui:event:notification",
                "event": "person_entered",
                "payload": {
                    "id": "69ec59eea047aa9eff3065fa",
                    "name": "Amit Chauhan",
                    "role": "Employee",
                    "department": "Operations",
                    "avatar": "https://minio.mssplonline.in/facevision/employees/amit-chauhan/1777025626416_Amit_Chauhan_1.jpeg",
                    "cameraCode": "entry_1",
                    "cameraName": "Entry Gate 3",
                    "eventTs": 1779103803424,
                    "note": "Amit Chauhan was detected at Entry Gate 3",
                    "noteKey": "person_entered"
                }
                 */
                const { id, name, role, department, avatar, cameraCode, cameraName, eventTs, note, noteKey } = message.payload;

                store.dispatch(addNotification({
                    id,
                    name,
                    role,
                    department,
                    avatar,
                    cameraCode,
                    cameraName,
                    eventTs,
                    note,
                    noteKey,
                }));
            }
            break;
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

/**
 * "type": "ui:event:notification",
  "event": "person_entered",
  "payload": {
    "id": "69ec59eea047aa9eff3065fa",
    "name": "Saurabh Kushwaha",
    "role": "Employee",
    "department": "Engineering",
    "avatar": "https://minio.mssplonline.in/facevision/employees/saurabh-kushwaha/1777097198286_saurabh.jpeg",
    "cameraCode": "entry_1",
    "cameraName": "Entry Gate 1",
  }
 */