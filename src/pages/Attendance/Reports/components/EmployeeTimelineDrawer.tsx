import React from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle 
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getEmployeeTimeline } from "../api/attendance-reports.api";
import { Clock3, AlertCircle, HelpCircle, RefreshCcw, Camera, DoorOpen, DoorClosed } from "lucide-react";
import { format } from "date-fns";
import { convertIdToEmpId } from "@/utils";

interface EmployeeTimelineDrawerProps {
  employeeId: string | null;
  onClose: () => void;
}

export const EmployeeTimelineDrawer: React.FC<EmployeeTimelineDrawerProps> = ({ employeeId, onClose }) => {
  const today = format(new Date(), 'yyyy-MM-dd');

  const { 
    data: timelineData, 
    isLoading,
    error,
  } = useQuery({
    queryKey: ["employeeTimeline", employeeId, today],
    queryFn: () => employeeId ? getEmployeeTimeline(employeeId, today) : Promise.reject("No employee ID"),
    enabled: !!employeeId,
    staleTime: 30 * 1000,
    retry: 1,
  });

  const getEventIcon = (eventName: string, type: string) => {
    switch (eventName) {
      case "ENTRY_DETECTED":
        return <DoorOpen className="w-5 h-5 text-emerald-600" />;
      case "FACE_DETECTED":
        return <Camera className="w-5 h-5 text-cyan-600" />;
      case "EXIT_PENDING":
        return <Clock3 className="w-5 h-5 text-amber-600" />;
      case "EXIT_CANCELLED":
        return <AlertCircle className="w-5 h-5 text-rose-600" />;
      case "EXIT_CONFIRMED":
        return <DoorClosed className="w-5 h-5 text-emerald-600" />;
      case "SYSTEM_RECOVERY":
        return <RefreshCcw className="w-5 h-5 text-blue-600" />;
      default:
        if (type === "ENTRY") return <DoorOpen className="w-5 h-5 text-emerald-600" />;
        if (type === "EXIT") return <DoorClosed className="w-5 h-5 text-slate-600" />;
        return <HelpCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getReadableEventName = (eventName: string) => eventName.replace(/_/g, " ");

  const getConfidencePercent = (confidence?: number | null) => {
    if (confidence === null || confidence === undefined || Number.isNaN(confidence)) {
      return null;
    }

    return confidence <= 1 ? Math.round(confidence * 100) : Math.round(confidence);
  };

  const getEventBadge = (status: string, label: string) => {
    const variants: Record<string, string> = {
      success: "bg-green-100 text-green-800",
      warning: "bg-orange-100 text-orange-800",
      error: "bg-red-100 text-red-800",
      info: "bg-blue-100 text-blue-800",
      default: "bg-gray-100 text-gray-800",
    };
    return (
      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${variants[status] || variants.default}`}>
        {label}
      </span>
    );
  };

  return (
    <Sheet open={!!employeeId} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-md p-0 overflow-y-auto flex flex-col shadow-2xl border-l border-border/50 bg-background/95 backdrop-blur-xl">
        <SheetHeader className="p-6 pb-4 border-b border-border/50 sticky top-0 bg-background/95 backdrop-blur-xl z-10">
          <SheetTitle>Employee Timeline</SheetTitle>
        </SheetHeader>
        
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-sm text-muted-foreground">Loading timeline...</p>
          </div>
        ) : error ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <p className="text-sm text-destructive">Failed to load timeline</p>
          </div>
        ) : timelineData ? (
          <div className="flex flex-col flex-1">
            {/* Employee Profile Header */}
            <div className="flex items-center gap-4 p-6 bg-secondary/20">
              <Avatar className="h-16 w-16 border-2 border-background shadow-sm">
                <AvatarImage src={timelineData.employee.avatar || undefined} alt={timelineData.employee.name} />
                <AvatarFallback>{timelineData.employee.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <h3 className="text-xl font-semibold">{timelineData.employee.name}</h3>
                <p className="text-sm text-muted-foreground">{timelineData.employee.role} • {timelineData.employee.department}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">{convertIdToEmpId(timelineData.employee.employeeId)}</Badge>
                </div>
              </div>
            </div>

            {/* Monthly Stats Summary */}
            <div className="grid grid-cols-3 gap-4 px-6 py-4 border-y border-border/50 bg-background">
              <div className="flex flex-col items-center">
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Present</span>
                <span className="text-xl font-semibold text-green-600">{timelineData.monthlyStats.present}</span>
              </div>
              <div className="flex flex-col items-center border-x border-border/50">
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Absent</span>
                <span className="text-xl font-semibold text-red-600">{timelineData.monthlyStats.absent}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Late</span>
                <span className="text-xl font-semibold text-orange-600">{timelineData.monthlyStats.late}</span>
              </div>
            </div>

            {/* Timeline Feed */}
            <div className="flex-1 p-6">
              <h4 className="text-sm font-semibold mb-6 text-foreground/80 uppercase tracking-wider">Audit Trail</h4>
              
              <div className="relative pl-6 border-l-2 border-border/60 space-y-8 ml-3">
                {timelineData.events.length > 0 ? (
                  timelineData.events.map((event) => (
                    <div key={event.id} className="relative">
                      <div className="absolute -left-[35px] top-1 bg-background rounded-full p-1 border shadow-sm">
                        {getEventIcon(event.eventName, event.type)}
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold">{getReadableEventName(event.eventName)}</span>
                          {getEventBadge(event.statusBadge, event.cameraSource ? `Camera: ${event.cameraSource}` : event.type)}
                          {/* {event.cameraSource} */}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                          <span>{format(new Date(event.timestamp), "dd MMM yyyy, hh:mm:ss a")}</span>
                          <span className="inline-flex h-1 w-1 rounded-full bg-border" />
                          <span>{event.type}</span>
                        </div>
                        
                        {(event.cameraSource || event.confidence !== null) && (
                          <div className="mt-2 p-3 bg-secondary/30 rounded-lg text-xs space-y-1.5 border border-border/50">
                            {event.cameraSource && (
                              <div className="flex items-center gap-2">
                                <span className="text-muted-foreground">Source:</span>
                                <span className="font-medium">{event.cameraSource}</span>
                              </div>
                            )}
                            {getConfidencePercent(event.confidence) !== null && (
                              <div className="space-y-1.5">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-muted-foreground">Confidence</span>
                                  <span className="font-medium">{getConfidencePercent(event.confidence)}%</span>
                                </div>
                                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                                  <div
                                    className="h-full rounded-full bg-cyan-500 transition-all duration-500"
                                    style={{ width: `${getConfidencePercent(event.confidence)}%` }}
                                  />
                                </div>
                              </div>
                            )}
                            {event.eventName === "FACE_DETECTED" && event.cameraSource && (
                              <div className="flex items-center gap-2 pt-1">
                                <span className="text-muted-foreground">Note:</span>
                                <span className="font-medium">Face capture matched on {event.cameraSource}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-sm text-muted-foreground">No events found</div>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
};
