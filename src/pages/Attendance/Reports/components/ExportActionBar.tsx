import React from "react";
import { Button } from "@/components/ui/button";
import { Download, FileSpreadsheet, X } from "lucide-react";
import type { ReportMode } from "../types";

interface ExportActionBarProps {
  selectedCount: number;
  totalCount: number;
  mode: ReportMode;
  onClearSelection: () => void;
  onExportCsv: () => void;
  onExportXlsx: () => void;
}

export const ExportActionBar: React.FC<ExportActionBarProps> = ({
  selectedCount,
  totalCount,
  mode,
  onClearSelection,
  onExportCsv,
  onExportXlsx
}) => {
  // We only show it if there's data to export, and it becomes more prominent if items are selected.
  if (totalCount === 0) return null;

  return (
    <div className="sticky bottom-0 z-20 w-full p-4 bg-background/95 backdrop-blur-md border-t border-border/50 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] flex flex-col sm:flex-row items-center justify-between gap-4 transition-all duration-300 animate-in slide-in-from-bottom-2">
      <div className="flex items-center gap-4">
        <div className="flex flex-col">
          <span className="text-sm font-semibold">
            {selectedCount > 0 ? `${selectedCount} rows selected` : `${totalCount} results found`}
          </span>
          <span className="text-xs text-muted-foreground uppercase tracking-wider">
            {mode} report ready
          </span>
        </div>
        {selectedCount > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-muted-foreground hover:text-foreground h-8 px-2"
            onClick={onClearSelection}
          >
            <X className="w-4 h-4 mr-1" />
            Clear Selection
          </Button>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Button variant="outline" className="hidden sm:flex" onClick={onExportCsv}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
        <Button variant="default" className="shadow-md" onClick={onExportXlsx}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Export XLSX
        </Button>
      </div>
    </div>
  );
};
