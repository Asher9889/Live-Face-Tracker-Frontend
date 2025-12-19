import { envs } from "@/config";
import { store } from "@/store";
import { updateOne } from "@/store/slices/cameraRuntimeSlice";
import type { WSMessage } from "@/types/ws";

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
        console.log("message is: ", message)
        // live-face-tracker:camera-event:status:change
        if (message.type === "live-face-tracker:camera-event:status:change") {
            const { cameraId, status, lastFrameAt, stoppedAt } = message; // cameraId

            store.dispatch(updateOne({
                code: cameraId,
                status: status,
                lastFrameAt: lastFrameAt,
            }))
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