# Attendance Reports - Backend API Quick Reference

**Status:** ✅ Backend Implemented | ⏳ Frontend Integration Pending

**Base URL:** `/api/v1/attendance`

**Authentication:** Bearer Token (JWT) in Authorization header

---

## Response Envelope (All Endpoints)

```typescript
{
  "status": "success" | "error",
  "statusCode": 200 | 202 | 400 | 401 | 403 | 404 | 422 | 500,
  "data"?: T,
  "message"?: string,
  "errors"?: [{ field?: string, message: string }]
}
```

---

## Endpoint Summary

| Method | Path | Purpose | Response Type |
|--------|------|---------|---------------|
| GET | `/attendance/reports/summary` | Analytics metrics (present, absent, late, etc.) | JSON |
| GET | `/attendance/reports/rows` | Paginated report rows (daily/monthly/custom) | JSON |
| GET | `/attendance/reports/employees/:employeeId/timeline` | Employee timeline drawer data | JSON |
| POST | `/attendance/reports/export` | Export report as CSV/XLSX | Blob or Job |
| GET | `/employees/search` | Employee autocomplete | JSON |

---

## 1. GET /attendance/reports/summary

**Query Params:**
```
mode=daily|monthly|custom (required)
date=YYYY-MM-DD (if mode=daily)
month=YYYY-MM (if mode=monthly)
startDate=YYYY-MM-DD (if mode=custom)
endDate=YYYY-MM-DD (if mode=custom)
employeeId=string (optional)
department=string (optional)
status=Present|Absent|Late|Half Day (optional)
lateOnly=true|false (optional)
missingExitOnly=true|false (optional)
timezone=IANA (optional, default Asia/Kolkata)
```

**Response:**
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

---

## 2. GET /attendance/reports/rows

**Query Params:**
```
mode=daily|monthly|custom (required)
date=YYYY-MM-DD (if mode=daily)
month=YYYY-MM (if mode=monthly)
startDate=YYYY-MM-DD (if mode=custom)
endDate=YYYY-MM-DD (if mode=custom)
employeeId=string (optional)
employeeName=string (optional, backend may fuzzy match)
department=string (optional)
status=Present|Absent|Late|Half Day (optional)
lateOnly=true|false (optional)
missingExitOnly=true|false (optional)
page=number (optional, default 1)
pageSize=number (optional, default 25, max 200)
sortBy=string (optional)
sortOrder=asc|desc (optional)
timezone=IANA (optional, default Asia/Kolkata)
```

**Response (Daily):**
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

**Response (Monthly) – Same structure, different row shape:**
```json
{
  "rows": [
    {
      "id": "month_2026-05_emp_123",
      "employeeId": "emp_123",
      "name": "Alice Smith",
      "avatar": null,
      "department": "Engineering",
      "presentDays": 20,
      "absentDays": 1,
      "lateCount": 2,
      "avgWorkHours": "8h 10m",
      "overtimeDays": 3,
      "missingExits": 1
    }
  ]
}
```

---

## 3. GET /attendance/reports/employees/:employeeId/timeline

**Query Params:**
```
date=YYYY-MM-DD (optional)
month=YYYY-MM (optional)
timezone=IANA (optional, default Asia/Kolkata)
```

**Response:**
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
      },
      {
        "id": "evt_2",
        "type": "EXIT_CONFIRMED",
        "timestamp": "2026-05-11T18:10:00+05:30",
        "cameraSource": "Main Exit Cam",
        "confidence": 97.2,
        "statusBadge": "success"
      }
    ]
  }
}
```

**Event types:** `ENTRY_DETECTED`, `EXIT_PENDING`, `EXIT_CANCELLED`, `EXIT_CONFIRMED`, `SYSTEM_RECOVERY`

**Status badges:** `success`, `warning`, `error`, `info`, `default`

---

## 4. POST /attendance/reports/export

**Request Body:**
```json
{
  "mode": "daily|monthly|custom",
  "date": "YYYY-MM-DD",
  "month": "YYYY-MM",
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD",
  "scope": "ALL_ROWS|SELECTED_ROWS|SELECTED_EMPLOYEES",
  "rowIds": ["..."],
  "employeeIds": ["..."],
  "filters": {
    "employeeId": "...",
    "employeeName": "...",
    "department": "...",
    "status": "Present",
    "lateOnly": false,
    "missingExitOnly": false
  },
  "format": "csv|xlsx",
  "timezone": "Asia/Kolkata",
  "registeredOnly": true
}
```

**Response (Synchronous – File Download):**
- Content-Type: `text/csv` or `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- Binary blob with `Content-Disposition` header

**Response (Asynchronous – Queued):**
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

## 5. GET /employees/search

**Query Params:**
```
name=string (required)
limit=number (optional, default 10)
```

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

---

## Error Responses

**400 Bad Request – Validation Error:**
```json
{
  "status": "error",
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    { "field": "endDate", "message": "endDate must be after startDate" }
  ]
}
```

**401 Unauthorized:**
```json
{
  "status": "error",
  "statusCode": 401,
  "message": "Missing or invalid authentication token"
}
```

**404 Not Found:**
```json
{
  "status": "error",
  "statusCode": 404,
  "message": "Employee not found"
}
```

**422 Unprocessable Entity:**
```json
{
  "status": "error",
  "statusCode": 422,
  "message": "Invalid date range (max 92 days for custom reports)"
}
```

---

## Query Parameter Rules

| Parameter | Validation | Notes |
|-----------|-----------|-------|
| `mode` | Must be one of: daily, monthly, custom | Required |
| `date` | YYYY-MM-DD format, required if mode=daily | ISO format |
| `month` | YYYY-MM format, required if mode=monthly | ISO format |
| `startDate`, `endDate` | YYYY-MM-DD format, required if mode=custom | startDate <= endDate |
| `employeeId` | Non-empty string | Empty string treated as no filter |
| `department` | String or "all" | "all" treated as no filter |
| `status` | One of: Present, Absent, Late, Half Day | Case-sensitive |
| `lateOnly`, `missingExitOnly` | Boolean | Default false |
| `page` | Positive integer, default 1 | |
| `pageSize` | 1-200, default 25 | Backend enforces max 200 |
| `timezone` | IANA timezone string | Default: Asia/Kolkata |

---

## Performance Recommendations

- Add database indexes: employee_id, event_date, department, status, flags
- Cache summary responses by filter hash (15-60 seconds TTL)
- Support parallel requests: Frontend calls summary + rows together
- Pagination default: 25 rows per page
- Max custom range: 92 days (recommend in validation error)

---

## Frontend Integration Checklist

- [ ] Create API client module (attendance-reports.api.ts)
- [ ] Replace mock calls in useAttendanceReports hook
- [ ] Replace mock timeline call in EmployeeTimelineDrawer
- [ ] Wire export button to POST endpoint
- [ ] Implement file download handler
- [ ] Add error toast/boundary for failures
- [ ] Test all filter combinations
- [ ] Validate pagination works
- [ ] Test timezone handling

---

## Contact / Support

- Backend issues: See Section 15 in main API requirements document
- Frontend questions: Check /docs/attendance-reports-api-requirements.md
- Integration help: Review frontend implementation guide in Section 15
