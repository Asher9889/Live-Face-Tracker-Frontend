import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { useEmployee } from "./hooks/useRegister";
import EmployeeListSkeleton from "./EmployeeListSkeleton";
import { convertIdToEmpId } from "@/utils";
import { Spinner } from "../ui/spinner";

type Employee = {
    id: string;
    name: string;
    department: string;
    phone: string;
    role: string;
    email: string;
    avatar: string;
}

const EmployeeList = () => {
  const { data, isLoading, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useEmployee();

  const employees = data?.pages.flatMap(page => page.data) ?? [];

  if (isLoading) return <EmployeeListSkeleton />;
  if (isError) return <p>{error.message}</p>;

  return (
    <div className="rounded-md border space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Phone or Email</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {employees.map((employee: Employee) => (
            <TableRow key={employee.id}>
              <TableCell className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage loading="lazy" src={employee.avatar} />
                  <AvatarFallback>
                    {employee.name.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <p className="font-medium">{employee.name}</p>
              </TableCell>

              <TableCell>{convertIdToEmpId(employee.id)}</TableCell>
              <TableCell>{employee.department}</TableCell>
              <TableCell>{employee.role}</TableCell>
              <TableCell>{employee.phone || employee.email}</TableCell>

              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* LOAD MORE */}
      {hasNextPage && (
        <div className="flex justify-center pb-4">
          <Button
            variant="outline"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="w-40"
          >
            {isFetchingNextPage ? <Spinner /> : "Load more"}
          </Button>
        </div>
      )}
    </div>
  );
};


export default EmployeeList;
