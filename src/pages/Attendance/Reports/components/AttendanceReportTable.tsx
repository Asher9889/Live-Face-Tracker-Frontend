import React from "react";
import type { ReportMode, DailyReportRow, MonthlyReportRow } from "../types";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface AttendanceReportTableProps {
  mode: ReportMode;
  data: (DailyReportRow | MonthlyReportRow)[];
  isLoading: boolean;
  selectedRowIds: string[];
  onSelectRow: (id: string) => void;
  onSelectAll: (selectAll: boolean) => void;
  onRowClick: (employeeId: string) => void;
}

export const AttendanceReportTable: React.FC<AttendanceReportTableProps> = ({
  mode,
  data,
  isLoading,
  selectedRowIds,
  onSelectRow,
  onSelectAll,
  onRowClick
}) => {
  if (isLoading) {
    return (
      <div className="flex-1 p-8 flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm text-muted-foreground">Loading report data...</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex-1 p-8 flex flex-col items-center justify-center">
        <p className="text-muted-foreground">No data found for the selected filters.</p>
      </div>
    );
  }

  const isDaily = mode === "daily" || mode === "custom";
  const allSelected = data.length > 0 && selectedRowIds.length === data.length;

  return (
    <div className="flex-1 overflow-auto bg-background p-4">
      <div className="rounded-md border border-border/50">
        <Table>
          <TableHeader className="bg-secondary/30 sticky top-0 z-10 shadow-sm">
            <TableRow>
              <TableHead className="w-12 text-center">
                <Checkbox 
                  checked={allSelected} 
                  onCheckedChange={(c) => onSelectAll(c === true)} 
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead>Employee</TableHead>
              {isDaily ? (
                <>
                  <TableHead>Entry Time</TableHead>
                  <TableHead>Exit Time</TableHead>
                  <TableHead>Work Hours</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Flags</TableHead>
                </>
              ) : (
                <>
                  <TableHead>Present Days</TableHead>
                  <TableHead>Absent Days</TableHead>
                  <TableHead>Late</TableHead>
                  <TableHead>Avg Hours</TableHead>
                  <TableHead>Missing Exits</TableHead>
                </>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => {
              const isSelected = selectedRowIds.includes(row.id);
              
              return (
                <TableRow 
                  key={row.id} 
                  className={`cursor-pointer transition-colors hover:bg-secondary/20 ${isSelected ? "bg-primary/5" : ""}`}
                  onClick={() => onRowClick(row.employeeId)}
                >
                  <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                    <Checkbox 
                      checked={isSelected} 
                      onCheckedChange={() => onSelectRow(row.id)} 
                      aria-label="Select row"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={row.avatar} alt={row.name} />
                        <AvatarFallback>{row.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{row.name}</span>
                        <span className="text-xs text-muted-foreground">{row.department} • {row.employeeId}</span>
                      </div>
                    </div>
                  </TableCell>
                  
                  {isDaily ? (
                    // DAILY / CUSTOM COLUMNS
                    <>
                      <TableCell className="text-sm">{(row as DailyReportRow).entryTime || "--"}</TableCell>
                      <TableCell className="text-sm">{(row as DailyReportRow).exitTime || "--"}</TableCell>
                      <TableCell className="text-sm font-medium">{(row as DailyReportRow).workHours || "--"}</TableCell>
                      <TableCell>
                        {(() => {
                          const status = (row as DailyReportRow).status;
                          return (
                            <Badge variant={status === 'Present' ? 'default' : status === 'Absent' ? 'destructive' : 'secondary'} className={status === 'Present' ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}>
                              {status}
                            </Badge>
                          );
                        })()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {(row as DailyReportRow).lateStatus && <Badge variant="outline" className="text-orange-500 border-orange-200 bg-orange-50">Late</Badge>}
                          {(row as DailyReportRow).missingExit && <Badge variant="outline" className="text-red-500 border-red-200 bg-red-50">Missing Exit</Badge>}
                        </div>
                      </TableCell>
                    </>
                  ) : (
                    // MONTHLY COLUMNS
                    <>
                      <TableCell className="font-medium text-green-600">{(row as MonthlyReportRow).presentDays}</TableCell>
                      <TableCell className="font-medium text-red-600">{(row as MonthlyReportRow).absentDays}</TableCell>
                      <TableCell className="text-sm">{(row as MonthlyReportRow).lateCount}</TableCell>
                      <TableCell className="text-sm">{(row as MonthlyReportRow).avgWorkHours}</TableCell>
                      <TableCell className="text-sm">{(row as MonthlyReportRow).missingExits}</TableCell>
                    </>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
