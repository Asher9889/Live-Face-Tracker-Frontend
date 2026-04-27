import { Users, UserX, Clock, ArrowRightFromLine, ArrowLeftFromLine } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { AttendanceCurrentStateStats, AttendanceStats } from '@/pages/Attendance/types/attendence.types';

interface StatsCardsProps {
    stats?: AttendanceStats | AttendanceCurrentStateStats;
}

const StatsCards = ({ stats }: StatsCardsProps) => {
    const data = stats || {
        totalRecords: 0,
        uniqueEmployees: 0,
        totalWorkDuration: 0,
        unknownEvents: 0,
        lateEntries: 0,
        earlyExits: 0
    };

    const hasCurrentStateShape = 'totalEmployeesPresent' in data;
    const currentState = hasCurrentStateShape ? data : null;

    const cards = [
        {
            title: hasCurrentStateShape ? "Present Employees" : "Total Records",
            value: hasCurrentStateShape ? String(currentState?.totalEmployeesPresent ?? 0) : data.totalRecords.toLocaleString(),
            description: hasCurrentStateShape ? "Currently inside" : "Entries & Exits today",
            icon: Users,
            color: "text-blue-500",
        },
        {
            title: hasCurrentStateShape ? "In Session" : "Present Employees",
            value: hasCurrentStateShape ? String(currentState?.inSession ?? 0) : data.uniqueEmployees.toString(),
            description: hasCurrentStateShape ? "Active right now" : "Unique individuals",
            icon: Users,
            color: "text-green-500",
        },
        {
            title: hasCurrentStateShape ? "On Break" : "Total Hours",
            value: hasCurrentStateShape ? String(currentState?.onBreak ?? 0) : `${Math.floor(data.totalWorkDuration / 60)}h ${data.totalWorkDuration % 60}m`,
            description: hasCurrentStateShape ? "Paused sessions" : "Cumulative work time",
            icon: Clock,
            color: "text-indigo-500",
        },
        {
            title: hasCurrentStateShape ? "Late Arrivals" : "Unknown Events",
            value: hasCurrentStateShape ? String(currentState?.lateArrivals ?? 0) : data.unknownEvents.toString(),
            description: hasCurrentStateShape ? "Today" : "Requires attention",
            icon: UserX,
            color: "text-red-500",
        },
        {
            title: hasCurrentStateShape ? "Active Sessions" : "Late Entries",
            value: hasCurrentStateShape ? String(currentState?.totalActiveSessions ?? 0) : data.lateEntries.toString(),
            description: hasCurrentStateShape ? "Tracked now" : "After 9:30 AM",
            icon: ArrowRightFromLine,
            color: "text-orange-500",
        },
        {
            title: hasCurrentStateShape ? "Live State" : "Early Exits",
            value: hasCurrentStateShape ? 'Current' : data.earlyExits.toString(),
            description: hasCurrentStateShape ? "Present employees" : "Before 6:00 PM",
            icon: ArrowLeftFromLine,
            color: "text-yellow-500",
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
            {cards.map((stat) => (
                <Card key={stat.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
                        <CardTitle className="text-sm font-medium">
                            {stat.title}
                        </CardTitle>
                        <stat.icon className={`h-4 w-4 ${stat.color}`} />
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <p className="text-xs text-muted-foreground truncate">
                            {stat.description}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default StatsCards;
