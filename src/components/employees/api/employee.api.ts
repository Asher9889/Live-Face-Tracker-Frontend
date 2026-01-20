import api from "@/config/axios";
import type { TEmployeeFormValues } from "../schema/employee.schema";
import endPoints from "@/config/endpoints";

const createEmployee = async (employee: TEmployeeFormValues) => {
    try {
        const fd = new FormData();
        fd.append("name", employee.name);
        fd.append("email", employee.email);
        fd.append("department", employee.department);
        fd.append("role", employee.role);
        for (let i = 0; i < employee.faces.length; i++) {
            fd.append("face", employee.faces[i]);
        }
        const response = await api.request({
            url: endPoints.employee.register.url,
            method: endPoints.employee.register.method,
            data: fd,
        });
        return response.data;
    } catch (err: any) {
        const backendMessage = err.response?.data?.message || err.response?.data?.error || "Something went wrong. Please try again.";
        throw new Error(backendMessage);
    }

};

const getEmployee = async ({cursor, limit}: {cursor?: string, limit?: number}) => {
    try {
        const response = await api.request({
            url: endPoints.employee.get.url,
            method: endPoints.employee.get.method,
            params: { cursor, limit }
        })
        return response.data?.data ?? [];
    } catch (err: any) {
        throw new Error(err.response?.data?.message || err.response?.data?.error || "Failed to fetch employees");
    }
}

export { createEmployee, getEmployee };