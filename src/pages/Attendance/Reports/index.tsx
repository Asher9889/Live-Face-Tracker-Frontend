import React, { useState } from "react";
import { ReportToolbar } from "./components/ReportToolbar";
import { ReportFilters } from "./components/ReportFilters";
import { SummaryCards } from "./components/SummaryCards";
import { AttendanceReportTable } from "./components/AttendanceReportTable";
import { EmployeeTimelineDrawer } from "./components/EmployeeTimelineDrawer";
import { ExportActionBar } from "./components/ExportActionBar";
import { useAttendanceReports } from "./hooks/useAttendanceReports";
import { exportReports } from "./api/attendance-reports.api";
import { toast } from "sonner";

const ReportsWorkspace: React.FC = () => {
  const {
    mode,
    filters,
    updateFilters,
    setMode,
    analytics,
    reportData,
    isLoading,
    selectedEmployeeId,
    setSelectedEmployeeId,
    selectedRowIds,
    setSelectedRowIds,
  } = useAttendanceReports();

  const [isExporting, setIsExporting] = useState(false);

  const handleSelectAll = (selectAll: boolean) => {
    if (selectAll) {
      setSelectedRowIds(reportData.map((r) => r.id));
    } else {
      setSelectedRowIds([]);
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedRowIds((prev) =>
      prev.includes(id) ? prev.filter((rId) => rId !== id) : [...prev, id]
    );
  };

  const handleExport = async (format: 'csv' | 'xlsx') => {
    const count = selectedRowIds.length > 0 ? selectedRowIds.length : reportData.length;
    
    try {
      setIsExporting(true);
      
      const exportPayload = {
        mode: filters.mode,
        date: filters.date,
        month: filters.month,
        startDate: filters.startDate,
        endDate: filters.endDate,
        scope: selectedRowIds.length > 0 ? ("SELECTED_ROWS" as const) : ("ALL_ROWS" as const),
        rowIds: selectedRowIds.length > 0 ? selectedRowIds : undefined,
        filters: {
          employeeId: filters.employeeId || undefined,
          employeeName: filters.employeeName || undefined,
          department: filters.department && filters.department !== "all" ? filters.department : undefined,
          status: filters.status || undefined,
          lateOnly: filters.lateOnly || undefined,
          missingExitOnly: filters.missingExitOnly || undefined,
        },
        format,
        timezone: "Asia/Kolkata",
        registeredOnly: true,
      };

      const blob = await exportReports(exportPayload);

      // Download the file
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const dateStr = filters.date || filters.month || `${filters.startDate}_${filters.endDate}`;
      link.download = `attendance-report-${filters.mode}-${dateStr}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success(`Exported ${count} rows as ${format.toUpperCase()}`, {
        description: "File download completed.",
      });
      
      setSelectedRowIds([]);
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Export failed", {
        description: error instanceof Error ? error.message : "Failed to export report",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-background relative overflow-hidden">
      {/* Sticky Top Section */}
      <ReportToolbar mode={mode} onModeChange={setMode} />

      {/* Scrollable Content Workspace */}
      <div className="flex-1 overflow-auto flex flex-col relative z-0">
        <ReportFilters filters={filters} onChange={updateFilters} />

        <SummaryCards
          analytics={analytics}
          isLoading={isLoading}
          mode={mode}
        />

        {/* Main Table Area */}
        <AttendanceReportTable
          mode={mode}
          data={reportData}
          isLoading={isLoading}
          selectedRowIds={selectedRowIds}
          onSelectRow={handleSelectRow}
          onSelectAll={handleSelectAll}
          onRowClick={setSelectedEmployeeId}
        />
      </div>

      {/* Sticky Bottom Actions */}
      <ExportActionBar
        mode={mode}
        selectedCount={selectedRowIds.length}
        totalCount={reportData.length}
        onClearSelection={() => setSelectedRowIds([])}
        onExportCsv={() => handleExport('csv')}
        onExportXlsx={() => handleExport('xlsx')}
        isExporting={isExporting}
      />

      {/* Contextual Drawer */}
      <EmployeeTimelineDrawer
        employeeId={selectedEmployeeId}
        onClose={() => setSelectedEmployeeId(null)}
      />
    </div>
  );
};

export default ReportsWorkspace;
