export interface AttendanceEvent extends AttendanceRecord {
  employeeId: string | null;
  lastCameraCode: string;
  lastChangedAt: number;
  lastGate: AttendanceEventType;
  lastSeenAt: number;
  state: "IN" | "OUT";
  date: string;
};

export type AttendanceEventsResponse = {
  attendanceEvents: AttendanceEvent[];
  nextCursor: number | null;
  hasMore: boolean;
};


export type AttendanceEventType = 'ENTRY' | 'EXIT';
export type AttendanceStatus = 'VERIFIED' | 'UNKNOWN' | 'SUSPICIOUS';
export type AttendanceSource = 'FACE_AI' | 'SYSTEM' | 'MANUAL';

export interface AttendanceRecord {
    id: string;
    employeeId: string | null; // Optional for unknown persons
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
