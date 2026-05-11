import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import type { ReportMode, ReportFiltersState } from "../types";
import { getReportsSummary, getReportsRows } from "../api/attendance-reports.api";

export const useAttendanceReports = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [pageSize] = useState(25);

  // Mode from URL, default to 'daily'
  const modeParam = searchParams.get("mode") as ReportMode | null;
  const initialMode: ReportMode = modeParam && ["daily", "monthly", "custom"].includes(modeParam) ? modeParam : "daily";

  const [filters, setFilters] = useState<ReportFiltersState>({
    mode: initialMode,
    date: searchParams.get("date") || new Date().toISOString().split('T')[0],
    month: searchParams.get("month") || new Date().toISOString().slice(0, 7),
    department: searchParams.get("department") || "all",
  });

  // Selected employee for Timeline Drawer
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);

  // Selection for export/actions
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);

  // Sync mode to URL when it changes
  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("mode", filters.mode);
    if (filters.date) newParams.set("date", filters.date);
    if (filters.month) newParams.set("month", filters.month);
    
    setSearchParams(newParams, { replace: true });
  }, [filters.mode, filters.date, filters.month, setSearchParams, searchParams]);

  // Fetch analytics summary
  const {
    data: analytics = null,
    isLoading: isSummaryLoading,
    error: summaryError,
  } = useQuery({
    queryKey: ["reportsSummary", filters],
    queryFn: () => getReportsSummary(filters),
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
    staleTime: 30 * 1000,
    retry: 2,
  });

  const reportData = rowsResponse?.rows || [];
  const pagination = rowsResponse?.pagination;
  const isLoading = isSummaryLoading || isRowsLoading;
  const error = summaryError || rowsError;

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
