import { Users, UserX, Clock, ArrowRightFromLine, ArrowLeftFromLine } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { AttendanceStats } from '@/pages/Attendance/types/attendence.types';

interface StatsCardsProps {
    stats?: AttendanceStats;
}

const StatsCards = ({ stats }: StatsCardsProps) => {
    // Default/Loading state values
    const data = stats || {
        totalRecords: 1250,
        uniqueEmployees: 450,
        totalWorkDuration: 3840, // minutes
        unknownEvents: 5,
        lateEntries: 12,
        earlyExits: 3
    };

    const cards = [
        {
            title: "Total Records",
            value: data.totalRecords.toLocaleString(),
            description: "Entries & Exits today",
            icon: Users,
            color: "text-blue-500",
        },
        {
            title: "Present Employees",
            value: data.uniqueEmployees.toString(),
            description: "Unique individuals",
            icon: Users,
            color: "text-green-500",
        },
        {
            title: "Total Hours",
            value: `${Math.floor(data.totalWorkDuration / 60)}h ${data.totalWorkDuration % 60}m`,
            description: "Cumulative work time",
            icon: Clock,
            color: "text-indigo-500",
        },
        {
            title: "Unknown Events",
            value: data.unknownEvents.toString(),
            description: "Requires attention",
            icon: UserX,
            color: "text-red-500",
        },
        {
            title: "Late Entries",
            value: data.lateEntries.toString(),
            description: "After 9:30 AM",
            icon: ArrowRightFromLine,
            color: "text-orange-500",
        },
        {
            title: "Early Exits",
            value: data.earlyExits.toString(),
            description: "Before 6:00 PM",
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
