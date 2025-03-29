import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Sector, Tooltip, XAxis, YAxis } from "recharts";
import { useDataMode } from "@/contexts/DataModeContext";
import DataModeToggle from "@/components/dashboard/DataModeToggle";

const demoData = [
  { name: 'Jan', visits: 4000, conversions: 2400 },
  { name: 'Feb', visits: 3000, conversions: 1398 },
  { name: 'Mar', visits: 2000, conversions: 9800 },
  { name: 'Apr', visits: 2780, conversions: 3908 },
  { name: 'May', visits: 1890, conversions: 4800 },
  { name: 'Jun', visits: 2390, conversions: 3800 },
  { name: 'Jul', visits: 3490, conversions: 4300 },
];

const demoSources = [
  { name: 'Direct', value: 40 },
  { name: 'Organic', value: 30 },
  { name: 'Social', value: 20 },
  { name: 'Referral', value: 10 },
];

const Analytics = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { isRealData } = useDataMode();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Visualize your business performance and customer insights
          </p>
        </div>
        <DataModeToggle />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 md:w-[600px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="traffic">Traffic</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="marketing">Marketing</TabsTrigger>
          <TabsTrigger value="custom">Custom</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          {isRealData ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">No real analytics data available. Connect your data sources in Integrations.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Website Traffic</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={demoData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="visits" stroke="#8884d8" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Traffic Sources</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={demoSources}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      />
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Conversions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={demoData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="conversions" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="traffic" className="mt-6">
          {isRealData ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">No real traffic data available. Connect your analytics platforms.</p>
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">Detailed traffic analysis will be available here.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="sales" className="mt-6">
          {isRealData ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">No real sales analytics available. Connect your CRM or sales platforms.</p>
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">Sales performance analytics will be available here.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="marketing" className="mt-6">
          {isRealData ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">No real marketing data available. Connect your marketing platforms.</p>
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">Marketing campaign performance will be available here.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="custom" className="mt-6">
          <div className="p-8 text-center">
            <p className="text-muted-foreground">
              {isRealData 
                ? "Upload and analyze your custom data here. Connect data sources or upload files in the Data Files section."
                : "Create custom reports and visualizations from your uploaded data files."}
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
