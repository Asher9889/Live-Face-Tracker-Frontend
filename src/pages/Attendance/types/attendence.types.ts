export interface AttendanceEvent extends AttendanceRecord {
  employeeId: string;
  lastCameraCode: string;
  lastChangedAt: number;
  lastGate: AttendanceEventType;
  lastSeenAt: number;
  state: "IN" | "OUT";
  date: string;
};

// Request DTOs
export interface AttendanceEventsQueryParams {
  date?: string; // YYYY-MM-DD format for single day
  dateFrom?: string; // YYYY-MM-DD format for range
  dateTo?: string; // YYYY-MM-DD format for range
  employeeId?: string;
  department?: string;
  status?: AttendanceStatus[];
  eventType?: AttendanceEventType[];
  registeredOnly?: boolean;
  includeUnregistered?: boolean;
  limit?: number; // pagination
  offset?: number; // pagination
  sortBy?: 'timestamp' | 'employeeName' | 'gate'; // sorting
  sortOrder?: 'asc' | 'desc';
}

export interface AttendanceCurrentStateQueryParams {
  date?: string;
  employeeId?: string;
  department?: string;
  registeredOnly?: boolean;
  includeCompleted?: boolean;
  limit?: number;
  offset?: number;
  sortBy?: 'firstEntryAt' | 'lastSeenAt' | 'employeeName' | 'department';
  sortOrder?: 'asc' | 'desc';
}

export type AttendanceExportScope = 'ALL_EMPLOYEES' | 'SELECTED_EMPLOYEES';
export type AttendanceExportFormat = 'csv' | 'xlsx';

export interface AttendanceExportReportRequest {
  date: string;
  scope: AttendanceExportScope;
  format?: AttendanceExportFormat;
  employeeIds?: string[];
  department?: string;
  registeredOnly?: boolean;
  includeUnregistered?: boolean;
  timezone?: string;
}

// Response DTOs
export type AttendanceEventsResponse = {
  attendanceEvents: AttendanceEvent[];
  nextCursor: number | null;
  hasMore: boolean;
};

export type AttendanceDailyResponse = {
  date: string; // YYYY-MM-DD
  events: AttendanceRecord[];
  stats: AttendanceStats;
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
};

export interface AttendanceCurrentStateEmployeeDTO {
  id: string;
  employeeId: string;
  employeeCode?: string;
  employeeName: string;
  employeeAvatar?: string;
  department?: string;
  role?: string;
  currentStatus: 'PRESENT' | 'ON_BREAK' | 'IN_SESSION';
  firstEntryAt?: string;
  lastSeenAt?: string;
  currentGate?: string;
  currentCameraCode?: string;
  workDurationMinutes?: number;
  breakDurationMinutes?: number;
  flags?: Array<'LATE_ENTRY' | 'EARLY_EXIT' | 'MISSING_EXIT' | 'OVERTIME'>;
  sessionId?: string;
}

export interface AttendanceCurrentStateStats {
  totalEmployeesPresent: number;
  inSession: number;
  onBreak: number;
  lateArrivals: number;
  totalActiveSessions: number;
}

export interface AttendanceCurrentStateResponse {
  date: string;
  presentEmployees: AttendanceCurrentStateEmployeeDTO[];
  stats: AttendanceCurrentStateStats;
  pagination?: {
    limit: number;
    offset: number;
    total: number;
  };
}


export type AttendanceEventType = 'ENTRY' | 'EXIT';
export type AttendanceStatus = 'VERIFIED' | 'UNKNOWN' | 'SUSPICIOUS';
export type AttendanceSource = 'FACE_AI' | 'SYSTEM' | 'MANUAL';

export interface AttendanceRecord {
  id: string;
  employeeIdToView: string;
  employeeId: string; // Optional for unknown persons
  employeeName: string; // "Unknown" if not identified
  employeeAvatar: string;
  department?: string;
  designation?: string;
  timestamp: string; // ISO string
  type: AttendanceEventType;
  gate: string; // Camera name or Gate ID
  status: AttendanceStatus;
  confidence: number;
  source: AttendanceSource;
  isLate?: boolean;
  isEarlyExit?: boolean;
}

export interface AttendanceSession {
  id: string;
  employeeId: string;
  date: string; // YYYY-MM-DD
  firstEntry: string; // ISO string
  lastExit?: string; // ISO string
  totalDuration: number; // minutes
  breakDuration: number; // minutes
  status: 'COMPLETED' | 'ONGOING' | 'INCOMPLETE';
  events: AttendanceRecord[];
  flags: ('LATE_ENTRY' | 'EARLY_EXIT' | 'MISSING_EXIT' | 'OVERTIME')[];
}

export interface AttendanceStats {
  totalRecords: number;
  uniqueEmployees: number;
  totalWorkDuration: number; // minutes
  unknownEvents: number;
  lateEntries: number;
  earlyExits: number;
}

export interface AttendanceFiltersState {
  dateRange: {
    from?: Date;
    to?: Date;
  };
  employeeId?: string;
  department?: string;
  type?: AttendanceEventType[];
  status?: AttendanceStatus[];
  flags?: string[];
}

export interface AttendanceEmployeeDTO {
  id: string;
  name: string;
  avatar: string;
  department: string;
  role: string;
  email?: string;
}

export interface AttendanceSessionEventDTO {
  id: string;                 // stable id for React keys
  type: AttendanceEventType;  // ENTRY | EXIT
  entryAt: number;
  exitAt?: number;
  entryCameraCode: string;
  exitCameraCode: string;
  exitConfidence: number;
  exitSource: string;
  entryConfidence: number;
  entrySource: string;
}

export interface AttendanceSessionDTO {
  sessionId: string;

  employee: AttendanceEmployeeDTO;

  date: string; // YYYY-MM-DD

  firstEntry?: number;
  lastExit?: number;

  totalDurationMinutes?: number;
  breakDurationMinutes?: number;

  status: "COMPLETED" | "ONGOING" | "INCOMPLETE";

  flags: Array<"LATE_ENTRY" | "EARLY_EXIT" | "MISSING_EXIT" | "OVERTIME">;

  sessions: AttendanceSessionEventDTO[];
}

export interface AttendanceEmployeeProfileDTO {
  id: string;
  employeeCode?: string;
  name: string;
  department?: string;
  role?: string;
  email?: string;
  avatar?: string;
  joinDate?: string;
  status?: string;
}

export interface AttendanceEmployeeDailyEventDTO {
  eventId: string;
  timestamp: string;
  type: AttendanceEventType;
  cameraId?: string;
  cameraCode?: string;
  cameraName?: string;
  confidence?: number;
  status?: AttendanceStatus;
  source?: AttendanceSource;
  note?: string;
}

export interface AttendanceEmployeeDailyTimelineDTO {
  employeeId: string;
  date: string;
  timezone?: string;
  events: AttendanceEmployeeDailyEventDTO[];
  computed?: {
    firstEntryAt?: string;
    lastExitAt?: string;
    entriesCount?: number;
    exitsCount?: number;
    totalDurationMinutes?: number;
    breakDurationMinutes?: number;
    sessionStatus?: "COMPLETED" | "ONGOING" | "INCOMPLETE";
    flags?: string[];
  };
}

export interface AttendanceEmployeeMonthlySummaryDTO {
  employeeId: string;
  month: string;
  workingDays?: number;
  presentDays?: number;
  avgHoursPerDay?: number;
  lateArrivals?: number;
  locationsVisited?: number;
  totalDurationMinutes?: number;
}

export interface AttendanceEmployeeCalendarDayDTO {
  date: string;
  status: "PRESENT" | "ABSENT" | "PARTIAL" | "HOLIDAY";
  firstEntryAt?: string | null;
  lastExitAt?: string | null;
  durationMinutes?: number;
  hasAnomaly?: boolean;
  flags?: string[];
}

export interface AttendanceEmployeeCalendarDTO {
  employeeId: string;
  month: string;
  days: AttendanceEmployeeCalendarDayDTO[];
}
