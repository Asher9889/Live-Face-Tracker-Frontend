import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import type { ReportMode, ReportFiltersState, AnalyticsSummary, DailyReportRow, MonthlyReportRow } from "../types";
import * as mockApi from "../services/mockReports";

export const useAttendanceReports = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Mode from URL, default to 'daily'
  const modeParam = searchParams.get("mode") as ReportMode | null;
  const initialMode: ReportMode = modeParam && ["daily", "monthly", "custom"].includes(modeParam) ? modeParam : "daily";

  const [filters, setFilters] = useState<ReportFiltersState>({
    mode: initialMode,
    date: searchParams.get("date") || new Date().toISOString().split('T')[0],
    month: searchParams.get("month") || new Date().toISOString().slice(0, 7),
    department: searchParams.get("department") || "all",
  });

  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [reportData, setReportData] = useState<DailyReportRow[] | MonthlyReportRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
  }, [filters.mode, filters.date, filters.month]);

  // Fetch data when filters change
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [summary, data] = await Promise.all([
        mockApi.getAnalyticsSummary(filters),
        filters.mode === "daily" 
          ? mockApi.getDailyReport(filters)
          : filters.mode === "monthly"
          ? mockApi.getMonthlyReport(filters)
          : mockApi.getCustomRangeReport(filters)
      ]);
      setAnalytics(summary);
      setReportData(data);
      // Reset row selection when data changes
      setSelectedRowIds([]);
    } catch (err) {
      setError("Failed to fetch report data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateFilters = (newFilters: Partial<ReportFiltersState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const setMode = (mode: ReportMode) => {
    setFilters(prev => ({ ...prev, mode }));
  };

  return {
    mode: filters.mode,
    filters,
    updateFilters,
    setMode,
    analytics,
    reportData,
    isLoading,
    error,
    selectedEmployeeId,
    setSelectedEmployeeId,
    selectedRowIds,
    setSelectedRowIds,
    refresh: fetchData
  };
};
