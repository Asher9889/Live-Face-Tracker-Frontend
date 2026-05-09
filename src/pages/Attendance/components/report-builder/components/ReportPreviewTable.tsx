import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import type { PreviewRow, ReportType } from '../types';

interface ReportPreviewTableProps {
  rows: PreviewRow[];
  isLoading: boolean;
  reportType: ReportType;
}

const getStatusBadge = (status: string) => {
  const statusMap: Record<string, { label: string; variant: any }> = {
    PRESENT: { label: 'Present', variant: 'default' },
    ABSENT: { label: 'Absent', variant: 'destructive' },
    LATE: { label: 'Late', variant: 'secondary' },
    ON_BREAK: { label: 'Break', variant: 'outline' },
    GOOD: { label: 'Good', variant: 'default' },
    WARNING: { label: 'Warning', variant: 'secondary' },
    CRITICAL: { label: 'Critical', variant: 'destructive' },
  };

  const mapped = statusMap[status] || {
    label: status,
    variant: 'outline',
  };

  return <Badge variant={mapped.variant}>{mapped.label}</Badge>;
};

export const ReportPreviewTable = ({
  rows,
  isLoading,
  reportType,
}: ReportPreviewTableProps) => {
  const isDailyReport = reportType === 'DAILY' || reportType === 'EMPLOYEE_WISE';

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">
          {isDailyReport ? 'Daily Attendance Preview' : 'Monthly Summary Preview'} ({rows.length} shown)
        </h3>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/4">Employee</TableHead>
              <TableHead className="w-1/4">Department</TableHead>
              {isDailyReport ? (
                <>
                  <TableHead className="w-1/6 text-center">Entry Time</TableHead>
                  <TableHead className="w-1/6 text-center">Exit Time</TableHead>
                  <TableHead className="w-1/6 text-center">Hrs</TableHead>
                </>
              ) : (
                <>
                  <TableHead className="w-1/6 text-center">Present</TableHead>
                  <TableHead className="w-1/6 text-center">Absent</TableHead>
                  <TableHead className="w-1/6 text-center">Avg Hrs</TableHead>
                </>
              )}
              <TableHead className="w-1/6 text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16 mx-auto" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16 mx-auto" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-12 mx-auto" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-14 mx-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={isDailyReport ? 6 : 6} className="text-center py-8">
                  <p className="text-sm text-muted-foreground">No preview data available</p>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row.employeeId}>
                  <TableCell className="font-medium">
                    <div>
                      <p className="text-sm">{row.employeeName}</p>
                      {row.employeeCode && (
                        <p className="text-xs text-muted-foreground">
                          {row.employeeCode}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {row.department || '-'}
                  </TableCell>
                  {isDailyReport && 'entryTime' in row ? (
                    <>
                      <TableCell className="text-center text-sm">
                        {row.entryTime
                          ? format(
                              new Date(`2024-01-01 ${row.entryTime}`),
                              'HH:mm'
                            )
                          : '-'}
                      </TableCell>
                      <TableCell className="text-center text-sm">
                        {row.exitTime
                          ? format(
                              new Date(`2024-01-01 ${row.exitTime}`),
                              'HH:mm'
                            )
                          : '-'}
                      </TableCell>
                      <TableCell className="text-center text-sm">
                        {row.workingHours?.toFixed(1)}h
                      </TableCell>
                    </>
                  ) : 'presentDays' in row ? (
                    <>
                      <TableCell className="text-center text-sm font-medium">
                        {row.presentDays}
                      </TableCell>
                      <TableCell className="text-center text-sm">
                        {row.absentDays}
                      </TableCell>
                      <TableCell className="text-center text-sm">
                        {row.averageHours?.toFixed(1)}h
                      </TableCell>
                    </>
                  ) : null}
                  <TableCell className="text-center">
                    {getStatusBadge(row.status)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {rows.length > 0 && (
        <p className="text-xs text-muted-foreground text-center">
          Showing first {rows.length} records. Complete report will include all data.
        </p>
      )}
    </div>
  );
};
