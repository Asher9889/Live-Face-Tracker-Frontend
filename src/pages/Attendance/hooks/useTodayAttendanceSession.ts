import { useQuery } from "@tanstack/react-query";
import { getTodayAttendanceSession } from "../api/attendence.api";

export function useTodayAttendanceSession(employeeId: string, enabled: boolean = false, date?: string){
    const {isLoading, data, isError} = useQuery({
        queryKey: ["attendance-session", employeeId, date],
        queryFn: () => getTodayAttendanceSession(employeeId, date),
        enabled: Boolean(employeeId && enabled), // 🔑 prevents unnecessary calls
        staleTime: 5 * 60 * 1000,
    });
 
    return {
        isLoading,
        data,
        isError
    };
}