import { api } from "@/config";
import endPoints from "@/config/endpoints";
import { type AttendanceEventsResponse, type AttendanceSessionDTO } from "../types/attendence.types";


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

export async function getTodayAttendanceSession(employeeId: string): Promise<AttendanceSessionDTO> {
    try {
        const response = await api.request({
            url: endPoints.attendance.todaySession.url.replace(':employeeId', employeeId),
            method: endPoints.attendance.todaySession.method
        });
        return response?.data.data ?? null;
    } catch (error) {
        console.error('Error fetching attendance session:', error);
        throw error;
    }
}