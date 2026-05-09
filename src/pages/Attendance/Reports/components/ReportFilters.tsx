import React from "react";
import type { ReportMode, ReportFiltersState } from "../types";
import { DEPARTMENTS, STATUS_OPTIONS, REPORT_PRESETS } from "../constants";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";

interface ReportFiltersProps {
  filters: ReportFiltersState;
  onChange: (filters: Partial<ReportFiltersState>) => void;
}

export const ReportFilters: React.FC<ReportFiltersProps> = ({ filters, onChange }) => {
  const mode = filters.mode;

  const handlePresetClick = (_presetValue: string, presetMode: ReportMode) => {
    // Basic mapping for demo purposes. In real app, calculate dates based on preset.
    onChange({ mode: presetMode });
  };

  return (
    <div className="flex flex-col gap-4 p-4 border-b border-border/40 bg-background/50">
      
      {/* QUICK PRESETS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider mr-2 shrink-0">
          Quick Filters
        </span>
        {REPORT_PRESETS.map((preset) => (
          <Badge 
            key={preset.value}
            variant="secondary"
            className="cursor-pointer hover:bg-secondary/80 shrink-0 transition-colors"
            onClick={() => handlePresetClick(preset.value, preset.mode as ReportMode)}
          >
            {preset.label}
          </Badge>
        ))}
      </div>

      {/* DYNAMIC FILTER BAR */}
      <div className="flex flex-wrap items-center gap-3">
        
        {/* Common: Employee Search */}
        <div className="relative w-full sm:w-64 shrink-0">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search employee..." 
            className="pl-9 h-9 bg-background"
            value={filters.employeeId || ""}
            onChange={(e) => onChange({ employeeId: e.target.value })}
          />
        </div>

        {/* Common: Department Select */}
        <Select 
          value={filters.department} 
          onValueChange={(val) => onChange({ department: val })}
        >
          <SelectTrigger className="w-[160px] h-9 bg-background">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {DEPARTMENTS.map(d => (
              <SelectItem key={d} value={d}>{d}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Mode Specific: DAILY */}
        {mode === "daily" && (
          <>
            <div className="relative">
              <Input 
                type="date" 
                className="h-9 w-[160px] bg-background" 
                value={filters.date || ""}
                onChange={(e) => onChange({ date: e.target.value })}
              />
            </div>
            <Select 
              value={filters.status || "all"} 
              onValueChange={(val) => onChange({ status: val === "all" ? undefined : val })}
            >
              <SelectTrigger className="w-[140px] h-9 bg-background">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {STATUS_OPTIONS.map(s => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              variant={filters.lateOnly ? "default" : "outline"} 
              size="sm" 
              className="h-9"
              onClick={() => onChange({ lateOnly: !filters.lateOnly })}
            >
              Late Only
            </Button>
            <Button 
              variant={filters.missingExitOnly ? "default" : "outline"} 
              size="sm" 
              className="h-9"
              onClick={() => onChange({ missingExitOnly: !filters.missingExitOnly })}
            >
              Missing Exit
            </Button>
          </>
        )}

        {/* Mode Specific: MONTHLY */}
        {mode === "monthly" && (
          <div className="relative">
            <Input 
              type="month" 
              className="h-9 w-[160px] bg-background" 
              value={filters.month || ""}
              onChange={(e) => onChange({ month: e.target.value })}
            />
          </div>
        )}

        {/* Mode Specific: CUSTOM RANGE */}
        {mode === "custom" && (
          <>
            <Input 
              type="date" 
              className="h-9 w-[150px] bg-background" 
              placeholder="Start Date"
              value={filters.startDate || ""}
              onChange={(e) => onChange({ startDate: e.target.value })}
            />
            <span className="text-muted-foreground text-sm">to</span>
            <Input 
              type="date" 
              className="h-9 w-[150px] bg-background" 
              placeholder="End Date"
              value={filters.endDate || ""}
              onChange={(e) => onChange({ endDate: e.target.value })}
            />
          </>
        )}

        {/* Reset Filters */}
        {(filters.employeeId || filters.department !== "all" || filters.lateOnly || filters.missingExitOnly || filters.status) && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-9 text-muted-foreground hover:text-foreground ml-auto"
            onClick={() => onChange({
              employeeId: "",
              department: "all",
              status: undefined,
              lateOnly: false,
              missingExitOnly: false,
            })}
          >
            <X className="mr-2 h-4 w-4" />
            Clear
          </Button>
        )}

      </div>
    </div>
  );
};
