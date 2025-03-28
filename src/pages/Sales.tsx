
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import SalesPipeline from "@/components/dashboard/SalesPipeline";
import RecentLeads from "@/components/dashboard/RecentLeads";

const Sales = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sales Management</h1>
          <p className="text-muted-foreground">
            View and manage your leads, deals, and sales pipeline.
          </p>
        </div>
        <Button size="sm" className="font-medium">
          <Plus className="h-4 w-4 mr-1" /> New Lead
        </Button>
      </div>
      
      <Tabs defaultValue="pipeline" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="leads">Leads</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="pipeline" className="mt-4">
          <div className="grid grid-cols-1 gap-4">
            <SalesPipeline />
            <RecentLeads />
          </div>
        </TabsContent>
        <TabsContent value="leads" className="mt-4">
          <div className="grid grid-cols-1 gap-4">
            <RecentLeads />
          </div>
        </TabsContent>
        <TabsContent value="customers" className="mt-4">
          <div className="p-8 text-center text-muted-foreground">
            Customer management features will be available in the next update.
          </div>
        </TabsContent>
        <TabsContent value="reports" className="mt-4">
          <div className="p-8 text-center text-muted-foreground">
            Sales reporting features will be available in the next update.
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Sales;
