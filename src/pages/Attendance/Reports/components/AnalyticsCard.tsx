import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  isLoading?: boolean;
}

export const AnalyticsCard: React.FC<AnalyticsCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  isLoading
}) => {
  return (
    <Card className="hover:shadow-md transition-shadow duration-200 bg-background/50 backdrop-blur-sm border-border/50">
      <CardContent className="p-4 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">{title}</span>
          <div className="p-2 bg-secondary/50 rounded-md">
            <Icon className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
        
        {isLoading ? (
          <div className="h-8 w-20 bg-muted animate-pulse rounded-md mt-1"></div>
        ) : (
          <div className="flex items-end justify-between mt-1">
            <span className="text-2xl font-bold tracking-tight text-foreground">{value}</span>
            {trend && (
              <span className={`text-xs font-medium px-1.5 py-0.5 rounded-sm ${trend.isPositive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                {trend.isPositive ? '+' : '-'}{trend.value}%
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
