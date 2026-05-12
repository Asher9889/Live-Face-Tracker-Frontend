import React, { useEffect, useState } from "react";
import type { ReportMode, ReportFiltersState } from "../types";
import { DEPARTMENTS, REPORT_PRESETS } from "../constants";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, X } from "lucide-react";
import useEmployeeSearchByName from "../hooks/useEmployeeSearchByName";
import type { EmployeeSearchItem } from "../hooks/useEmployeeSearchByName";
import { convertIdToEmpId } from "@/utils";

interface ReportFiltersProps {
  filters: ReportFiltersState;
  onChange: (filters: Partial<ReportFiltersState>) => void;
}

export const ReportFilters: React.FC<ReportFiltersProps> = ({ filters, onChange }) => {
  const [employeeSearchQuery, setEmployeeSearchQuery] = useState<string>(filters.employeeName || "");
  const [showSuggestions, setShowSuggestions] = useState(false); // name suggestions dropdown visibility

  const mode = filters.mode;

  useEffect(() => {
    setEmployeeSearchQuery(filters.employeeName || "");
  }, [filters.employeeName]);

  const handlePresetClick = (_presetValue: string, presetMode: ReportMode) => {
    // Basic mapping for demo purposes. In real app, calculate dates based on preset.
    onChange({ mode: presetMode });
  };

  const { employees, isLoading, isError } = useEmployeeSearchByName(employeeSearchQuery);


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
            value={employeeSearchQuery}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => {
              window.setTimeout(() => setShowSuggestions(false), 120);
            }}
            onChange={(e) => {
              const value = e.target.value;
              setEmployeeSearchQuery(value);
              setShowSuggestions(value.length >= 2);
            }}
          /> 
 
          {showSuggestions && employeeSearchQuery.length >= 2 && (
            <div className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-md border border-border bg-background shadow-md">
              {isLoading && ((()=>{console.log("Searching...")})())  && (
                <div className="px-3 py-2 text-xs text-muted-foreground">Searching...</div>
              )}

              {!isLoading && isError && (
                <div className="px-3 py-2 text-xs text-destructive">Unable to fetch employees</div>
              )}

              {!isLoading && !isError && employees.length === 0 && (
                <div className="px-3 py-2 text-xs text-muted-foreground">No employees found</div>
              )} 

              { !isLoading && !isError && employees.length > 0 && employees.map((employee: EmployeeSearchItem) => (
                <button
                  key={employee.id}
                  type="button"
                  className="block w-full px-3 py-2 text-left hover:bg-accent border-b border-border last:border-0 cursor-pointer"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    setEmployeeSearchQuery(employee.name);
                    onChange({ employeeName: employee.name, employeeId: employee.id });
                    setShowSuggestions(false);
                  }}

                >
                  <p className="text-sm font-medium text-foreground">{employee.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {/* { employee.id} */}
                    {employee.department ? ` • ${employee.department}` : ""}
                    {employee.role ? ` • ${employee.role}` : ""}
                    {convertIdToEmpId(employee.id) ? ` • ${convertIdToEmpId(employee.id)}` : ""}
                  </p>
                </button> 
              ))}


            </div>
          )}

          
        </div>

        {/* Common: Department Select */}
        <Select 
          value={filters.department} 
          onValueChange={(val) => {
            onChange({ department: val.toLocaleLowerCase(), employeeId: undefined, employeeName: "" });
          }}
        >
          <SelectTrigger className="w-[160px] h-9 bg-background">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {DEPARTMENTS.map(d => (
              <SelectItem key={d} value={d.toLocaleLowerCase()}>{d}</SelectItem>
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
            {/* <Select 
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
            </Select> */}
            {/* <Button 
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
            </Button> */}
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
        {(filters.employeeId || filters.employeeName || filters.department !== "all" || filters.lateOnly || filters.missingExitOnly || filters.status) && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-9 text-muted-foreground text-black border   hover:text-foreground ml-auto"
            onClick={() => onChange({
              employeeId: undefined,
              employeeName: undefined,
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
