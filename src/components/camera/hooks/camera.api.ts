import { api } from "@/config";
import endPoints from "@/config/endpoints";


export async function getToken(cameraCode: string) {
   try {
     const res = await api.request({
         url: endPoints.camera.token.url.replace(":cameraCode", cameraCode),
         method: endPoints.camera.token.method,
     })
     return res.data.data ?? [];
   } catch (error:any) {
      if(error.response){
         throw new Error(error.response.data.message || "Server Error");
      } else if(error.request){
         throw new Error("No response received from the server. Please check your network connection.");
      } else {
         throw new Error(error.message);
      }
   }
}