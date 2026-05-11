import { api } from "@/config";
import type {
  AnalyticsSummary,
  DailyReportRow,
  MonthlyReportRow,
  ReportFiltersState,
  EmployeeTimeline,
} from "../types";

/**
 * Get reports analytics summary (present, absent, late, etc.)
 */
export async function getReportsSummary(
  filters: ReportFiltersState
): Promise<AnalyticsSummary> {
  const params = {
    mode: filters.mode,
    date: filters.mode === "daily" ? filters.date : undefined,
    month: filters.mode === "monthly" ? filters.month : undefined,
    startDate: filters.mode === "custom" ? filters.startDate : undefined,
    endDate: filters.mode === "custom" ? filters.endDate : undefined,
    employeeId: filters.employeeId || undefined,
    department: filters.department && filters.department !== "all" ? filters.department : undefined,
    status: filters.status || undefined,
    lateOnly: filters.lateOnly || undefined,
    missingExitOnly: filters.missingExitOnly || undefined,
    timezone: "Asia/Kolkata",
  };

  // Remove undefined values
  Object.keys(params).forEach(
    (key) => params[key as keyof typeof params] === undefined && delete params[key as keyof typeof params]
  );

  const response = await api.request({
    url: "/attendance/reports/summary",
    method: "GET",
    params,
  });

  return response.data.data;
}

/**
 * Get reports rows dataset (daily, monthly, or custom range)
 */
export async function getReportsRows(
  filters: ReportFiltersState,
  page: number = 1,
  pageSize: number = 25
): Promise<{
  mode: "daily" | "monthly" | "custom";
  rows: (DailyReportRow | MonthlyReportRow)[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}> {
  const params = {
    mode: filters.mode,
    date: filters.mode === "daily" ? filters.date : undefined,
    month: filters.mode === "monthly" ? filters.month : undefined,
    startDate: filters.mode === "custom" ? filters.startDate : undefined,
    endDate: filters.mode === "custom" ? filters.endDate : undefined,
    employeeId: filters.employeeId || undefined,
    employeeName: filters.employeeName || undefined,
    department: filters.department && filters.department !== "all" ? filters.department : undefined,
    status: filters.status || undefined,
    lateOnly: filters.lateOnly || undefined,
    missingExitOnly: filters.missingExitOnly || undefined,
    page,
    pageSize,
    timezone: "Asia/Kolkata",
  };

  // Remove undefined values
  Object.keys(params).forEach(
    (key) => params[key as keyof typeof params] === undefined && delete params[key as keyof typeof params]
  );

  const response = await api.request({
    url: "/attendance/reports/rows",
    method: "GET",
    params,
  });

  return response.data.data;
}

/**
 * Get employee timeline for the drawer
 */
export async function getEmployeeTimeline(
  employeeId: string,
  date?: string
): Promise<EmployeeTimeline> {
  const params: Record<string, string> = {
    timezone: "Asia/Kolkata",
  };

  if (date) {
    params.date = date;
  }

  const response = await api.request({
    url: `/attendance/reports/employees/${employeeId}/timeline`,
    method: "GET",
    params,
  });

  return response.data.data;
}

/**
 * Export reports as CSV or XLSX
 */
export async function exportReports(payload: {
  mode: "daily" | "monthly" | "custom";
  date?: string;
  month?: string;
  startDate?: string;
  endDate?: string;
  scope: "ALL_ROWS" | "SELECTED_ROWS" | "SELECTED_EMPLOYEES";
  rowIds?: string[];
  employeeIds?: string[];
  filters?: {
    employeeId?: string;
    employeeName?: string;
    department?: string;
    status?: string;
    lateOnly?: boolean;
    missingExitOnly?: boolean;
  };
  format?: "csv" | "xlsx";
  timezone?: string;
  registeredOnly?: boolean;
}): Promise<Blob> {
  const response = await api.request({
    url: "/attendance/reports/export",
    method: "POST",
    data: {
      ...payload,
      timezone: payload.timezone || "Asia/Kolkata",
      registeredOnly: payload.registeredOnly ?? true,
    },
    responseType: "blob",
  });

  return response.data;
}
