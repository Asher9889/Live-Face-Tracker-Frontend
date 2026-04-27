import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Check, Download, Search } from "lucide-react";
import { useEmployee } from "@/components/employees/hooks/useRegister";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/cn";
import { exportAttendanceReport } from "../api/attendence.api";
import type { AttendanceExportFormat, AttendanceExportScope } from "../types/attendence.types";

type EmployeeItem = {
    id: string;
    name: string;
    department?: string;
    role?: string;
    email?: string;
    phone?: string;
    avatar?: string;
};

interface AttendanceExportDialogProps {
    selectedDate?: Date;
}

const downloadBlob = (blob: Blob, fileName: string) => {
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = fileName;
    anchor.click();
    window.URL.revokeObjectURL(url);
};

const AttendanceExportDialog = ({ selectedDate }: AttendanceExportDialogProps) => {
    const [open, setOpen] = useState(false);
    const [reportDate, setReportDate] = useState<Date>(selectedDate || new Date());
    const [scope, setScope] = useState<AttendanceExportScope>("ALL_EMPLOYEES");
    const [formatType, setFormatType] = useState<AttendanceExportFormat>("csv");
    const [search, setSearch] = useState("");
    const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<string[]>([]);
    const [isExporting, setIsExporting] = useState(false);
    const [exportError, setExportError] = useState<string | null>(null);

    const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isLoading } = useEmployee();

    useEffect(() => {
        if (selectedDate) {
            setReportDate(selectedDate);
        }
    }, [selectedDate]);

    useEffect(() => {
        if (!open || !hasNextPage || isFetchingNextPage) {
            return;
        }

        fetchNextPage();
    }, [open, hasNextPage, isFetchingNextPage, fetchNextPage, data?.pages.length]);

    const employees = useMemo<EmployeeItem[]>(() => {
        return data?.pages.flatMap((page) => page.data ?? []) ?? [];
    }, [data]);

    const filteredEmployees = useMemo(() => {
        const normalized = search.trim().toLowerCase();

        if (!normalized) {
            return employees;
        }

        return employees.filter((employee) => {
            const haystack = [
                employee.name,
                employee.department,
                employee.role,
                employee.email,
                employee.phone,
                employee.id,
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return haystack.includes(normalized);
        });
    }, [employees, search]);

    useEffect(() => {
        if (scope === "ALL_EMPLOYEES") {
            setSelectedEmployeeIds([]);
        }
    }, [scope]);

    const selectedDateLabel = format(reportDate, "PPP");
    const allVisibleSelected = filteredEmployees.length > 0 && filteredEmployees.every((employee) => selectedEmployeeIds.includes(employee.id));

    const toggleEmployee = (employeeId: string) => {
        setSelectedEmployeeIds((current) => {
            if (current.includes(employeeId)) {
                return current.filter((id) => id !== employeeId);
            }

            return [...current, employeeId];
        });
    };

    const toggleAllVisible = () => {
        if (allVisibleSelected) {
            setSelectedEmployeeIds((current) => current.filter((id) => !filteredEmployees.some((employee) => employee.id === id)));
            return;
        }

        setSelectedEmployeeIds((current) => Array.from(new Set([...current, ...filteredEmployees.map((employee) => employee.id)])));
    };

    const handleExport = async () => {
        setExportError(null);

        if (scope === "SELECTED_EMPLOYEES" && selectedEmployeeIds.length === 0) {
            setExportError("Select at least one employee to generate an employee-wise report.");
            return;
        }

        setIsExporting(true);

        try {
            const blob = await exportAttendanceReport({
                date: format(reportDate, "yyyy-MM-dd"),
                scope,
                format: formatType,
                employeeIds: scope === "SELECTED_EMPLOYEES" ? selectedEmployeeIds : undefined,
                registeredOnly: true,
            });

            const scopeLabel = scope === "ALL_EMPLOYEES" ? "all-employees" : `employees-${selectedEmployeeIds.length}`;
            downloadBlob(blob, `attendance-report-${scopeLabel}-${format(reportDate, "yyyy-MM-dd")}.${formatType}`);
            setOpen(false);
        } catch (error) {
            setExportError(error instanceof Error ? error.message : "Failed to export report.");
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
                <Download className="mr-2 h-4 w-4" />
                Export Report
            </Button>

            <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden p-0">
                <div className="max-h-[90vh] overflow-y-auto p-6">
                    <DialogHeader>
                        <DialogTitle>Export Attendance Report</DialogTitle>
                        <DialogDescription>
                            Generate a downloadable report for the selected date. You can export a complete attendance summary for all employees or a custom employee-wise report.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-6 md:grid-cols-[320px_1fr]">
                    <div className="space-y-5">
                        <div className="rounded-xl border bg-muted/20 p-4 space-y-4">
                            <div>
                                <p className="text-sm font-medium">Report date</p>
                                <p className="text-xs text-muted-foreground">Choose the day you want to export.</p>
                            </div>

                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {selectedDateLabel}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar mode="single" selected={reportDate} onSelect={(value) => value && setReportDate(value)} initialFocus />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="rounded-xl border bg-card p-4 space-y-4">
                            <div>
                                <p className="text-sm font-medium">Export mode</p>
                                <p className="text-xs text-muted-foreground">Pick one report style.</p>
                            </div>

                            <div className="grid gap-3">
                                <button
                                    type="button"
                                    onClick={() => setScope("ALL_EMPLOYEES")}
                                    className={cn(
                                        "rounded-lg border p-3 text-left transition-colors hover:border-primary",
                                        scope === "ALL_EMPLOYEES" && "border-primary bg-primary/5"
                                    )}
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <div>
                                            <p className="font-medium">All employees report</p>
                                            <p className="text-xs text-muted-foreground">Single file with everyone included for the selected date.</p>
                                        </div>
                                        {scope === "ALL_EMPLOYEES" && <Check className="h-4 w-4 text-primary" />}
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setScope("SELECTED_EMPLOYEES")}
                                    className={cn(
                                        "rounded-lg border p-3 text-left transition-colors hover:border-primary",
                                        scope === "SELECTED_EMPLOYEES" && "border-primary bg-primary/5"
                                    )}
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <div>
                                            <p className="font-medium">Employee-wise report</p>
                                            <p className="text-xs text-muted-foreground">Choose one or more employees from the list.</p>
                                        </div>
                                        {scope === "SELECTED_EMPLOYEES" && <Check className="h-4 w-4 text-primary" />}
                                    </div>
                                </button>
                            </div>
                        </div>

                        <div className="rounded-xl border p-4 space-y-3">
                            <div>
                                <p className="text-sm font-medium">Format</p>
                                <p className="text-xs text-muted-foreground">Choose the file type for the download.</p>
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant={formatType === "csv" ? "default" : "outline"}
                                    className="flex-1"
                                    onClick={() => setFormatType("csv")}
                                >
                                    CSV
                                </Button>
                                <Button
                                    type="button"
                                    variant={formatType === "xlsx" ? "default" : "outline"}
                                    className="flex-1"
                                    onClick={() => setFormatType("xlsx")}
                                >
                                    XLSX
                                </Button>
                            </div>
                        </div>

                        <div className="rounded-xl border bg-muted/20 p-4 text-sm text-muted-foreground space-y-2">
                            <p className="font-medium text-foreground">Selected summary</p>
                            <div className="flex flex-wrap gap-2">
                                <Badge variant="secondary">{selectedDateLabel}</Badge>
                                <Badge variant="secondary">{scope === "ALL_EMPLOYEES" ? "All employees" : `${selectedEmployeeIds.length} employees selected`}</Badge>
                                <Badge variant="secondary">.{formatType}</Badge>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border p-4 space-y-4 min-h-[520px] flex flex-col">
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <div>
                                <p className="text-sm font-medium">Employee directory</p>
                                <p className="text-xs text-muted-foreground">
                                    {scope === "ALL_EMPLOYEES"
                                        ? "The list is still available for reference."
                                        : "Search and select employees to include in the export."}
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <Badge variant="outline">{employees.length} loaded</Badge>
                                <Badge variant="outline">{selectedEmployeeIds.length} selected</Badge>
                            </div>
                        </div>

                        <div className="relative">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search by name, department, role or ID"
                                className="pl-9"
                            />
                        </div>

                        {scope === "SELECTED_EMPLOYEES" && (
                            <div className="flex items-center justify-between rounded-lg border bg-muted/20 px-3 py-2 text-sm">
                                <span>{allVisibleSelected ? "All visible employees selected" : "Select all visible employees"}</span>
                                <Button variant="ghost" size="sm" onClick={toggleAllVisible}>
                                    {allVisibleSelected ? "Clear visible" : "Select visible"}
                                </Button>
                            </div>
                        )}

                        {isLoading ? (
                            <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
                                Loading employee directory...
                            </div>
                        ) : (
                            <ScrollArea className="flex-1 pr-3">
                                <div className="space-y-2">
                                    {filteredEmployees.length === 0 ? (
                                        <div className="flex min-h-[240px] items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
                                            No employees match your search.
                                        </div>
                                    ) : (
                                        filteredEmployees.map((employee) => {
                                            const checked = selectedEmployeeIds.includes(employee.id);

                                            return (
                                                <label
                                                    key={employee.id}
                                                    className={cn(
                                                        "flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/40",
                                                        scope === "SELECTED_EMPLOYEES" && checked && "border-primary bg-primary/5"
                                                    )}
                                                >
                                                    {scope === "SELECTED_EMPLOYEES" ? (
                                                        <Checkbox
                                                            checked={checked}
                                                            onCheckedChange={() => toggleEmployee(employee.id)}
                                                            className="mt-1"
                                                        />
                                                    ) : (
                                                        <div className="mt-1 h-4 w-4 rounded-full border border-muted-foreground/30" />
                                                    )}

                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-center justify-between gap-3">
                                                            <div className="min-w-0">
                                                                <p className="truncate font-medium">{employee.name}</p>
                                                                <p className="text-xs text-muted-foreground">
                                                                    {employee.department || "No department"} · {employee.role || "No role"}
                                                                </p>
                                                            </div>

                                                            {checked && scope === "SELECTED_EMPLOYEES" && (
                                                                <Badge variant="secondary" className="shrink-0">Selected</Badge>
                                                            )}
                                                        </div>
                                                        <p className="mt-2 text-xs text-muted-foreground">Employee ID: {employee.id}</p>
                                                    </div>
                                                </label>
                                            );
                                        })
                                    )}
                                </div>
                            </ScrollArea>
                        )}

                        {hasNextPage && (
                            <Button variant="outline" onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
                                {isFetchingNextPage ? "Loading more employees..." : "Load more employees"}
                            </Button>
                        )}

                        {exportError && (
                            <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                                {exportError}
                            </div>
                        )}
                    </div>

                    </div>

                    <Separator className="my-6" />

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleExport} disabled={isExporting || (scope === "SELECTED_EMPLOYEES" && selectedEmployeeIds.length === 0)}>
                            {isExporting ? "Generating report..." : "Download report"}
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AttendanceExportDialog;