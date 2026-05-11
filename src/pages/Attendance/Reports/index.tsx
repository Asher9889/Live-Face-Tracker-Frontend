import React from "react";
import { ReportToolbar } from "./components/ReportToolbar";
import { ReportFilters } from "./components/ReportFilters";
import { SummaryCards } from "./components/SummaryCards";
import { AttendanceReportTable } from "./components/AttendanceReportTable";
import { EmployeeTimelineDrawer } from "./components/EmployeeTimelineDrawer";
import { ExportActionBar } from "./components/ExportActionBar";
import { useAttendanceReports } from "./hooks/useAttendanceReports";
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

  const handleExport = (format: 'csv' | 'xlsx') => {
    const count = selectedRowIds.length > 0 ? selectedRowIds.length : reportData.length;
    toast.success(`Exporting ${count} rows as ${format.toUpperCase()}`, {
      description: "Your download will start shortly.",
    });
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
