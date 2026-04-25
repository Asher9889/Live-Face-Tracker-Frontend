import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Download, Calendar as CalendarIcon, Clock, Loader2, Mail, MapPin } from "lucide-react";
import { useMemo, useState } from "react";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { useEmployeeHistory } from "./hooks/useEmployeeHistory";
import { exportAttendanceEmployeeHistory } from "./api/attendence.api";
import { envs } from "@/config";

const EmployeeHistory = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [isExporting, setIsExporting] = useState(false);

    const selectedDate = date ?? new Date();
    const { profile, summary, timeline, calendar, isLoading, isFetching, isError } = useEmployeeHistory(id, selectedDate);

    const selectedDateLabel = format(selectedDate, "PPPP");

    const avatar = useMemo(() => {
        if (!profile?.avatar) return undefined;
        if (profile.avatar.startsWith("http://") || profile.avatar.startsWith("https://")) {
            return profile.avatar;
        }
        return `${envs.minioServerUrl}/${envs.minioBucketName}/${profile.avatar}`;
    }, [profile?.avatar]);

    const employeeCodeToShow = profile?.employeeCode || (profile?.id ? `EMP-${profile.id.slice(-4)}` : "-");

    const presentDates = useMemo(() => {
        return (calendar?.days ?? [])
            .filter((day) => day.status === "PRESENT")
            .map((day) => new Date(`${day.date}T00:00:00`));
    }, [calendar?.days]);

    const partialDates = useMemo(() => {
        return (calendar?.days ?? [])
            .filter((day) => day.status === "PARTIAL")
            .map((day) => new Date(`${day.date}T00:00:00`));
    }, [calendar?.days]);

    const anomalyDates = useMemo(() => {
        return (calendar?.days ?? [])
            .filter((day) => day.hasAnomaly)
            .map((day) => new Date(`${day.date}T00:00:00`));
    }, [calendar?.days]);

    const timelineEvents = timeline?.events ?? [];

    const stats = [
        {
            title: "Present Days",
            value: String(summary?.presentDays ?? 0),
            subText: `/ ${summary?.workingDays ?? 0} working days`,
            icon: CalendarIcon,
            iconClassName: "text-muted-foreground",
            valueClassName: ""
        },
        {
            title: "Avg Hours",
            value: `${(summary?.avgHoursPerDay ?? 0).toFixed(1)}h`,
            subText: "Per day",
            icon: Clock,
            iconClassName: "text-muted-foreground",
            valueClassName: ""
        },
        {
            title: "Late Arrivals",
            value: String(summary?.lateArrivals ?? 0),
            subText: "This month",
            icon: Clock,
            iconClassName: "text-amber-600",
            valueClassName: "text-amber-600"
        },
        {
            title: "Locations",
            value: String(summary?.locationsVisited ?? 0),
            subText: "Offices visited",
            icon: MapPin,
            iconClassName: "text-sky-600",
            valueClassName: ""
        },
    ] as const;

    const handleExport = async () => {
        if (!id) return;

        try {
            setIsExporting(true);
            const monthStart = format(startOfMonth(selectedDate), "yyyy-MM-dd");
            const monthEnd = format(endOfMonth(selectedDate), "yyyy-MM-dd");
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

            const blob = await exportAttendanceEmployeeHistory(id, monthStart, monthEnd, timezone, "csv");
            const objectUrl = URL.createObjectURL(blob);
            const anchor = document.createElement("a");
            anchor.href = objectUrl;
            anchor.download = `attendance-${id}-${format(selectedDate, "yyyy-MM")}.csv`;
            document.body.appendChild(anchor);
            anchor.click();
            document.body.removeChild(anchor);
            URL.revokeObjectURL(objectUrl);
        } catch (error) {
            console.error("Export failed", error);
        } finally {
            setIsExporting(false);
        }
    };

    if (!id) {
        return (
            <div className="mx-auto w-full max-w-[1400px]">
                <Card className="rounded-2xl">
                    <CardContent className="p-6 text-sm text-muted-foreground">Invalid employee id in URL.</CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-[1400px] space-y-6 pb-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div className="flex items-start gap-3">
                    <Button variant="ghost" size="icon" className="mt-1" onClick={() => navigate(-1)}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div className="space-y-1">
                        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                            {isLoading ? <Skeleton className="h-8 w-48" /> : (profile?.name ?? "Employee")}
                        </h2>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                            <span>{employeeCodeToShow}</span>
                            <span className="hidden sm:inline">•</span>
                            <span>{profile?.department ?? "-"}</span>
                            <Badge variant="outline" className="font-normal">{profile?.status ?? "-"}</Badge>
                            {isFetching && !isLoading && (
                                <span className="inline-flex items-center gap-1 text-xs">
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                    Refreshing
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <Button variant="outline" className="w-full sm:w-auto" onClick={handleExport} disabled={isExporting}>
                    {isExporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                    Export History
                </Button>
            </div>

            {isError && (
                <Card className="rounded-2xl border-destructive/30">
                    <CardContent className="p-4 text-sm text-destructive">
                        Failed to fetch employee attendance data. Please refresh and try again.
                    </CardContent>
                </Card>
            )}

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;

                    return (
                        <Card key={stat.title} className="rounded-2xl">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
                                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                                <Icon className={`h-4 w-4 ${stat.iconClassName}`} />
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                {isLoading ? (
                                    <>
                                        <Skeleton className="h-8 w-16" />
                                        <Skeleton className="mt-2 h-3 w-24" />
                                    </>
                                ) : (
                                    <>
                                        <div className={`text-2xl font-bold ${stat.valueClassName || ""}`}>{stat.value}</div>
                                        <p className="text-xs text-muted-foreground">{stat.subText}</p>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
                <div className="space-y-6">
                    <Card className="rounded-2xl">
                        <CardContent className="space-y-5 p-6">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-16 w-16 sm:h-20 sm:w-20">
                                    <AvatarImage src={avatar} />
                                    <AvatarFallback>
                                        {(profile?.name ?? "NA")
                                            .split(" ")
                                            .map((name) => name[0])
                                            .join("")
                                            .slice(0, 2)
                                            .toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="space-y-1">
                                    {isLoading ? (
                                        <>
                                            <Skeleton className="h-5 w-32" />
                                            <Skeleton className="h-4 w-24" />
                                        </>
                                    ) : (
                                        <>
                                            <h3 className="text-lg font-semibold leading-tight">{profile?.name ?? "Employee"}</h3>
                                            <p className="text-sm text-muted-foreground">{profile?.role ?? "-"}</p>
                                        </>
                                    )}
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-3 text-sm">
                                <div className="flex items-start justify-between gap-4">
                                    <span className="text-muted-foreground">Department</span>
                                    <span className="text-right font-medium">{profile?.department ?? "-"}</span>
                                </div>
                                <div className="flex items-start justify-between gap-4">
                                    <span className="text-muted-foreground">Joined</span>
                                    <span className="text-right font-medium">
                                        {profile?.joinDate ? format(new Date(profile.joinDate), "PPP") : "-"}
                                    </span>
                                </div>
                                <div className="flex items-start justify-between gap-4">
                                    <span className="text-muted-foreground">Email</span>
                                    <span className="flex max-w-[200px] items-start gap-1 text-right font-medium break-all">
                                        <Mail className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                                        {profile?.email ?? "-"}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-2xl">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">Attendance Calendar</CardTitle>
                            <CardDescription>Pick a date to review activity entries.</CardDescription>
                        </CardHeader>
                        <CardContent className="overflow-x-auto pt-0">
                            <div className="min-w-[280px]">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    numberOfMonths={1}
                                    modifiers={{
                                        present: presentDates,
                                        partial: partialDates,
                                        anomaly: anomalyDates,
                                    }}
                                    modifiersClassNames={{
                                        present: "bg-emerald-100 text-emerald-800 rounded-md",
                                        partial: "bg-amber-100 text-amber-800 rounded-md",
                                        anomaly: "ring-1 ring-red-500 rounded-md",
                                    }}
                                    className="mx-auto"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="rounded-2xl">
                    <CardHeader className="border-b pb-4">
                        <CardTitle className="text-xl">Daily Activity</CardTitle>
                        <CardDescription>Timeline for {selectedDateLabel}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="relative ml-2 space-y-4 border-l pl-6">
                            {timelineEvents.length === 0 && !isLoading && (
                                <div className="rounded-xl border bg-card p-4 shadow-sm text-sm text-muted-foreground">
                                    No activity found for this date.
                                </div>
                            )}

                            {timelineEvents.map((event, index) => {
                                const isEntry = event.type === "ENTRY";
                                const displayTime = format(new Date(event.timestamp), "hh:mm aa");
                                const confidenceText = typeof event.confidence === "number"
                                    ? `Face Verified (${Math.round(event.confidence * 100)}%)`
                                    : "Face Detected";

                                return (
                                    <div key={`${event.eventId}-${index}`} className="relative">
                                        <span
                                            className={`absolute -left-[31px] top-6 h-3.5 w-3.5 rounded-full border-2 bg-background ${
                                                isEntry ? "border-emerald-500" : "border-amber-500"
                                            }`}
                                        />
                                        <div className="rounded-xl border bg-card p-4 shadow-sm">
                                            <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                                <p className="text-sm font-semibold tabular">{displayTime}</p>
                                                <Badge
                                                    variant="secondary"
                                                    className={isEntry ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}
                                                >
                                                    {event.type}
                                                </Badge>
                                            </div>
                                            <p className="text-sm font-medium">{event.cameraName || event.cameraCode || "Unknown Gate"}</p>
                                            <p className="text-xs text-muted-foreground">{event.note || confidenceText}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default EmployeeHistory;
