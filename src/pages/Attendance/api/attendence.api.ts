import { api } from "@/config";
import endPoints from "@/config/endpoints";
import { type AttendanceEventsResponse } from "../types/attendence.types";


export async function getAllAttendence(): Promise<AttendanceEventsResponse> { 
    try {
        const response = await api.request({
            url: endPoints.attendance.getAllEvents.url,
            method: endPoints.attendance.getAllEvents.method
        });
        return response.data.data;
    } catch (error) {
        console.error('Error fetching attendance:', error);
        throw error;
    }
}