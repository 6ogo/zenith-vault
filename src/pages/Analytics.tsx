
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Sector, Tooltip, XAxis, YAxis } from "recharts";
import { useDataMode } from "@/contexts/DataModeContext";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";

const demoData = [
  { name: 'Jan', visits: 4000, conversions: 2400 },
  { name: 'Feb', visits: 3000, conversions: 1398 },
  { name: 'Mar', visits: 2000, conversions: 9800 },
  { name: 'Apr', visits: 2780, conversions: 3908 },
  { name: 'May', visits: 1890, conversions: 4800 },
  { name: 'Jun', visits: 2390, conversions: 3800 },
  { name: 'Jul', visits: 3490, conversions: 4300 },
];

const demoSources = [
  { name: 'Direct', value: 40 },
  { name: 'Organic', value: 30 },
  { name: 'Social', value: 20 },
  { name: 'Referral', value: 10 },
];

const demoSalesData = [
  { name: 'Jan', revenue: 42000, profit: 14700 },
  { name: 'Feb', revenue: 38000, profit: 13300 },
  { name: 'Mar', revenue: 45000, profit: 15750 },
  { name: 'Apr', revenue: 51000, profit: 17850 },
  { name: 'May', revenue: 49000, profit: 17150 },
  { name: 'Jun', revenue: 53000, profit: 18550 },
  { name: 'Jul', revenue: 56000, profit: 19600 },
];

const demoProductSales = [
  { name: 'Product A', value: 35 },
  { name: 'Product B', value: 25 },
  { name: 'Product C', value: 20 },
  { name: 'Product D', value: 15 },
  { name: 'Other', value: 5 },
];

const demoCampaignData = [
  { name: 'Email', sent: 8500, opened: 4250, clicked: 1275 },
  { name: 'Social', sent: 5200, opened: 2340, clicked: 780 },
  { name: 'Display', sent: 3800, opened: 1140, clicked: 570 },
  { name: 'Search', sent: 2900, opened: 2900, clicked: 783 },
  { name: 'Referral', sent: 1700, opened: 1700, clicked: 425 },
];

const Analytics = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { isRealData } = useDataMode();

  return (
    <div className="space-y-6 max-w-full">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Visualize your business performance and customer insights
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 max-w-[600px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="traffic">Traffic</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="marketing">Marketing</TabsTrigger>
          <TabsTrigger value="custom">Custom</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          {isRealData ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">No real analytics data available. Connect your data sources in Integrations.</p>
              <Button 
                onClick={() => window.location.href = "/integrations"}
                className="mt-4"
              >
                <ArrowUpRight className="h-4 w-4 mr-1" /> Go to Integrations
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Website Traffic</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={demoData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="visits" stroke="#8884d8" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Traffic Sources</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={demoSources}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      />
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Conversions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={demoData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="conversions" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="traffic" className="mt-6">
          {isRealData ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">No real traffic data available. Connect your analytics platforms.</p>
              <Button 
                onClick={() => window.location.href = "/integrations"}
                className="mt-4"
              >
                <ArrowUpRight className="h-4 w-4 mr-1" /> Go to Integrations
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Traffic by Channel</CardTitle>
                  <CardDescription>Visitor sources over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={[
                      { month: 'Jan', Organic: 4200, Direct: 2400, Social: 1800, Referral: 1200 },
                      { month: 'Feb', Organic: 3800, Direct: 2200, Social: 1600, Referral: 1100 },
                      { month: 'Mar', Organic: 4500, Direct: 2700, Social: 2100, Referral: 1500 },
                      { month: 'Apr', Organic: 5100, Direct: 3000, Social: 2400, Referral: 1800 },
                      { month: 'May', Organic: 5400, Direct: 3200, Social: 2700, Referral: 2000 },
                      { month: 'Jun', Organic: 5800, Direct: 3500, Social: 3000, Referral: 2100 },
                      { month: 'Jul', Organic: 6200, Direct: 3800, Social: 3200, Referral: 2300 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="Organic" stroke="#8884d8" />
                      <Line type="monotone" dataKey="Direct" stroke="#82ca9d" />
                      <Line type="monotone" dataKey="Social" stroke="#ffc658" />
                      <Line type="monotone" dataKey="Referral" stroke="#ff8042" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Top Landing Pages</CardTitle>
                  <CardDescription>Most visited entry points</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-b pb-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">/homepage</span>
                        <span className="text-sm">45.8%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full">
                        <div className="h-full bg-primary rounded-full" style={{ width: '45.8%' }}></div>
                      </div>
                    </div>
                    
                    <div className="border-b pb-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">/products</span>
                        <span className="text-sm">22.3%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full">
                        <div className="h-full bg-primary rounded-full" style={{ width: '22.3%' }}></div>
                      </div>
                    </div>
                    
                    <div className="border-b pb-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">/blog/top-10-tips</span>
                        <span className="text-sm">12.6%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full">
                        <div className="h-full bg-primary rounded-full" style={{ width: '12.6%' }}></div>
                      </div>
                    </div>
                    
                    <div className="border-b pb-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">/pricing</span>
                        <span className="text-sm">8.4%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full">
                        <div className="h-full bg-primary rounded-full" style={{ width: '8.4%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">/contact</span>
                        <span className="text-sm">5.7%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full">
                        <div className="h-full bg-primary rounded-full" style={{ width: '5.7%' }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Device Breakdown</CardTitle>
                  <CardDescription>Visitor device types</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Mobile', value: 58 },
                          { name: 'Desktop', value: 34 },
                          { name: 'Tablet', value: 8 },
                        ]}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="sales" className="mt-6">
          {isRealData ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">No real sales analytics available. Connect your CRM or sales platforms.</p>
              <Button 
                onClick={() => window.location.href = "/integrations"}
                className="mt-4"
              >
                <ArrowUpRight className="h-4 w-4 mr-1" /> Go to Integrations
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Sales Performance</CardTitle>
                  <CardDescription>Revenue and profit over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={demoSalesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="revenue" fill="#8884d8" name="Revenue" />
                      <Bar dataKey="profit" fill="#82ca9d" name="Profit" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Sales by Product</CardTitle>
                  <CardDescription>Distribution of product sales</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={demoProductSales}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Regions</CardTitle>
                  <CardDescription>Sales by geographical region</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-b pb-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">North America</span>
                        <span className="text-sm">$125,400</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full">
                        <div className="h-full bg-primary rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                    
                    <div className="border-b pb-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">Europe</span>
                        <span className="text-sm">$98,750</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full">
                        <div className="h-full bg-primary rounded-full" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                    
                    <div className="border-b pb-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">Asia Pacific</span>
                        <span className="text-sm">$74,200</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full">
                        <div className="h-full bg-primary rounded-full" style={{ width: '45%' }}></div>
                      </div>
                    </div>
                    
                    <div className="border-b pb-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">Latin America</span>
                        <span className="text-sm">$32,850</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full">
                        <div className="h-full bg-primary rounded-full" style={{ width: '20%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">Middle East & Africa</span>
                        <span className="text-sm">$18,400</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full">
                        <div className="h-full bg-primary rounded-full" style={{ width: '12%' }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="marketing" className="mt-6">
          {isRealData ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">No real marketing data available. Connect your marketing platforms.</p>
              <Button 
                onClick={() => window.location.href = "/integrations"}
                className="mt-4"
              >
                <ArrowUpRight className="h-4 w-4 mr-1" /> Go to Integrations
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Campaign Performance</CardTitle>
                  <CardDescription>Engagement metrics by channel</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={demoCampaignData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="sent" fill="#8884d8" name="Sent/Impressions" />
                      <Bar dataKey="opened" fill="#82ca9d" name="Opened/Viewed" />
                      <Bar dataKey="clicked" fill="#ffc658" name="Clicked/Engaged" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Campaigns</CardTitle>
                  <CardDescription>Campaigns with highest ROI</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-b pb-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Summer Sale Email</span>
                        <span className="text-sm bg-green-500/10 text-green-500 px-2 py-1 rounded-full text-xs">487% ROI</span>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Sent Jul 15 - Generated $24,500 in revenue
                      </div>
                    </div>
                    
                    <div className="border-b pb-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Product Launch Webinar</span>
                        <span className="text-sm bg-green-500/10 text-green-500 px-2 py-1 rounded-full text-xs">352% ROI</span>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Held Jun 8 - Generated $18,750 in revenue
                      </div>
                    </div>
                    
                    <div className="border-b pb-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Referral Program</span>
                        <span className="text-sm bg-green-500/10 text-green-500 px-2 py-1 rounded-full text-xs">295% ROI</span>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Ongoing - Generated $15,200 in revenue
                      </div>
                    </div>
                    
                    <div className="border-b pb-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Social Media Contest</span>
                        <span className="text-sm bg-green-500/10 text-green-500 px-2 py-1 rounded-full text-xs">243% ROI</span>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        May 1-15 - Generated $12,850 in revenue
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Retargeting Ad Campaign</span>
                        <span className="text-sm bg-green-500/10 text-green-500 px-2 py-1 rounded-full text-xs">189% ROI</span>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Ongoing - Generated $9,400 in revenue
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Customer Acquisition</CardTitle>
                  <CardDescription>Cost per acquisition by channel</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-b pb-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">Email</span>
                        <span className="text-sm">$12 CPA</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                    
                    <div className="border-b pb-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">Organic Search</span>
                        <span className="text-sm">$15 CPA</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                    
                    <div className="border-b pb-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">Referral</span>
                        <span className="text-sm">$18 CPA</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                    
                    <div className="border-b pb-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">Social Media</span>
                        <span className="text-sm">$25 CPA</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: '50%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">Paid Search</span>
                        <span className="text-sm">$32 CPA</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: '40%' }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="custom" className="mt-6">
          {isRealData ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">Upload and analyze your custom data here. Connect data sources or upload files in the Data Files section.</p>
              <Button 
                onClick={() => window.location.href = "/data"}
                className="mt-4"
              >
                <ArrowUpRight className="h-4 w-4 mr-1" /> Go to Data Files
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Custom Report Builder</CardTitle>
                  <CardDescription>Create custom analytics reports for your specific needs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-6 text-center border rounded-md bg-muted/20">
                    <h3 className="text-lg font-medium mb-2">Build Your Own Reports</h3>
                    <p className="text-muted-foreground mb-4">
                      Combine data from multiple sources and create visualizations tailored to your business questions.
                    </p>
                    <Button 
                      onClick={() => window.location.href = "/reports"}
                      className="mt-2"
                    >
                      <ArrowUpRight className="h-4 w-4 mr-1" /> Create Custom Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Popular Custom Reports</CardTitle>
                  <CardDescription>Reports built by your team</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b pb-2">
                      <div>
                        <div className="font-medium">Q2 Sales Performance</div>
                        <div className="text-xs text-muted-foreground">Created by John D.</div>
                      </div>
                      <Button variant="outline" size="sm">View</Button>
                    </div>
                    
                    <div className="flex items-center justify-between border-b pb-2">
                      <div>
                        <div className="font-medium">Marketing ROI Analysis</div>
                        <div className="text-xs text-muted-foreground">Created by Sarah T.</div>
                      </div>
                      <Button variant="outline" size="sm">View</Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Customer Retention Dashboard</div>
                        <div className="text-xs text-muted-foreground">Created by Michael C.</div>
                      </div>
                      <Button variant="outline" size="sm">View</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Scheduled Reports</CardTitle>
                  <CardDescription>Reports set to automatically run</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b pb-2">
                      <div>
                        <div className="font-medium">Weekly Sales Summary</div>
                        <div className="text-xs text-muted-foreground">Mondays at 9:00 AM</div>
                      </div>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                    
                    <div className="flex items-center justify-between border-b pb-2">
                      <div>
                        <div className="font-medium">Monthly Marketing Analysis</div>
                        <div className="text-xs text-muted-foreground">1st of each month</div>
                      </div>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Quarterly Business Review</div>
                        <div className="text-xs text-muted-foreground">Last day of quarter</div>
                      </div>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
