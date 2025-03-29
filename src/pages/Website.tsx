
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Plus, ExternalLink, Code, PenTool, Eye, Globe, AlertCircle, CheckCircle, XCircle, Search } from "lucide-react";
import { useDataMode } from "@/contexts/DataModeContext";
import DataModeToggle from "@/components/dashboard/DataModeToggle";

const Website = () => {
  const { isRealData, setIsRealData } = useDataMode();
  const [activeTab, setActiveTab] = useState("seo");

  // Demo SEO issues
  const demoSeoIssues = [
    { id: 1, severity: "high", issue: "Missing meta descriptions on 8 pages", url: "https://example.com/about" },
    { id: 2, severity: "medium", issue: "Slow loading time (>3s) on 5 pages", url: "https://example.com/products" },
    { id: 3, severity: "high", issue: "Duplicate content detected", url: "https://example.com/services" },
    { id: 4, severity: "low", issue: "Missing alt text on 12 images", url: "https://example.com/gallery" },
    { id: 5, severity: "medium", issue: "Mobile optimization issues", url: "https://example.com/contact" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Website SEO Analyzer</h1>
          <p className="text-muted-foreground">
            Monitor and improve your website's SEO performance and ranking factors.
          </p>
        </div>
        <div className="flex gap-3">
          <DataModeToggle isRealData={isRealData} onToggle={setIsRealData} />
          <Button size="sm" className="font-medium">
            <Plus className="h-4 w-4 mr-1" /> Add Website
          </Button>
        </div>
      </div>
      
      {isRealData && (
        <Alert variant="destructive" className="bg-amber-50 text-amber-800 border-amber-200">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No websites connected</AlertTitle>
          <AlertDescription>
            Connect your website in the settings to start monitoring SEO performance.
          </AlertDescription>
        </Alert>
      )}
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 lg:w-[600px]">
          <TabsTrigger value="seo">SEO Analysis</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="keywords">Keywords</TabsTrigger>
          <TabsTrigger value="backlinks">Backlinks</TabsTrigger>
          <TabsTrigger value="competitors">Competitors</TabsTrigger>
        </TabsList>
        
        <TabsContent value="seo" className="mt-4">
          {isRealData ? (
            <Card className="dashboard-card p-6">
              <div className="text-center p-8">
                <Globe className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No websites connected</h3>
                <p className="text-muted-foreground mb-4">
                  Connect your website to start analyzing SEO performance and get recommendations.
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-1" /> Connect Website
                </Button>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>SEO Health Score</CardTitle>
                  <CardDescription>Overall SEO performance of your website</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-5xl font-bold">78<span className="text-2xl text-muted-foreground">/100</span></div>
                    <div className="text-right">
                      <p className="font-medium">Last checked: 2 hours ago</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        <RefreshCw className="h-4 w-4 mr-1" /> Re-analyze
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-green-500" style={{ width: "78%" }}></div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>SEO Issues</CardTitle>
                  <CardDescription>Problems that could affect your search rankings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {demoSeoIssues.map((issue) => (
                      <div key={issue.id} className="flex items-start gap-3 p-3 border rounded-lg">
                        {issue.severity === "high" ? (
                          <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                        ) : issue.severity === "medium" ? (
                          <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                        ) : (
                          <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <p className="font-medium">{issue.issue}</p>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              issue.severity === "high" ? "bg-red-100 text-red-800" :
                              issue.severity === "medium" ? "bg-amber-100 text-amber-800" :
                              "bg-blue-100 text-blue-800"
                            }`}>
                              {issue.severity.charAt(0).toUpperCase() + issue.severity.slice(1)}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1 break-all">{issue.url}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="performance" className="mt-4">
          <div className="p-8 text-center text-muted-foreground">
            {isRealData 
              ? "Connect your website to analyze performance metrics." 
              : "Website performance analysis will be available here."}
          </div>
        </TabsContent>
        
        <TabsContent value="keywords" className="mt-4">
          <div className="p-8 text-center text-muted-foreground">
            {isRealData 
              ? "Connect your website to track keyword rankings." 
              : "Keyword tracking and analysis will be available here."}
          </div>
        </TabsContent>
        
        <TabsContent value="backlinks" className="mt-4">
          <div className="p-8 text-center text-muted-foreground">
            {isRealData 
              ? "Connect your website to analyze backlink profile." 
              : "Backlink analysis will be available here."}
          </div>
        </TabsContent>
        
        <TabsContent value="competitors" className="mt-4">
          <div className="p-8 text-center text-muted-foreground">
            {isRealData 
              ? "Connect your website to compare with competitors." 
              : "Competitor analysis will be available here."}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Website;
