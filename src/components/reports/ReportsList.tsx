
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, ChevronRight, LineChart, PieChart, BarChart, Share2 } from "lucide-react";
import { useDataMode } from "@/contexts/DataModeContext";
import { useToast } from "@/hooks/use-toast";

interface ReportData {
  id: string;
  name: string;
  description: string;
  category: string;
  lastUpdated: string;
  author: string;
  type: "line" | "pie" | "bar" | "custom";
  shared: boolean;
}

interface ReportsListProps {
  searchQuery?: string;
  categoryFilter?: string;
  onViewReport?: (reportId: string) => void;
}

export const ReportsList = ({ searchQuery = "", categoryFilter, onViewReport }: ReportsListProps) => {
  const { isRealData } = useDataMode();
  const { toast } = useToast();
  
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ReportData | null>(null);
  const [shareType, setShareType] = useState<string>("user");
  const [shareTarget, setShareTarget] = useState<string>("");
  
  const demoReports: ReportData[] = [
    {
      id: "rep-001",
      name: "Monthly Sales Overview",
      description: "Summary of sales performance for the current month",
      category: "sales",
      lastUpdated: "2 days ago",
      author: "John Doe",
      type: "line",
      shared: false
    },
    {
      id: "rep-002",
      name: "Customer Acquisition by Channel",
      description: "Breakdown of new customers by acquisition source",
      category: "marketing",
      lastUpdated: "1 week ago",
      author: "Sarah Miller",
      type: "pie",
      shared: true
    },
    {
      id: "rep-003",
      name: "Support Tickets by Category",
      description: "Distribution of support tickets across categories",
      category: "service",
      lastUpdated: "3 days ago",
      author: "Michael Chen",
      type: "bar",
      shared: false
    },
    {
      id: "rep-004",
      name: "Website Traffic Analysis",
      description: "Traffic sources and user behavior on the website",
      category: "analytics",
      lastUpdated: "Yesterday",
      author: "Emily Johnson",
      type: "line",
      shared: false
    },
    {
      id: "rep-005",
      name: "Revenue by Product Category",
      description: "Comparison of revenue across different product lines",
      category: "sales",
      lastUpdated: "5 days ago",
      author: "David Wilson",
      type: "bar",
      shared: true
    },
    {
      id: "rep-006",
      name: "Customer Satisfaction Trends",
      description: "Analysis of customer satisfaction scores over time",
      category: "customers",
      lastUpdated: "1 day ago",
      author: "Jessica Brown",
      type: "line",
      shared: false
    }
  ];

  const [reports, setReports] = useState<ReportData[]>(demoReports);

  const filteredReports = reports.filter(report => {
    const matchesSearch = 
      report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.author.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !categoryFilter || report.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const handleShareReport = () => {
    if (!selectedReport) return;
    
    // Update the selected report
    const updatedReports = reports.map(report => 
      report.id === selectedReport.id 
        ? { ...report, shared: true } 
        : report
    );
    
    setReports(updatedReports);
    setShowShareDialog(false);
    
    toast({
      title: "Report shared successfully",
      description: `"${selectedReport.name}" has been shared with ${shareType === 'organization' ? 'the entire organization' : shareTarget}.`,
    });
  };

  const openShareDialog = (report: ReportData) => {
    setSelectedReport(report);
    setShareType("user");
    setShareTarget("");
    setShowShareDialog(true);
  };

  const handleViewReport = (reportId: string) => {
    if (onViewReport) {
      onViewReport(reportId);
    }
  };

  const renderReportIcon = (type: string) => {
    switch (type) {
      case 'line': return <LineChart className="h-5 w-5 text-primary" />;
      case 'pie': return <PieChart className="h-5 w-5 text-primary" />;
      case 'bar': return <BarChart className="h-5 w-5 text-primary" />;
      default: return <LineChart className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <div className="space-y-4">
      {isRealData ? (
        <div className="text-center py-8">
          <Card className="mx-auto max-w-md p-6">
            <h3 className="text-lg font-medium mb-2">No Reports Available</h3>
            <p className="text-muted-foreground mb-4">
              No reports have been created yet or you don't have access to any reports.
            </p>
            <Button onClick={() => window.location.href = "/reports?tab=create"}>
              Create Your First Report
            </Button>
          </Card>
        </div>
      ) : (
        filteredReports.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredReports.map((report) => (
              <Card key={report.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center">
                        {renderReportIcon(report.type)}
                        <h3 className="font-medium ml-2">{report.name}</h3>
                      </div>
                      <Badge variant="outline" className="ml-2 capitalize">{report.category}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {report.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-muted-foreground">
                        Updated {report.lastUpdated} by {report.author}
                      </div>
                      {report.shared && (
                        <Badge variant="secondary" className="ml-2 text-xs">Shared</Badge>
                      )}
                    </div>
                  </div>
                  <div className="bg-muted/50 p-2 border-t flex justify-between">
                    <Button variant="ghost" size="sm" onClick={() => openShareDialog(report)}>
                      <Share2 className="h-4 w-4 mr-1" /> Share
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleViewReport(report.id)}
                    >
                      View <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">No reports found matching your criteria.</p>
            </CardContent>
          </Card>
        )
      )}

      {/* Share Report Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Report</DialogTitle>
            <DialogDescription>
              Share "{selectedReport?.name}" with team members or your entire organization
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Share with</label>
              <Select value={shareType} onValueChange={setShareType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select who to share with" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Specific User</SelectItem>
                  <SelectItem value="role">Role</SelectItem>
                  <SelectItem value="organization">Entire Organization</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {shareType !== 'organization' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {shareType === 'user' ? 'Select User' : 'Select Role'}
                </label>
                <Select value={shareTarget} onValueChange={setShareTarget}>
                  <SelectTrigger>
                    <SelectValue placeholder={shareType === 'user' ? "Select a user" : "Select a role"} />
                  </SelectTrigger>
                  <SelectContent>
                    {shareType === 'user' ? (
                      <>
                        <SelectItem value="john.doe@example.com">John Doe</SelectItem>
                        <SelectItem value="sarah.miller@example.com">Sarah Miller</SelectItem>
                        <SelectItem value="michael.chen@example.com">Michael Chen</SelectItem>
                        <SelectItem value="emily.johnson@example.com">Emily Johnson</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="admin">Administrators</SelectItem>
                        <SelectItem value="manager">Managers</SelectItem>
                        <SelectItem value="sales">Sales Team</SelectItem>
                        <SelectItem value="support">Support Team</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="bg-muted rounded-md p-3 text-sm">
              <p className="font-medium flex items-center">
                <Check className="h-4 w-4 mr-1 text-green-500" />
                Access Permissions
              </p>
              <p className="text-muted-foreground mt-1">
                Shared users will have view-only access to this report. 
                They will not be able to edit or delete it.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowShareDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleShareReport}
              disabled={shareType !== 'organization' && !shareTarget}
            >
              Share Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
