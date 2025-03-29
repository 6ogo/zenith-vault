
import React, { useState } from "react";
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
import { CheckCircle2, Code, Database, FileJson, Upload, Save, Play, BarChart, PieChart, LineChart } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export const CustomReportBuilder = () => {
  const [reportTitle, setReportTitle] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [reportType, setReportType] = useState("sql");
  const [reportCategory, setReportCategory] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [codeEditorContent, setCodeEditorContent] = useState("-- Write your SQL query here\nSELECT * FROM sales\nWHERE created_at > NOW() - INTERVAL '30 days'\nORDER BY amount DESC\nLIMIT 10;");
  const [pythonEditorContent, setPythonEditorContent] = useState("# Python script for data analysis\nimport pandas as pd\nimport numpy as np\n\n# Load data\n# This is just a placeholder, in production this would access your data\ndf = pd.read_csv('sales_data.csv')\n\n# Perform analysis\nmonthly_sales = df.groupby(pd.Grouper(key='date', freq='M'))['amount'].sum()\n\n# Output results\nprint(monthly_sales)");
  const [rEditorContent, setREditorContent] = useState("# R script for statistical analysis\n\n# Load libraries\nlibrary(tidyverse)\nlibrary(lubridate)\n\n# Load data\n# This is just a placeholder\ndata <- read.csv('customer_data.csv')\n\n# Analyze data\nmonthly_summary <- data %>%\n  mutate(month = floor_date(as.Date(date), 'month')) %>%\n  group_by(month) %>%\n  summarise(total_sales = sum(amount),\n            avg_order = mean(amount),\n            customer_count = n_distinct(customer_id))\n\n# Plot results\nggplot(monthly_summary, aes(x = month, y = total_sales)) +\n  geom_line() +\n  theme_minimal() +\n  labs(title = 'Monthly Sales Trend',\n       x = 'Month',\n       y = 'Total Sales')");

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

    // In a real app, this would save to Supabase
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
    // This would normally execute the query or script
    toast({
      title: "Report Executed",
      description: `Your ${reportType.toUpperCase()} code is now running. Results will appear soon.`,
    });
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
              onClick={() => toast({
                title: "Templates",
                description: "Report templates will be available soon."
              })}
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
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Label htmlFor="public-report" className="text-sm font-medium">
                Make report public to organization
              </Label>
              <Switch 
                id="public-report" 
                checked={isPublic} 
                onCheckedChange={setIsPublic} 
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-muted-foreground" />
              <Select defaultValue="production">
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Select database" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="production">Production DB</SelectItem>
                  <SelectItem value="analytics">Analytics DB</SelectItem>
                  <SelectItem value="staging">Staging DB</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
  );
};
