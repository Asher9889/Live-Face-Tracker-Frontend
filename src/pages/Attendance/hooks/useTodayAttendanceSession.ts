import { useQuery } from "@tanstack/react-query";
import { getTodayAttendanceSession } from "../api/attendence.api";

export function useTodayAttendanceSession(employeeId: string, enabled: boolean = false){
    const {isLoading, data, isError} = useQuery({
        queryKey: ["attendance-session", employeeId],
        queryFn: () => getTodayAttendanceSession(employeeId),
        enabled: Boolean(employeeId && enabled), // 🔑 prevents unnecessary calls
        staleTime: 5 * 60 * 1000,
    });
 
    return {
        isLoading,
        data,
        isError
    };
}