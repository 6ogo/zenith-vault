
import { useState, useEffect } from 'react';

// Define the data types
export interface AnalyticsMetric {
  id: string;
  title: string;
  value: number | string;
  change?: {
    value: number;
    isPositive: boolean;
  };
}

export interface ChartData {
  id: string;
  title: string;
  description?: string;
  type: 'line' | 'area' | 'bar';
  data: any[];
  dataKeys: {
    xAxis: string;
    yAxis: string[];
    colors: string[];
  };
  valueFormatter?: (value: number) => string;
}

// Simulated analytics data
const mockMetrics: AnalyticsMetric[] = [
  {
    id: 'total-sales',
    title: 'Total Sales',
    value: '$128,430',
    change: { value: 12.5, isPositive: true }
  },
  {
    id: 'conversion-rate',
    title: 'Conversion Rate',
    value: '24.8%',
    change: { value: 3.2, isPositive: true }
  },
  {
    id: 'customer-satisfaction',
    title: 'Customer Satisfaction',
    value: '4.8/5',
    change: { value: 0.3, isPositive: true }
  },
  {
    id: 'active-users',
    title: 'Active Users',
    value: '2,845',
    change: { value: 5.1, isPositive: true }
  }
];

const salesData = [
  { month: 'Jan', sales: 4000, target: 4200 },
  { month: 'Feb', sales: 3000, target: 3800 },
  { month: 'Mar', sales: 5000, target: 4500 },
  { month: 'Apr', sales: 4500, target: 4300 },
  { month: 'May', sales: 6000, target: 5000 },
  { month: 'Jun', sales: 5500, target: 5200 },
  { month: 'Jul', sales: 7000, target: 6000 },
  { month: 'Aug', sales: 6500, target: 6200 },
  { month: 'Sep', sales: 8000, target: 7000 },
  { month: 'Oct', sales: 7500, target: 7200 },
  { month: 'Nov', sales: 9000, target: 8000 },
  { month: 'Dec', sales: 8500, target: 8200 },
];

const userActivityData = [
  { day: 'Mon', visits: 500, engagements: 300 },
  { day: 'Tue', visits: 600, engagements: 400 },
  { day: 'Wed', visits: 700, engagements: 500 },
  { day: 'Thu', visits: 800, engagements: 600 },
  { day: 'Fri', visits: 900, engagements: 700 },
  { day: 'Sat', visits: 600, engagements: 400 },
  { day: 'Sun', visits: 500, engagements: 300 },
];

const leadSourceData = [
  { source: 'Organic Search', value: 40 },
  { source: 'Direct', value: 25 },
  { source: 'Social Media', value: 20 },
  { source: 'Email', value: 10 },
  { source: 'Referral', value: 5 },
];

const mockCharts: ChartData[] = [
  {
    id: 'sales-trends',
    title: 'Sales Trends',
    description: 'Monthly sales vs targets',
    type: 'line',
    data: salesData,
    dataKeys: {
      xAxis: 'month',
      yAxis: ['sales', 'target'],
      colors: ['#0e8be5', '#ff9966']
    },
    valueFormatter: (value) => `$${value.toLocaleString()}`
  },
  {
    id: 'user-activity',
    title: 'User Activity',
    description: 'Daily visits and engagements',
    type: 'area',
    data: userActivityData,
    dataKeys: {
      xAxis: 'day',
      yAxis: ['visits', 'engagements'],
      colors: ['#00CC66', '#003366']
    }
  },
  {
    id: 'lead-sources',
    title: 'Lead Sources',
    description: 'Distribution of leads by source',
    type: 'bar',
    data: leadSourceData,
    dataKeys: {
      xAxis: 'source',
      yAxis: ['value'],
      colors: ['#003366']
    },
    valueFormatter: (value) => `${value}%`
  }
];

// Hook for fetching analytics data
export const useAnalyticsData = () => {
  const [metrics, setMetrics] = useState<AnalyticsMetric[]>([]);
  const [charts, setCharts] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // In a real implementation, this would be an API call
        // For now, we'll simulate a network request
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Update the metrics with simulated real-time data (add some random fluctuation)
        const updatedMetrics = mockMetrics.map(metric => ({
          ...metric,
          change: metric.change ? {
            ...metric.change,
            value: +(metric.change.value + (Math.random() * 2 - 1)).toFixed(1)
          } : undefined
        }));
        
        setMetrics(updatedMetrics);
        setCharts(mockCharts);
      } catch (err) {
        console.error('Error fetching analytics data:', err);
        setError('Failed to load analytics data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
    
    // Set up periodic polling for real-time updates
    const intervalId = setInterval(fetchData, 30000); // Update every 30 seconds
    
    return () => clearInterval(intervalId);
  }, []);

  return { metrics, charts, isLoading, error };
};
