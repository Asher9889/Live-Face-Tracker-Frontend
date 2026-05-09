import { useCallback, useEffect, useMemo, useState } from 'react';
import { format, endOfMonth } from 'date-fns';
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import {
  getAttendanceByDate,
  getAttendanceByDateRange,
  exportAttendanceReport,
} from '../../../api/attendence.api';
import type {
  ReportConfig,
  ReportPreviewStats,
  PreviewRow,
  PreviewRowDaily,
  ReportType,
} from '../types';

interface UseReportBuilderProps {
  initialDate?: Date;
  onExportSuccess?: () => void;
}

export function useReportBuilder({
  initialDate = new Date(),
  onExportSuccess,
}: UseReportBuilderProps) {
  const queryClient = useQueryClient();
  const [config, setConfig] = useState<ReportConfig>({
    reportType: 'DAILY',
    startDate: initialDate,
    selectedEmployeeIds: [],
    format: 'csv',
    timezone: 'UTC',
  });

  const [previewStats, setPreviewStats] = useState<ReportPreviewStats | null>(null);
  const [previewRows, setPreviewRows] = useState<PreviewRow[]>([]);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);

  // Determine date range based on report type
  const dateRange = useMemo(() => {
    const start = config.startDate;
    let end = config.endDate || start;

    if (config.reportType === 'MONTHLY') {
      const now = new Date(start);
      end = endOfMonth(now);
    }

    return {
      from: format(start, 'yyyy-MM-dd'),
      to: format(end, 'yyyy-MM-dd'),
    };
  }, [config.startDate, config.endDate, config.reportType]);

  // Fetch preview data
  const { data: previewData, isLoading: isLoadingData } = useQuery({
    queryKey: ['attendancePreview', dateRange.from, dateRange.to, config.reportType],
    queryFn: async () => {
      if (config.reportType === 'DAILY') {
        return getAttendanceByDate(dateRange.from, {
          registeredOnly: true,
          limit: 50,
          offset: 0,
        });
      } else if (config.reportType === 'MONTHLY') {
        return getAttendanceByDateRange(dateRange.from, dateRange.to, {
          registeredOnly: true,
          limit: 50,
          offset: 0,
        });
      }
      return null;
    },
    enabled: config.reportType !== 'ORGANIZATION',
    staleTime: 30 * 1000, // 30 seconds
  });

  // Update preview data whenever it changes
  useEffect(() => {
    setIsLoadingPreview(isLoadingData);

    if (previewData && 'stats' in previewData) {
      const stats = previewData.stats;
      setPreviewStats({
        totalEmployees: stats.uniqueEmployees || 0,
        totalPresent: stats.totalRecords || 0,
        totalAbsent: 0,
        lateArrivals: stats.lateEntries || 0,
        missingExits: stats.earlyExits || 0,
        averageWorkingHours: stats.totalWorkDuration ? Math.round((stats.totalWorkDuration / (stats.totalRecords || 1)) * 10) / 10 : 0,
        overtimeCount: 0,
        onBreak: 0,
      });

      // Transform events to preview rows
      if (previewData.events) {
        const rows: PreviewRowDaily[] = previewData.events
          .slice(0, 10)
          .map((event: any) => ({
            employeeId: event.employeeId,
            employeeName: event.employeeName || 'Unknown',
            employeeCode: event.employeeCode,
            department: event.department,
            entryTime: event.entryTime,
            exitTime: event.exitTime,
            status: (event.status || 'PRESENT') as 'PRESENT' | 'ABSENT' | 'LATE' | 'ON_BREAK',
            workingHours: event.workingHours,
            isLate: event.flags?.includes('LATE_ENTRY'),
          }));
        setPreviewRows(rows);
      }
    } else if (previewData && 'attendanceEvents' in previewData) {
      // Handle range response
      setPreviewStats({
        totalEmployees: 0,
        totalPresent: previewData.attendanceEvents?.length || 0,
        totalAbsent: 0,
        lateArrivals: 0,
        missingExits: 0,
        averageWorkingHours: 0,
        overtimeCount: 0,
        onBreak: 0,
      });

      if (previewData.attendanceEvents) {
        const rows = previewData.attendanceEvents
          .slice(0, 10)
          .map((event: any) => ({
            employeeId: event.employeeId,
            employeeName: event.employeeName || 'Unknown',
            employeeCode: event.employeeCode,
            department: event.department,
            entryTime: event.lastSeenAt,
            exitTime: undefined,
            status: (event.state === 'IN' ? 'PRESENT' : 'ABSENT') as
              | 'PRESENT'
              | 'ABSENT'
              | 'LATE'
              | 'ON_BREAK',
            workingHours: 0,
            isLate: false,
          }));
        setPreviewRows(rows as PreviewRow[]);
      }
    }
  }, [previewData, isLoadingData]);

  // Export mutation
  const exportMutation = useMutation({
    mutationFn: async () => {
      const blob = await exportAttendanceReport({
        date: dateRange.from,
        scope: config.selectedEmployeeIds.length > 0 ? 'SELECTED_EMPLOYEES' : 'ALL_EMPLOYEES',
        format: config.format as 'csv' | 'xlsx',
        employeeIds: config.selectedEmployeeIds.length > 0 ? config.selectedEmployeeIds : undefined,
        registeredOnly: true,
        timezone: config.timezone,
      });

      return blob;
    },
    onSuccess: (blob) => {
      // Download the file
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const scopeLabel =
        config.selectedEmployeeIds.length > 0
          ? `employees-${config.selectedEmployeeIds.length}`
          : 'all-employees';
      link.download = `attendance-report-${scopeLabel}-${dateRange.from}.${config.format}`;
      link.click();
      window.URL.revokeObjectURL(url);

      onExportSuccess?.();
      queryClient.invalidateQueries({ queryKey: ['attendancePreview'] });
    },
    onError: (error) => {
      console.error('Export failed:', error);
    },
  });

  // Configuration setters
  const setReportType = useCallback((type: ReportType) => {
    setConfig((prev: ReportConfig) => ({
      ...prev,
      reportType: type,
      selectedEmployeeIds: [],
    }));
  }, []);

  const setDateRange = useCallback((startDate: Date, endDate?: Date) => {
    setConfig((prev: ReportConfig) => ({
      ...prev,
      startDate,
      endDate,
    }));
  }, []);

  const setSelectedEmployeeIds = useCallback((ids: string[]) => {
    setConfig((prev: ReportConfig) => ({
      ...prev,
      selectedEmployeeIds: ids,
    }));
  }, []);

  const setFormat = useCallback((format: 'csv' | 'xlsx') => {
    setConfig((prev: ReportConfig) => ({
      ...prev,
      format,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setConfig({
      reportType: 'DAILY',
      startDate: new Date(),
      selectedEmployeeIds: [],
      format: 'csv',
      timezone: 'UTC',
    });
    setPreviewStats(null);
    setPreviewRows([]);
  }, []);

  return {
    config,
    previewStats,
    previewRows,
    isLoadingPreview,
    isExporting: exportMutation.isPending,
    exportError: exportMutation.error?.message || null,
    dateRange,
    setReportType,
    setDateRange,
    setSelectedEmployeeIds,
    setFormat,
    resetFilters,
    handleExport: () => exportMutation.mutate(),
  };
}
