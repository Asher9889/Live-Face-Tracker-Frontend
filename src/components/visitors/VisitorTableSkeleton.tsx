import { Skeleton } from "../ui/skeleton";
import { TableCell, TableRow } from "../ui/table";

const VisitorRowSkeleton = () => (
  <TableRow>
    <TableCell>
      <Skeleton className="h-12 w-12 rounded-md" />
    </TableCell>
    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
    <TableCell>
      <div className="space-y-2 py-1">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-2 w-56" />
        <Skeleton className="h-4 w-52" />
      </div>
    </TableCell>
    <TableCell><Skeleton className="h-4 w-40" /></TableCell>
    <TableCell><Skeleton className="h-4 w-40" /></TableCell>
    <TableCell className="text-right">
      <Skeleton className="h-8 w-32 ml-auto" />
    </TableCell>
  </TableRow>
);

export default VisitorRowSkeleton;
