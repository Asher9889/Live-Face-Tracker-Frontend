import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, CheckCircle2, AlertCircle, Camera, ShieldAlert, Clock } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";

import { format } from "date-fns";
import { cn } from "@/utils/cn";
import type { AttendanceRecord } from "@/pages/Attendance/types/attendence.types";
import { envs } from "@/config";

interface AttendanceTableProps {
    records: AttendanceRecord[];
    onRowClick?: (record: AttendanceRecord) => void;
}

const AttendanceTable = ({ records, onRowClick }: AttendanceTableProps) => {
    // Mock data - in real app would come from props/query
    console.log("record is", records)
    return (
        <div className="space-y-4">
            <div className="rounded-md border bg-card">
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
                        {records.map((record) => {
                            const avatar = envs.minioServerUrl + "/" + envs.minioBucketName + "/" + record.employeeAvatar;
                            console.log("avatar is", avatar)
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
                                                {record.employeeName.substring(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-medium text-sm">{record.employeeName}</div>
                                            <div className="text-xs text-muted-foreground">
                                                {record.employeeId || "Unregistered"}
                                            </div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium text-sm">
                                            {format(new Date(record.timestamp), "HH:mm:ss")}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {format(new Date(record.timestamp), "MMM dd")}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className={cn(
                                                "text-[10px] px-1 py-0 h-5 font-medium",
                                                record.type === 'ENTRY'
                                                    ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                                                    : "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800"
                                            )}>
                                                {record.type}
                                            </Badge>
                                            {(record.isLate || record.isEarlyExit) && (
                                                <Badge variant="destructive" className="h-5 px-1 py-0 text-[10px]">
                                                    {record.isLate ? "LATE" : "EARLY"}
                                                </Badge>
                                            )}
                                        </div>
                                        <span className="text-xs text-muted-foreground">{record.gate}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                            {record.status === 'VERIFIED' ? (
                                                <div className="flex items-center text-green-600 text-xs font-medium">
                                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                                    Verified
                                                </div>
                                            ) : (
                                                <div className="flex items-center text-red-600 text-xs font-medium">
                                                    <ShieldAlert className="w-3 h-3 mr-1" />
                                                    {record.status}
                                                </div>
                                            )}
                                        </div>
                                        {record.status === 'VERIFIED' && (
                                            <span className="text-[10px] text-muted-foreground">
                                                Confidence: {record.confidence}%
                                            </span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-1.5">
                                        {record.source === 'FACE_AI' ? (
                                            <Camera className="w-3 h-3 text-muted-foreground" />
                                        ) : (
                                            <Clock className="w-3 h-3 text-muted-foreground" />
                                        )}
                                        <span className="text-xs text-muted-foreground capitalize">
                                            {record.source.replace('_', ' ').toLowerCase()}
                                        </span>
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
                                                View Session
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
            <div className="flex justify-center">
                <Button variant="outline" size="sm" className="w-full md:w-auto">
                    Load More Events
                </Button>
            </div>
        </div>
    );
};

export default AttendanceTable;
