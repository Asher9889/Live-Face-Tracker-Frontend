import { getAttendanceByDate, getAttendanceByDateRange, getAllAttendence, getAttendanceCurrentState } from "../api/attendence.api";
import { useQuery } from "@tanstack/react-query";
import { mapAttendanceEventsToRecords } from "../mapper/attendance.mapper";
import { format } from "date-fns";
import type { AttendanceCurrentStateQueryParams, AttendanceEventsQueryParams } from "../types/attendence.types";

/**
 * Hook to fetch all attendance events
 * @returns attendance data, loading state, and error
 */
export function useAttendence() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['attendence'],
        queryFn: getAllAttendence,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    const attendenceData = mapAttendanceEventsToRecords(data?.attendanceEvents ?? []);

    return {
        data: attendenceData ?? [],
        isLoading,
        error
    };
}

/**
 * Hook to fetch attendance events for a specific date
 * @param date - Date object or string in YYYY-MM-DD format
 * @param filters - Optional query filters (employeeId, department, etc)
 * @returns attendance data, loading state, and error
 */
export function useAttendanceByDate(
    date?: Date | string | null,
    filters?: Omit<AttendanceEventsQueryParams, 'dateFrom' | 'dateTo'>
) {
    // Convert date to YYYY-MM-DD format
    const dateStr = date ? (typeof date === 'string' ? date : format(date, 'yyyy-MM-dd')) : null;
    const effectiveFilters = {
        ...filters,
        registeredOnly: filters?.registeredOnly ?? true,
    };

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['attendence', 'date', dateStr, effectiveFilters],
        queryFn: () => getAttendanceByDate(dateStr!, effectiveFilters),
        enabled: !!dateStr,
        staleTime: 2 * 60 * 1000, // 2 minutes
    });

    return {
        data: data?.events ?? [],
        stats: data?.stats,
        pagination: data?.pagination,
        isLoading,
        error,
        refetch
    };
}

/**
 * Hook to fetch attendance events for a date range
 * @param dateFrom - Start date (Date object or YYYY-MM-DD string)
 * @param dateTo - End date (Date object or YYYY-MM-DD string)
 * @param filters - Optional query filters
 * @returns attendance data, loading state, and error
 */
export function useAttendanceByDateRange(
    dateFrom?: Date | string | null,
    dateTo?: Date | string | null,
    filters?: Omit<AttendanceEventsQueryParams, 'date'>
) {
    const dateFromStr = dateFrom ? (typeof dateFrom === 'string' ? dateFrom : format(dateFrom, 'yyyy-MM-dd')) : null;
    const dateToStr = dateTo ? (typeof dateTo === 'string' ? dateTo : format(dateTo, 'yyyy-MM-dd')) : null;
    const effectiveFilters = {
        ...filters,
        registeredOnly: filters?.registeredOnly ?? true,
    };

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['attendence', 'range', dateFromStr, dateToStr, effectiveFilters],
        queryFn: () => getAttendanceByDateRange(dateFromStr!, dateToStr!, effectiveFilters),
        enabled: !!dateFromStr && !!dateToStr,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    const attendanceData = mapAttendanceEventsToRecords(data?.attendanceEvents ?? []);

    return {
        data: attendanceData ?? [],
        hasMore: data?.hasMore ?? false,
        nextCursor: data?.nextCursor,
        isLoading,
        error,
        refetch
    };
}

export function useAttendanceCurrentState(
    date?: Date | string | null,
    filters?: Omit<AttendanceCurrentStateQueryParams, 'date'>
) {
    const dateStr = date ? (typeof date === 'string' ? date : format(date, 'yyyy-MM-dd')) : format(new Date(), 'yyyy-MM-dd');
    const effectiveFilters = {
        ...filters,
        date: dateStr,
        registeredOnly: filters?.registeredOnly ?? true,
        includeCompleted: filters?.includeCompleted ?? false,
    };

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['attendence', 'current-state', dateStr, effectiveFilters],
        queryFn: () => getAttendanceCurrentState(effectiveFilters),
        staleTime: 60 * 1000,
    });

    return {
        data: data?.presentEmployees ?? [],
        stats: data?.stats,
        pagination: data?.pagination,
        date: data?.date ?? dateStr,
        isLoading,
        error,
        refetch,
    };
}
