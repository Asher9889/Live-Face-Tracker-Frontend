import type { AttendanceEvent,AttendanceRecord } from "../types/attendence.types";

/**
 * Convert one backend AttendanceEvent into a UI AttendanceRecord
 */
export function mapAttendanceEventToRecord(event: AttendanceEvent): AttendanceRecord {
  const isVerified = !!event.employeeId;

  return {
    id: `${event.employeeId ?? "unknown"}-${event.lastChangedAt}`,

    employeeId: event.employeeId,
    employeeName: isVerified ? "Employee" : "Unknown Person",
    employeeAvatar: undefined,

    timestamp: new Date(event.lastChangedAt).toISOString(),

    // ENTRY | EXIT
    type: event.lastGate,

    gate: event.lastCameraCode,

    status: isVerified ? "VERIFIED" : "UNKNOWN",
    confidence: isVerified ? 98.5 : 0,

    source: "FACE_AI",

    isLate: false,
    isEarlyExit: false,
  };
}

/**
 * Convert multiple events
 */
export function mapAttendanceEventsToRecords(
  events: AttendanceEvent[]
): AttendanceRecord[] {
  return events.map(mapAttendanceEventToRecord);
}
