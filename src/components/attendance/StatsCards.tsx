import { Users, UserX, LogIn, LogOut } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const StatsCards = () => {
    const stats = [
        {
            title: "Total Recognized",
            value: "1,234",
            description: "+12% from yesterday",
            icon: Users,
            color: "text-blue-500",
        },
        {
            title: "Unknown Faces",
            value: "23",
            description: "Requires attention",
            icon: UserX,
            color: "text-red-500",
        },
        {
            title: "Current Entries",
            value: "856",
            description: "Active on premises",
            icon: LogIn,
            color: "text-green-500",
        },
        {
            title: "Total Exits",
            value: "342",
            description: "Checked out today",
            icon: LogOut,
            color: "text-orange-500",
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
                <Card key={stat.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {stat.title}
                        </CardTitle>
                        <stat.icon className={`h-4 w-4 ${stat.color}`} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <p className="text-xs text-muted-foreground">
                            {stat.description}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default StatsCards;
