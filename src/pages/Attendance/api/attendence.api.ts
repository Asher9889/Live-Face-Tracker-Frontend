import { api } from "@/config";
import endPoints from "@/config/endpoints";
import {
    type AttendanceEmployeeCalendarDTO,
    type AttendanceCurrentStateQueryParams,
    type AttendanceCurrentStateResponse,
    type AttendanceDailyResponse,
    type AttendanceEmployeeDailyTimelineDTO,
    type AttendanceEmployeeMonthlySummaryDTO,
    type AttendanceEmployeeProfileDTO,
    type AttendanceEventsResponse,
    type AttendanceEventsQueryParams,
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

/**
 * Get attendance events for a specific date with optional filters
 * @param date - YYYY-MM-DD format (required)
 * @param filters - Optional query parameters for filtering
 * @returns Attendance events for the day with stats
 */
export async function getAttendanceByDate(
    date: string,
    filters?: Omit<AttendanceEventsQueryParams, 'dateFrom' | 'dateTo'>
): Promise<AttendanceDailyResponse> {
    try {
        const params = {
            date,
            ...filters,
            registeredOnly: filters?.registeredOnly ?? true,
        };
        const response = await api.request({
            url: endPoints.attendance.getByDate.url,
            method: endPoints.attendance.getByDate.method,
            params
        });
        return response.data.data;
    } catch (error) {
        console.error('Error fetching attendance by date:', error);
        throw error;
    }
}

/**
 * Get attendance events for a date range
 * @param dateFrom - Start date in YYYY-MM-DD format
 * @param dateTo - End date in YYYY-MM-DD format
 * @param filters - Optional query parameters for filtering
 * @returns Attendance events for the range
 */
export async function getAttendanceByDateRange(
    dateFrom: string,
    dateTo: string,
    filters?: Omit<AttendanceEventsQueryParams, 'date'>
): Promise<AttendanceEventsResponse> {
    try {
        const params = {
            dateFrom,
            dateTo,
            ...filters,
            registeredOnly: filters?.registeredOnly ?? true,
        };
        const response = await api.request({
            url: endPoints.attendance.getByDateRange.url,
            method: endPoints.attendance.getByDateRange.method,
            params
        });
        return response.data.data;
    } catch (error) {
        console.error('Error fetching attendance by date range:', error);
        throw error;
    }
}

export async function getAttendanceCurrentState(
    filters?: AttendanceCurrentStateQueryParams
): Promise<AttendanceCurrentStateResponse> {
    try {
        const params = {
            ...filters,
            registeredOnly: filters?.registeredOnly ?? true,
            includeCompleted: filters?.includeCompleted ?? false,
        };

        const response = await api.request({
            url: endPoints.attendance.currentState.url,
            method: endPoints.attendance.currentState.method,
            params,
        });

        return response.data.data;
    } catch (error) {
        console.error('Error fetching attendance current state:', error);
        throw error;
    }
}

export async function getTodayAttendanceSession(employeeId: string, date?: string): Promise<AttendanceSessionDTO> {
    try {
        const response = await api.request({
            url: endPoints.attendance.employeeSession.url.replace(':employeeId', employeeId),
            method: endPoints.attendance.employeeSession.method
            ,
            params: date ? { date } : undefined,
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