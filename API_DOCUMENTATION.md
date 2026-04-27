# Attendance System - Complete API Documentation

## Overview
This document provides detailed specifications for the Attendance Management System APIs that should be implemented on the backend. These APIs support the `/attendance` route which displays attendance records filtered by date and other criteria.

---

## Table of Contents
1. [Base URL & Authentication](#base-url--authentication)
2. [Data Models](#data-models)
3. [API Endpoints](#api-endpoints)
4. [Query Parameters](#query-parameters)
5. [Response Formats](#response-formats)
6. [Error Handling](#error-handling)
7. [Implementation Notes](#implementation-notes)

---

## Base URL & Authentication

**Base URL:** `{API_BASE_URL}/api` or `{API_BASE_URL}`

**Authentication:** Bearer Token (JWT) in `Authorization` header
```
Authorization: Bearer {token}
```

**Content-Type:** `application/json`

---

## Data Models

### AttendanceEvent
Represents a single attendance event (entry or exit).

```typescript
{
  "id": "string",                          // Unique identifier
  "employeeId": "string",                  // Employee's unique ID
  "employeeIdToView": "string",            // Employee's display ID (e.g., EMP001)
  "employeeName": "string",                // Employee's full name
  "employeeAvatar": "string",              // Avatar/photo path from MinIO
  "department": "string",                  // Optional: Department name
  "designation": "string",                 // Optional: Job title
  "timestamp": "ISO 8601",                 // Event timestamp (e.g., 2024-04-27T09:30:45Z)
  "type": "ENTRY" | "EXIT",                // Event type
  "gate": "string",                        // Camera/Gate identifier or name
  "status": "VERIFIED" | "UNKNOWN" | "SUSPICIOUS", // Verification status
  "confidence": "number",                  // AI confidence score (0-100)
  "source": "FACE_AI" | "SYSTEM" | "MANUAL", // Data source
  "isLate": "boolean",                     // Optional: True if entry is after 9:30 AM
  "isEarlyExit": "boolean",                // Optional: True if exit is before 6:00 PM
  "date": "YYYY-MM-DD",                    // Event date
  "lastCameraCode": "string",              // Last camera code
  "lastChangedAt": "number",               // Timestamp of last change
  "lastGate": "ENTRY" | "EXIT",            // Last gate type
  "lastSeenAt": "number",                  // Timestamp when last seen
  "state": "IN" | "OUT"                    // Current state
}
```

### Registered employee rule

The `/attendance` page is a registered-employee view by default.

- Return only rows that can be matched to a registered employee.
- Exclude `status = UNKNOWN` rows from the default response.
- Exclude rows with no resolvable employee profile from the default response.
- If the backend needs audit access to unknown faces, expose it explicitly with `includeUnregistered=true`.
- The frontend will send `registeredOnly=true` for the main attendance page.

### AttendanceStats
Summary statistics for a specific date.

```typescript
{
  "totalRecords": "number",                // Total events for the date
  "uniqueEmployees": "number",             // Number of unique employees
  "totalWorkDuration": "number",           // Total work time in minutes across all employees
  "unknownEvents": "number",               // Events from unidentified persons
  "lateEntries": "number",                 // Entries after 9:30 AM
  "earlyExits": "number"                   // Exits before 6:00 PM
}
```

### Pagination
Used in paginated responses.

```typescript
{
  "limit": "number",                       // Items per page
  "offset": "number",                      // Starting position
  "total": "number"                        // Total items available
}
```

---

## API Endpoints

### 0. Get Current Present Employees State
**Endpoint:** `GET /attendance/current-state`

**Purpose:** Fetch only the employees who are currently present on the selected date. This is the payload used when the `/attendance` page opens.

**Query Parameters:**
```
date                (optional) - YYYY-MM-DD format; defaults to today
employeeId          (optional) - Filter by a specific employee ID
department          (optional) - Filter by department name
registeredOnly      (optional) - boolean, default true. Must stay true for the main attendance page.
includeCompleted    (optional) - boolean, default false. When true, backend may include completed sessions in an audit view.
limit               (optional) - Pagination limit
offset              (optional) - Pagination offset
sortBy              (optional) - firstEntryAt|lastSeenAt|employeeName|department
sortOrder           (optional) - asc|desc
```

**Response Schema:**
```typescript
{
  "status": "success",
  "statusCode": 200,
  "data": {
    "date": "2026-04-27",
    "presentEmployees": [
      {
        "id": "string",
        "employeeId": "string",
        "employeeCode": "EMP001",
        "employeeName": "John Doe",
        "employeeAvatar": "path/to/avatar.jpg",
        "department": "Engineering",
        "role": "Developer",
        "currentStatus": "PRESENT|ON_BREAK|IN_SESSION",
        "firstEntryAt": "2026-04-27T09:10:00Z",
        "lastSeenAt": "2026-04-27T12:40:00Z",
        "currentGate": "Main Gate",
        "currentCameraCode": "CAM-01",
        "workDurationMinutes": 210,
        "breakDurationMinutes": 30,
        "flags": ["LATE_ENTRY"],
        "sessionId": "string"
      }
    ],
    "stats": {
      "totalEmployeesPresent": 18,
      "inSession": 15,
      "onBreak": 3,
      "lateArrivals": 2,
      "totalActiveSessions": 18
    },
    "pagination": {
      "limit": 100,
      "offset": 0,
      "total": 18
    }
  }
}
```

**Backend rule:** the default response must exclude unknown/unregistered faces. If audit access is required, it should be an explicit opt-in endpoint or a separate `includeUnregistered=true` flow.

### 1. Get Full Session Log for a Clicked Employee
**Endpoint:** `GET /attendance/employees/:employeeId/session`

**Purpose:** Fetch the full detailed session log after a user clicks a present employee row.

**Query Parameters:**
```
date                (optional) - YYYY-MM-DD format; if omitted, backend may default to today
timezone            (optional) - IANA timezone string
```

**Response:**
Use the existing session response shape already used by the drawer: employee profile, total duration, break duration, flags, and the `sessions` timeline array.

**Frontend flow:**
- On page open, call `GET /attendance/current-state`.
- On row click, call `GET /attendance/employees/:employeeId/session` for the selected employee.
- Keep the separate employee history page for the full month view.

### 2. Get Attendance Events for a Specific Date
**Endpoint:** `GET /attendance/date`

**Purpose:** Fetch all attendance events for a specific date with optional filters.

**Query Parameters:**
```
date           (required) - YYYY-MM-DD format (e.g., 2024-04-27)
employeeId     (optional) - Filter by specific employee ID
department     (optional) - Filter by department name
status         (optional) - Comma-separated status values (VERIFIED,UNKNOWN,SUSPICIOUS)
eventType      (optional) - Comma-separated event types (ENTRY,EXIT)
registeredOnly (optional) - boolean, default true
includeUnregistered (optional) - boolean, default false
limit          (optional) - Records per page (default: 50, max: 500)
offset         (optional) - Pagination offset (default: 0)
sortBy         (optional) - Sort field: timestamp|employeeName|gate (default: timestamp)
sortOrder      (optional) - asc|desc (default: desc)
```

**Example Request:**
```bash
GET /attendance/date?date=2024-04-27&limit=50&offset=0&sortBy=timestamp&sortOrder=desc
GET /attendance/date?date=2024-04-27&department=Engineering&status=VERIFIED
GET /attendance/date?date=2024-04-27&eventType=ENTRY&registeredOnly=true
GET /attendance/date?date=2024-04-27&includeUnregistered=true
```

**Response Schema:**
```typescript
{
  "status": "success",
  "statusCode": 200,
  "data": {
    "date": "2024-04-27",
    "events": [AttendanceEvent[], ...],  // Array of attendance events
    "stats": AttendanceStats,             // Daily statistics
    "pagination": {
      "limit": 50,
      "offset": 0,
      "total": 234
    }
  },
  "message": "Attendance records retrieved successfully"
}
```

**Status Codes:**
- `200 OK` - Success
- `400 Bad Request` - Invalid date format or parameters
- `401 Unauthorized` - Missing or invalid token
- `500 Internal Server Error` - Server error

---

### 2. Get Attendance Events for a Date Range
**Endpoint:** `GET /attendance/range`

**Purpose:** Fetch attendance events for a date range with optional filters.

**Query Parameters:**
```
dateFrom       (required) - Start date in YYYY-MM-DD format
dateTo         (required) - End date in YYYY-MM-DD format
employeeId     (optional) - Filter by specific employee ID
department     (optional) - Filter by department name
status         (optional) - Comma-separated status values
eventType      (optional) - Comma-separated event types
registeredOnly (optional) - boolean, default true
includeUnregistered (optional) - boolean, default false
limit          (optional) - Records per page (default: 100, max: 1000)
offset         (optional) - Pagination offset (default: 0)
sortBy         (optional) - Sort field
sortOrder      (optional) - asc|desc
```

**Example Request:**
```bash
GET /attendance/range?dateFrom=2024-04-01&dateTo=2024-04-30&limit=100
GET /attendance/range?dateFrom=2024-04-25&dateTo=2024-04-27&department=Sales
```

**Response Schema:**
```typescript
{
  "status": "success",
  "statusCode": 200,
  "data": {
    "attendanceEvents": [AttendanceEvent[], ...],
    "pagination": {
      "limit": 100,
      "offset": 0,
      "total": 5420
    },
    "nextCursor": 100,     // For cursor-based pagination if applicable
    "hasMore": true,       // Whether more records exist
    "dateRange": {
      "from": "2024-04-25",
      "to": "2024-04-27"
    }
  },
  "message": "Attendance records retrieved successfully"
}
```

---

### 3. Get Attendance Events (All/Recent)
**Endpoint:** `GET /attendance/events`

**Purpose:** Fetch recent attendance events (typically today or last few days).

**Query Parameters:**
```
limit          (optional) - Records per page (default: 100)
offset         (optional) - Pagination offset (default: 0)
```

**Response Schema:**
```typescript
{
  "status": "success",
  "statusCode": 200,
  "data": {
    "attendanceEvents": [AttendanceEvent[], ...],
    "nextCursor": 100,
    "hasMore": true
  }
}
```

---

### 4. Get Today's Session for an Employee
**Endpoint:** `GET /attendance/today/:employeeId`

**Purpose:** Get today's complete attendance session for a specific employee.

**Path Parameters:**
```
employeeId     (required) - Employee's unique ID
```

**Response Schema:**
```typescript
{
  "status": "success",
  "statusCode": 200,
  "data": {
    "sessionId": "string",
    "employee": {
      "id": "string",
      "name": "string",
      "avatar": "string",
      "department": "string",
      "role": "string",
      "email": "string"
    },
    "date": "2024-04-27",
    "firstEntry": 1714222245000,         // Timestamp in milliseconds
    "lastExit": 1714259145000,           // Timestamp in milliseconds
    "totalDurationMinutes": 480,         // Total work time
    "breakDurationMinutes": 45,          // Break time
    "status": "COMPLETED" | "ONGOING" | "INCOMPLETE",
    "flags": ["LATE_ENTRY", "OVERTIME"],
    "sessions": [
      {
        "id": "string",
        "type": "ENTRY" | "EXIT",
        "entryAt": 1714222245000,
        "exitAt": 1714259145000,
        "entryCameraCode": "CAM_001",
        "exitCameraCode": "CAM_001",
        "entryConfidence": 0.95,
        "exitConfidence": 0.92,
        "entrySource": "FACE_AI",
        "exitSource": "FACE_AI"
      },
      ...
    ]
  }
}
```

---

### 5. Get Employee Attendance Summary
**Endpoint:** `GET /attendance/employees/:employeeId/summary`

**Purpose:** Get monthly attendance summary for an employee.

**Path Parameters:**
```
employeeId     (required) - Employee's unique ID
```

**Query Parameters:**
```
month          (required) - Month in YYYY-MM format (e.g., 2024-04)
timezone       (optional) - Timezone string (default: UTC)
```

**Response Schema:**
```typescript
{
  "status": "success",
  "statusCode": 200,
  "data": {
    "employeeId": "string",
    "month": "2024-04",
    "workingDays": 22,
    "presentDays": 20,
    "avgHoursPerDay": 8.5,
    "lateArrivals": 3,
    "locationsVisited": 2,
    "totalDurationMinutes": 11520
  }
}
```

---

### 6. Get Employee Daily Timeline
**Endpoint:** `GET /attendance/employees/:employeeId/timeline`

**Purpose:** Get detailed daily attendance timeline for an employee on a specific date.

**Path Parameters:**
```
employeeId     (required) - Employee's unique ID
```

**Query Parameters:**
```
date           (required) - YYYY-MM-DD format
timezone       (optional) - Timezone string (default: UTC)
```

**Response Schema:**
```typescript
{
  "status": "success",
  "statusCode": 200,
  "data": {
    "employeeId": "string",
    "date": "2024-04-27",
    "timezone": "UTC",
    "events": [
      {
        "eventId": "string",
        "timestamp": "2024-04-27T09:30:45Z",
        "type": "ENTRY",
        "cameraId": "cam_001",
        "cameraCode": "MAIN_GATE",
        "cameraName": "Main Gate",
        "confidence": 0.95,
        "status": "VERIFIED",
        "source": "FACE_AI",
        "note": "Optional notes"
      },
      ...
    ],
    "computed": {
      "firstEntryAt": "2024-04-27T09:30:45Z",
      "lastExitAt": "2024-04-27T18:00:00Z",
      "entriesCount": 1,
      "exitsCount": 1,
      "totalDurationMinutes": 510,
      "breakDurationMinutes": 30,
      "sessionStatus": "COMPLETED",
      "flags": []
    }
  }
}
```

---

### 7. Get Employee Monthly Calendar
**Endpoint:** `GET /attendance/employees/:employeeId/calendar`

**Purpose:** Get calendar view of attendance for an employee's month.

**Path Parameters:**
```
employeeId     (required) - Employee's unique ID
```

**Query Parameters:**
```
month          (required) - YYYY-MM format
timezone       (optional) - Timezone string (default: UTC)
```

**Response Schema:**
```typescript
{
  "status": "success",
  "statusCode": 200,
  "data": {
    "employeeId": "string",
    "month": "2024-04",
    "days": [
      {
        "date": "2024-04-01",
        "status": "PRESENT" | "ABSENT" | "PARTIAL" | "HOLIDAY",
        "firstEntryAt": "2024-04-01T09:30:45Z",
        "lastExitAt": "2024-04-01T18:00:00Z",
        "durationMinutes": 510,
        "hasAnomaly": false,
        "flags": []
      },
      ...
    ]
  }
}
```

---

### 8. Export Employee Attendance History
**Endpoint:** `GET /attendance/employees/:employeeId/export`

**Purpose:** Export attendance history as file (CSV or XLSX).

**Path Parameters:**
```
employeeId     (required) - Employee's unique ID
```

**Query Parameters:**
```
from           (required) - Start date in YYYY-MM-DD format
to             (required) - End date in YYYY-MM-DD format
timezone       (optional) - Timezone string (default: UTC)
format         (optional) - csv|xlsx (default: csv)
```

**Example Request:**
```bash
GET /attendance/employees/emp_123/export?from=2024-04-01&to=2024-04-30&format=csv
```

**Response:**
- Returns a file blob with content-type `application/csv` or `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- Filename: `attendance_emp_123_2024-04-01_2024-04-30.csv`

### 9. Export Attendance Report (All Employees or Selected Employees)
**Endpoint:** `POST /attendance/reports/export`

**Purpose:** Generate a downloadable report from the `/attendance` page modal. This endpoint supports both a full attendance report for all employees and an employee-wise report for a selected subset of employees.

**Request Body:**
```typescript
{
  "date": "2026-04-28",                 // Required: report date in YYYY-MM-DD format
  "scope": "ALL_EMPLOYEES" | "SELECTED_EMPLOYEES",
  "format": "csv" | "xlsx",           // Optional, default: csv
  "employeeIds": ["emp_101", "emp_205"], // Required when scope = SELECTED_EMPLOYEES
  "department": "Engineering",         // Optional: filter to one department
  "registeredOnly": true,                // Optional, default: true
  "includeUnregistered": false,         // Optional, default: false
  "timezone": "Asia/Kolkata"           // Optional, default: UTC
}
```

**Behavior:**
- `scope = ALL_EMPLOYEES` produces one file containing every matched employee for the chosen date.
- `scope = SELECTED_EMPLOYEES` produces a report only for the supplied `employeeIds`.
- If `registeredOnly = true`, the backend must exclude unresolved or unknown faces from the export.
- If `includeUnregistered = true`, the backend may include unknown rows, but that should be an explicit admin/audit use case.

**Response:**
- Returns a file blob.
- `Content-Type` should be either `application/csv` or `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`.
- Suggested filename pattern:
  - `attendance-report-all-employees-2026-04-28.csv`
  - `attendance-report-employees-3-2026-04-28.xlsx`

**Recommended CSV/XLSX columns:**
- `employeeId`
- `employeeCode`
- `employeeName`
- `department`
- `role`
- `date`
- `firstEntryAt`
- `lastSeenAt`
- `totalWorkDurationMinutes`
- `breakDurationMinutes`
- `currentStatus`
- `flags`
- `present`
- `lateArrival`
- `earlyExit`

**Frontend modal flow:**
- Open the modal from `Export Report`.
- Pick the report date.
- Choose `All employees report` or `Employee-wise report`.
- If employee-wise, search and select one or more employees.
- Pick `CSV` or `XLSX`.
- Click `Download report`.

---

## Query Parameters

### Common Filters

| Parameter | Type | Format | Example | Notes |
|-----------|------|--------|---------|-------|
| `date` | string | YYYY-MM-DD | `2024-04-27` | Single day query |
| `dateFrom` | string | YYYY-MM-DD | `2024-04-01` | Range start (inclusive) |
| `dateTo` | string | YYYY-MM-DD | `2024-04-30` | Range end (inclusive) |
| `employeeId` | string | UUID or code | `emp_123` | Filter by employee |
| `department` | string | name | `Engineering` | Filter by department |
| `eventType` | string | ENTRY,EXIT | `ENTRY,EXIT` | Comma-separated |
| `status` | string | VERIFIED,UNKNOWN,SUSPICIOUS | `VERIFIED` | Comma-separated |
| `limit` | number | 1-500 | `50` | Records per page |
| `offset` | number | >= 0 | `0` | Pagination offset |
| `sortBy` | string | timestamp\|employeeName\|gate | `timestamp` | Sort field |
| `sortOrder` | string | asc\|desc | `desc` | Sort direction |
| `timezone` | string | IANA format | `Asia/Kolkata` | Timezone for timestamps |

---

## Response Formats

### Success Response
```json
{
  "status": "success",
  "statusCode": 200,
  "data": { /* actual data */ },
  "message": "Operation completed successfully"
}
```

### Error Response
```json
{
  "status": "error",
  "statusCode": 400,
  "message": "Invalid date format. Expected YYYY-MM-DD",
  "error": {
    "code": "INVALID_DATE_FORMAT",
    "details": "Date parameter must be in YYYY-MM-DD format"
  }
}
```

---

## Error Handling

### HTTP Status Codes

| Status | Meaning | Use Case |
|--------|---------|----------|
| 200 | OK | Request succeeded |
| 400 | Bad Request | Invalid parameters, missing required fields |
| 401 | Unauthorized | Missing/invalid authentication token |
| 403 | Forbidden | User doesn't have permission |
| 404 | Not Found | Employee or resource not found |
| 422 | Unprocessable Entity | Validation error |
| 500 | Internal Server Error | Server-side error |
| 503 | Service Unavailable | Temporary service issue |

### Error Codes

```
INVALID_DATE_FORMAT       - Date not in YYYY-MM-DD format
INVALID_PARAMETERS        - One or more parameters invalid
EMPLOYEE_NOT_FOUND        - Employee ID doesn't exist
UNAUTHORIZED_ACCESS       - No permission to access resource
INTERNAL_SERVER_ERROR     - Unexpected server error
```

---

## Implementation Notes

### Database Considerations

1. **Indexing**: Create indexes on:
   - `attendance_events.date` (or timestamp range)
   - `attendance_events.employee_id`
   - `attendance_events.department`
   - `attendance_events.status`
   - `attendance_events.type`
   - `attendance_events.created_at` or `timestamp`

2. **Performance**:
   - Implement pagination to handle large result sets
   - Cache stats calculation (refresh every 5-10 minutes)
   - Use database cursors for very large date ranges

3. **Data Retention**:
   - Keep detailed event records for at least 2 years
   - Archive old events to separate storage
   - Implement soft-deletes for audit trail

### Timezone Handling

1. Store all timestamps in UTC in the database
2. Convert to requested timezone only in API response
3. Support common IANA timezone identifiers
4. Default to UTC if not specified

### Pagination Strategy

1. Use limit/offset for UI pagination (frontend)
2. For large datasets (> 10,000 records), consider cursor-based pagination
3. Maximum limit: 500 records per request
4. Return `hasMore` flag to indicate more records exist

### Caching Strategy

- Cache daily stats for 2-5 minutes
- Cache employee profile for 1 hour
- Invalidate cache on new event creation
- Use ETag headers for conditional requests

### Rate Limiting

- Recommend: 1000 requests per minute per user
- Implement exponential backoff for clients
- Return `Retry-After` header on rate limit

---

## Example Implementation Checklist

- [ ] Create attendance_events table with proper indexes
- [ ] Implement GET `/attendance/date` endpoint
- [ ] Implement GET `/attendance/range` endpoint
- [ ] Implement GET `/attendance/events` endpoint
- [ ] Implement GET `/attendance/today/:employeeId` endpoint
- [ ] Implement GET `/attendance/employees/:employeeId/summary` endpoint
- [ ] Implement GET `/attendance/employees/:employeeId/timeline` endpoint
- [ ] Implement GET `/attendance/employees/:employeeId/calendar` endpoint
- [ ] Implement GET `/attendance/employees/:employeeId/export` endpoint
- [ ] Add proper error handling and validation
- [ ] Add request/response logging
- [ ] Add database indexes
- [ ] Add caching layer
- [ ] Add unit tests
- [ ] Add integration tests
- [ ] Document edge cases and limitations
- [ ] Set up monitoring and alerts

---

## Frontend Integration

The frontend will use these APIs as follows:

### Main Attendance Page (`/attendance`)
- **On Load**: Calls `GET /attendance/date?date={today}` to show today's records
- **Date Change**: Calls `GET /attendance/date?date={selectedDate}` with current filters
- **Filter Application**: Calls `GET /attendance/date?date={date}&{filters}` with updated filters
- **Export**: Calls `GET /attendance/employees/{id}/export?from=&to=&format=csv`

### Employee Session Drawer
- **On Click**: Calls `GET /attendance/today/{employeeId}` to show full session details

### Performance Targets
- Initial load: < 2 seconds
- Filter application: < 1 second
- Export generation: < 5 seconds

