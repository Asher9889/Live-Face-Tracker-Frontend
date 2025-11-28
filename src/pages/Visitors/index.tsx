import VisitorTable from '@/components/visitors/VisitorTable';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Filter } from 'lucide-react';

const Visitors = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Visitor Logs</h2>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        Date Range
                    </Button>
                    <Button variant="outline" size="sm">
                        <Filter className="mr-2 h-4 w-4" />
                        Filter
                    </Button>
                </div>
            </div>

            <VisitorTable />
        </div>
    );
};

export default Visitors;
