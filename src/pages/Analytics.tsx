
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SalesChart from "@/components/dashboard/SalesChart";
import CustomerSatisfaction from "@/components/dashboard/CustomerSatisfaction";

const Analytics = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics & Reporting</h1>
        <p className="text-muted-foreground">
          View detailed statistics and generate reports.
        </p>
      </div>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5 lg:w-[500px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="marketing">Marketing</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SalesChart />
            <CustomerSatisfaction />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <Card className="dashboard-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold">Sales By Region</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">North America</span>
                      <span className="text-sm font-medium">42%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-salescraft-600 h-2.5 rounded-full" style={{ width: "42%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Europe</span>
                      <span className="text-sm font-medium">28%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-salescraft-600 h-2.5 rounded-full" style={{ width: "28%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Asia Pacific</span>
                      <span className="text-sm font-medium">18%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-salescraft-600 h-2.5 rounded-full" style={{ width: "18%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Latin America</span>
                      <span className="text-sm font-medium">8%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-salescraft-600 h-2.5 rounded-full" style={{ width: "8%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Middle East & Africa</span>
                      <span className="text-sm font-medium">4%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-salescraft-600 h-2.5 rounded-full" style={{ width: "4%" }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="dashboard-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold">Sales By Product</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Basic Plan</span>
                      <span className="text-sm font-medium">48%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-salescraft-600 h-2.5 rounded-full" style={{ width: "48%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Pro Plan</span>
                      <span className="text-sm font-medium">32%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-salescraft-600 h-2.5 rounded-full" style={{ width: "32%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Enterprise Plan</span>
                      <span className="text-sm font-medium">20%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-salescraft-600 h-2.5 rounded-full" style={{ width: "20%" }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="dashboard-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold">Key Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-sm font-medium">Avg. Deal Size</span>
                    <span className="font-semibold">$15,789</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-sm font-medium">Sales Cycle</span>
                    <span className="font-semibold">24 days</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-sm font-medium">Customer Acq. Cost</span>
                    <span className="font-semibold">$1,250</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-sm font-medium">LTV</span>
                    <span className="font-semibold">$54,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Churn Rate</span>
                    <span className="font-semibold">3.2%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="sales" className="mt-4">
          <div className="p-8 text-center text-muted-foreground">
            Detailed sales analytics will be available in the next update.
          </div>
        </TabsContent>
        <TabsContent value="customers" className="mt-4">
          <div className="p-8 text-center text-muted-foreground">
            Detailed customer analytics will be available in the next update.
          </div>
        </TabsContent>
        <TabsContent value="marketing" className="mt-4">
          <div className="p-8 text-center text-muted-foreground">
            Detailed marketing analytics will be available in the next update.
          </div>
        </TabsContent>
        <TabsContent value="reports" className="mt-4">
          <div className="p-8 text-center text-muted-foreground">
            Custom report generation will be available in the next update.
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
