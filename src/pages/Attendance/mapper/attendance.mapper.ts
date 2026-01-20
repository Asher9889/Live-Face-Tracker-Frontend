import type { AttendanceEvent,AttendanceRecord } from "../types/attendence.types";

/**
 * Convert one backend AttendanceEvent into a UI AttendanceRecord
 */
export function mapAttendanceEventToRecord(event: AttendanceEvent): AttendanceRecord {
    const { employeeId } = event;
  return {
    id: event.id,

    employeeIdToView: `EMP-${employeeId?.slice(employeeId.length - 4)}`,
    employeeId: employeeId,
    employeeName: event.employeeName,
    employeeAvatar: event.employeeAvatar,

    timestamp: new Date(event.lastChangedAt).toISOString(),
    type: event.lastGate,

    gate: event.lastCameraCode,

    status: event.status,
    confidence: Number((event.confidence * 100).toFixed(2)),

    source: event.source,

    isLate: event.isLate,
    isEarlyExit: event.isEarlyExit,
  };
}

/**
 * Convert multiple events
 */
export function mapAttendanceEventsToRecords(events: AttendanceEvent[]): AttendanceRecord[] {
  return events.map(mapAttendanceEventToRecord);
}
