
import React, { useState } from "react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BarChart3, LineChart, RefreshCcw, Activity, AlertCircle, PieChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnalyticsMetricCard from "@/components/analytics/AnalyticsMetricCard";
import AnalyticsChart from "@/components/analytics/AnalyticsChart";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";

const Analytics = () => {
  const [timeframe, setTimeframe] = useState("monthly");
  const [refreshing, setRefreshing] = useState(false);
  const { metrics, charts, isLoading, error } = useAnalyticsData();

  const handleRefresh = () => {
    setRefreshing(true);
    
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const getIconForMetric = (id: string) => {
    switch (id) {
      case 'total-sales':
        return <BarChart3 className="h-5 w-5" />;
      case 'conversion-rate':
        return <LineChart className="h-5 w-5" />;
      case 'customer-satisfaction':
        return <PieChart className="h-5 w-5" />;
      case 'active-users':
        return <Activity className="h-5 w-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Monitor your business performance metrics in real-time
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCcw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <AnalyticsMetricCard 
                key={i}
                title=""
                value=""
                isLoading={true}
              />
            ))
          : metrics.map((metric) => (
              <AnalyticsMetricCard
                key={metric.id}
                title={metric.title}
                value={metric.value}
                change={metric.change}
                icon={getIconForMetric(metric.id)}
              />
            ))
        }
      </div>
      
      <Tabs defaultValue="charts" className="space-y-6">
        <TabsList>
          <TabsTrigger value="charts">Charts</TabsTrigger>
          <TabsTrigger value="real-time">Real-Time</TabsTrigger>
        </TabsList>
        
        <TabsContent value="charts" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {isLoading
              ? Array.from({ length: 2 }).map((_, i) => (
                  <AnalyticsChart
                    key={i}
                    title=""
                    data={[]}
                    dataKeys={{ xAxis: '', yAxis: [], colors: [] }}
                    isLoading={true}
                  />
                ))
              : charts.slice(0, 2).map((chart) => (
                  <AnalyticsChart
                    key={chart.id}
                    title={chart.title}
                    description={chart.description}
                    data={chart.data}
                    dataKeys={chart.dataKeys}
                    type={chart.type}
                    valueFormatter={chart.valueFormatter}
                  />
                ))
            }
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            {isLoading
              ? <AnalyticsChart
                  title=""
                  data={[]}
                  dataKeys={{ xAxis: '', yAxis: [], colors: [] }}
                  isLoading={true}
                />
              : charts.slice(2, 3).map((chart) => (
                  <AnalyticsChart
                    key={chart.id}
                    title={chart.title}
                    description={chart.description}
                    data={chart.data}
                    dataKeys={chart.dataKeys}
                    type={chart.type}
                    valueFormatter={chart.valueFormatter}
                  />
                ))
            }
          </div>
        </TabsContent>
        
        <TabsContent value="real-time">
          <div className="space-y-6">
            <AnalyticsChart
              title="Real-Time User Activity"
              description="Live tracking of user actions in the last 30 minutes"
              data={[
                { time: "Now", users: 42, actions: 78 },
                { time: "-5m", users: 39, actions: 68 },
                { time: "-10m", users: 35, actions: 52 },
                { time: "-15m", users: 31, actions: 44 },
                { time: "-20m", users: 28, actions: 36 },
                { time: "-25m", users: 26, actions: 29 },
                { time: "-30m", users: 24, actions: 25 },
              ]}
              dataKeys={{
                xAxis: "time",
                yAxis: ["users", "actions"],
                colors: ["#003366", "#00CC66"]
              }}
              type="line"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
