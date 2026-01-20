import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, AlertTriangle, ExternalLink } from "lucide-react";
import type { AttendanceSession } from "@/pages/Attendance/types/attendence.types";
import { useTodayAttendanceSession } from "../hooks/useTodayAttendanceSession";
import { Skeleton } from "@/components/ui/skeleton";
import { envs } from "@/config";

interface SessionDrawerProps {
    open: boolean;
    onClose: () => void;
    employeeId?: string;
}

const SessionDrawer = ({ open, onClose, employeeId }: SessionDrawerProps) => {
    if (!employeeId) return null;

    const { data, isLoading } = useTodayAttendanceSession(employeeId, open);

    const avatar = data?.employee?.avatar && `${envs.minioServerUrl}/${envs.minioBucketName}/${data.employee.avatar}`;

    console.log("data is", data)
    const sessions = data?.sessions;

    console.log("sessions are", sessions)
    // TEMP mocked session (replace with `data` later)
    const session: AttendanceSession = {
        id: "sess_1",
        employeeId: "EMP-1002",
        date: "2024-04-15",
        firstEntry: "2024-04-15T09:12:00Z",
        lastExit: "2024-04-15T18:42:00Z",
        totalDuration: 510,
        breakDuration: 45,
        status: "COMPLETED",
        flags: ["LATE_ENTRY"],
        events: [
            {
                id: "evt_1",
                employeeId: "EMP-1002",
                employeeIdToView: "EMP-1002",
                employeeName: "Alice Smith",
                employeeAvatar: "/avatars/alice.png",
                department: "Engineering",
                designation: "Senior Developer",
                timestamp: "2024-04-15T09:12:00Z",
                type: "ENTRY",
                gate: "Main Entrance",
                status: "VERIFIED",
                confidence: 98.5,
                source: "FACE_AI",
                isLate: true,
                isEarlyExit: false,
            },
            {
                id: "evt_2",
                employeeId: "EMP-1002",
                employeeIdToView: "EMP-1002",
                employeeName: "Alice Smith",
                employeeAvatar: "/avatars/alice.png",
                department: "Engineering",
                designation: "Senior Developer",
                timestamp: "2024-04-15T13:00:00Z",
                type: "EXIT",
                gate: "Back Gate",
                status: "VERIFIED",
                confidence: 99.1,
                source: "FACE_AI",
                isLate: false,
                isEarlyExit: false,
            },
            {
                id: "evt_3",
                employeeId: "EMP-1002",
                employeeIdToView: "EMP-1002",
                employeeName: "Alice Smith",
                employeeAvatar: "/avatars/alice.png",
                department: "Engineering",
                designation: "Senior Developer",
                timestamp: "2024-04-15T14:00:00Z",
                type: "ENTRY",
                gate: "Main Entrance",
                status: "VERIFIED",
                confidence: 97.2,
                source: "FACE_AI",
                isLate: false,
                isEarlyExit: false,
            },
            {
                id: "evt_4",
                employeeId: "EMP-1002",
                employeeIdToView: "EMP-1002",
                employeeName: "Alice Smith",
                employeeAvatar: "/avatars/alice.png",
                department: "Engineering",
                designation: "Senior Developer",
                timestamp: "2024-04-15T18:42:00Z",
                type: "EXIT",
                gate: "Main Entrance",
                status: "VERIFIED",
                confidence: 98.9,
                source: "FACE_AI",
                isLate: false,
                isEarlyExit: false,
            },
        ],
    };

    const timelineEvents = !data ? []
        : data.sessions.flatMap((s, idx) => {
            const events = [];

            // ENTRY event
            events.push({
                id: s.id,
                type: "ENTRY",
                timestamp: s.entryAt,
                gate: s.entryCameraCode,
                confidence: s.entryConfidence,
                source: s.entrySource,
            });

            // EXIT event (only if exists)
            if (s.exitAt) {
                events.push({
                    id: `exit-${idx}-${s.exitAt}`,
                    type: "EXIT",
                    timestamp: s.exitAt,
                    gate: s.exitCameraCode,
                    confidence: s.exitConfidence,
                    source: s.exitSource,
                });
            }

            return events;
        });


    return (
        <Sheet open={open} onOpenChange={(val) => !val && onClose()}>
            <SheetContent className="w-[400px] sm:w-[540px] flex flex-col h-full">
                {/* HEADER */}
                <SheetHeader className="shrink-0">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            {isLoading ? (
                                <Skeleton className="h-16 w-16 rounded-full" />
                            ) : (
                                <Avatar className="h-16 w-16">
                                    <AvatarImage src={avatar} />
                                    <AvatarFallback>AS</AvatarFallback>
                                </Avatar>
                            )}

                            <div>
                                {isLoading ? (
                                    <>
                                        <Skeleton className="h-4 w-40 mb-2" />
                                        <Skeleton className="h-3 w-48" />
                                        <div className="flex gap-2 mt-2">
                                            <Skeleton className="h-5 w-24 rounded-full" />
                                            <Skeleton className="h-5 w-20 rounded-full" />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <SheetTitle>{data?.employee.name}</SheetTitle>
                                        <SheetDescription>
                                            {data?.employee.department} • {data?.employee.role}
                                        </SheetDescription>
                                        <div className="flex items-center gap-2 mt-2">
                                            <Badge variant="outline">EMP-{data?.employee.id.slice(-4)}</Badge>
                                            {data?.flags.includes("LATE_ENTRY") && (
                                                <Badge variant="destructive" className="bg-orange-500 hover:bg-orange-600">
                                                    Late Entry
                                                </Badge>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {isLoading ? (
                            <Skeleton className="h-8 w-8 rounded-md" />
                        ) : (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                    window.open(`/attendance/employee/${session.employeeId}`, "_blank")
                                }
                            >
                                <ExternalLink className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </SheetHeader>

                {/* SUMMARY CARDS */}
                <div className="mt-8 grid grid-cols-2 gap-4 shrink-0">
                    {[0, 1].map((i) => (
                        <div key={i} className="rounded-lg border p-3 flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                                {isLoading ? (
                                    <Skeleton className="h-5 w-5 rounded-full" />
                                ) : i === 0 ? (
                                    <Clock className="h-5 w-5 text-blue-600" />
                                ) : (
                                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                                )}
                            </div>
                            <div className="w-full">
                                {isLoading ? (
                                    <>
                                        <Skeleton className="h-3 w-24 mb-2" />
                                        <Skeleton className="h-6 w-20" />
                                    </>
                                ) : (
                                    <>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            {i === 0 ? "Total Duration" : "Break Time"}
                                        </p>
                                        <p className="text-xl font-bold">
                                            {i === 0
                                                ? (data?.totalDurationMinutes?.toFixed(1) ?? "0") + "m"
                                                : (data?.breakDurationMinutes?.toFixed(1) ?? "0") + "m"}
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* TIMELINE */}
                <div className="mt-6 mb-2 shrink-0">
                    <h4 className="text-sm font-medium mb-4">Session Timeline</h4>
                </div>

                <ScrollArea className="flex-1 -mx-6 px-6">
                    <div className="relative border-l ml-4 space-y-8 pb-10">
                        {isLoading
                            ? Array.from({ length: 4 }).map((_, idx) => (
                                <div key={idx} className="relative pl-6">
                                    <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 bg-background">
                                        <Skeleton className="h-full w-full rounded-full" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center justify-between">
                                            <Skeleton className="h-4 w-20" />
                                            <Skeleton className="h-3 w-10" />
                                        </div>
                                        <Skeleton className="h-4 w-32" />
                                        <div className="flex gap-2">
                                            <Skeleton className="h-5 w-16 rounded-full" />
                                            <Skeleton className="h-3 w-20" />
                                        </div>
                                    </div>
                                </div>
                            ))
                            : timelineEvents.map((event) => (
                                <div key={event.id} className="relative pl-6">
                                    <div
                                        className={`absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 bg-background ${event.type === "ENTRY"
                                                ? "border-green-500"
                                                : "border-orange-500"
                                            }`}
                                    />

                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center justify-between">
                                            <span
                                                className={`text-sm font-medium ${event.type === "ENTRY"
                                                        ? "text-green-600"
                                                        : "text-orange-600"
                                                    }`}
                                            >
                                                {event.type}
                                            </span>

                                            <span className="text-xs text-muted-foreground font-mono">
                                                {new Date(event.timestamp).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </span>
                                        </div>

                                        <div className="text-sm">{event.gate}</div>

                                        <div className="flex items-center gap-2 mt-1">
                                            <Badge variant="secondary" className="text-[10px] font-normal">
                                                {event.source?.replace("_", " ")}
                                            </Badge>
                                            {event.confidence !== undefined && (
                                                <span className="text-[10px] text-muted-foreground">
                                                    Prob: {(event.confidence * 100).toFixed(0)}%
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}

                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
};

export default SessionDrawer;
