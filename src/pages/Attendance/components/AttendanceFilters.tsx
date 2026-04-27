import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
    selectedDate?: Date;
    onDateChange?: (date: Date) => void;
}

const AttendanceFilters = ({ 
    className, 
    onFiltersChange,
    selectedDate,
    onDateChange 
}: AttendanceFiltersProps) => {
    const [date, setDate] = useState<Date | undefined>(selectedDate || new Date());
    const [isOpen, setIsOpen] = useState(false);

    const [filters, setFilters] = useState<AttendanceFiltersState>({
        dateRange: { from: date },
        employeeId: "",
        department: undefined,
    });

    // Update filters when date changes
    useEffect(() => {
        if (date) {
            setFilters(prev => ({ 
                ...prev, 
                dateRange: { from: date } 
            }));
            onDateChange?.(date);
        }
    }, [date, onDateChange]);

    const handleApply = () => {
        onFiltersChange(filters);
        setIsOpen(false);
    };

    const handleReset = () => {
        const resetState: AttendanceFiltersState = {
            dateRange: { from: new Date() },
            employeeId: "",
            department: undefined,
        };
        setFilters(resetState);
        setDate(new Date());
        onFiltersChange(resetState);
    };

    const isFiltered = !!filters.employeeId || !!filters.department;

    return (
        <div className={cn("flex flex-col gap-4", className)}>
            <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-2">
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
                            onSelect={setDate}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>

                {/* Department Filter */}
                <Select
                    value={filters.department || "all"}
                    onValueChange={(val) => setFilters(prev => ({ 
                        ...prev, 
                        department: val === "all" ? undefined : val 
                    }))}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Department" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Departments</SelectItem>
                        <SelectItem value="engineering">Engineering</SelectItem>
                        <SelectItem value="hr">HR</SelectItem>
                        <SelectItem value="sales">Sales</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                    </SelectContent>
                </Select>

                <Button
                    variant="outline"
                    className={cn("gap-2", isOpen && "bg-accent", isFiltered && "border-blue-500")}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <Filter className="h-4 w-4" />
                    More Filters
                </Button>

                {isFiltered && (
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={handleReset} 
                        className="text-muted-foreground hover:text-foreground"
                    >
                        Clear Filters
                        <X className="ml-2 h-3 w-3" />
                    </Button>
                )}
            </div>

            {/* Advanced Filters Panel */}
            {isOpen && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border rounded-lg bg-card text-card-foreground shadow-sm animate-in slide-in-from-top-2">
                    <div className="space-y-3">
                        <h4 className="font-medium text-sm text-muted-foreground">Employee Search</h4>
                        <div className="space-y-2">
                            <Label htmlFor="employee-search">Employee Name / ID</Label>
                            <Input
                                id="employee-search"
                                placeholder="Search employee..."
                                value={filters.employeeId || ""}
                                onChange={(e) => setFilters(prev => ({ ...prev, employeeId: e.target.value }))}
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col items-end justify-end gap-2">
                        <Button onClick={handleApply} className="w-full md:w-auto">
                            Apply Filters
                        </Button>
                        {isFiltered && (
                            <Button 
                                variant="outline"
                                onClick={handleReset}
                                className="w-full md:w-auto"
                            >
                                Reset All
                            </Button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AttendanceFilters;
