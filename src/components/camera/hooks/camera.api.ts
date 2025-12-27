import { api } from "@/config";
import endPoints from "@/config/endpoints";


export async function getToken(cameraCode: string) {
   try {
     const res = await api.request({
         url: endPoints.camera.token.url.replace(":cameraCode", cameraCode),
         method: endPoints.camera.token.method,
     })
     return res.data.data;
   } catch (error:any) {
      throw new Error(error.response?.data?.message || error.response?.data?.errors || "Network Error");
   }
}