# Custom Date Reports - Backend Implementation Analysis

**Status:** Analysis & Specification for Backend Team
**Date:** May 13, 2026
**Mode:** Custom Date Range (not affecting daily/monthly)

---

## Executive Summary

The custom date report mode allows users to query attendance data for ANY date range (e.g., 2026-05-06 to 2026-05-12), with optional employee/department filters. Backend must handle **three distinct scenarios** with different query parameters and response expectations.

---

## Scenario 1: Page Load (Initial State)

### When This Occurs
User navigates to Reports page with mode=custom but NO date range selected yet.

### Query Parameters Sent to Backend
```
GET /attendance/reports/rows?mode=custom&timezone=Asia/Kolkata&page=1&pageSize=25
```

**Note:** `startDate` and `endDate` will be **absent/undefined**.

### Current Frontend Behavior
- Query is disabled (not sent) via `enabled: filters.mode !== "custom" || (!!filters.startDate && !!filters.endDate)`
- Shows loading skeleton or empty state
- User sees UI prompt: "Please select both start and end dates for custom range."

### What Backend SHOULD Return

**Option A: Empty Response (Recommended)**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "No date range specified. Please select start and end dates.",
  "data": {
    "mode": "custom",
    "rows": [],
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "total": 0,
      "totalPages": 0
    }
  }
}
```

**Option B: Return Last 7 Days (Alternative)**
- If business logic prefers showing recent data by default
- Set `startDate = today - 7 days`, `endDate = today` automatically on backend
- Return matching records for that range

### Validation Rule
- **IF** `mode === "custom"` **AND** (`startDate` is missing OR `endDate` is missing)
- **THEN** return `400 Bad Request` with clear error:
  ```json
  {
    "success": false,
    "statusCode": 400,
    "message": "For custom mode, both startDate and endDate are required",
    "errors": [
      { "field": "startDate", "message": "startDate is required when mode=custom" },
      { "field": "endDate", "message": "endDate is required when mode=custom" }
    ]
  }
  ```

---

## Scenario 2: User Selects Date Range

### When This Occurs
User opens date picker and selects:
- Start Date: 2026-05-06
- End Date: 2026-05-12
- No employee filter applied yet
- No other filters (department, lateOnly, etc.)

### Query Parameters Sent to Backend
```
GET /attendance/reports/rows?
  mode=custom
  &startDate=2026-05-06
  &endDate=2026-05-12
  &page=1
  &pageSize=25
  &timezone=Asia/Kolkata
```

### What Backend SHOULD Return

**Response Structure: Array of Daily Records**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Reports rows fetched successfully",
  "data": {
    "mode": "custom",
    "rows": [
      {
        "id": "custom_2026-05-06_<employeeId>",
        "date": "2026-05-06",
        "employeeId": "69ec59eea047aa9eff3065fa",
        "name": "Employee Name",
        "avatar": "https://...",
        "department": "Engineering",
        "entryTime": "2026-05-06T09:15:00+05:30",
        "exitTime": "2026-05-06T18:30:00+05:30",
        "lastSeenAt": "2026-05-06T18:30:00+05:30",
        "workHours": "9h 15m",
        "status": "Present",
        "currentStatus": "Out",
        "lateStatus": false,
        "missingExit": false
      },
      // ... one record per employee per day in the range
    ],
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "total": 150,
      "totalPages": 6
    }
  }
}
```

### Key Requirements for This Scenario

1. **Date Range Expansion**
   - Start: 2026-05-06 (inclusive)
   - End: 2026-05-12 (inclusive, so includes May 12th records)
   - Return **ONE record per employee per day** within this range
   - Even if employee has no entry/exit on a day, return Absent status

2. **Row Structure: Use DailyReportRow Format**
   - Must match the `DailyReportRow` interface (from daily mode):
     ```typescript
     interface DailyReportRow {
       id: string;                    // unique per day per employee
       date: string;                  // YYYY-MM-DD the specific day
       employeeId: string;
       name: string;
       avatar?: string;
       department: string;
       entryTime: string;             // ISO format with timezone
       exitTime: string;              // ISO format with timezone
       lastSeenAt: string;
       workHours: string | null;      // "9h 15m" or null
       status: "Present|Absent|Late|Half Day";
       currentStatus: "In" | "Out";   // whether still clocked in
       lateStatus: boolean;           // late arrival
       missingExit: boolean;          // no exit detected
     }
     ```

3. **Pagination Handling**
   - Respect `page` and `pageSize` parameters (both query params)
   - Calculate `total` = count of all records matching the range + filters
   - Return `totalPages = ceil(total / pageSize)`
   - If custom range spans 7 days and there are 100 employees:
     - `total = 700` (7 days × 100 employees)
     - With `pageSize=25`, `totalPages=28`

4. **Timezone Handling**
   - Parse `timezone` parameter (default: Asia/Kolkata)
   - Store all times in ISO 8601 format with timezone offset (e.g., `+05:30`)
   - Convert to requested timezone for entryTime, exitTime, lastSeenAt

5. **Filtering Order (No Conflicts)**
   - If `mode === "custom"`:
     - **Use ONLY** `startDate` and `endDate`
     - **Ignore** any `date` or `month` parameters if present
     - Apply additional filters: department, status, lateOnly, missingExitOnly
   - If `mode === "daily"` or `"monthly"`:
     - **Ignore** `startDate` and `endDate`
     - Use `date` or `month` respectively

### Example: Full Query with Filters

```
GET /attendance/reports/rows?
  mode=custom
  &startDate=2026-05-06
  &endDate=2026-05-12
  &department=engineering
  &lateOnly=true
  &page=1
  &pageSize=25
  &timezone=Asia/Kolkata
```

**Backend Logic:**
1. Validate: both startDate and endDate present → OK
2. Query attendance records where:
   - `date >= 2026-05-06 AND date <= 2026-05-12`
   - `department = "engineering"` (lowercase)
   - `lateStatus = true`
3. Apply pagination (skip, limit)
4. Return results with pagination metadata

---

## Scenario 3: User Searches for Employee Name in Custom Range

### When This Occurs
User:
1. Selected date range: 2026-05-06 to 2026-05-12
2. Used employee search dropdown to select "Saurabh Kushwaha"
3. Frontend sends both `employeeId` AND `employeeName`

### Query Parameters Sent to Backend
```
GET /attendance/reports/rows?
  mode=custom
  &startDate=2026-05-06
  &endDate=2026-05-12
  &employeeId=69ec59eea047aa9eff3065fa
  &employeeName=Saurabh%20Kushwaha
  &page=1
  &pageSize=25
  &timezone=Asia/Kolkata
```

### What Backend SHOULD Return

**Response: All Days for That Employee in Range**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Reports rows fetched successfully",
  "data": {
    "mode": "custom",
    "rows": [
      {
        "id": "custom_2026-05-06_69ec59eea047aa9eff3065fa",
        "date": "2026-05-06",
        "employeeId": "69ec59eea047aa9eff3065fa",
        "name": "Saurabh Kushwaha",
        "avatar": "https://minio.mssplonline.in/facevision/...",
        "department": "Engineering",
        "entryTime": "2026-05-06T12:30:54+05:30",
        "exitTime": "2026-05-06T14:32:15+05:30",
        "lastSeenAt": "2026-05-06T14:32:15+05:30",
        "workHours": "2h 1m",
        "status": "Present",
        "currentStatus": "Out",
        "lateStatus": true,
        "missingExit": false
      },
      {
        "id": "custom_2026-05-07_69ec59eea047aa9eff3065fa",
        "date": "2026-05-07",
        "employeeId": "69ec59eea047aa9eff3065fa",
        "name": "Saurabh Kushwaha",
        "avatar": "https://...",
        "department": "Engineering",
        "entryTime": "2026-05-07T12:40:59+05:30",
        "exitTime": "2026-05-07T19:06:35+05:30",
        "lastSeenAt": "2026-05-07T19:06:35+05:30",
        "workHours": "6h 26m",
        "status": "Present",
        "currentStatus": "Out",
        "lateStatus": true,
        "missingExit": false
      },
      // ... one record per day in range for this employee
    ],
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "total": 6,
      "totalPages": 1
    }
  }
}
```

### Key Requirements for This Scenario

1. **Employee Filter Priority**
   - **IF** `employeeId` is provided:
     - Use `employeeId` directly (exact match)
     - `employeeName` is optional/secondary (could be used for verification)
   - **ELSE IF** only `employeeName` is provided:
     - Perform fuzzy/regex match or exact match on name field
   - **Result:** Highly filtered dataset (1 employee × number of days in range)

2. **Return Daily Records for That Employee**
   - One row per day in the range [startDate, endDate]
   - Same `DailyReportRow` structure as Scenario 2
   - Example: 7-day range = 7 records (one per day)
   - If employee was absent on a day, include an Absent record

3. **Pagination Still Applies**
   - Even though filtered to one employee, calculate `total` correctly
   - `total = number of days in range` (6 days → total: 6)
   - With pageSize=25, totalPages=1

4. **Combined Filters**
   - If user adds additional filters beyond employee name:
     ```
     &employeeName=Saurabh Kushwaha
     &lateOnly=true
     &startDate=2026-05-06
     &endDate=2026-05-12
     ```
   - Return only records where:
     - Employee name = "Saurabh Kushwaha"
     - Date between 2026-05-06 and 2026-05-12
     - `lateStatus = true`
   - Result: Only days where this employee was late

---

## Summary Table: Request→Response Mapping

| Scenario | Query Params | Row Count | Total Scope | Response Format |
|----------|--------------|-----------|-------------|-----------------|
| **Page Load** | mode=custom (no dates) | 0 | Empty | Empty rows array |
| **Date Range Selected** | mode, startDate, endDate (no employee) | count per page | All employees in range | Array of DailyReportRow |
| **Employee Search** | mode, startDate, endDate, employeeId | count per page | Single employee, all days in range | Array of DailyReportRow |

---

## Critical Validations & Error Handling

### 1. Missing Required Fields for Custom Mode
```
Request: GET /attendance/reports/rows?mode=custom&page=1&pageSize=25

Response (400):
{
  "success": false,
  "statusCode": 400,
  "message": "Invalid custom date range",
  "errors": [
    { "field": "startDate", "message": "startDate is required for mode=custom" },
    { "field": "endDate", "message": "endDate is required for mode=custom" }
  ]
}
```

### 2. Invalid Date Format
```
Request: GET /attendance/reports/rows?mode=custom&startDate=05-06-2026&endDate=2026-05-12

Response (400):
{
  "success": false,
  "statusCode": 400,
  "message": "Invalid date format",
  "errors": [
    { "field": "startDate", "message": "Date must be in YYYY-MM-DD format" }
  ]
}
```

### 3. End Date Before Start Date
```
Request: GET /attendance/reports/rows?mode=custom&startDate=2026-05-12&endDate=2026-05-06

Response (400):
{
  "success": false,
  "statusCode": 400,
  "message": "Invalid date range",
  "errors": [
    { "field": "endDate", "message": "endDate must be >= startDate" }
  ]
}
```

### 4. Date Range Too Large (Business Logic)
```
Request: GET /attendance/reports/rows?mode=custom&startDate=2026-01-01&endDate=2026-12-31

Response (400 or 422):
{
  "success": false,
  "statusCode": 422,
  "message": "Date range exceeds maximum allowed span",
  "errors": [
    { "field": "dateRange", "message": "Maximum range is 90 days; your range is 365 days" }
  ]
}
```
*(Backend should define max range, e.g., 30, 60, 90, or 180 days)*

### 5. Conflicting Parameters (Daily/Monthly vs Custom)
```
Request: GET /attendance/reports/rows?mode=custom&startDate=2026-05-06&endDate=2026-05-12&date=2026-05-13

Backend Action: IGNORE date, use startDate/endDate
Response: Success (no error, but log warning)

Alternative (Stricter):
Response (400):
{
  "success": false,
  "statusCode": 400,
  "message": "Conflicting parameters",
  "errors": [
    { "field": "date", "message": "The 'date' parameter should not be used when mode=custom. Use startDate and endDate instead." }
  ]
}
```

---

## Backend Implementation Checklist

### Data Query Logic
- [ ] Parse and validate startDate/endDate in YYYY-MM-DD format
- [ ] Validate endDate >= startDate
- [ ] Validate date range does not exceed max allowed days (configure threshold)
- [ ] Query attendance records where: `date >= startDate AND date <= endDate`
- [ ] Apply secondary filters (department, status, lateOnly, missingExitOnly) when provided
- [ ] Apply employee filter (by employeeId first, then employeeName if needed)
- [ ] **Do NOT** use `date` or `month` parameters when mode=custom

### Response Structure
- [ ] Return array of DailyReportRow objects (same as daily mode)
- [ ] Include one record per employee per day
- [ ] Include Absent records for days with no attendance data
- [ ] Set `date` field to the specific YYYY-MM-DD for each row
- [ ] Include pagination metadata (page, pageSize, total, totalPages)

### Timezone Handling
- [ ] Parse timezone parameter (or use default Asia/Kolkata)
- [ ] Return all times in ISO 8601 format with timezone offset (e.g., 2026-05-06T12:30:54+05:30)
- [ ] All calculations (workHours, late status) based on timezone-adjusted times

### Error Handling
- [ ] Reject requests missing startDate or endDate for mode=custom (400 Bad Request)
- [ ] Reject invalid date formats (400 Bad Request)
- [ ] Reject endDate < startDate (400 Bad Request)
- [ ] Reject date ranges exceeding max allowed span (422 Unprocessable Entity)
- [ ] Reject conflicting parameters (either warn/ignore or return 400, pick one strategy)
- [ ] Return clear error messages with field names and reasons

### Testing Scenarios
- [ ] Test with minimal range (1 day, single employee, single day)
- [ ] Test with medium range (7 days, multiple employees)
- [ ] Test with maximum allowed range
- [ ] Test with out-of-range boundaries (dates beyond available data)
- [ ] Test with no matching employees in range
- [ ] Test with all filters applied together
- [ ] Test pagination: ensure total count is correct across pages
- [ ] Test that no data leaks from other employees when single employee is searched

### Logging & Monitoring
- [ ] Log all custom date queries with parameters for audit trail
- [ ] Monitor performance: ensure large date ranges don't timeout
- [ ] Log when conflicting parameters are detected
- [ ] Alert if queries exceed expected latency threshold

---

## Impact on Daily & Monthly Modes

✅ **NO CHANGES REQUIRED** for daily and monthly modes
- Daily mode continues: `mode=daily` + `date=YYYY-MM-DD`
- Monthly mode continues: `mode=monthly` + `month=YYYY-MM`
- Backend should simply ignore startDate/endDate when mode != custom

---

## Frontend → Backend Communication

### The Frontend Now Sends (After Fix):

**For Daily Mode:**
```json
{
  "mode": "daily",
  "date": "2026-05-13"
  // (no startDate, endDate, month)
}
```

**For Monthly Mode:**
```json
{
  "mode": "monthly",
  "month": "2026-05"
  // (no startDate, endDate, date)
}
```

**For Custom Mode:**
```json
{
  "mode": "custom",
  "startDate": "2026-05-06",
  "endDate": "2026-05-12"
  // (no date, month)
}
```

This eliminates ambiguity and ensures backend applies the correct query logic per mode.

---

## Questions for Backend Team

1. **Date Range Limit:** What is the maximum allowed range (days) for a single custom query? (Default suggestion: 90 days)
2. **Missing Data:** If an employee has no entry/exit on a day in the custom range, should we return an Absent record or skip that day?
3. **Pagination Ceiling:** With very large date ranges, should we have a max `pageSize` to prevent memory issues? (Current API allows up to 200; consider capping at 100 for custom mode)
4. **Timezone Edge Cases:** How should we handle records that span midnight or cross DST boundaries?
5. **Parameter Conflict:** Should we (a) silently ignore conflicting parameters, or (b) return 400 error? Pick one strategy.
6. **Performance:** Is there an index on (date, employeeId) to support range queries efficiently?

---

## Next Steps

1. Review this spec with backend team
2. Implement validation logic (see Checklist above)
3. Update API response logging to track custom mode queries
4. Run integration tests: frontend → backend → verify exact row data
5. Monitor performance with production-like date ranges
