import { getAllAttendence } from "../api/attendence.api";
import { useQuery } from "@tanstack/react-query";
import { mapAttendanceEventsToRecords } from "../mapper/attendance.mapper";

export function useAttendence() {

    const { data, isLoading, error } = useQuery({
        queryKey: ['attendence'],
        queryFn: getAllAttendence,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    const attendenceData = mapAttendanceEventsToRecords(data?.attendanceEvents ?? []);

    console.log("Attendance Data", attendenceData)

    return {
        data: attendenceData ?? [],
        isLoading,
        error
    };
}
