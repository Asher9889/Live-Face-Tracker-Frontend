# Monthly Attendance Reports — API Contract

This document describes the API contract required for implementing the Monthly Reports flow used by the frontend. Copy-paste into your backend IDE or repo.

---

## Global

- Base path: `/api/v1/attendance`
- Auth: `Authorization: Bearer <JWT>` (401 for unauthenticated)
- Response envelope (JSON):

```ts
type ApiResponse<T> = {
  status: "success" | "error";
  statusCode: number;
  data?: T;
  message?: string;
  errors?: Array<{ field?: string; message: string }>;
}
```

- Timezone query param: `timezone` (IANA). Default: `Asia/Kolkata`.
- Date formats:
  - `date` = `YYYY-MM-DD`
  - `month` = `YYYY-MM`

---

## 1) GET /attendance/reports/summary

Purpose: analytics summary for current report view (daily / monthly / custom).

Query params:
- `mode`: `daily` | `monthly` | `custom` (required)
- `month`: `YYYY-MM` (required when `mode=monthly`)
- `date` / `startDate` / `endDate` as applicable
- `employeeId?`, `employeeName?`, `department?`, `status?`
- `lateOnly?` (boolean), `missingExitOnly?` (boolean)
- `timezone?`

Validation rules:
- `mode` required.
- `month` required when `mode=monthly`; must match `/^\d{4}-\d{2}$/`.
- Return 400/422 with `errors` on validation failure.

Response `data` shape:

```ts
type ReportsSummaryData = {
  present: number;
  absent: number;
  late: number;
  avgHours: string;       // e.g. "8h 12m"
  missingExit: number;
  overtime: number;
  totalEmployees: number;
}
```

Example:

```json
200 {
  "status": "success",
  "statusCode": 200,
  "data": { "present":120, "absent":5, "late":9, "avgHours":"8h 12m", "missingExit":2, "overtime":14, "totalEmployees":125 }
}
```

---

## 2) GET /attendance/reports/rows

Purpose: paginated table rows for the selected mode (daily/monthly/custom).

Query params:
- `mode`: `daily` | `monthly` | `custom` (required)
- `month`: `YYYY-MM` (required when `mode=monthly`)
- `date` / `startDate` / `endDate` as applicable
- `employeeId?`, `employeeName?`, `department?`, `status?`
- `lateOnly?`, `missingExitOnly?`
- `page?` (default 1), `pageSize?` (default 25, max 200)
- `sortBy?`, `sortOrder?` (`asc` | `desc`, default `asc`)
- `timezone?`

Validation:
- sanitize `page`/`pageSize`; enforce max 200.

Response `data` shapes:

```ts
type ReportRowDaily = {
  id: string;
  employeeId: string;
  name: string;
  avatar?: string | null;
  department?: string | null;
  entryTime?: string | null;   // ISO
  exitTime?: string | null;    // ISO
  lastSeenAt?: string | null;  // ISO
  workHours?: string | null;   // "8h 12m"
  status: "Present" | "Absent" | "Late" | "Half Day";
  currentStatus: "In" | "Out";
  lateStatus: boolean;
  missingExit: boolean;
};

type ReportRowMonthly = {
  id: string;
  employeeId: string;
  name: string;
  avatar?: string | null;
  department?: string | null;
  presentDays: number;
  absentDays: number;
  lateCount: number;
  avgWorkHours: string;
  overtimeDays: number;
  missingExits: number;
};

type ReportsRowsData<T = ReportRowDaily | ReportRowMonthly> = {
  mode: "daily" | "monthly" | "custom";
  rows: T[];
  pagination: { page: number; pageSize: number; total: number; totalPages: number };
}
```

Example (monthly):

```json
200 {
  "status": "success",
  "statusCode": 200,
  "data": {
    "mode":"monthly",
    "rows":[
      { "id":"m_2026-05_emp_123", "employeeId":"emp_123", "name":"Alice", "presentDays":20, "absentDays":1, "lateCount":2, "avgWorkHours":"7h 45m", "overtimeDays":1, "missingExits":0 }
    ],
    "pagination":{ "page":1, "pageSize":25, "total":125, "totalPages":5 }
  }
}
```

Notes:
- If `employeeId` present, filter exactly by id. `employeeName` is optional context.
- All timestamps must be ISO strings (UTC or with offset); frontend will format.

---

## 3) GET /attendance/reports/employees/:employeeId/timeline

Purpose: employee audit trail. Accepts `date` for daily and `month` for monthly overview.

Path param: `employeeId` (required)

Query params:
- `date?: YYYY-MM-DD`
- `month?: YYYY-MM`
- `timezone?: string`

Validation: require either `date` or `month`. If both provided, prefer `date`.

Response shape:

```ts
type EmployeeTimelineEvent = {
  id: string;
  type: "ENTRY" | "EXIT" | "SYSTEM";   // coarse type
  eventName: string;                       // e.g. "ENTRY_DETECTED", "FACE_DETECTED", "EXIT_CONFIRMED"
  timestamp: string;                       // ISO
  cameraSource?: string | null;
  confidence?: number | null;              // decimal 0-1 or 0-100; frontend normalizes
  statusBadge: "success" | "warning" | "error" | "info" | "default";
};

type EmployeeTimelineData = {
  employee: { id:string; employeeId:string; name:string; avatar?:string|null; department?:string|null; role?:string|null };
  monthlyStats?: { present:number; absent:number; late:number };
  events: EmployeeTimelineEvent[];
}
```

Example (month):

```bash
GET /api/v1/attendance/reports/employees/69ec59eea047aa9eff3065fa/timeline?month=2026-05&timezone=Asia/Kolkata
```

Return events spanning the month; frontend will render timestamps and use `eventName` and `confidence` where available.

---

## 4) GET /employee/search

Purpose: suggestion endpoint for employee input (frontend calls only while typing; frontend calls after suggestion selected to fetch rows).

Query params:
- `name`: string (required; call when typed >=2 chars)
- `limit?` (default 10)

Response item:

```ts
type EmployeeSearchItem = { id:string; name:string; department?:string; role?:string }
```

Example:

```
GET /api/v1/employee/search?name=Saurabh&limit=10
```

---

## 5) POST /attendance/reports/export

Purpose: export selected or all rows. Support CSV/XLSX.

Body (JSON):

```ts
type ExportRequest = {
  mode: "daily" | "monthly" | "custom";
  date?: string;    // when mode=daily
  month?: string;   // when mode=monthly
  startDate?: string; // when custom
  endDate?: string;
  scope: "ALL_ROWS" | "SELECTED_ROWS";
  rowIds?: string[]; // required when scope=SELECTED_ROWS
  filters?: {
    employeeId?: string;
    employeeName?: string;
    department?: string;
    status?: string;
    lateOnly?: boolean;
    missingExitOnly?: boolean;
  };
  format: "csv" | "xlsx";
  timezone?: string;
  registeredOnly?: boolean; // default true
}
```

Response options:
- Synchronous: return binary file stream with `Content-Type: application/octet-stream` (or `text/csv`/`application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`).
- Or queued: return `ApiResponse<{ jobId: string; downloadUrl?: string }>` if export is long-running.

Example request (curl):

```bash
curl -X POST -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{ "mode":"monthly", "month":"2026-05", "scope":"ALL_ROWS", "format":"csv", "timezone":"Asia/Kolkata" }' \
  https://your-host/api/v1/attendance/reports/export
```

---

## Validation and Behavior Notes

- Treat empty strings and `"all"` for `department` as absence of filter.
- Trim `employeeName` server-side.
- Accept `confidence` as decimal (0-1) or 0-100; normalize to frontend expectation.
- Timeline must include `eventName` and `type`; include `cameraSource` and `confidence` when available.
- Use pagination metadata consistently.
- Return 400/422 for validation errors (include `errors` array), 404 for not found, 500 for server errors.

---

## Implementation Hints (TypeScript / Express)

- Use `zod` or `joi` for request validation. Example Zod pseudo:

```ts
const summarySchema = z.object({
  mode: z.enum(["daily","monthly","custom"]),
  date: z.string().optional(),
  month: z.string().optional().regex(/^\d{4}-\d{2}$/),
  employeeId: z.string().optional(),
  department: z.string().optional(),
  status: z.enum(["Present","Absent","Late","Half Day"]).optional(),
  lateOnly: z.boolean().optional(),
  missingExitOnly: z.boolean().optional(),
  timezone: z.string().optional(),
});
```

- Tests: add unit tests for monthly aggregation logic and integration tests for `month` param handling.

---

## Quick curl examples

- Monthly summary:

```bash
curl -H "Authorization: Bearer $TOKEN" \ 
  "https://your-host/api/v1/attendance/reports/summary?mode=monthly&month=2026-05&timezone=Asia/Kolkata"
```

- Monthly rows by department:

```bash
curl -H "Authorization: Bearer $TOKEN" \ 
  "https://your-host/api/v1/attendance/reports/rows?mode=monthly&month=2026-05&department=engineering&page=1&pageSize=25&timezone=Asia/Kolkata"
```

- Employee timeline (month):

```bash
curl -H "Authorization: Bearer $TOKEN" \ 
  "https://your-host/api/v1/attendance/reports/employees/69ec59eea047aa9eff3065fa/timeline?month=2026-05&timezone=Asia/Kolkata"
```

---

If you want, I can now generate:
- Zod validation schemas and Express route handlers (TypeScript), or
- A Postman/Insomnia collection JSON with these requests.

Which should I create next?
