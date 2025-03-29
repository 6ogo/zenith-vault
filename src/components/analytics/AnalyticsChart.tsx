
import React from 'react';
import {
  AreaChart,
  Area,
  BarChart, 
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  TooltipProps
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export type ChartType = 'line' | 'area' | 'bar';

interface AnalyticsChartProps {
  title: string;
  description?: string;
  data: any[];
  dataKeys: {
    xAxis: string;
    yAxis: string[];
    colors: string[];
  };
  type?: ChartType;
  height?: number;
  isLoading?: boolean;
  valueFormatter?: (value: number) => string;
}

const AnalyticsChart = ({
  title,
  description,
  data,
  dataKeys,
  type = 'line',
  height = 300,
  isLoading = false,
  valueFormatter = (value) => `${value}`
}: AnalyticsChartProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle><Skeleton className="h-6 w-40" /></CardTitle>
          {description && <CardDescription><Skeleton className="h-4 w-60" /></CardDescription>}
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  const renderChart = () => {
    const chartProps = {
      data,
      margin: { top: 10, right: 30, left: 0, bottom: 0 },
    };

    const renderCustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
      if (active && payload && payload.length) {
        return (
          <div className="bg-background border border-border p-3 rounded-md shadow-md text-sm">
            <p className="font-medium mb-1">{label}</p>
            {payload.map((entry, index) => (
              <div key={`tooltip-${index}`} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-muted-foreground">{entry.name}: </span>
                <span className="font-medium">
                  {valueFormatter(entry.value as number)}
                </span>
              </div>
            ))}
          </div>
        );
      }
      return null;
    };

    switch (type) {
      case 'area':
        return (
          <AreaChart {...chartProps}>
            <defs>
              {dataKeys.yAxis.map((key, index) => (
                <linearGradient key={key} id={`color${key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={dataKeys.colors[index]} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={dataKeys.colors[index]} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey={dataKeys.xAxis} 
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12 }} 
              tickFormatter={valueFormatter}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={renderCustomTooltip} />
            <Legend />
            {dataKeys.yAxis.map((key, index) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                name={key}
                stroke={dataKeys.colors[index]}
                fillOpacity={1}
                fill={`url(#color${key})`}
              />
            ))}
          </AreaChart>
        );
      
      case 'bar':
        return (
          <BarChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey={dataKeys.xAxis} 
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12 }} 
              tickFormatter={valueFormatter}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={renderCustomTooltip} />
            <Legend />
            {dataKeys.yAxis.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                name={key}
                fill={dataKeys.colors[index]}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        );
      
      case 'line':
      default:
        return (
          <LineChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey={dataKeys.xAxis} 
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12 }} 
              tickFormatter={valueFormatter}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={renderCustomTooltip} />
            <Legend />
            {dataKeys.yAxis.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                name={key}
                stroke={dataKeys.colors[index]}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            ))}
          </LineChart>
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div style={{ height: `${height}px`, width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyticsChart;
