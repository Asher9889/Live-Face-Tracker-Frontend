import api from "@/config/axios";
import endPoints from "@/config/endpoints";
import type { TCameraFormValues } from "../schema/camera.schema";


const createCamera = async (camera: TCameraFormValues) => {
  try {

    const fd = new FormData();
    fd.append("name", camera.name);
    fd.append("code", camera.code);
    fd.append("gateType", camera.gateType);
    fd.append("location", camera.location);
    fd.append("rtspUrl", camera.rtspUrl);
    fd.append("username", camera.credentials.username);
    fd.append("password", camera.credentials.password);
    const response = await api.request({
      url: endPoints.camera.register.url,
      method: endPoints.camera.register.method,
      data: fd,
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
