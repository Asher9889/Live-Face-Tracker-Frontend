import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Clock, CircleDot, MapPin } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";

import { format } from "date-fns";
import { cn } from "@/utils/cn";
import type { AttendanceCurrentStateEmployeeDTO } from "@/pages/Attendance/types/attendence.types";
import { envs } from "@/config";

interface AttendanceTableProps {
    records: AttendanceCurrentStateEmployeeDTO[];
    onRowClick?: (record: AttendanceCurrentStateEmployeeDTO) => void;
}

const AttendanceTable = ({ records, onRowClick }: AttendanceTableProps) => {
    return (
        <div className="space-y-4">
            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Current State</TableHead>
                            <TableHead>First Entry</TableHead>
                            <TableHead>Last Seen / Gate</TableHead>
                            <TableHead>Work Time</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {records.map((record) => {
                            const avatar = record.employeeAvatar
                                ? `${envs.minioServerUrl}/${envs.minioBucketName}/${record.employeeAvatar}`
                                : undefined;
                            return (
                            <TableRow
                                key={record.id}
                                className="cursor-pointer hover:bg-muted/50"
                                onClick={() => onRowClick?.(record)}
                            >
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src={avatar} />
                                            <AvatarFallback>
                                                {(record.employeeName || 'NA').substring(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-medium text-sm">{record.employeeName}</div>
                                            <div className="text-xs text-muted-foreground">
                                                {record.employeeCode || record.employeeId}
                                            </div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <CircleDot className={cn("h-3.5 w-3.5", record.currentStatus === 'ON_BREAK' ? 'text-amber-500' : 'text-green-500')} />
                                        <div className="flex flex-col">
                                            <span className="font-medium text-sm">{record.currentStatus.replace('_', ' ')}</span>
                                            <span className="text-xs text-muted-foreground">
                                                {record.flags?.length ? record.flags.join(', ') : 'Active now'}
                                            </span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium text-sm">
                                            {record.firstEntryAt ? format(new Date(record.firstEntryAt), 'HH:mm:ss') : '-'}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {record.firstEntryAt ? format(new Date(record.firstEntryAt), 'MMM dd') : 'Not captured'}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2 text-xs font-medium text-foreground">
                                            <Clock className="w-3 h-3" />
                                            {record.lastSeenAt ? format(new Date(record.lastSeenAt), 'HH:mm:ss') : '-'}
                                        </div>
                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                            <MapPin className="w-3 h-3" />
                                            {record.currentGate || record.currentCameraCode || '-'}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="text-sm font-medium">
                                        {record.workDurationMinutes !== undefined
                                            ? `${Math.floor(record.workDurationMinutes / 60)}h ${record.workDurationMinutes % 60}m`
                                            : '-'}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Open menu</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem onClick={() => onRowClick?.(record)}>
                                                View Full Session
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); window.open(`/attendance/employee/${record.employeeId}`, '_blank'); }}>
                                                View History
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem>Flag as Suspicious</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>)
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default AttendanceTable;
