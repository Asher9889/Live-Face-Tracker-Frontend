import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { getDashboardAttendanceSummary } from "../api/dashboard.api";

export function useDashboardAttendanceSummary(date?: Date) {
  const resolvedDate = date ?? new Date();
  const dateParam = format(resolvedDate, "yyyy-MM-dd");

  const query = useQuery({
    queryKey: ["dashboard-attendance-summary", dateParam],
    queryFn: () => getDashboardAttendanceSummary(dateParam),
    staleTime: 60 * 1000,
  });

  return query;
}
