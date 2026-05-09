import { BarChart3, Calendar, Users, Building2 } from 'lucide-react';
import type { ReportType } from '../types';

interface ReportTypeSelectorProps {
  value: ReportType;
  onChange: (type: ReportType) => void;
}

const reportTypes = [
  {
    id: 'DAILY' as const,
    label: 'Daily Attendance',
    description: 'Daily attendance report for a specific date',
    icon: Calendar,
  },
  {
    id: 'MONTHLY' as const,
    label: 'Monthly Report',
    description: 'Attendance summary for an entire month',
    icon: BarChart3,
  },
  {
    id: 'EMPLOYEE_WISE' as const,
    label: 'Employee-wise',
    description: 'Individual employee attendance details',
    icon: Users,
  },
  {
    id: 'ORGANIZATION' as const,
    label: 'Organization Summary',
    description: 'Organization-wide attendance analytics',
    icon: Building2,
  },
];

export const ReportTypeSelector = ({ value, onChange }: ReportTypeSelectorProps) => {
  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-1">Report Type</h3>
        <p className="text-xs text-muted-foreground mb-3">Select the type of report to generate</p>
      </div>

      <div className="space-y-2">
        {reportTypes.map((type) => {
          const Icon = type.icon;
          const isSelected = value === type.id;

          return (
            <button
              key={type.id}
              onClick={() => onChange(type.id)}
              className={`w-full p-3 rounded-lg border transition-all text-left ${
                isSelected
                  ? 'border-primary bg-primary/5 ring-1 ring-primary'
                  : 'border-border hover:border-border/50 hover:bg-accent'
              }`}
            >
              <div className="flex items-start gap-3">
                <Icon
                  className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                    isSelected ? 'text-primary' : 'text-muted-foreground'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${isSelected ? 'text-foreground' : 'text-foreground'}`}>
                    {type.label}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{type.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
