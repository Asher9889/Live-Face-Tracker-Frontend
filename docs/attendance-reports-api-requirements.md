# Attendance Reports Route - Backend API Requirements

## Status

✅ **Backend: IMPLEMENTED**

All backend APIs are implemented with validators, route handlers, service logic, and standardized response envelopes. See Section 5 for exact endpoint contracts and TypeScript types.

⏳ **Frontend: AWAITING INTEGRATION**

Frontend mock services need to be replaced with real API calls. See Section 12 for integration checklist.

---

## Response Envelope (Quick Reference)

All endpoints return this structure:

```typescript
type ApiResponse<T> = {
  status: "success" | "error";
  statusCode: number;
  data?: T;
  message?: string;
  errors?: Array<{ field?: string; message: string }>;
}
```

**Base URL:** `/api/v1/attendance`

---

## 1. Scope and Goal

This document defines the API contracts required to fully power the route:
- /attendance/reports

Frontend route source:
- src/pages/Attendance/Reports/index.tsx

The page currently uses mock APIs for report data and employee timeline, and a real API for employee name search. Backend implementation has replaced all mock services with stable, paginated, filterable reporting APIs.

---

## 2. Current Frontend Behavior (Exact)

### 2.1 Route wiring

- Route path: /attendance/reports
- Registered in: src/App.tsx
- Entry button from attendance dashboard navigates with state.initialDate: src/pages/Attendance/index.tsx

### 2.2 Data fetching model

The report workspace calls a custom hook:
- src/pages/Attendance/Reports/hooks/useAttendanceReports.ts

Current behavior:
- Reads mode/date/month from URL query params.
- Keeps mode/date/month synced to URL.
- On filter change, requests in parallel:
  - analytics summary
  - report table data (daily, monthly, or custom)
- Resets selected rows when data changes.

Important: this hook currently calls mock service methods from:
- src/pages/Attendance/Reports/services/mockReports.ts

### 2.3 Real API currently used

Employee autocomplete uses real backend API:
- src/pages/Attendance/Reports/hooks/useEmployeeSearchByName.ts
- src/pages/Attendance/Reports/api/report.api.ts
- endpoint source: src/config/endpoints.ts -> employee.searchEmployeeByName

### 2.4 UI modules requiring backend data

- Toolbar and mode switching: src/pages/Attendance/Reports/components/ReportToolbar.tsx
- Filters: src/pages/Attendance/Reports/components/ReportFilters.tsx
- Summary metrics cards: src/pages/Attendance/Reports/components/SummaryCards.tsx
- Data table (daily/monthly/custom): src/pages/Attendance/Reports/components/AttendanceReportTable.tsx
- Employee timeline drawer: src/pages/Attendance/Reports/components/EmployeeTimelineDrawer.tsx
- Export action bar: src/pages/Attendance/Reports/components/ExportActionBar.tsx

---

## 3. All Filter Inputs Frontend Can Send

From ReportFilters component and hook state:
- mode: daily | monthly | custom
- date: YYYY-MM-DD (daily)
- month: YYYY-MM (monthly)
- startDate: YYYY-MM-DD (custom)
- endDate: YYYY-MM-DD (custom)
- employeeId: internal employee id
- employeeName: free text (search input)
- department: currently string or all
- status: Present | Absent | Late | Half Day
- lateOnly: boolean
- missingExitOnly: boolean

Notes:
- Department list is currently hardcoded in frontend constants.
- Clear action may send employeeId as empty string. Backend should treat empty string as no filter.
- Search input updates employeeName immediately; selected suggestion sets both employeeName and employeeId.

---

## 4. Data Contracts Required by UI

## 4.1 Summary cards contract

Required fields:
- present: number
- absent: number
- late: number
- missingExit: number
- avgHours: string (for example 8h 15m)
- totalEmployees: number

Source type used by frontend:
- src/pages/Attendance/Reports/types.ts -> AnalyticsSummary

## 4.2 Daily/custom table row contract

Required fields per row:
- id: string (stable unique row id)
- employeeId: string
- name: string
- avatar: string | optional
- department: string
- entryTime: string | null
- exitTime: string | null
- workHours: string | null
- status: Present | Absent | Late | Half Day
- lateStatus: boolean
- missingExit: boolean

Source type:
- src/pages/Attendance/Reports/types.ts -> DailyReportRow

## 4.3 Monthly table row contract

Required fields per row:
- id: string
- employeeId: string
- name: string
- avatar: string | optional
- department: string
- presentDays: number
- absentDays: number
- lateCount: number
- avgWorkHours: string
- overtimeDays: number
- missingExits: number

Source type:
- src/pages/Attendance/Reports/types.ts -> MonthlyReportRow

## 4.4 Employee timeline drawer contract

Required response shape:
- employee:
  - id
  - employeeId
  - name
  - avatar (optional)
  - department
  - role
- monthlyStats:
  - present
  - absent
  - late
- events[]:
  - id
  - type: ENTRY_DETECTED | EXIT_PENDING | EXIT_CANCELLED | EXIT_CONFIRMED | SYSTEM_RECOVERY
  - timestamp
  - cameraSource (optional)
  - confidence (optional)
  - statusBadge: success | warning | error | info | default

Source type:
- src/pages/Attendance/Reports/types.ts -> EmployeeTimeline

---

## 5. Implemented Backend Endpoints

Base URL: `/api/v1/attendance`

All endpoints use the standardized response envelope (see Section 8).

### 5.1 Employee search

**Endpoint:** `GET /employees/search`

**Query Parameters:**
- `name` (string, required) – Employee name search term
- `limit` (number, optional, default 10) – Max results

**Response:**
```json
{
  "status": "success",
  "statusCode": 200,
  "data": [
    {
      "id": "emp_123",
      "name": "Alice Smith",
      "department": "Engineering",
      "role": "Senior Developer"
    }
  ]
}
```

### 5.2 Reports Analytics Summary

**Endpoint:** `GET /attendance/reports/summary`

**Query Parameters:**
- `mode` (string, required) – One of: `daily`, `monthly`, `custom`
- `date` (string, YYYY-MM-DD, required if `mode=daily`)
- `month` (string, YYYY-MM, required if `mode=monthly`)
- `startDate` (string, YYYY-MM-DD, required if `mode=custom`)
- `endDate` (string, YYYY-MM-DD, required if `mode=custom`)
- `employeeId` (string, optional) – Filter by employee; empty string = no filter
- `department` (string, optional) – Filter by department; empty or "all" = no filter
- `status` (string, optional) – One of: `Present`, `Absent`, `Late`, `Half Day`
- `lateOnly` (boolean, optional, default false)
- `missingExitOnly` (boolean, optional, default false)
- `timezone` (string, optional, default "Asia/Kolkata") – IANA timezone

**Response Shape:**
```typescript
type ReportsSummaryData = {
  present: number;        // count
  absent: number;         // count
  late: number;           // count
  avgHours: string;       // formatted "8h 12m"
  missingExit: number;    // count
  overtime: number;       // count
  totalEmployees: number; // count
}
```

**Example Response:**
```json
{
  "status": "success",
  "statusCode": 200,
  "data": {
    "present": 120,
    "absent": 5,
    "late": 9,
    "avgHours": "8h 12m",
    "missingExit": 2,
    "overtime": 14,
    "totalEmployees": 125
  }
}
```

### 5.3 Reports Rows Dataset

**Endpoint:** `GET /attendance/reports/rows`

**Query Parameters:**
- All filter params from summary endpoint (mode, date, month, startDate, endDate, employeeId, department, status, lateOnly, missingExitOnly, timezone)
- `employeeName` (string, optional) – Backend may fuzzy match
- `page` (number, optional, default 1)
- `pageSize` (number, optional, default 25, max 200)
- `sortBy` (string, optional) – Sort field
- `sortOrder` (string, optional) – One of: `asc`, `desc` (default `asc`)

**Response Shape (Daily/Custom):**
```typescript
type ReportRowDaily = {
  id: string;            // stable unique id, e.g. "daily_2026-05-11_emp_123"
  employeeId: string;
  name: string;
  avatar?: string | null;
  department?: string | null;
  entryTime?: string | null; // ISO timestamp
  exitTime?: string | null;  // ISO timestamp
  workHours?: string | null; // formatted "8h 12m"
  status: "Present" | "Absent" | "Late" | "Half Day";
  lateStatus: boolean;
  missingExit: boolean;
}

type ReportRowMonthly = {
  id: string;
  employeeId: string;
  name: string;
  avatar?: string | null;
  department?: string | null;
  presentDays: number;
  absentDays: number;
  lateCount: number;
  avgWorkHours: string;   // formatted "7h 45m"
  overtimeDays: number;
  missingExits: number;
}

type ReportsRowsData<T = ReportRowDaily | ReportRowMonthly> = {
  mode: "daily" | "monthly" | "custom";
  rows: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  }
}
```

**Example Response (Daily):**
```json
{
  "status": "success",
  "statusCode": 200,
  "data": {
    "mode": "daily",
    "rows": [
      {
        "id": "daily_2026-05-11_emp_123",
        "employeeId": "emp_123",
        "name": "Alice Smith",
        "avatar": null,
        "department": "Engineering",
        "entryTime": "2026-05-11T09:12:00+05:30",
        "exitTime": "2026-05-11T18:05:00+05:30",
        "workHours": "8h 53m",
        "status": "Present",
        "lateStatus": false,
        "missingExit": false
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "total": 125,
      "totalPages": 5
    }
  }
}
```

**Notes:**
- For `mode=monthly`, rows conform to `ReportRowMonthly` shape
- Backend returns ISO timestamps; frontend may localize further for UI rendering

### 5.4 Employee Timeline Drawer

**Endpoint:** `GET /attendance/reports/employees/:employeeId/timeline`

**Path Parameters:**
- `employeeId` (string, required) – Employee identifier

**Query Parameters:**
- `date` (string, YYYY-MM-DD, optional) – Defaults to current date
- `month` (string, YYYY-MM, optional) – Defaults to current month
- `timezone` (string, optional, default "Asia/Kolkata") – IANA timezone

**Response Shape:**
```typescript
type EmployeeTimelineEvent = {
  id: string;
  type: "ENTRY_DETECTED" | "EXIT_PENDING" | "EXIT_CANCELLED" | "EXIT_CONFIRMED" | "SYSTEM_RECOVERY";
  timestamp: string; // ISO
  cameraSource?: string | null;
  confidence?: number | null; // percentage or score
  statusBadge: "success" | "warning" | "error" | "info" | "default";
}

type EmployeeTimelineData = {
  employee: {
    id: string; // database id
    employeeId: string; // stable employee code
    name: string;
    avatar?: string | null;
    department?: string | null;
    role?: string | null;
  };
  monthlyStats: {
    present: number;
    absent: number;
    late: number;
  };
  events: EmployeeTimelineEvent[];
}
```

**Example Response:**
```json
{
  "status": "success",
  "statusCode": 200,
  "data": {
    "employee": {
      "id": "60a...",
      "employeeId": "EMP_123",
      "name": "Alice Smith",
      "avatar": null,
      "department": "Engineering",
      "role": "Senior Dev"
    },
    "monthlyStats": {
      "present": 21,
      "absent": 1,
      "late": 2
    },
    "events": [
      {
        "id": "evt_1",
        "type": "ENTRY_DETECTED",
        "timestamp": "2026-05-11T08:45:00+05:30",
        "cameraSource": "Main Entrance Cam",
        "confidence": 98.5,
        "statusBadge": "success"
      }
    ]
  }
}
```

### 5.5 Reports Export

**Endpoint:** `POST /attendance/reports/export`

**Request Body:**
```typescript
type ReportsExportRequest = {
  mode: "daily" | "monthly" | "custom";
  date?: string;           // YYYY-MM-DD (required if mode=daily)
  month?: string;          // YYYY-MM (required if mode=monthly)
  startDate?: string;      // YYYY-MM-DD (required if mode=custom)
  endDate?: string;        // YYYY-MM-DD (required if mode=custom)
  scope: "ALL_ROWS" | "SELECTED_ROWS" | "SELECTED_EMPLOYEES";
  rowIds?: string[];       // required if scope=SELECTED_ROWS
  employeeIds?: string[];  // required if scope=SELECTED_EMPLOYEES
  filters?: {
    employeeId?: string;
    employeeName?: string;
    department?: string;
    status?: string;
    lateOnly?: boolean;
    missingExitOnly?: boolean;
  };
  format?: "csv" | "xlsx";  // default "csv"
  timezone?: string;        // default "Asia/Kolkata"
  registeredOnly?: boolean; // default true
}
```

**Response (Synchronous):**
- Content-Type: `text/csv` or `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- Binary file payload with appropriate `Content-Disposition` header

**Response (Asynchronous/Queued):**
```json
{
  "status": "success",
  "statusCode": 202,
  "data": {
    "jobId": "exp_abc123",
    "status": "QUEUED"
  }
}
```

---

## 6. Existing Backend APIs That Can Be Reused

From src/config/endpoints.ts and attendance API client:

Already available and useful:
- GET /employees/search?name=...
- GET /attendance/employees/:employeeId/timeline
- POST /attendance/reports/export

Also available in attendance module:
- GET /attendance/current-state
- GET /attendance/date
- GET /attendance/range

Potential reuse strategy:
- Build /attendance/reports/summary and /attendance/reports/rows as optimized report endpoints.
- Or compose from /attendance/date and /attendance/range internally in backend service layer.

---

## 7. Request Validation Rules (Backend)

## 7.1 Mode-specific required fields

- mode=daily -> date required
- mode=monthly -> month required
- mode=custom -> startDate and endDate required

## 7.2 Date constraints

- startDate <= endDate
- custom range max window recommended (for example 92 days) to avoid heavy queries

## 7.3 Filter sanitation

- Treat empty string values as undefined (especially employeeId)
- department=all should map to no department filter
- status should only allow enum: Present, Absent, Late, Half Day

## 7.4 Pagination safety

- enforce pageSize max
- stable default sort for deterministic pagination

---

## 8. Response Envelope and Error Contract

All endpoints use the standardized envelope format:

**Success Response:**
```typescript
type ApiResponse<T> = {
  status: "success";
  statusCode: number;
  data: T;
  message?: string;
}
```

**Error Response:**
```typescript
type ApiErrorResponse = {
  status: "error";
  statusCode: number;
  message: string;
  errors?: Array<{ field?: string; message: string }>;
}
```

Frontend axios layer (src/config/axios.ts) expects:
- successful data accessible at `response.data.data`
- error message accessible at `response.data.message` for normalized Error

**HTTP Status Codes:**
- `200 OK` – Successful request
- `202 Accepted` – Export queued for async processing
- `400 Bad Request` – Invalid query/body parameters (includes validation errors in `errors` array)
- `401 Unauthorized` – Missing or invalid authentication token
- `403 Forbidden` – User lacks permission for resource
- `404 Not Found` – Employee not found (timeline endpoint)
- `422 Unprocessable Entity` – Semantic validation failed (e.g., invalid date range)
- `500 Internal Server Error` – Server-side failure

**Example Error Response:**
```json
{
  "status": "error",
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    { "field": "endDate", "message": "endDate must be after startDate" },
    { "field": "pageSize", "message": "pageSize must not exceed 200" }
  ]
}
```

---

## 9. Timezone and Formatting Requirements

- Accept timezone query/body field (IANA format, for example Asia/Kolkata).
- Compute late, missing exit, work hours, and monthly rollups in that timezone.
- Prefer returning raw ISO timestamps plus optional formatted fields.
- If returning formatted fields only, keep format stable because table renders string directly.

---

## 10. Performance Expectations

Minimum recommendations:
- Employee search p95 < 300 ms for top 10 results.
- Reports summary + rows should support parallel load.
- Add indexes for:
  - employee id
  - event date
  - department
  - status/flags used by lateOnly and missingExitOnly filters

Caching suggestions:
- summary response can be short-cached by filter hash for 15 to 60 seconds
- employee search can be cached for short TTL

---

## 11. Security and Access Control

- Require authenticated user for all report endpoints.
- Enforce role permissions for report export if needed.
- Prevent unrestricted PII leakage in search endpoint for non-admin roles.
- Audit log export actions with requester, filter scope, and timestamp.

---

## 12. Backend Implementation Status

✅ All mandatory endpoints are now implemented in backend:
- GET /attendance/reports/summary
- GET /attendance/reports/rows
- GET /attendance/reports/employees/:employeeId/timeline
- POST /attendance/reports/export
- GET /employees/search?name=...

Backend includes:
- Route validators (schema validation for all query/body params)
- Service layer logic (aggregations, filtering, pagination)
- Response envelopes (standardized status/statusCode/data/message format)
- Error handling (400, 401, 403, 404, 422, 500 status codes)

### Frontend Integration Remaining

These are frontend wiring tasks, not backend blockers:

1. **Replace mock APIs in useAttendanceReports hook** (src/pages/Attendance/Reports/hooks/useAttendanceReports.ts)
   - Replace `mockApi.getAnalyticsSummary()` with real GET /attendance/reports/summary
   - Replace `mockApi.getDailyReport()` with real GET /attendance/reports/rows
   - Replace `mockApi.getMonthlyReport()` with real GET /attendance/reports/rows (mode=monthly)
   - Replace `mockApi.getCustomRangeReport()` with real GET /attendance/reports/rows (mode=custom)

2. **Replace mock timeline in EmployeeTimelineDrawer** (src/pages/Attendance/Reports/components/EmployeeTimelineDrawer.tsx)
   - Replace `mockApi.getEmployeeTimeline()` with real GET /attendance/reports/employees/:employeeId/timeline

3. **Wire export API** (src/pages/Attendance/Reports/index.tsx)
   - Implement actual POST /attendance/reports/export call when export buttons are clicked
   - Handle file download for CSV/XLSX formats or track export job status for async processing

4. **Optional: Dynamic department list**
   - Replace hardcoded DEPARTMENTS constant with GET /departments endpoint (if implemented)

### Known UI Gaps (Not Blockers)

These will be resolved during frontend integration:

1. Error from useAttendanceReports is not rendered in UI currently
2. URL sync currently includes mode/date/month but not other filters
3. Quick preset chips currently switch mode only, not date ranges
4. Export buttons show toast only; no API call wired yet

Backend can proceed with full API implementation; frontend wiring can begin immediately.

---

## 13. Final API Checklist for Frontend Implementation

### Mandatory APIs (✅ Backend Implemented)

- ✅ GET /attendance/reports/summary
- ✅ GET /attendance/reports/rows
- ✅ GET /attendance/reports/employees/:employeeId/timeline
- ✅ POST /attendance/reports/export
- ✅ GET /employees/search?name=...

### Recommended Helper Endpoints (Optional)

- GET /departments (to replace hardcoded frontend list)

### Future Enhancement Endpoints

- GET /attendance/reports/presets (server-defined quick filters)
- POST /attendance/reports/scheduled (scheduled report generation)
- GET /attendance/reports/export/:jobId (check async export status)

### Frontend Wiring Checklist

- [ ] Update src/pages/Attendance/Reports/api/report.api.ts with real API calls
- [ ] Replace mock calls in useAttendanceReports hook
- [ ] Replace mock timeline call in EmployeeTimelineDrawer
- [ ] Wire export button handlers to POST /attendance/reports/export
- [ ] Handle file download for CSV/XLSX responses
- [ ] Add error boundary/toast for API failures
- [ ] Test all filter combinations (daily, monthly, custom modes)
- [ ] Validate timezone handling on client-side rendering

---

## 15. Frontend Implementation Guide

### Quick Start for API Integration

1. **Create a new API module** (src/pages/Attendance/Reports/api/attendance-reports.api.ts):
   ```typescript
   import { api } from "@/config";
   
   async function getReportsSummary(params: GetReportsSummaryParams) {
     const response = await api.request({
       url: "/attendance/reports/summary",
       method: "GET",
       params
     });
     return response.data.data;
   }
   
   async function getReportsRows(params: GetReportsRowsParams) {
     const response = await api.request({
       url: "/attendance/reports/rows",
       method: "GET",
       params
     });
     return response.data.data;
   }
   
   async function getEmployeeTimeline(employeeId: string, params?: TimelineParams) {
     const response = await api.request({
       url: `/attendance/reports/employees/${employeeId}/timeline`,
       method: "GET",
       params
     });
     return response.data.data;
   }
   
   async function exportReports(data: ReportsExportRequest) {
     const response = await api.request({
       url: "/attendance/reports/export",
       method: "POST",
       data,
       responseType: "blob"
     });
     return response.data;
   }
   ```

2. **Update useAttendanceReports hook**:
   - Import the new API functions
   - Replace all `mockApi.*` calls with real functions
   - Keep all state management and URL sync logic as-is

3. **Update EmployeeTimelineDrawer**:
   - Replace `getEmployeeTimeline()` mock call with real API function
   - Maintain the same data handling and UI rendering

4. **Implement export handler in Reports index**:
   - Wire `handleExport()` to call `exportReports()`
   - Trigger file download for synchronous responses
   - Track job ID for asynchronous responses

### Important Implementation Notes

**Query Parameter Handling:**
- Only pass parameters that have values (avoid empty strings, null, undefined)
- Backend treats empty `employeeId` as no filter; don't send it if empty
- `department="all"` should be sent as-is; backend maps it

**Error Handling:**
- Wrap API calls in try-catch
- Display error message from `response.data.message`
- Show validation errors from `response.data.errors` array

**Timezone Handling:**
- Read user's timezone from browser or settings
- Pass timezone in every API request for consistent results
- Backend returns ISO timestamps; format on client for display

**Pagination:**
- Render pagination UI using `pagination.page`, `pagination.totalPages`
- Maintain page state when filters change (or reset to page 1)
- Max pageSize is 200; default is 25

**File Download (Export):**
```typescript
const downloadBlob = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  window.URL.revokeObjectURL(url);
};
```

### Data Flow Diagram

```
ReportsWorkspace (index.tsx)
  ↓
useAttendanceReports hook
  ├─ getReportsSummary() → SummaryCards
  ├─ getReportsRows() → AttendanceReportTable
  └─ getEmployeeTimeline() ← EmployeeTimelineDrawer (on row click)

ExportActionBar
  └─ exportReports() → file download or job tracking
```

### Testing Checklist

- [ ] Load Reports page with each mode (daily, monthly, custom)
- [ ] Apply all filters independently and combined
- [ ] Verify pagination works (navigate pages, change pageSize)
- [ ] Click employee row to open timeline drawer
- [ ] Select rows and export as CSV/XLSX
- [ ] Test with different timezones
- [ ] Verify error handling (network failure, 404, validation error)
- [ ] Test concurrent requests (summary + rows in parallel)

---

## Notes for Backend Developers

**If frontend encounters issues:**

1. **Error 401 Unauthorized** – Check JWT token refresh in axios interceptor
2. **CORS errors** – Verify backend is configured to allow frontend origin
3. **404 on export** – Ensure POST /attendance/reports/export route is registered
4. **Slow responses** – Add database indexes on: employee_id, event_date, department, status
5. **Empty timeline** – Verify `includeMonthlyStats` or similar flag in timeline endpoint

**Future enhancements:**
- Implement GET /attendance/reports/export/:jobId for async job status
- Add webhook or polling mechanism for large exports
- Cache summary responses by filter hash (15-60 second TTL)
- Support custom report scheduling via POST /attendance/reports/scheduled

---

If backend follows this contract, frontend can replace mock services with real APIs with minimal refactor and stable behavior across daily, monthly, and custom report modes.
