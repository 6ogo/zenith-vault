
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface AnalyticsMetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
  isLoading?: boolean;
}

const AnalyticsMetricCard = ({
  title,
  value,
  change,
  icon,
  isLoading = false
}: AnalyticsMetricCardProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            <Skeleton className="h-4 w-24" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline justify-between">
            <Skeleton className="h-7 w-16" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
          <Skeleton className="h-4 w-16 mt-2" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline justify-between">
          <div className="text-2xl font-bold">{value}</div>
          {icon && (
            <div className="p-2 bg-primary/10 text-primary rounded-full">
              {icon}
            </div>
          )}
        </div>
        {change && (
          <div className="flex items-center mt-1">
            <span
              className={`text-xs font-semibold ${
                change.isPositive 
                  ? "text-green-600" 
                  : "text-red-600"
              }`}
            >
              {change.isPositive ? "↑" : "↓"} {change.value}%
            </span>
            <span className="text-xs text-muted-foreground ml-1">
              vs. last period
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AnalyticsMetricCard;
