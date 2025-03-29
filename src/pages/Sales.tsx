
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, ArrowUpRight } from "lucide-react";
import SalesPipeline from "@/components/dashboard/SalesPipeline";
import RecentLeads from "@/components/dashboard/RecentLeads";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDataMode } from "@/contexts/DataModeContext";
import DataModeToggle from "@/components/dashboard/DataModeToggle";

const Sales = () => {
  const { isRealData, setIsRealData } = useDataMode();

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
          <DataModeToggle isRealData={isRealData} onToggle={setIsRealData} />
          <Button size="sm" className="font-medium">
            <Plus className="h-4 w-4 mr-1" /> New Lead
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="pipeline" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="leads">Leads</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
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
        <TabsContent value="customers" className="mt-4">
          <div className="p-8 text-center text-muted-foreground">
            {isRealData 
              ? "No customer data available. Connect your CRM through the integrations page."
              : "Customer management features will be available in the next update."}
          </div>
        </TabsContent>
        <TabsContent value="reports" className="mt-4">
          <div className="p-8 text-center text-muted-foreground">
            {isRealData 
              ? "No sales reports available. Connect your sales data through the integrations page."
              : "Sales reporting features will be available in the next update."}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Sales;
