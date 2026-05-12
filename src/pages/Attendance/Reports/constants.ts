export const DEPARTMENTS = [
  "Engineering", "HR", "Marketing", "Sales", "Admin", "Operations"
];

export const STATUS_OPTIONS = [
  { label: "Present", value: "Present" },
  { label: "Absent", value: "Absent" },
  { label: "Late", value: "Late" },
  { label: "Half Day", value: "Half Day" },
];

export const REPORT_PRESETS = [
  { label: "Today", value: "today", mode: "daily" },
  { label: "Yesterday", value: "yesterday", mode: "daily" },
  { label: "This Week", value: "this_week", mode: "custom" },
  { label: "This Month", value: "this_month", mode: "monthly" },
  { label: "Late Arrivals", value: "late_arrivals", mode: "daily" },
  { label: "Missing Exit", value: "missing_exit", mode: "daily" },
];
