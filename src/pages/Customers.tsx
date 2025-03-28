
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import CustomerSatisfaction from "@/components/dashboard/CustomerSatisfaction";

const Customers = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Customer Management</h1>
          <p className="text-muted-foreground">
            Manage your customer database and history.
          </p>
        </div>
        <Button size="sm" className="font-medium">
          <Plus className="h-4 w-4 mr-1" /> Add Customer
        </Button>
      </div>
      
      <div className="flex items-center">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search customers..."
            className="pl-9"
          />
        </div>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="dashboard-card p-6">
              <div className="text-center p-8">
                <h3 className="text-lg font-semibold mb-2">Customer Database</h3>
                <p className="text-muted-foreground mb-4">
                  Your customer list will appear here. Add your first customer to get started.
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-1" /> Add Customer
                </Button>
              </div>
            </div>
            <CustomerSatisfaction />
          </div>
        </TabsContent>
        <TabsContent value="active" className="mt-4">
          <div className="p-8 text-center text-muted-foreground">
            Active customer list will be available in the next update.
          </div>
        </TabsContent>
        <TabsContent value="inactive" className="mt-4">
          <div className="p-8 text-center text-muted-foreground">
            Inactive customer list will be available in the next update.
          </div>
        </TabsContent>
        <TabsContent value="reports" className="mt-4">
          <div className="p-8 text-center text-muted-foreground">
            Customer reporting features will be available in the next update.
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Customers;
