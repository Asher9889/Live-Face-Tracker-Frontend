import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  getAttendanceEmployeeCalendar,
  getAttendanceEmployeeMonthlySummary,
  getAttendanceEmployeeProfile,
  getAttendanceEmployeeTimeline,
} from "../api/attendence.api";

export function useEmployeeHistory(employeeId?: string, date?: Date) {
  const resolvedDate = date ?? new Date();
  const month = format(resolvedDate, "yyyy-MM");
  const day = format(resolvedDate, "yyyy-MM-dd");
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const enabled = Boolean(employeeId);

  const profileQuery = useQuery({
    queryKey: ["attendance-employee-profile", employeeId],
    queryFn: () => getAttendanceEmployeeProfile(employeeId as string),
    enabled,
    staleTime: 5 * 60 * 1000,
  });

  const summaryQuery = useQuery({
    queryKey: ["attendance-employee-summary", employeeId, month, timezone],
    queryFn: () =>
      getAttendanceEmployeeMonthlySummary(employeeId as string, month, timezone),
    enabled,
    staleTime: 5 * 60 * 1000,
  });

  const timelineQuery = useQuery({
    queryKey: ["attendance-employee-timeline", employeeId, day, timezone],
    queryFn: () => getAttendanceEmployeeTimeline(employeeId as string, day, timezone),
    enabled,
    staleTime: 60 * 1000,
  });

  const calendarQuery = useQuery({
    queryKey: ["attendance-employee-calendar", employeeId, month, timezone],
    queryFn: () => getAttendanceEmployeeCalendar(employeeId as string, month, timezone),
    enabled,
    staleTime: 5 * 60 * 1000,
  });

  return {
    profile: profileQuery.data,
    summary: summaryQuery.data,
    timeline: timelineQuery.data,
    calendar: calendarQuery.data,
    isLoading:
      profileQuery.isLoading ||
      summaryQuery.isLoading ||
      timelineQuery.isLoading ||
      calendarQuery.isLoading,
    isFetching:
      profileQuery.isFetching ||
      summaryQuery.isFetching ||
      timelineQuery.isFetching ||
      calendarQuery.isFetching,
    isError:
      profileQuery.isError ||
      summaryQuery.isError ||
      timelineQuery.isError ||
      calendarQuery.isError,
  };
}
