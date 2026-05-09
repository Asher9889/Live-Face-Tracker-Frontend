import { z } from "zod";

// Report configuration types
export type ReportType = 'DAILY' | 'MONTHLY' | 'EMPLOYEE_WISE' | 'ORGANIZATION';
export type DateSelectionMode = 'single' | 'month' | 'range';
export type ExportFormat = 'csv' | 'xlsx';

// Zod schemas for validation
export const reportConfigSchema = z.object({
  reportType: z.enum(['DAILY', 'MONTHLY', 'EMPLOYEE_WISE', 'ORGANIZATION'] as const),
  startDate: z.date(),
  endDate: z.date().optional(),
  selectedEmployeeIds: z.array(z.string()).default([]),
  format: z.enum(['csv', 'xlsx'] as const),
  timezone: z.string().default('UTC'),
});

export type ReportConfig = z.infer<typeof reportConfigSchema>;

// Report preview data
export interface ReportPreviewStats {
  totalEmployees: number;
  totalPresent: number;
  totalAbsent: number;
  lateArrivals: number;
  missingExits: number;
  averageWorkingHours: number;
  overtimeCount: number;
  onBreak: number;
}

export interface PreviewRowDaily {
  employeeId: string;
  employeeName: string;
  employeeCode?: string;
  department?: string;
  entryTime?: string;
  exitTime?: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'ON_BREAK';
  workingHours?: number;
  isLate?: boolean;
}

export interface PreviewRowMonthly {
  employeeId: string;
  employeeName: string;
  employeeCode?: string;
  department?: string;
  presentDays: number;
  absentDays: number;
  lateCount: number;
  averageHours: number;
  overtimeDays: number;
  status: 'GOOD' | 'WARNING' | 'CRITICAL';
}

export type PreviewRow = PreviewRowDaily | PreviewRowMonthly;

// Report builder state
export interface ReportBuilderState {
  config: ReportConfig;
  previewStats: ReportPreviewStats | null;
  previewRows: PreviewRow[];
  isLoadingPreview: boolean;
  isExporting: boolean;
  exportError: string | null;
}
