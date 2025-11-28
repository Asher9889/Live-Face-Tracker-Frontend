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
import { Check, X } from "lucide-react";

const AttendanceTable = () => {
    // Mock data
    const records = Array.from({ length: 10 }).map((_, i) => ({
        id: i.toString(),
        name: i % 3 === 0 ? "Unknown Person" : `Employee ${i + 1}`,
        employeeId: i % 3 === 0 ? "-" : `EMP-${1000 + i}`,
        timestamp: new Date().toLocaleTimeString(),
        type: i % 2 === 0 ? "Entry" : "Exit",
        status: i % 3 === 0 ? "Unknown" : "Verified",
        image: `https://i.pravatar.cc/150?u=${i}`,
    }));

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Employee ID</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {records.map((record) => (
                        <TableRow key={record.id}>
                            <TableCell className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarImage src={record.image} />
                                    <AvatarFallback>U</AvatarFallback>
                                </Avatar>
                                <div className="font-medium">{record.name}</div>
                            </TableCell>
                            <TableCell>{record.employeeId}</TableCell>
                            <TableCell>{record.timestamp}</TableCell>
                            <TableCell>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${record.type === 'Entry'
                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                        : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                                    }`}>
                                    {record.type}
                                </span>
                            </TableCell>
                            <TableCell>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${record.status === 'Verified'
                                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                    }`}>
                                    {record.status}
                                </span>
                            </TableCell>
                            <TableCell className="text-right">
                                {record.status === 'Unknown' && (
                                    <div className="flex justify-end gap-2">
                                        <Button size="sm" variant="outline" className="h-8 w-8 p-0 text-green-600">
                                            <Check className="h-4 w-4" />
                                        </Button>
                                        <Button size="sm" variant="outline" className="h-8 w-8 p-0 text-red-600">
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default AttendanceTable;
