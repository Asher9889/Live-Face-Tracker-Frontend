import { api } from "@/config";
import endPoints from "@/config/endpoints";

export interface DashboardAttendanceSummaryDTO {
  range: {
    from: string;
    to: string;
    timezone: string;
  };
  stats: {
    totalRecords: number;
    uniqueEmployees: number;
    totalWorkDurationMinutes: number;
    unknownEvents: number;
    lateEntries: number;
    earlyExits: number;
  };
}

export async function getDashboardAttendanceSummary(
  date: string
): Promise<DashboardAttendanceSummaryDTO> {
  try {
    const response = await api.request({
      url: endPoints.dashboard.attendanceSummary.url,
      method: endPoints.dashboard.attendanceSummary.method,
      params: { date },
    });

    return response?.data?.data ?? null;
  } catch (error) {
    console.error("Error fetching dashboard attendance summary:", error);
    throw error;
  }
}
