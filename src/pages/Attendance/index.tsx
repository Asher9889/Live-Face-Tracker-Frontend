import { useState } from 'react';
import { format } from 'date-fns';
import StatsCards from '@/components/attendance/StatsCards';
import AttendanceTable from '@/components/attendance/AttendanceTable';
import AttendanceFilters from './components/AttendanceFilters';
import SessionDrawer from './components/SessionDrawer';
import { useAttendanceCurrentState } from './hooks/useAttendance';
import type { AttendanceCurrentStateEmployeeDTO, AttendanceFiltersState } from './types/attendence.types';
import AttendanceTableSkeleton from '@/components/attendance/AttendanceTableSkeleton';
import AttendanceExportDialog from './components/AttendanceExportDialog';
import { Button } from '@/components/ui/button';

const Attendance = () => {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [filters, setFilters] = useState<AttendanceFiltersState>({ dateRange: { from: new Date() } });
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | undefined>();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Build query filters for the current-state API
    const queryFilters = {
        employeeId: filters.employeeId || undefined,
        department: filters.department || undefined,
        registeredOnly: true,
        limit: 100,
        offset: 0,
    };

    // Fetch employees who are currently present for the selected date
    const { data, stats, isLoading, error } = useAttendanceCurrentState(selectedDate, queryFilters);

    const handleFiltersChange = (newFilters: AttendanceFiltersState) => {
        setFilters(newFilters);
        // API fetch is automatically triggered by useAttendanceByDate when filters change
    };

    const handleDateChange = (date: Date) => {
        setSelectedDate(date);
    };

    const handleRowClick = (record: AttendanceCurrentStateEmployeeDTO) => {
        setSelectedEmployeeId(record.employeeId);
        setIsDrawerOpen(true);
    };

    if (isLoading) {
        return <AttendanceTableSkeleton />;
    }

    if (error) {
        return (
            <div className="space-y-6 h-full flex flex-col items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-destructive mb-2">Error Loading Attendance</h2>
                    <p className="text-muted-foreground mb-4">Failed to load attendance data. Please try again.</p>
                    <Button onClick={() => window.location.reload()}>Retry</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 h-full flex flex-col">
            {/* Header Section */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between shrink-0">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Attendance Dashboard</h2>
                    <p className="text-muted-foreground">
                        Showing employees currently present for {format(selectedDate, 'MMMM dd, yyyy')}
                    </p>
                </div>
                <AttendanceExportDialog selectedDate={selectedDate} />
            </div>

            {/* Stats Cards and Filters Section */}
            <div className="space-y-6 shrink-0">
                <StatsCards stats={stats} />
                <AttendanceFilters 
                    onFiltersChange={handleFiltersChange}
                    selectedDate={selectedDate}
                    onDateChange={handleDateChange}
                />
            </div>

            {/* Table Section */}
            <div className="flex-1 min-h-0 overflow-auto border rounded-md">
                {isLoading ? (
                    <AttendanceTableSkeleton />
                ) : data.length > 0 ? (
                    <AttendanceTable 
                        records={data} 
                        onRowClick={handleRowClick}
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                        <div className="text-center">
                                <p className="text-lg font-medium mb-2">No present employees found</p>
                                <p className="text-sm">Try selecting a different date or refreshing the live state</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Session Drawer */}
            <SessionDrawer
                open={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                employeeId={selectedEmployeeId}
                date={format(selectedDate, 'yyyy-MM-dd')}
            />
        </div>
    );
};

export default Attendance;
