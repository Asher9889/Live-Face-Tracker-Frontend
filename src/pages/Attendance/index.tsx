import StatsCards from '@/components/attendance/StatsCards';
import AttendanceTable from '@/components/attendance/AttendanceTable';
import { Button } from '@/components/ui/button';
import { Download, Filter } from 'lucide-react';

const Attendance = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Attendance Dashboard</h2>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                        <Filter className="mr-2 h-4 w-4" />
                        Filter
                    </Button>
                    <Button size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Export CSV
                    </Button>
                </div>
            </div>

            <StatsCards />
            <AttendanceTable />
        </div>
    );
};

export default Attendance;
