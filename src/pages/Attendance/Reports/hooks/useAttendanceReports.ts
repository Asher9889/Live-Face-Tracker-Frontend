import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import type { ReportMode, ReportFiltersState } from "../types";
import { getReportsSummary, getReportsRows } from "../api/attendance-reports.api";

const parseBooleanParam = (value: string | null) => value === "true";

const buildFiltersFromSearchParams = (searchParams: URLSearchParams): ReportFiltersState => {
  const modeParam = searchParams.get("mode") as ReportMode | null;
  const mode: ReportMode = modeParam && ["daily", "monthly", "custom"].includes(modeParam) ? modeParam : "daily";

  return {
    mode,
    date: searchParams.get("date") || new Date().toISOString().split("T")[0],
    month: searchParams.get("month") || new Date().toISOString().slice(0, 7),
    startDate: searchParams.get("startDate") || undefined,
    endDate: searchParams.get("endDate") || undefined,
    department: searchParams.get("department") || "all",
    employeeId: searchParams.get("employeeId") || undefined,
    employeeName: searchParams.get("employeeName") || undefined,
    status: searchParams.get("status") || undefined,
    lateOnly: parseBooleanParam(searchParams.get("lateOnly")),
    missingExitOnly: parseBooleanParam(searchParams.get("missingExitOnly")),
  };
};

export const useAttendanceReports = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [pageSize] = useState(25);

  const [filters, setFilters] = useState<ReportFiltersState>(() => buildFiltersFromSearchParams(searchParams));

  // Selected employee for Timeline Drawer
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);

  // Selection for export/actions
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);

  // Sync all active filters to URL so refresh/back-forward keep the same report state.
  useEffect(() => {
    const newParams = new URLSearchParams();
    newParams.set("mode", filters.mode);

    if (filters.mode === "daily" && filters.date) newParams.set("date", filters.date);
    if (filters.mode === "monthly" && filters.month) newParams.set("month", filters.month);
    if (filters.mode === "custom") {
      if (filters.startDate) newParams.set("startDate", filters.startDate);
      if (filters.endDate) newParams.set("endDate", filters.endDate);
    }

    if (filters.department && filters.department !== "all") newParams.set("department", filters.department);
    if (filters.employeeId) newParams.set("employeeId", filters.employeeId);
    if (filters.employeeName) newParams.set("employeeName", filters.employeeName);
    if (filters.status) newParams.set("status", filters.status);
    if (filters.lateOnly) newParams.set("lateOnly", "true");
    if (filters.missingExitOnly) newParams.set("missingExitOnly", "true");

    setSearchParams(newParams, { replace: true });
  }, [filters, setSearchParams]);

  // Fetch analytics summary
  const {
    data: analytics = null,
    isLoading: isSummaryLoading,
    error: summaryError,
  } = useQuery({
    queryKey: ["reportsSummary", filters],
    queryFn: () => getReportsSummary(filters),
    // Only run for custom mode when both dates are provided
    enabled: filters.mode !== "custom" || (!!filters.startDate && !!filters.endDate),
    staleTime: 30 * 1000, // 30 seconds
    retry: 2,
  });

  // Fetch report rows
  const {
    data: rowsResponse,
    isLoading: isRowsLoading,
    error: rowsError,
  } = useQuery({
    queryKey: ["reportsRows", filters, page, pageSize],
    queryFn: () => getReportsRows(filters, page, pageSize),
    // Only run for custom mode when both dates are provided
    enabled: filters.mode !== "custom" || (!!filters.startDate && !!filters.endDate),
    staleTime: 30 * 1000,
    retry: 2,
  });

  const reportData = rowsResponse?.rows || [];
  const pagination = rowsResponse?.pagination;
  const isLoading = isSummaryLoading || isRowsLoading;
  let error: string | null = null;
  if (filters.mode === "custom" && (!filters.startDate || !filters.endDate)) {
    error = "Please select both start and end dates for custom range.";
  } else if (summaryError || rowsError) {
    error = "Failed to fetch report data. Please try again.";
  }

  const updateFilters = (newFilters: Partial<ReportFiltersState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    // Reset to page 1 when filters change
    setPage(1);
    // Reset row selection
    setSelectedRowIds([]);
  };

  const setMode = (mode: ReportMode) => {
    setFilters(prev => ({ ...prev, mode }));
    setPage(1);
    setSelectedRowIds([]);
  };

  const goToPage = (newPage: number) => {
    setPage(newPage);
  };

  return {
    mode: filters.mode,
    filters,
    updateFilters,
    setMode,
    analytics,
    reportData,
    isLoading,
    error: error ? "Failed to fetch report data. Please try again." : null,
    selectedEmployeeId,
    setSelectedEmployeeId,
    selectedRowIds,
    setSelectedRowIds,
    pagination,
    page,
    pageSize,
    goToPage,
  };
};
