
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReportsList } from "@/components/reports/ReportsList";
import { CustomReportBuilder } from "@/components/reports/CustomReportBuilder";
import { Search, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Reports = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const { toast } = useToast();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground mt-1">
            Access, search, and create custom reports for your organization
          </p>
        </div>
        
        <Button 
          onClick={() => toast({
            title: "Coming Soon",
            description: "Report sharing will be available in the next update."
          })}
        >
          Share Reports
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Search Reports</CardTitle>
          <CardDescription>
            Find reports by name or category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search reports..."
                className="pl-8"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {["all", "sales", "customers", "marketing", "service", "analytics"].map((filter) => (
                <Button
                  key={filter}
                  variant={activeFilter === filter ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterChange(filter)}
                  className="capitalize"
                >
                  {filter}
                </Button>
              ))}
              <Button variant="outline" size="icon" title="More filters">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="reports" className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-md mb-6">
          <TabsTrigger value="reports">Browse Reports</TabsTrigger>
          <TabsTrigger value="create">Create Custom Report</TabsTrigger>
        </TabsList>
        
        <TabsContent value="reports" className="mt-0">
          <ReportsList 
            searchQuery={searchQuery} 
            categoryFilter={activeFilter !== "all" ? activeFilter : undefined} 
          />
        </TabsContent>
        
        <TabsContent value="create" className="mt-0">
          <CustomReportBuilder />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
