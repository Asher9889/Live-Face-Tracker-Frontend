import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  rows?: number;
};

const AttendanceTableSkeleton = ({ rows = 6 }: Props) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Event Time</TableHead>
            <TableHead>Type / Gate</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Source</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {Array.from({ length: rows }).map((_, i) => (
            <TableRow key={i}>
              {/* User */}
              <TableCell className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-44" />
                </div>
              </TableCell>

              {/* Event Time */}
              <TableCell>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </TableCell>

              {/* Type / Gate */}
              <TableCell>
                <div className="space-y-2">
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </TableCell>

              {/* Status */}
              <TableCell>
                <div className="space-y-2">
                  <Skeleton className="h-6 w-24 rounded-full" />
                  <Skeleton className="h-3 w-28" />
                </div>
              </TableCell>

              {/* Source */}
              <TableCell>
                <Skeleton className="h-4 w-20" />
              </TableCell>

              {/* Actions */}
              <TableCell className="text-right">
                <Skeleton className="h-8 w-8 rounded-md ml-auto" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AttendanceTableSkeleton;
