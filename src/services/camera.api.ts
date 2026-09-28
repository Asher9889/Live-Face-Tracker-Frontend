import { api } from "@/config";
import endPoints from "@/config/endpoints";
import type { ILiveViewerCredentials } from "@/types/live";

export async function startCamera(cameraId: string): Promise<void> {
    await api.request({
        url: endPoints.camera.start.url.replace(":cameraCode", cameraId),
        method: endPoints.camera.start.method,
    })
}

export async function getCameraToken(cameraId: string): Promise<string> {
    const response = await api.request({
        url: endPoints.camera.token.url.replace(":cameraCode", cameraId),
        method: endPoints.camera.token.method,
    })
    return response.data.data.token;
}

/**
 * View-only LiveKit credentials for one camera's room.
 *
 * Room name is the camera `code`, matching what the AI service publishes to.
 * Prefer this over `getCameraToken` — the legacy endpoint mints a room from the
 * mongo `_id`, which is the old ffmpeg/ingress naming and no longer matches.
 */
export async function getLiveViewerToken(cameraCode: string): Promise<ILiveViewerCredentials> {
    const response = await api.request({
        url: endPoints.live.token.url.replace(":cameraCode", cameraCode),
        method: endPoints.live.token.method,
    });
    return response.data.data;
}

/** Cameras that can be watched; `code` is the LiveKit room name. */
export async function getLiveRooms() {
    const response = await api.request({
        url: endPoints.live.cameras.url,
        method: endPoints.live.cameras.method,
    });
    return response.data.data ?? [];
}
