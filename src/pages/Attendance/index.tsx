import { useState } from 'react';
import StatsCards from '@/components/attendance/StatsCards';
import AttendanceTable from '@/components/attendance/AttendanceTable';
import AttendanceFilters from './components/AttendanceFilters';
import SessionDrawer from './components/SessionDrawer';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useAttendence } from './hooks/useAttendance';
import type { AttendanceFiltersState, AttendanceRecord } from './types/attendence.types';
import AttendanceTableSkeleton from '@/components/attendance/AttendanceTableSkeleton';

const Attendance = () => {
    const [filters, setFilters] = useState<AttendanceFiltersState>({ dateRange: { from: new Date() } });
    const [selectedSessionId, setSelectedSessionId] = useState<string | undefined>();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const { data, isLoading } = useAttendence();

    const handleFiltersChange = (newFilters: AttendanceFiltersState) => {
        setFilters(newFilters);
        // TODO: Trigger API fetch with new filters
        console.log("Filters updated:", newFilters, filters);
    };

    const handleRowClick = (_record: AttendanceRecord) => {
        // In real app, we might derive sessionId from record or fetch matches
        setSelectedSessionId("sess_1"); // Mock session ID
        setIsDrawerOpen(true);
    };

    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between shrink-0">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Attendance Dashboard</h2>
                    <p className="text-muted-foreground">Monitor daily attendance, audits, and exceptions.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Export Report
                    </Button>
                </div>
            </div>

            <div className="space-y-6 shrink-0">
                <StatsCards />
                <AttendanceFilters onFiltersChange={handleFiltersChange} />
            </div>

            <div className="flex-1 min-h-0 overflow-auto border rounded-md">
                {isLoading ? <AttendanceTableSkeleton /> : <AttendanceTable records={data || []} onRowClick={handleRowClick} />}
            </div>

            <SessionDrawer
                open={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                sessionId={selectedSessionId}
            />
        </div>
    );
};

export default Attendance;
