import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { CalendarIcon, Filter, X } from "lucide-react";
import { format } from "date-fns";
import type { AttendanceFiltersState } from "@/pages/Attendance/types/attendence.types";
import { cn } from "@/utils/cn";

interface AttendanceFiltersProps {
    className?: string;
    onFiltersChange: (filters: AttendanceFiltersState) => void;
}

const AttendanceFilters = ({ className, onFiltersChange }: AttendanceFiltersProps) => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [isOpen, setIsOpen] = useState(false);

    // Mock initial state - in real app would come from props or URL
    const [filters, setFilters] = useState<AttendanceFiltersState>({
        dateRange: { from: new Date() },
        employeeId: "",
        department: "all",
        status: [],
        flags: []
    });

    const handleApply = () => {
        onFiltersChange(filters);
        setIsOpen(false);
    };

    const handleReset = () => {
        const resetState = {
            dateRange: { from: new Date() },
            employeeId: "",
            department: "all",
            status: [],
            flags: []
        };
        setFilters(resetState);
        onFiltersChange(resetState);
    };

    return (
        <div className={cn("flex flex-col gap-4", className)}>
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {/* Date Picker */}
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "justify-start text-left font-normal w-[240px]",
                                !date && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={(d) => {
                                setDate(d);
                                setFilters(prev => ({ ...prev, dateRange: { from: d } }));
                            }}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>

                {/* Quick Filters */}
                <Select
                    value={filters.department}
                    onValueChange={(val) => setFilters(prev => ({ ...prev, department: val }))}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Department" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Departments</SelectItem>
                        <SelectItem value="engineering">Engineering</SelectItem>
                        <SelectItem value="hr">HR</SelectItem>
                        <SelectItem value="sales">Sales</SelectItem>
                    </SelectContent>
                </Select>

                <Button
                    variant="outline"
                    className={cn("gap-2", isOpen && "bg-accent")}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <Filter className="h-4 w-4" />
                    More Filters
                </Button>

                {(filters.status?.length ?? 0) > 0 && (
                    <Button variant="ghost" size="sm" onClick={handleReset} className="text-muted-foreground">
                        Reset
                        <X className="ml-2 h-3 w-3" />
                    </Button>
                )}
            </div>

            {/* Advanced Filters Panel */}
            {isOpen && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-4 border rounded-lg bg-card text-card-foreground shadow-sm animate-in slide-in-from-top-2">
                    <div className="space-y-3">
                        <h4 className="font-medium text-sm text-muted-foreground">Detailed Search</h4>
                        <div className="space-y-2">
                            <Label>Employee Name / ID</Label>
                            <Input
                                placeholder="Search employee..."
                                value={filters.employeeId}
                                onChange={(e) => setFilters(prev => ({ ...prev, employeeId: e.target.value }))}
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h4 className="font-medium text-sm text-muted-foreground">Event Type</h4>
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <Checkbox id="entry" />
                                <label htmlFor="entry" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Entry
                                </label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="exit" />
                                <label htmlFor="exit" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Exit
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h4 className="font-medium text-sm text-muted-foreground">Status & Flags</h4>
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <Checkbox id="unknown" />
                                <label htmlFor="unknown" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Unknown Person
                                </label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="late" />
                                <label htmlFor="late" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Late Entry
                                </label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="early" />
                                <label htmlFor="early" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Early Exit
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-end justify-end">
                        <Button onClick={handleApply} className="w-full md:w-auto">
                            Apply Filters
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AttendanceFilters;
