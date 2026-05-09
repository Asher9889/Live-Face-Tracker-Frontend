import {
  Users,
  UserCheck,
  UserX,
  Clock,
  AlertCircle,
  Zap,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { ReportPreviewStats } from '../types';

interface ReportSummaryCardsProps {
  stats: ReportPreviewStats | null;
  isLoading: boolean;
}

interface StatCard {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number | string;
  subtext?: string;
  color: 'blue' | 'green' | 'red' | 'orange' | 'purple' | 'amber';
}

export const ReportSummaryCards = ({
  stats,
  isLoading,
}: ReportSummaryCardsProps) => {
  if (!stats && !isLoading) return null;

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      blue: { bg: 'bg-blue-50', text: 'text-blue-600' },
      green: { bg: 'bg-green-50', text: 'text-green-600' },
      red: { bg: 'bg-red-50', text: 'text-red-600' },
      orange: { bg: 'bg-orange-50', text: 'text-orange-600' },
      purple: { bg: 'bg-purple-50', text: 'text-purple-600' },
      amber: { bg: 'bg-amber-50', text: 'text-amber-600' },
    };
    return colors[color] || colors.blue;
  };

  const statCards: StatCard[] = [
    {
      icon: Users,
      label: 'Total Employees',
      value: stats?.totalEmployees || 0,
      color: 'blue',
    },
    {
      icon: UserCheck,
      label: 'Present',
      value: stats?.totalPresent || 0,
      color: 'green',
    },
    {
      icon: UserX,
      label: 'Absent',
      value: stats?.totalAbsent || 0,
      color: 'red',
    },
    {
      icon: Clock,
      label: 'Avg Working Hrs',
      value: stats?.averageWorkingHours?.toFixed(1) || '0',
      color: 'purple',
    },
    {
      icon: AlertCircle,
      label: 'Late Arrivals',
      value: stats?.lateArrivals || 0,
      color: 'amber',
    },
    {
      icon: Zap,
      label: 'Overtime',
      value: stats?.overtimeCount || 0,
      color: 'orange',
    },
  ];

  return (
    <div>
      <h3 className="text-sm font-semibold text-foreground mb-3">Report Summary</h3>
      <div className="grid grid-cols-2 gap-3">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          const colors = getColorClasses(card.color);

          return (
            <div
              key={idx}
              className={`p-3 rounded-lg border border-border ${colors.bg}`}
            >
              <div className="flex items-start gap-2">
                <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${colors.text}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-muted-foreground">
                    {card.label}
                  </p>
                  {isLoading ? (
                    <Skeleton className="h-6 w-12 mt-1" />
                  ) : (
                    <p className={`text-lg font-bold ${colors.text}`}>
                      {card.value}
                    </p>
                  )}
                  {card.subtext && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {card.subtext}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
