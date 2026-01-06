import { api } from "@/config";
import endPoints from "@/config/endpoints";

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
