
import React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const StatCard = ({ title, value, icon, trend, className }: StatCardProps) => {
  return (
    <Card className={cn("p-4 sm:p-6", className)}>
      <div className="flex justify-between items-start">
        <div className="overflow-hidden">
          <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">{title}</p>
          <p className="text-xl sm:text-2xl font-bold mt-1 truncate">{value}</p>
          
          {trend && (
            <div className="flex items-center mt-1">
              <span
                className={cn(
                  "text-xs font-medium",
                  trend.isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                )}
              >
                {trend.isPositive ? "↑" : "↓"} {trend.value}%
              </span>
              <span className="text-xs text-muted-foreground ml-1 hidden sm:inline">vs last month</span>
              <span className="text-xs text-muted-foreground ml-1 sm:hidden">vs last</span>
            </div>
          )}
        </div>
        
        <div className="p-2 sm:p-2.5 rounded-full bg-primary/10 text-primary flex-shrink-0">
          {icon}
        </div>
      </div>
    </Card>
  );
};

export default StatCard;
