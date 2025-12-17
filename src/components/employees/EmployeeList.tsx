import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { useEmployee } from "./hooks/useRegister";

const EmployeeList = () => {
    // Mock data

    const { data: employees, isLoading, isError, error } = useEmployee();

    console.log("employees is", employees)
    if (isLoading) return <p>Loading...</p>;
    if (isError) return <p>{error.message}</p>;

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
                    {employees.map((employee:any) => (
                        <TableRow key={employee.id}>
                            <TableCell className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarImage src={employee.image} />
                                    <AvatarFallback>{employee.name.substring(0, 2)}</AvatarFallback>
                                </Avatar>
                                <div className="font-medium">{employee.name}</div>
                            </TableCell>
                            <TableCell>{employee.employeeId}</TableCell>
                            <TableCell>{employee.department}</TableCell>
                            <TableCell>{employee.role}</TableCell>
                            <TableCell>{employee.phone}</TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default EmployeeList;
