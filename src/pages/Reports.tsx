
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReportsList } from "@/components/reports/ReportsList";
import { CustomReportBuilder } from "@/components/reports/CustomReportBuilder";
import { Search, Filter, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useDataMode } from "@/contexts/DataModeContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from 'recharts';

const Reports = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("reports");
  const { toast } = useToast();
  const { isRealData } = useDataMode();
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  const handleReportView = (reportId: string) => {
    setSelectedReport(reportId);
  };

  const sampleReports = {
    "rep-001": {
      type: "line",
      title: "Monthly Sales Overview",
      data: [
        { name: 'Jan', value: 12000 },
        { name: 'Feb', value: 19000 },
        { name: 'Mar', value: 15000 },
        { name: 'Apr', value: 21000 },
        { name: 'May', value: 18000 },
        { name: 'Jun', value: 25000 },
      ]
    },
    "rep-002": {
      type: "pie",
      title: "Customer Acquisition by Channel",
      data: [
        { name: 'Organic Search', value: 35, color: '#0088FE' },
        { name: 'Social Media', value: 25, color: '#00C49F' },
        { name: 'Email', value: 15, color: '#FFBB28' },
        { name: 'Referral', value: 20, color: '#FF8042' },
        { name: 'Other', value: 5, color: '#A569BD' },
      ]
    },
    "rep-003": {
      type: "bar",
      title: "Support Tickets by Category",
      data: [
        { name: 'Technical', value: 45 },
        { name: 'Billing', value: 32 },
        { name: 'Product', value: 28 },
        { name: 'Feature', value: 18 },
        { name: 'Access', value: 12 },
      ]
    },
    "rep-004": {
      type: "line",
      title: "Website Traffic Analysis",
      data: [
        { name: 'Week 1', value: 4500 },
        { name: 'Week 2', value: 5000 },
        { name: 'Week 3', value: 6800 },
        { name: 'Week 4', value: 7200 },
      ]
    },
    "rep-005": {
      type: "bar",
      title: "Revenue by Product Category",
      data: [
        { name: 'Software', value: 35000 },
        { name: 'Hardware', value: 25000 },
        { name: 'Services', value: 42000 },
        { name: 'Support', value: 18000 },
      ]
    },
    "rep-006": {
      type: "line",
      title: "Customer Satisfaction Trends",
      data: [
        { name: 'Q1', value: 82 },
        { name: 'Q2', value: 85 },
        { name: 'Q3', value: 83 },
        { name: 'Q4', value: 89 },
      ]
    },
  };

  const renderReportPreview = () => {
    if (!selectedReport || !sampleReports[selectedReport as keyof typeof sampleReports]) {
      return null;
    }

    const report = sampleReports[selectedReport as keyof typeof sampleReports];

    return (
      <Dialog open={!!selectedReport} onOpenChange={(open) => !open && setSelectedReport(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{report.title}</DialogTitle>
          </DialogHeader>
          <div className="h-[400px] w-full mt-4">
            {report.type === 'pie' && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={report.data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    legendType="circle"
                  >
                    {report.data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || `hsl(${index * 45}, 70%, 60%)`} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}`, '']} />
                  <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                </PieChart>
              </ResponsiveContainer>
            )}

            {report.type === 'bar' && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={report.data}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            )}

            {report.type === 'line' && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={report.data}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setSelectedReport(null)}>Close</Button>
            <Button onClick={() => {
              toast({
                title: "Report exported",
                description: "Your report has been exported to CSV"
              });
            }}>Export to CSV</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-md mb-6">
          <TabsTrigger value="reports">Browse Reports</TabsTrigger>
          <TabsTrigger value="create">Create Custom Report</TabsTrigger>
        </TabsList>
        
        <TabsContent value="reports" className="mt-0">
          <ReportsList 
            searchQuery={searchQuery} 
            categoryFilter={activeFilter !== "all" ? activeFilter : undefined}
            onViewReport={handleReportView} 
          />
        </TabsContent>
        
        <TabsContent value="create" className="mt-0">
          <CustomReportBuilder />
        </TabsContent>
      </Tabs>

      {renderReportPreview()}
    </div>
  );
};

export default Reports;
