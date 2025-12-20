import api from "@/config/axios";
import endPoints from "@/config/endpoints";
import type { TCameraFormValues } from "../schema/camera.schema";

const createCamera = async (camera: TCameraFormValues) => {
  try {
    const payload = {
      name: camera.name,
      code: camera.code,
      gateType: camera.gateType,
      location: camera.location,
      rtspUrl: camera.rtspUrl,
      credentials: {
        username: camera.credentials.username,
        password: camera.credentials.password,
      },

      streamConfig: {
        aiFps: 25,
        displayFps: 25,
      },

      enabled: true,

      roi: {
        enabled: true,
        polygons: [
          [10, 20],
          [200, 20],
          [200, 250],
          [10, 250],
        ],
      },

      wsStreamId: camera.code,

      status: {
        online: true,
        lastCheckedAt: new Date(),
        lastFrameAt: new Date()
      },
    };

    const response = await api.request({
      url: endPoints.camera.register.url,
      method: endPoints.camera.register.method,
      data: payload, 
    });

    return response.data;
  } catch (err: any) {
    const backendMessage =
      err.response?.data?.message ||
      err.response?.data?.error ||
      "Something went wrong. Please try again.";

    throw new Error(backendMessage);
  }
};

const getCamera = async () => {
  try {
    const response = await api.request({
      url: endPoints.camera.get.url,
      method: endPoints.camera.get.method,
    });

    return response.data?.data ?? [];
  } catch (err: any) {
    const backendMessage =
      err.response?.data?.message ||
      err.response?.data?.error ||
      "Failed to fetch cameras";

    throw new Error(backendMessage);
  }
};

export { createCamera, getCamera };
