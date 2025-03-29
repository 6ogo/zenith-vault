import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Code, Database, FileJson, Upload, Save, Play, BarChart, PieChart, LineChart, Search, User, Users, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Role, Permission } from "@/types/organization";
import { ComboboxPopover } from "@/components/ui/combobox";
import { useDataMode } from "@/contexts/DataModeContext";

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  language: 'sql' | 'python' | 'r';
  code: string;
  category: string;
}

const reportTemplates: ReportTemplate[] = [
  {
    id: 'sales-monthly',
    name: 'Monthly Sales Performance',
    description: 'Shows sales trends over the last 12 months with comparisons to targets',
    language: 'sql',
    category: 'sales',
    code: `-- Monthly Sales Performance
SELECT 
  DATE_TRUNC('month', created_at) AS month,
  SUM(amount) AS total_sales,
  COUNT(*) AS transaction_count,
  AVG(amount) AS average_sale
FROM sales
WHERE created_at >= NOW() - INTERVAL '12 months'
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month DESC;`
  },
  {
    id: 'customer-engagement',
    name: 'Customer Engagement Metrics',
    description: 'Analyzes customer interactions and engagement levels',
    language: 'sql',
    category: 'customers',
    code: `-- Customer Engagement Analysis
SELECT 
  c.id, 
  c.name,
  COUNT(i.id) AS interaction_count,
  MAX(i.created_at) AS last_interaction,
  NOW() - MAX(i.created_at) AS days_since_last_interaction
FROM customers c
LEFT JOIN customer_interactions i ON c.id = i.customer_id
WHERE i.created_at >= NOW() - INTERVAL '90 days'
GROUP BY c.id, c.name
ORDER BY interaction_count DESC;`
  },
  {
    id: 'service-performance',
    name: 'Support Ticket Analysis',
    description: 'Analyzes support ticket resolution times and satisfaction ratings',
    language: 'sql',
    category: 'service',
    code: `-- Support Ticket Analysis
SELECT 
  agent_id,
  COUNT(*) AS tickets_handled,
  AVG(EXTRACT(EPOCH FROM (resolved_at - created_at))/3600) AS avg_resolution_hours,
  AVG(satisfaction_rating) AS avg_satisfaction
FROM support_tickets
WHERE status = 'closed'
  AND created_at >= NOW() - INTERVAL '30 days'
GROUP BY agent_id
ORDER BY avg_resolution_hours ASC;`
  },
  {
    id: 'marketing-campaign',
    name: 'Marketing Campaign Performance',
    description: 'Evaluates marketing campaign effectiveness and ROI',
    language: 'python',
    category: 'marketing',
    code: `# Marketing Campaign Performance Analysis
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# Load campaign data
# In production, this would use your real data source
campaigns = pd.read_csv('campaigns.csv')

# Calculate key metrics
campaigns['roi'] = campaigns['revenue'] / campaigns['cost']
campaigns['conversion_rate'] = campaigns['conversions'] / campaigns['impressions'] * 100

# Summarize results
summary = campaigns.groupby('channel').agg({
    'impressions': 'sum',
    'clicks': 'sum',
    'conversions': 'sum',
    'cost': 'sum',
    'revenue': 'sum',
    'roi': 'mean',
    'conversion_rate': 'mean'
})

# Print results
print(summary.sort_values('roi', ascending=False))`
  },
  {
    id: 'financial-analysis',
    name: 'Financial Performance Analysis',
    description: 'Comprehensive financial analysis with key ratios and trends',
    language: 'r',
    category: 'analytics',
    code: `# Financial Performance Analysis
library(tidyverse)
library(lubridate)

# Load financial data
# In production, would connect to your actual data source
financials <- read.csv("financial_data.csv")

# Calculate key financial ratios
financials <- financials %>%
  mutate(
    gross_margin = (revenue - cost_of_goods) / revenue * 100,
    operating_margin = operating_income / revenue * 100,
    net_margin = net_income / revenue * 100,
    month = floor_date(as.Date(date), "month")
  )

# Summarize by month
monthly_performance <- financials %>%
  group_by(month) %>%
  summarise(
    revenue = sum(revenue),
    expenses = sum(expenses),
    profit = sum(revenue - expenses),
    margin = mean(net_margin)
  )

# Print results
print(monthly_performance)`
  }
];

export const CustomReportBuilder = () => {
  const [reportTitle, setReportTitle] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [reportType, setReportType] = useState("sql");
  const [reportCategory, setReportCategory] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [codeEditorContent, setCodeEditorContent] = useState("-- Write your SQL query here\nSELECT * FROM sales\nWHERE created_at > NOW() - INTERVAL '30 days'\nORDER BY amount DESC\nLIMIT 10;");
  const [pythonEditorContent, setPythonEditorContent] = useState("# Python script for data analysis\nimport pandas as pd\nimport numpy as np\n\n# Load data\n# This is just a placeholder, in production this would access your data\ndf = pd.read_csv('sales_data.csv')\n\n# Perform analysis\nmonthly_sales = df.groupby(pd.Grouper(key='date', freq='M'))['amount'].sum()\n\n# Output results\nprint(monthly_sales)");
  const [rEditorContent, setREditorContent] = useState("# R script for statistical analysis\n\n# Load libraries\nlibrary(tidyverse)\nlibrary(lubridate)\n\n# Load data\n# This is just a placeholder\ndata <- read.csv('customer_data.csv')\n\n# Analyze data\nmonthly_summary <- data %>%\n  mutate(month = floor_date(as.Date(date), 'month')) %>%\n  group_by(month) %>%\n  summarise(total_sales = sum(amount),\n            avg_order = mean(amount),\n            customer_count = n_distinct(customer_id))\n\n# Plot results\nggplot(monthly_summary, aes(x = month, y = total_sales)) +\n  geom_line() +\n  theme_minimal() +\n  labs(title = 'Monthly Sales Trend',\n       x = 'Month',\n       y = 'Total Sales')");

  const [specificRoles, setSpecificRoles] = useState<string[]>([]);
  const [specificPersons, setSpecificPersons] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showTemplates, setShowTemplates] = useState(false);
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  const [organizationMembers, setOrganizationMembers] = useState<{id: string, name: string}[]>([]);
  const { isRealData } = useDataMode();

  useEffect(() => {
    setAvailableRoles([
      { id: '1', name: 'Admin', is_system_role: true, organization_id: '1' },
      { id: '2', name: 'Manager', is_system_role: false, organization_id: '1' },
      { id: '3', name: 'Analyst', is_system_role: false, organization_id: '1' },
      { id: '4', name: 'User', is_system_role: true, organization_id: '1' }
    ]);
    
    setOrganizationMembers([
      { id: '1', name: 'John Smith' },
      { id: '2', name: 'Sarah Wilson' },
      { id: '3', name: 'Mike Johnson' },
      { id: '4', name: 'Jane Smith' }
    ]);
  }, []);

  const handleSaveReport = () => {
    if (!reportTitle) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please provide a title for your report."
      });
      return;
    }

    if (!reportCategory) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please select a category for your report."
      });
      return;
    }

    toast({
      title: "Report Saved",
      description: "Your custom report has been saved successfully.",
      action: (
        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/20">
          <CheckCircle2 className="h-5 w-5 text-primary" />
        </div>
      ),
    });
  };

  const handleRunReport = () => {
    toast({
      title: "Report Executed",
      description: `Your ${reportType.toUpperCase()} code is now running. Results will appear soon.`,
    });
  };

  const handleTemplateSelect = (template: ReportTemplate) => {
    setReportTitle(template.name);
    setReportDescription(template.description);
    setReportCategory(template.category);
    setReportType(template.language);
    
    switch (template.language) {
      case 'sql':
        setCodeEditorContent(template.code);
        break;
      case 'python':
        setPythonEditorContent(template.code);
        break;
      case 'r':
        setREditorContent(template.code);
        break;
    }
    
    setShowTemplates(false);
    
    toast({
      title: "Template Applied",
      description: `The template "${template.name}" has been applied to your report.`
    });
  };

  const filteredTemplates = reportTemplates.filter(template => 
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRoleToggle = (roleId: string) => {
    setSpecificRoles(prev => 
      prev.includes(roleId) 
        ? prev.filter(id => id !== roleId) 
        : [...prev, roleId]
    );
  };

  const handlePersonToggle = (personId: string) => {
    setSpecificPersons(prev => 
      prev.includes(personId) 
        ? prev.filter(id => id !== personId) 
        : [...prev, personId]
    );
  };

  const renderLanguageTab = (language: string) => {
    let content = '';
    let setValue = (v: string) => {};
    
    switch (language) {
      case 'sql':
        content = codeEditorContent;
        setValue = setCodeEditorContent;
        break;
      case 'python':
        content = pythonEditorContent;
        setValue = setPythonEditorContent;
        break;
      case 'r':
        content = rEditorContent;
        setValue = setREditorContent;
        break;
    }
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            <span className="font-medium">{language.toUpperCase()} Editor</span>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 gap-1"
              onClick={() => setShowTemplates(true)}
            >
              <FileJson className="h-4 w-4" />
              Templates
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 gap-1"
              onClick={() => toast({
                title: "Upload File",
                description: "File upload functionality will be available soon."
              })}
            >
              <Upload className="h-4 w-4" />
              Upload
            </Button>
          </div>
        </div>
        
        <div className="relative rounded-md border">
          <div className="flex items-center justify-between text-xs text-muted-foreground p-2 bg-muted border-b">
            <div className="flex gap-2">
              {language === 'sql' && <Badge variant="outline">PostgreSQL</Badge>}
              {language === 'python' && <Badge variant="outline">Python 3.9</Badge>}
              {language === 'r' && <Badge variant="outline">R 4.2</Badge>}
              <Badge variant="outline">Syntax</Badge>
            </div>
            <span>Allowed: Select Queries Only</span>
          </div>
          <div className="p-4 bg-muted/50 font-mono text-sm overflow-auto whitespace-pre rounded-b-md" style={{ minHeight: '300px' }}>
            <textarea
              className="w-full h-72 bg-transparent border-none resize-none focus:outline-none"
              value={content}
              onChange={(e) => setValue(e.target.value)}
              spellCheck={false}
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button
              onClick={handleRunReport}
              className="gap-1"
            >
              <Play className="h-4 w-4" />
              Run {language.toUpperCase()}
            </Button>
            <Button
              variant="outline"
              onClick={() => toast({
                title: "Scheduled Execution",
                description: "Scheduling functionality will be available soon."
              })}
            >
              Schedule Execution
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Select defaultValue="line">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Chart Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bar">
                  <div className="flex items-center gap-2">
                    <BarChart className="h-4 w-4" />
                    <span>Bar Chart</span>
                  </div>
                </SelectItem>
                <SelectItem value="line">
                  <div className="flex items-center gap-2">
                    <LineChart className="h-4 w-4" />
                    <span>Line Chart</span>
                  </div>
                </SelectItem>
                <SelectItem value="pie">
                  <div className="flex items-center gap-2">
                    <PieChart className="h-4 w-4" />
                    <span>Pie Chart</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Report Details</CardTitle>
            <CardDescription>
              Enter the basic information about your custom report
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Report Title</Label>
                <Input 
                  id="title" 
                  value={reportTitle} 
                  onChange={(e) => setReportTitle(e.target.value)} 
                  placeholder="Monthly Sales Analysis"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={reportCategory} onValueChange={setReportCategory}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="customers">Customers</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="service">Service</SelectItem>
                    <SelectItem value="analytics">Analytics</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                value={reportDescription} 
                onChange={(e) => setReportDescription(e.target.value)} 
                placeholder="Analyze monthly sales performance by product category and region"
              />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="public-report" 
                    checked={isPublic} 
                    onCheckedChange={setIsPublic} 
                  />
                  <Label htmlFor="public-report" className="text-sm font-medium">
                    Make report public to organization
                  </Label>
                </div>
                
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-muted-foreground" />
                  <Select defaultValue={isRealData ? "production" : "demo"}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Select database" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="production">Production DB</SelectItem>
                      <SelectItem value="analytics">Analytics DB</SelectItem>
                      <SelectItem value="staging">Staging DB</SelectItem>
                      <SelectItem value="demo">Demo DB</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {!isPublic && (
                <Card className="p-4 border-dashed">
                  <CardHeader className="p-0 pb-2">
                    <CardTitle className="text-sm">Access Control</CardTitle>
                    <CardDescription>Specify who can access this report</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0 space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="h-4 w-4" />
                        <h4 className="font-medium text-sm">Role-based access</h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {availableRoles.map(role => (
                          <Badge 
                            key={role.id} 
                            variant={specificRoles.includes(role.id) ? "default" : "outline"}
                            className="cursor-pointer"
                            onClick={() => handleRoleToggle(role.id)}
                          >
                            {role.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <User className="h-4 w-4" />
                        <h4 className="font-medium text-sm">Person-based access</h4>
                      </div>
                      <div className="relative mb-2">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search members..."
                          className="pl-8"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {organizationMembers
                          .filter(member => 
                            member.name.toLowerCase().includes(searchTerm.toLowerCase())
                          )
                          .map(member => (
                            <Badge 
                              key={member.id} 
                              variant={specificPersons.includes(member.id) ? "default" : "outline"}
                              className="cursor-pointer"
                              onClick={() => handlePersonToggle(member.id)}
                            >
                              {member.name}
                            </Badge>
                          ))
                        }
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Report Source</CardTitle>
            <CardDescription>
              Create your report using SQL, Python, or R
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="sql" onValueChange={setReportType}>
              <TabsList className="grid grid-cols-3 w-full max-w-md">
                <TabsTrigger value="sql">SQL</TabsTrigger>
                <TabsTrigger value="python">Python</TabsTrigger>
                <TabsTrigger value="r">R</TabsTrigger>
              </TabsList>
              
              <TabsContent value="sql" className="pt-4">
                {renderLanguageTab('sql')}
              </TabsContent>
              
              <TabsContent value="python" className="pt-4">
                {renderLanguageTab('python')}
              </TabsContent>
              
              <TabsContent value="r" className="pt-4">
                {renderLanguageTab('r')}
              </TabsContent>
            </Tabs>
          </CardContent>
          <Separator />
          <CardFooter className="flex justify-between p-6">
            <Button 
              variant="outline"
              onClick={() => toast({
                title: "Draft Saved",
                description: "Your report draft has been saved."
              })}
            >
              Save as Draft
            </Button>
            <Button 
              onClick={handleSaveReport}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              Save & Publish Report
            </Button>
          </CardFooter>
        </Card>
      </div>

      {showTemplates && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg shadow-lg w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Report Templates</h2>
                <Button variant="ghost" size="icon" onClick={() => setShowTemplates(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-muted-foreground mt-1">Select a template to quickly create your report</p>
              
              <div className="relative my-2">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search templates..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-auto p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredTemplates.map(template => (
                  <Card 
                    key={template.id}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md flex items-center gap-2">
                        {template.name}
                        <Badge variant="outline" className="ml-auto">
                          {template.language.toUpperCase()}
                        </Badge>
                      </CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Badge>{template.category}</Badge>
                      <div className="mt-2 text-xs text-muted-foreground line-clamp-2 font-mono">
                        {template.code.split('\n').slice(0, 2).join('\n')}...
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {filteredTemplates.length === 0 && (
                  <div className="col-span-2 text-center py-8 text-muted-foreground">
                    No templates found matching your search criteria.
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-4 border-t">
              <Button variant="outline" onClick={() => setShowTemplates(false)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
