import { api } from "@/config"
import endPoints from "@/config/endpoints"
import type { TLoginSchema } from "../validations/login.validation";

export async function login(loginData: TLoginSchema){
    try {
        const res = await api.request({
            url: endPoints.auth.login.url,
            method: endPoints.auth.login.method,
            data: loginData
        })
        return res.data?.data || [];
    } catch (error:any) {
        throw new Error(error.response?.data?.message || error.response?.data?.errors || "Network Error");
    }
}