import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const EmployeeListSkeleton = ({ rows = 6 }: { rows?: number }) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {Array.from({ length: rows }).map((_, i) => (
            <TableRow key={i}>
              {/* Employee (Avatar + Name) */}
              <TableCell>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-9 w-9 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </TableCell>

              {/* ID */}
              <TableCell>
                <Skeleton className="h-4 w-20" />
              </TableCell>

              {/* Department */}
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>

              {/* Role */}
              <TableCell>
                <Skeleton className="h-4 w-20" />
              </TableCell>

              {/* Phone */}
              <TableCell>
                <Skeleton className="h-4 w-28" />
              </TableCell>

              {/* Actions */}
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Skeleton className="h-8 w-8 rounded-md" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default EmployeeListSkeleton;
