import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, ArrowUpRight } from "lucide-react";
import SalesPipeline from "@/components/dashboard/SalesPipeline";
import RecentLeads from "@/components/dashboard/RecentLeads";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDataMode } from "@/contexts/DataModeContext";

const Sales = () => {
  const { isRealData } = useDataMode();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sales Management</h1>
          <p className="text-muted-foreground">
            View and manage your leads, deals, and sales pipeline.
          </p>
        </div>
        <div className="flex gap-3">
          <Button size="sm" className="font-medium">
            <Plus className="h-4 w-4 mr-1" /> New Lead
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="pipeline" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="leads">Leads</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="pipeline" className="mt-4">
          {isRealData ? (
            <div className="grid grid-cols-1 gap-4">
              <Card className="dashboard-card p-6">
                <div className="text-center">
                  <p className="text-muted-foreground mb-4">
                    No sales pipeline data available. Connect your sales systems through the integrations page.
                  </p>
                  <Button onClick={() => window.location.href = "/integrations"}>
                    <ArrowUpRight className="h-4 w-4 mr-1" /> Go to Integrations
                  </Button>
                </div>
              </Card>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              <SalesPipeline />
              <RecentLeads />
            </div>
          )}
        </TabsContent>
        <TabsContent value="leads" className="mt-4">
          {isRealData ? (
            <div className="grid grid-cols-1 gap-4">
              <Card className="dashboard-card p-6">
                <div className="text-center">
                  <p className="text-muted-foreground mb-4">
                    No leads data available. Connect your CRM or create your first lead.
                  </p>
                  <div className="flex justify-center gap-3">
                    <Button>
                      <Plus className="h-4 w-4 mr-1" /> Add Lead
                    </Button>
                    <Button variant="outline" onClick={() => window.location.href = "/integrations"}>
                      Connect CRM
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              <RecentLeads />
            </div>
          )}
        </TabsContent>
        <TabsContent value="reports" className="mt-4">
          {isRealData ? (
            <div className="grid grid-cols-1 gap-4">
              <Card className="dashboard-card p-6">
                <div className="text-center">
                  <p className="text-muted-foreground mb-4">
                    No sales reports available. Connect your sales data through the integrations page.
                  </p>
                  <Button onClick={() => window.location.href = "/integrations"}>
                    <ArrowUpRight className="h-4 w-4 mr-1" /> Go to Integrations
                  </Button>
                </div>
              </Card>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="dashboard-card">
                <CardHeader>
                  <CardTitle>Customer Journey Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-col space-y-2">
                      <p className="text-muted-foreground">Average time from lead to customer: <span className="font-semibold text-foreground">18 days</span></p>
                      <div className="h-2 bg-muted rounded-full">
                        <div className="h-full bg-primary rounded-full" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <p className="text-muted-foreground">Touchpoints before conversion: <span className="font-semibold text-foreground">5.2</span></p>
                      <div className="h-2 bg-muted rounded-full">
                        <div className="h-full bg-primary rounded-full" style={{ width: '78%' }}></div>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <p className="text-muted-foreground">Lead qualification rate: <span className="font-semibold text-foreground">42%</span></p>
                      <div className="h-2 bg-muted rounded-full">
                        <div className="h-full bg-primary rounded-full" style={{ width: '42%' }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="dashboard-card">
                <CardHeader>
                  <CardTitle>Churn Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-col space-y-2">
                      <p className="text-muted-foreground">Monthly churn rate: <span className="font-semibold text-foreground">2.1%</span></p>
                      <div className="h-2 bg-muted rounded-full">
                        <div className="h-full bg-red-500 rounded-full" style={{ width: '21%' }}></div>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <p className="text-muted-foreground">Customer lifetime: <span className="font-semibold text-foreground">18 months</span></p>
                      <div className="h-2 bg-muted rounded-full">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <p className="text-muted-foreground">Annual recurring revenue at risk: <span className="font-semibold text-foreground">$86,500</span></p>
                      <div className="h-2 bg-muted rounded-full">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: '34%' }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="dashboard-card md:col-span-2">
                <CardHeader>
                  <CardTitle>Tips to Improve Sales Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-3">
                      <h3 className="font-medium mb-1">Accelerate your lead response time</h3>
                      <p className="text-sm text-muted-foreground">Responding to leads within 5 minutes increases conversion rates by 900%. Your current average is 3.2 hours.</p>
                    </div>
                    <div className="border rounded-lg p-3">
                      <h3 className="font-medium mb-1">Optimize your sales process for existing customers</h3>
                      <p className="text-sm text-muted-foreground">It costs 5-25x more to acquire a new customer than retain an existing one. Focus on up-selling to your existing base.</p>
                    </div>
                    <div className="border rounded-lg p-3">
                      <h3 className="font-medium mb-1">Implement a customer win-back strategy</h3>
                      <p className="text-sm text-muted-foreground">You have a 60-70% chance of selling to an existing customer and only a 5-20% chance of selling to a new prospect.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Sales;
