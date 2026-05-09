import type {
  AnalyticsSummary,
  DailyReportRow,
  EmployeeTimeline,
  MonthlyReportRow,
  ReportFiltersState,
} from "../types";
import { DEPARTMENTS } from "../constants";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const NAMES = [
  "Alice Smith",
  "Bob Johnson",
  "Charlie Davis",
  "Diana Prince",
  "Evan Wright",
  "Fiona Gallagher",
  "George Costanza",
  "Hannah Abbott",
  "Ian Malcolm",
  "Julia Roberts",
];

export const getAnalyticsSummary = async (
  _filters: ReportFiltersState
): Promise<AnalyticsSummary> => {
  await delay(600); // Simulate network latency

  return {
    present: Math.floor(Math.random() * 50) + 100,
    absent: Math.floor(Math.random() * 10) + 2,
    late: Math.floor(Math.random() * 15) + 1,
    avgHours: "8h 15m",
    missingExit: Math.floor(Math.random() * 5),
    overtime: Math.floor(Math.random() * 20),
    totalEmployees: 150,
  };
};

export const getDailyReport = async (
  _filters: ReportFiltersState
): Promise<DailyReportRow[]> => {
  await delay(800);

  return Array.from({ length: 25 }).map((_, i) => {
    const isLate = Math.random() > 0.8;
    const isMissingExit = Math.random() > 0.9;
    const isAbsent = Math.random() > 0.95;

    let status: "Present" | "Absent" | "Late" | "Half Day" = "Present";
    if (isAbsent) status = "Absent";
    else if (isLate) status = "Late";
    else if (Math.random() > 0.9) status = "Half Day";

    return {
      id: `day-row-${i}`,
      employeeId: `EMP-${1000 + i}`,
      name: NAMES[i % NAMES.length],
      avatar: `https://i.pravatar.cc/150?u=${i}`,
      department: DEPARTMENTS[i % DEPARTMENTS.length],
      entryTime: isAbsent ? null : `0${8 + (isLate ? 1 : 0)}:${Math.floor(Math.random() * 59).toString().padStart(2, '0')} AM`,
      exitTime: isAbsent || isMissingExit ? null : `0${5 + Math.floor(Math.random() * 2)}:${Math.floor(Math.random() * 59).toString().padStart(2, '0')} PM`,
      workHours: isAbsent ? null : isMissingExit ? "--" : "8h 30m",
      status,
      lateStatus: isLate,
      missingExit: isMissingExit,
    };
  });
};

export const getMonthlyReport = async (
  _filters: ReportFiltersState
): Promise<MonthlyReportRow[]> => {
  await delay(800);

  return Array.from({ length: 25 }).map((_, i) => ({
    id: `month-row-${i}`,
    employeeId: `EMP-${1000 + i}`,
    name: NAMES[i % NAMES.length],
    avatar: `https://i.pravatar.cc/150?u=${i}`,
    department: DEPARTMENTS[i % DEPARTMENTS.length],
    presentDays: Math.floor(Math.random() * 5) + 18,
    absentDays: Math.floor(Math.random() * 3),
    lateCount: Math.floor(Math.random() * 4),
    avgWorkHours: "8h 10m",
    overtimeDays: Math.floor(Math.random() * 5),
    missingExits: Math.floor(Math.random() * 2),
  }));
};

export const getCustomRangeReport = async (
  _filters: ReportFiltersState
): Promise<DailyReportRow[]> => {
  // Reuse daily logic for demo purposes, representing multiple days
  await delay(1000);
  return getDailyReport(_filters);
};

export const getEmployeeTimeline = async (
  employeeId: string
): Promise<EmployeeTimeline> => {
  await delay(700);

  return {
    employee: {
      id: "1",
      employeeId: employeeId || "EMP-1001",
      name: NAMES[0],
      avatar: "https://i.pravatar.cc/150?u=0",
      department: "Engineering",
      role: "Senior Developer",
    },
    monthlyStats: {
      present: 21,
      absent: 1,
      late: 2,
    },
    events: [
      {
        id: "evt-1",
        type: "ENTRY_DETECTED",
        timestamp: "Today, 08:45 AM",
        cameraSource: "Main Entrance Cam",
        confidence: 98.5,
        statusBadge: "success",
      },
      {
        id: "evt-2",
        type: "EXIT_PENDING",
        timestamp: "Today, 05:30 PM",
        cameraSource: "Lobby Cam",
        confidence: 95.2,
        statusBadge: "warning",
      },
      {
        id: "evt-3",
        type: "EXIT_CANCELLED",
        timestamp: "Today, 05:32 PM",
        statusBadge: "error",
      },
      {
        id: "evt-4",
        type: "EXIT_CONFIRMED",
        timestamp: "Today, 06:15 PM",
        cameraSource: "Main Exit Cam",
        confidence: 99.1,
        statusBadge: "success",
      },
    ],
  };
};
