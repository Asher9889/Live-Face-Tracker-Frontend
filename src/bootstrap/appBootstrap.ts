import { api } from "@/config"
import { initCameraStatusWS } from "@/services";
import { store } from "@/store";
import { bootstrapFailed, bootstrapStarted, bootstrapSucceeded } from "@/store/slices/bootstrapSlice";
import { registerAll } from "@/store/slices/cameraEntitySlice";
import { updateOne } from "@/store/slices/cameraRuntimeSlice";
import type { IRuntimeCameraStatus } from "@/types";
import type { TCameraRuntimeStatus } from "@/types/camera";

export default async function appBootstrap(){
    store.dispatch(bootstrapStarted()); // only outside React.
    
    try {
        const cameras = await api.get("/cameras");
        const status = await api.get("/cameras/status");
        store.dispatch(registerAll(cameras.data.data));
        status.data.data.forEach((cam:IRuntimeCameraStatus) => {
            store.dispatch(updateOne({
                code: cam.code,
                status: cam.status as TCameraRuntimeStatus,
                lastFrameAt: cam.lastFrameAt,
            }));
        })

        initCameraStatusWS();
        
        store.dispatch(bootstrapSucceeded());
    } catch (error: any) {
        if(error.response){
            store.dispatch(bootstrapFailed(error.response.data.message)); // only outside React.
        } else if (error.request){
            store.dispatch(bootstrapFailed(error.response.data.message))
        } else {
            console.error('Error message:', error.message)
            bootstrapFailed(error.message)
        }
    }

}