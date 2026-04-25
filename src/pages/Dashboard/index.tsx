import StatsCards from '@/components/attendance/StatsCards';
import CameraGrid from '@/components/camera/CameraGrid';
import AlertsFeed from '@/components/alerts/AlertsFeed';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDashboardAttendanceSummary } from './hooks/useDashboardAttendanceSummary';
import type { AttendanceStats } from '../Attendance/types/attendence.types';

const Dashboard = () => {
    const { data } = useDashboardAttendanceSummary();

    const mappedStats: AttendanceStats | undefined = data
        ? {
            totalRecords: data.stats.totalRecords,
            uniqueEmployees: data.stats.uniqueEmployees,
            totalWorkDuration: data.stats.totalWorkDurationMinutes,
            unknownEvents: data.stats.unknownEvents,
            lateEntries: data.stats.lateEntries,
            earlyExits: data.stats.earlyExits,
        }
        : undefined;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-primary tracking-tight">Dashboard</h2>
                <div className="flex items-center gap-2">
                    <Button>Download Report</Button>
                </div>
            </div>

            <StatsCards stats={mappedStats} />

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 p-4">
                    {/* <CardHeader>
                        <CardTitle>Live Monitoring</CardTitle>
                    </CardHeader> */}
                    <CardContent className="pl-2">
                        <CameraGrid />
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Recent Alerts</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <AlertsFeed />
                        <div className="mt-4 flex justify-center">
                            <Link to="/alerts">
                                <Button variant="ghost" className="gap-2">
                                    View All Alerts <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
