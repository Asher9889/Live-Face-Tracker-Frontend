import { Skeleton } from "../ui/skeleton";
import { TableCell, TableRow } from "../ui/table";

const VisitorRowSkeleton = () => (
  <TableRow>
    <TableCell>
      <Skeleton className="h-12 w-12 rounded-md" />
    </TableCell>
    <TableCell><Skeleton className="h-4 w-40" /></TableCell>
    <TableCell><Skeleton className="h-4 w-40" /></TableCell>
    <TableCell><Skeleton className="h-4 w-10" /></TableCell>
    <TableCell className="text-right">
      <Skeleton className="h-8 w-32 ml-auto" />
    </TableCell>
  </TableRow>
);

export default VisitorRowSkeleton;