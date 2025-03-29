
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  BarChart3, 
  LineChart, 
  PieChart, 
  Download, 
  Eye, 
  Star, 
  Clock, 
  User, 
  Tag,
  ShoppingCart,
  Users,
  MessageSquare,
  Mail,
  Megaphone
} from "lucide-react";

interface Report {
  id: string;
  title: string;
  description: string;
  category: string;
  created: string;
  author: string;
  stars: number;
  views: number;
  type: "bar" | "line" | "pie" | "table";
  isPublic: boolean;
}

interface ReportsListProps {
  searchQuery?: string;
  categoryFilter?: string;
}

export const ReportsList = ({ searchQuery = "", categoryFilter }: ReportsListProps) => {
  // Sample report data - in a real app, this would come from Supabase
  const reports: Report[] = [
    {
      id: "1",
      title: "Monthly Sales Overview",
      description: "Overview of sales performance by product category and region",
      category: "sales",
      created: "2024-07-15",
      author: "John Smith",
      stars: 24,
      views: 142,
      type: "bar",
      isPublic: true
    },
    {
      id: "2",
      title: "Customer Satisfaction Analysis",
      description: "Analysis of customer satisfaction scores and feedback trends",
      category: "customers",
      created: "2024-07-12",
      author: "Lisa Wong",
      stars: 18,
      views: 98,
      type: "line",
      isPublic: true
    },
    {
      id: "3",
      title: "Marketing Campaign ROI",
      description: "Evaluation of return on investment for recent marketing campaigns",
      category: "marketing",
      created: "2024-07-10",
      author: "Michael Chen",
      stars: 31,
      views: 215,
      type: "pie",
      isPublic: true
    },
    {
      id: "4",
      title: "Service Ticket Resolution Times",
      description: "Analysis of ticket resolution times and efficiency metrics",
      category: "service",
      created: "2024-07-08",
      author: "Emma Rodriguez",
      stars: 12,
      views: 76,
      type: "line",
      isPublic: true
    },
    {
      id: "5",
      title: "Sales Forecasting Q3 2024",
      description: "Predictive analysis for Q3 sales with regional breakdown",
      category: "sales",
      created: "2024-07-05",
      author: "David Lee",
      stars: 27,
      views: 183,
      type: "bar",
      isPublic: false
    },
    {
      id: "6",
      title: "Email Marketing Performance",
      description: "Open rates, click-through rates, and conversion metrics",
      category: "marketing",
      created: "2024-07-02",
      author: "Sarah Johnson",
      stars: 15,
      views: 104,
      type: "line",
      isPublic: true
    },
    {
      id: "7",
      title: "Customer Acquisition Costs",
      description: "Analysis of customer acquisition costs by channel",
      category: "analytics",
      created: "2024-06-28",
      author: "Alex Thompson",
      stars: 19,
      views: 127,
      type: "bar",
      isPublic: false
    },
    {
      id: "8",
      title: "Support Team Performance",
      description: "Evaluation of support team efficiency and customer ratings",
      category: "service",
      created: "2024-06-25",
      author: "Jasmine Patel",
      stars: 22,
      views: 134,
      type: "pie",
      isPublic: true
    }
  ];

  // Filter reports based on search query and category
  const filteredReports = reports.filter(report => {
    const matchesSearch = 
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      report.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !categoryFilter || report.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  // Get icon based on report category
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'sales':
        return <ShoppingCart className="h-4 w-4" />;
      case 'customers':
        return <Users className="h-4 w-4" />;
      case 'service':
        return <MessageSquare className="h-4 w-4" />;
      case 'marketing':
        return <Megaphone className="h-4 w-4" />;
      case 'analytics':
        return <BarChart3 className="h-4 w-4" />;
      default:
        return <Tag className="h-4 w-4" />;
    }
  };
  
  // Get chart icon based on report type
  const getReportTypeIcon = (type: Report['type']) => {
    switch (type) {
      case 'bar':
        return <BarChart3 className="h-4 w-4" />;
      case 'line':
        return <LineChart className="h-4 w-4" />;
      case 'pie':
        return <PieChart className="h-4 w-4" />;
      default:
        return <BarChart3 className="h-4 w-4" />;
    }
  };

  if (filteredReports.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-10">
          <div className="rounded-full bg-muted p-3 mb-4">
            <BarChart3 className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">No reports found</h3>
          <p className="text-muted-foreground text-center mt-2 max-w-md">
            {searchQuery 
              ? `No reports match "${searchQuery}"${categoryFilter ? ` in the ${categoryFilter} category` : ''}.` 
              : `No reports available${categoryFilter ? ` in the ${categoryFilter} category` : ''}.`}
          </p>
          <Button variant="outline" className="mt-4">
            Create a Report
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredReports.map((report) => (
        <Card key={report.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-start justify-between gap-2">
              <span className="line-clamp-1">{report.title}</span>
              <Badge variant="outline" className="shrink-0 flex items-center gap-1 h-6">
                {getReportTypeIcon(report.type)}
                <span className="capitalize">{report.type} Chart</span>
              </Badge>
            </CardTitle>
            <CardDescription className="line-clamp-2">
              {report.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex items-center gap-2 mb-3">
              <Badge className="capitalize flex items-center gap-1 h-6">
                {getCategoryIcon(report.category)}
                {report.category}
              </Badge>
              {!report.isPublic && (
                <Badge variant="secondary">Private</Badge>
              )}
            </div>
            
            <div className="flex items-center text-sm text-muted-foreground">
              <div className="flex items-center gap-1 mr-4">
                <Clock className="h-3.5 w-3.5" />
                <span>{new Date(report.created).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="h-3.5 w-3.5" />
                <span>{report.author}</span>
              </div>
            </div>
          </CardContent>
          <Separator />
          <CardFooter className="flex justify-between p-4">
            <div className="flex items-center gap-4 text-muted-foreground text-sm">
              <div className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5" />
                <span>{report.stars}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" />
                <span>{report.views}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" title="Download Report">
                <Download className="h-4 w-4" />
              </Button>
              <Button>View Report</Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
