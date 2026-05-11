import { api } from "@/config"
import endPoints from "@/config/endpoints";

async function fetchEmployeeNames(name: string) {
    const { url, method } = endPoints.employee.searchEmployeeByName(name)

    const response = await api.request({
        url: url,
        method: method
    });

    return response.data.data;
}

export { fetchEmployeeNames}