export type ReportMode = "daily" | "monthly" | "custom";

export interface AnalyticsSummary {
  present: number;
  absent: number;
  late: number;
  avgHours: string;
  missingExit: number;
  overtime: number;
  totalEmployees: number;
}

export interface DailyReportRow {
  id: string;
  employeeId: string;
  name: string;
  avatar?: string;
  department: string;
  entryTime: string | null;
  exitTime: string | null;
  workHours: string | null;
  status: "Present" | "Absent" | "Late" | "Half Day";
  lateStatus: boolean;
  missingExit: boolean;
}

export interface MonthlyReportRow {
  id: string;
  employeeId: string;
  name: string;
  avatar?: string;
  department: string;
  presentDays: number;
  absentDays: number;
  lateCount: number;
  avgWorkHours: string;
  overtimeDays: number;
  missingExits: number;
}

export interface TimelineEvent {
  id: string;
  type: "ENTRY_DETECTED" | "EXIT_PENDING" | "EXIT_CANCELLED" | "EXIT_CONFIRMED" | "SYSTEM_RECOVERY";
  timestamp: string;
  cameraSource?: string;
  confidence?: number;
  statusBadge: "success" | "warning" | "error" | "info" | "default";
}

export interface EmployeeTimeline {
  employee: {
    id: string;
    employeeId: string;
    name: string;
    avatar?: string;
    department: string;
    role: string;
  };
  monthlyStats: {
    present: number;
    absent: number;
    late: number;
  };
  events: TimelineEvent[];
}

export interface ReportFiltersState {
  mode: ReportMode;
  date?: string; // YYYY-MM-DD
  month?: string; // YYYY-MM
  startDate?: string;
  endDate?: string;
  department?: string;
  employeeId?: string;
  employeeName?: string;
  status?: string;
  lateOnly?: boolean;
  missingExitOnly?: boolean;
}
