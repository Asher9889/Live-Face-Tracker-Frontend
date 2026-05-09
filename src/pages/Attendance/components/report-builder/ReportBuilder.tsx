import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ReportTypeSelector } from './components/ReportTypeSelector';
import { DateSelector } from './components/DateSelector';
import { EmployeeSelector } from './components/EmployeeSelector';
import { ExportFormatSelector } from './components/ExportFormatSelector';
import { ReportSummaryCards } from './components/ReportSummaryCards';
import { ReportPreviewTable } from './components/ReportPreviewTable';
import { ExportActions } from './components/ExportActions';
import { useReportBuilder } from './hooks/useReportBuilder';

interface ReportBuilderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialDate?: Date;
  onExportSuccess?: () => void;
}

export const ReportBuilder = ({
  open,
  onOpenChange,
  initialDate,
  onExportSuccess,
}: ReportBuilderProps) => {
  const {
    config,
    previewStats,
    previewRows,
    isLoadingPreview,
    isExporting,
    exportError,
    setReportType,
    setDateRange,
    setSelectedEmployeeIds,
    setFormat,
    resetFilters,
    handleExport,
  } = useReportBuilder({
    initialDate,
    onExportSuccess: () => {
      onExportSuccess?.();
      onOpenChange(false);
    },
  });

  const handleReset = () => {
    resetFilters();
  };

  const hasValidConfig: boolean =
    !!(config.reportType &&
    config.startDate &&
    config.format);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl max-h-[90vh] p-0 overflow-hidden flex flex-col">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="text-2xl">Generate Attendance Report</DialogTitle>
          <DialogDescription>
            Configure your report settings and preview data before exporting
          </DialogDescription>
        </DialogHeader>

          <div className="flex gap-6 p-6 flex-1 overflow-hidden">
          {/* Left Panel - Configuration */}
          <ScrollArea className="w-80 border rounded-lg flex-shrink-0">
            <div className="p-4 space-y-6">
              {/* Report Type Selector */}
              <ReportTypeSelector
                value={config.reportType}
                onChange={setReportType}
              />

              {/* Date Selector */}
              <DateSelector
                reportType={config.reportType}
                startDate={config.startDate}
                onDateChange={setDateRange}
              />

              {/* Employee Selector */}
              {config.reportType !== 'ORGANIZATION' && (
                <EmployeeSelector
                  selectedIds={config.selectedEmployeeIds}
                  onSelectedChange={setSelectedEmployeeIds}
                  disabled={isExporting}
                />
              )}

              {/* Export Format Selector */}
              <ExportFormatSelector
                value={config.format}
                onChange={setFormat}
                disabled={isExporting}
              />
            </div>
          </ScrollArea>

          {/* Right Panel - Preview */}
          <div className="flex-1 flex flex-col gap-4 overflow-hidden">
            <ScrollArea className="flex-1 border rounded-lg">
              <div className="p-4 space-y-6">
                {/* Summary Cards */}
                <ReportSummaryCards
                  stats={previewStats}
                  isLoading={isLoadingPreview}
                />

                {/* Preview Table */}
                <ReportPreviewTable
                  rows={previewRows}
                  isLoading={isLoadingPreview}
                  reportType={config.reportType}
                />
              </div>
            </ScrollArea>

            {/* Export Actions */}
            <ExportActions
              isExporting={isExporting}
              isLoadingPreview={isLoadingPreview}
              exportError={exportError}
              onExport={handleExport}
              onReset={handleReset}
              hasValidConfig={hasValidConfig}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
