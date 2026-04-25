import { api } from "@/config";
import endPoints from "@/config/endpoints";
import {
    type AttendanceEmployeeCalendarDTO,
    type AttendanceEmployeeDailyTimelineDTO,
    type AttendanceEmployeeMonthlySummaryDTO,
    type AttendanceEmployeeProfileDTO,
    type AttendanceEventsResponse,
    type AttendanceSessionDTO,
} from "../types/attendence.types";


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

export async function getAttendanceEmployeeProfile(employeeId: string): Promise<AttendanceEmployeeProfileDTO> {
    try {
        const response = await api.request({
            url: endPoints.employee.getById.url.replace(':employeeId', employeeId),
            method: endPoints.employee.getById.method,
        });

        return response?.data?.data ?? null;
    } catch (error) {
        console.error('Error fetching employee profile:', error);
        throw error;
    }
}

export async function getAttendanceEmployeeMonthlySummary(
    employeeId: string,
    month: string,
    timezone: string
): Promise<AttendanceEmployeeMonthlySummaryDTO> {
    try {
        const response = await api.request({
            url: endPoints.attendance.employeeSummary.url.replace(':employeeId', employeeId),
            method: endPoints.attendance.employeeSummary.method,
            params: { month, timezone },
        });

        return response?.data?.data ?? null;
    } catch (error) {
        console.error('Error fetching attendance employee summary:', error);
        throw error;
    }
}

export async function getAttendanceEmployeeTimeline(
    employeeId: string,
    date: string,
    timezone: string
): Promise<AttendanceEmployeeDailyTimelineDTO> {
    try {
        const response = await api.request({
            url: endPoints.attendance.employeeTimeline.url.replace(':employeeId', employeeId),
            method: endPoints.attendance.employeeTimeline.method,
            params: { date, timezone },
        });

        return response?.data?.data ?? null;
    } catch (error) {
        console.error('Error fetching attendance employee timeline:', error);
        throw error;
    }
}

export async function getAttendanceEmployeeCalendar(
    employeeId: string,
    month: string,
    timezone: string
): Promise<AttendanceEmployeeCalendarDTO> {
    try {
        const response = await api.request({
            url: endPoints.attendance.employeeCalendar.url.replace(':employeeId', employeeId),
            method: endPoints.attendance.employeeCalendar.method,
            params: { month, timezone },
        });

        return response?.data?.data ?? null;
    } catch (error) {
        console.error('Error fetching attendance employee calendar:', error);
        throw error;
    }
}

export async function exportAttendanceEmployeeHistory(
    employeeId: string,
    from: string,
    to: string,
    timezone: string,
    format: 'csv' | 'xlsx' = 'csv'
): Promise<Blob> {
    try {
        const response = await api.request({
            url: endPoints.attendance.employeeExport.url.replace(':employeeId', employeeId),
            method: endPoints.attendance.employeeExport.method,
            params: { from, to, timezone, format },
            responseType: 'blob',
        });

        return response.data;
    } catch (error) {
        console.error('Error exporting attendance employee history:', error);
        throw error;
    }
}