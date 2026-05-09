import React from "react";
import type { AnalyticsSummary, ReportMode } from "../types";
import { AnalyticsCard } from "./AnalyticsCard";
import { 
  Users, 
  UserCheck, 
  UserX, 
  Clock, 
  AlertTriangle, 
  Timer
} from "lucide-react";

interface SummaryCardsProps {
  analytics: AnalyticsSummary | null;
  isLoading: boolean;
  mode: ReportMode;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ analytics, isLoading, mode }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 p-4 bg-secondary/10">
      <AnalyticsCard
        title={mode === 'monthly' ? "Avg Present" : "Present"}
        value={analytics?.present || 0}
        icon={UserCheck}
        isLoading={isLoading}
        trend={{ value: 2.4, isPositive: true }}
      />
      <AnalyticsCard
        title={mode === 'monthly' ? "Avg Absent" : "Absent"}
        value={analytics?.absent || 0}
        icon={UserX}
        isLoading={isLoading}
        trend={{ value: 1.1, isPositive: false }}
      />
      <AnalyticsCard
        title="Late Arrivals"
        value={analytics?.late || 0}
        icon={Clock}
        isLoading={isLoading}
      />
      <AnalyticsCard
        title="Missing Exit"
        value={analytics?.missingExit || 0}
        icon={AlertTriangle}
        isLoading={isLoading}
      />
      <AnalyticsCard
        title="Avg Hours"
        value={analytics?.avgHours || "0h"}
        icon={Timer}
        isLoading={isLoading}
      />
      <AnalyticsCard
        title="Total Employees"
        value={analytics?.totalEmployees || 0}
        icon={Users}
        isLoading={isLoading}
      />
    </div>
  );
};
