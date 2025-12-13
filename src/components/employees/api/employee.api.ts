import api from "@/config/axios";
import type { TEmployeeFormValues } from "../schema/employee.schema";
import endPoints from "@/config/endpoints";

const createEmployee = async (employee: TEmployeeFormValues) => {
        console.log("Employee data:", employee);
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
    
};

export { createEmployee };