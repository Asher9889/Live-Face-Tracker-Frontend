import { api } from "@/config";
import endPoints from "@/config/endpoints";
import type { VisitorDTO } from "../types/visitors.types";

export async function getVisitorData():Promise<VisitorDTO[]> {
    try {
        const res = await api.request({
            url: endPoints.unknown.getAllVisitors.url,
            method: endPoints.unknown.getAllVisitors.method
        })
        return res.data.data ?? []
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data.message || "Server Error");
        } else if (error.request) {
            throw new Error("No response received from the server. Please check your network connection.");
        } else {
            throw new Error(error.message);
        }
    }
}
