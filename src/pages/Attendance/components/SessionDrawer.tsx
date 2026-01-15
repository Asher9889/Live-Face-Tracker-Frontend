import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, AlertTriangle, ExternalLink } from "lucide-react";
import type { AttendanceSession } from "@/pages/Attendance/types/attendence.types";

interface SessionDrawerProps {
    open: boolean;
    onClose: () => void;
    sessionId?: string; // In real app, fetch details by ID
}

const SessionDrawer = ({ open, onClose, sessionId }: SessionDrawerProps) => {
    // Mock Data for the session
    const session: AttendanceSession = {
        id: "sess_1",
        employeeId: "EMP-1002",
        date: "2024-04-15",

        firstEntry: "2024-04-15T09:12:00Z",
        lastExit: "2024-04-15T18:42:00Z",

        totalDuration: 510,      // minutes
        breakDuration: 45,       // minutes

        status: "COMPLETED",

        flags: ["LATE_ENTRY"],

        events: [
            {
                id: "evt_1",
                employeeId: "EMP-1002",
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


    if (!sessionId) return null;

    return (
        <Sheet open={open} onOpenChange={(val) => !val && onClose()}>
            <SheetContent className="w-[400px] sm:w-[540px] flex flex-col h-full">
                <SheetHeader className="shrink-0">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-16 w-16">
                                <AvatarImage src={`https://i.pravatar.cc/150?u=${session.employeeId}`} />
                                <AvatarFallback>AS</AvatarFallback>
                            </Avatar>
                            <div>
                                <SheetTitle>Alice Smith</SheetTitle>
                                <SheetDescription>
                                    Engineering • Senior Developer
                                </SheetDescription>
                                <div className="flex items-center gap-2 mt-2">
                                    <Badge variant="outline">{session.employeeId}</Badge>
                                    {session.flags.includes("LATE_ENTRY") && (
                                        <Badge variant="destructive" className="bg-orange-500 hover:bg-orange-600">Late Entry</Badge>
                                    )}
                                </div>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => window.open(`/attendance/employee/${session.employeeId}`, '_blank')}>
                            <ExternalLink className="h-4 w-4" />
                        </Button>
                    </div>
                </SheetHeader>

                <div className="mt-8 grid grid-cols-2 gap-4 shrink-0">
                    <div className="rounded-lg border p-3 flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                            <Clock className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Duration</p>
                            <p className="text-xl font-bold">8h 30m</p>
                        </div>
                    </div>
                    <div className="rounded-lg border p-3 flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                            <AlertTriangle className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Break Time</p>
                            <p className="text-xl font-bold">45m</p>
                        </div>
                    </div>
                </div>

                <div className="mt-6 mb-2 shrink-0">
                    <h4 className="text-sm font-medium mb-4">Session Timeline</h4>
                </div>

                <ScrollArea className="flex-1 -mx-6 px-6">
                    <div className="relative border-l ml-4 space-y-8 pb-10">
                        {session.events.map((event) => (
                            <div key={event.id} className="relative pl-6">
                                <div className={`absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 bg-background ${event.type === 'ENTRY' ? 'border-green-500' : 'border-orange-500'
                                    }`} />
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center justify-between">
                                        <span className={`text-sm font-medium ${event.type === 'ENTRY' ? 'text-green-600' : 'text-orange-600'
                                            }`}>{event.type}</span>
                                        <span className="text-xs text-muted-foreground font-mono">
                                            {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <div className="text-sm">{event.gate}</div>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Badge variant="secondary" className="text-[10px] font-normal">
                                            {event.source.replace('_', ' ')}
                                        </Badge>
                                        <span className="text-[10px] text-muted-foreground">
                                            Prob: {event.confidence}%
                                        </span>
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
