import React, { useState } from "react";
import { useDataMode } from "@/contexts/DataModeContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, ArrowUpRight, ExternalLink, Globe, LineChart, Search, Link as LinkIcon, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Website = () => {
  const { isRealData } = useDataMode();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("performance");
  const [showAddWebsiteDialog, setShowAddWebsiteDialog] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [websiteType, setWebsiteType] = useState("organization");
  const [scanType, setScanType] = useState("single");

  const handleAddWebsite = () => {
    if (!websiteUrl) {
      toast({
        title: "Website URL is required",
        description: "Please enter a valid website URL",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Website added",
      description: `${websiteUrl} has been added for ${scanType === "single" ? "single page" : "full"} scanning as a ${websiteType} website.`,
    });
    
    setWebsiteUrl("");
    setWebsiteType("organization");
    setScanType("single");
    setShowAddWebsiteDialog(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Website Management</h1>
          <p className="text-muted-foreground">
            Monitor and optimize your web presence
          </p>
        </div>
        <Button onClick={() => setShowAddWebsiteDialog(true)}>
          <Plus className="h-4 w-4 mr-1" /> Add Website
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 md:w-[600px]">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="keywords">Keywords</TabsTrigger>
          <TabsTrigger value="backlinks">Backlinks</TabsTrigger>
          <TabsTrigger value="competitors">Competitors</TabsTrigger>
        </TabsList>
        
        <TabsContent value="performance" className="mt-6">
          {isRealData ? (
            <div className="text-center py-8">
              <Card className="mx-auto max-w-md p-6">
                <h3 className="text-lg font-medium mb-2">No Performance Data</h3>
                <p className="text-muted-foreground mb-4">
                  Add your website to start tracking performance metrics.
                </p>
                <Button onClick={() => setShowAddWebsiteDialog(true)}>
                  <Plus className="h-4 w-4 mr-1" /> Add Website
                </Button>
              </Card>
            </div>
          ) : (
            <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Web Traffic Overview</CardTitle>
                  <CardDescription>Monthly visitors and engagement metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-center justify-center">
                    <div className="w-full h-full flex flex-col items-center justify-center">
                      <LineChart className="h-12 w-12 text-muted-foreground mb-4" />
                      <div className="text-center">
                        <h3 className="text-lg font-medium mb-1">Website Traffic</h3>
                        <p className="text-sm text-muted-foreground mb-3">Last 30 days</p>
                        <div className="grid grid-cols-4 gap-4 max-w-lg mx-auto mb-2">
                          <div className="text-center">
                            <div className="text-2xl font-bold">12.4K</div>
                            <div className="text-xs text-muted-foreground">Users</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold">35.7K</div>
                            <div className="text-xs text-muted-foreground">Sessions</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold">2:45</div>
                            <div className="text-xs text-muted-foreground">Avg. Time</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold">42.3%</div>
                            <div className="text-xs text-muted-foreground">Bounce Rate</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Performance Score</CardTitle>
                  <CardDescription>Web Core Vitals</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">Overall</span>
                        <span className="text-sm font-medium text-primary">86/100</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: '86%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">LCP</span>
                        <span className="text-sm font-medium text-primary">2.3s</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">FID</span>
                        <span className="text-sm font-medium text-primary">18ms</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: '92%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">CLS</span>
                        <span className="text-sm font-medium text-primary">0.12</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: '80%' }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Page Speed</CardTitle>
                  <CardDescription>Mobile vs Desktop</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">Mobile</span>
                        <span className="text-sm font-medium text-amber-500">72/100</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: '72%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">Desktop</span>
                        <span className="text-sm font-medium text-green-500">94/100</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: '94%' }}></div>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <h4 className="text-sm font-medium mb-2">Improvement Suggestions</h4>
                      <ul className="text-sm space-y-2">
                        <li className="flex items-start gap-2">
                          <div className="text-amber-500 mt-0.5">•</div>
                          <span>Optimize images for mobile devices</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="text-amber-500 mt-0.5">•</div>
                          <span>Reduce unused JavaScript on landing page</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="text-amber-500 mt-0.5">•</div>
                          <span>Leverage browser caching</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Top Pages</CardTitle>
                  <CardDescription>By traffic volume</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Homepage</div>
                        <div className="text-sm text-muted-foreground">/</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">5,342</div>
                        <div className="text-xs text-muted-foreground">visits</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Products</div>
                        <div className="text-sm text-muted-foreground">/products</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">3,721</div>
                        <div className="text-xs text-muted-foreground">visits</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">About Us</div>
                        <div className="text-sm text-muted-foreground">/about</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">2,103</div>
                        <div className="text-xs text-muted-foreground">visits</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Contact</div>
                        <div className="text-sm text-muted-foreground">/contact</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">1,893</div>
                        <div className="text-xs text-muted-foreground">visits</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Blog</div>
                        <div className="text-sm text-muted-foreground">/blog</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">1,459</div>
                        <div className="text-xs text-muted-foreground">visits</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="keywords" className="mt-6">
          {isRealData ? (
            <div className="text-center py-8">
              <Card className="mx-auto max-w-md p-6">
                <h3 className="text-lg font-medium mb-2">No Keyword Data</h3>
                <p className="text-muted-foreground mb-4">
                  Add your website to start tracking keyword performance.
                </p>
                <Button onClick={() => setShowAddWebsiteDialog(true)}>
                  <Plus className="h-4 w-4 mr-1" /> Add Website
                </Button>
              </Card>
            </div>
          ) : (
            <div className="grid gap-4 grid-cols-1">
              <Card>
                <CardHeader>
                  <CardTitle>Keyword Rankings</CardTitle>
                  <CardDescription>Top performing keywords for your website</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium">Keyword</th>
                          <th className="text-center py-3 px-4 font-medium">Position</th>
                          <th className="text-center py-3 px-4 font-medium">Monthly Searches</th>
                          <th className="text-center py-3 px-4 font-medium">Competition</th>
                          <th className="text-center py-3 px-4 font-medium">Trend</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b hover:bg-muted/40">
                          <td className="py-3 px-4">business platform solution</td>
                          <td className="py-3 px-4 text-center">3</td>
                          <td className="py-3 px-4 text-center">5,400</td>
                          <td className="py-3 px-4 text-center">High</td>
                          <td className="py-3 px-4 text-center text-green-500">↑ 2</td>
                        </tr>
                        <tr className="border-b hover:bg-muted/40">
                          <td className="py-3 px-4">customer management software</td>
                          <td className="py-3 px-4 text-center">5</td>
                          <td className="py-3 px-4 text-center">8,100</td>
                          <td className="py-3 px-4 text-center">High</td>
                          <td className="py-3 px-4 text-center text-green-500">↑ 3</td>
                        </tr>
                        <tr className="border-b hover:bg-muted/40">
                          <td className="py-3 px-4">sales automation tools</td>
                          <td className="py-3 px-4 text-center">7</td>
                          <td className="py-3 px-4 text-center">4,200</td>
                          <td className="py-3 px-4 text-center">Medium</td>
                          <td className="py-3 px-4 text-center text-amber-500">−</td>
                        </tr>
                        <tr className="border-b hover:bg-muted/40">
                          <td className="py-3 px-4">marketing platform all-in-one</td>
                          <td className="py-3 px-4 text-center">11</td>
                          <td className="py-3 px-4 text-center">3,600</td>
                          <td className="py-3 px-4 text-center">Medium</td>
                          <td className="py-3 px-4 text-center text-green-500">↑ 4</td>
                        </tr>
                        <tr className="border-b hover:bg-muted/40">
                          <td className="py-3 px-4">integrated business solution</td>
                          <td className="py-3 px-4 text-center">15</td>
                          <td className="py-3 px-4 text-center">6,700</td>
                          <td className="py-3 px-4 text-center">High</td>
                          <td className="py-3 px-4 text-center text-red-500">↓ 2</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Keyword Opportunities</CardTitle>
                    <CardDescription>Relevant keywords to target</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b pb-3">
                        <div>
                          <div className="font-medium">business process automation</div>
                          <div className="text-sm text-muted-foreground">7,200 monthly searches</div>
                        </div>
                        <Button variant="outline" size="sm">Add</Button>
                      </div>
                      
                      <div className="flex items-center justify-between border-b pb-3">
                        <div>
                          <div className="font-medium">customer insights platform</div>
                          <div className="text-sm text-muted-foreground">5,800 monthly searches</div>
                        </div>
                        <Button variant="outline" size="sm">Add</Button>
                      </div>
                      
                      <div className="flex items-center justify-between border-b pb-3">
                        <div>
                          <div className="font-medium">sales team software</div>
                          <div className="text-sm text-muted-foreground">4,500 monthly searches</div>
                        </div>
                        <Button variant="outline" size="sm">Add</Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">marketing analytics tools</div>
                          <div className="text-sm text-muted-foreground">3,900 monthly searches</div>
                        </div>
                        <Button variant="outline" size="sm">Add</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Historical Performance</CardTitle>
                    <CardDescription>Keyword position changes over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-60 flex items-center justify-center">
                      <div className="w-full h-full flex flex-col items-center justify-center">
                        <LineChart className="h-12 w-12 text-muted-foreground mb-4" />
                        <div className="text-center">
                          <h3 className="text-lg font-medium mb-1">Keyword Trends</h3>
                          <p className="text-sm text-muted-foreground mb-3">Last 90 days</p>
                          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
                            <div className="text-center">
                              <div className="text-xl font-bold text-green-500">+5</div>
                              <div className="text-xs text-muted-foreground">Improved</div>
                            </div>
                            <div className="text-center">
                              <div className="text-xl font-bold text-amber-500">12</div>
                              <div className="text-xs text-muted-foreground">Stable</div>
                            </div>
                            <div className="text-center">
                              <div className="text-xl font-bold text-red-500">-2</div>
                              <div className="text-xs text-muted-foreground">Declined</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="backlinks" className="mt-6">
          {isRealData ? (
            <div className="text-center py-8">
              <Card className="mx-auto max-w-md p-6">
                <h3 className="text-lg font-medium mb-2">No Backlink Data</h3>
                <p className="text-muted-foreground mb-4">
                  Add your website to start tracking backlinks.
                </p>
                <Button onClick={() => setShowAddWebsiteDialog(true)}>
                  <Plus className="h-4 w-4 mr-1" /> Add Website
                </Button>
              </Card>
            </div>
          ) : (
            <div className="grid gap-4 grid-cols-1">
              <Card>
                <CardHeader>
                  <CardTitle>Backlink Overview</CardTitle>
                  <CardDescription>Quality and quantity of links pointing to your site</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-8 grid-cols-1 lg:grid-cols-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold mb-1">428</div>
                      <div className="text-sm text-muted-foreground">Total Backlinks</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-4xl font-bold mb-1">183</div>
                      <div className="text-sm text-muted-foreground">Referring Domains</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-4xl font-bold mb-1">37</div>
                      <div className="text-sm text-muted-foreground">New This Month</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-4xl font-bold mb-1">28.5</div>
                      <div className="text-sm text-muted-foreground">Domain Authority</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Top Backlinks</CardTitle>
                  <CardDescription>Most valuable links to your website</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium">Source</th>
                          <th className="text-left py-3 px-4 font-medium">Linked Page</th>
                          <th className="text-center py-3 px-4 font-medium">Domain Authority</th>
                          <th className="text-center py-3 px-4 font-medium">Type</th>
                          <th className="text-center py-3 px-4 font-medium">First Seen</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b hover:bg-muted/40">
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>techreview.com</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">/blog/top-business-platforms</td>
                          <td className="py-3 px-4 text-center">89</td>
                          <td className="py-3 px-4 text-center">Dofollow</td>
                          <td className="py-3 px-4 text-center">2 months ago</td>
                        </tr>
                        <tr className="border-b hover:bg-muted/40">
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>businessweekly.com</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">/emerging-tech-solutions</td>
                          <td className="py-3 px-4 text-center">76</td>
                          <td className="py-3 px-4 text-center">Dofollow</td>
                          <td className="py-3 px-4 text-center">3 months ago</td>
                        </tr>
                        <tr className="border-b hover:bg-muted/40">
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>marketingpros.net</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">/tools/automation-platforms</td>
                          <td className="py-3 px-4 text-center">67</td>
                          <td className="py-3 px-4 text-center">Dofollow</td>
                          <td className="py-3 px-4 text-center">5 months ago</td>
                        </tr>
                        <tr className="border-b hover:bg-muted/40">
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>salesnews.org</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">/reviews/best-sales-platforms</td>
                          <td className="py-3 px-4 text-center">58</td>
                          <td className="py-3 px-4 text-center">Dofollow</td>
                          <td className="py-3 px-4 text-center">1 month ago</td>
                        </tr>
                        <tr className="border-b hover:bg-muted/40">
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>smallbusinesstoolkit.com</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">/resources/customer-management</td>
                          <td className="py-3 px-4 text-center">52</td>
                          <td className="py-3 px-4 text-center">Nofollow</td>
                          <td className="py-3 px-4 text-center">2 weeks ago</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="competitors" className="mt-6">
          {isRealData ? (
            <div className="text-center py-8">
              <Card className="mx-auto max-w-md p-6">
                <h3 className="text-lg font-medium mb-2">No Competitor Data</h3>
                <p className="text-muted-foreground mb-4">
                  Add competitor websites to start tracking competitive insights.
                </p>
                <Button onClick={() => setShowAddWebsiteDialog(true)}>
                  <Plus className="h-4 w-4 mr-1" /> Add Website
                </Button>
              </Card>
            </div>
          ) : (
            <div className="grid gap-4 grid-cols-1">
              <Card>
                <CardHeader>
                  <CardTitle>Competitor Comparison</CardTitle>
                  <CardDescription>How your site performs against competitors</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium">Website</th>
                          <th className="text-center py-3 px-4 font-medium">Domain Authority</th>
                          <th className="text-center py-3 px-4 font-medium">Backlinks</th>
                          <th className="text-center py-3 px-4 font-medium">Keywords</th>
                          <th className="text-center py-3 px-4 font-medium">Traffic</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b bg-muted/30">
                          <td className="py-3 px-4 font-medium">
                            <div className="flex items-center">
                              <span>yoursite.com</span>
                              <Badge className="ml-2 bg-primary/20 text-primary hover:bg-primary/30">You</Badge>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center">28.5</td>
                          <td className="py-3 px-4 text-center">428</td>
                          <td className="py-3 px-4 text-center">362</td>
                          <td className="py-3 px-4 text-center">24K/mo</td>
                        </tr>
                        <tr className="border-b hover:bg-muted/40">
                          <td className="py-3 px-4">competitor1.com</td>
                          <td className="py-3 px-4 text-center">45.8</td>
                          <td className="py-3 px-4 text-center">1,243</td>
                          <td className="py-3 px-4 text-center">782</td>
                          <td className="py-3 px-4 text-center">87K/mo</td>
                        </tr>
                        <tr className="border-b hover:bg-muted/40">
                          <td className="py-3 px-4">competitor2.com</td>
                          <td className="py-3 px-4 text-center">39.2</td>
                          <td className="py-3 px-4 text-center">876</td>
                          <td className="py-3 px-4 text-center">598</td>
                          <td className="py-3 px-4 text-center">62K/mo</td>
                        </tr>
                        <tr className="border-b hover:bg-muted/40">
                          <td className="py-3 px-4">competitor3.com</td>
                          <td className="py-3 px-4 text-center">22.7</td>
                          <td className="py-3 px-4 text-center">321</td>
                          <td className="py-3 px-4 text-center">245</td>
                          <td className="py-3 px-4 text-center">19K/mo</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Keyword Gap Analysis</CardTitle>
                    <CardDescription>Keywords your competitors rank for that you don't</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b pb-2">
                        <div>
                          <div className="font-medium">enterprise business solutions</div>
                          <div className="text-sm text-muted-foreground">competitor1.com ranks #3</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">9,400</div>
                          <div className="text-xs text-muted-foreground">monthly searches</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between border-b pb-2">
                        <div>
                          <div className="font-medium">omnichannel marketing platform</div>
                          <div className="text-sm text-muted-foreground">competitor2.com ranks #5</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">7,800</div>
                          <div className="text-xs text-muted-foreground">monthly searches</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between border-b pb-2">
                        <div>
                          <div className="font-medium">sales ai automation</div>
                          <div className="text-sm text-muted-foreground">competitor1.com ranks #2</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">6,200</div>
                          <div className="text-xs text-muted-foreground">monthly searches</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between border-b pb-2">
                        <div>
                          <div className="font-medium">small business crm comparison</div>
                          <div className="text-sm text-muted-foreground">competitor3.com ranks #7</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">5,900</div>
                          <div className="text-xs text-muted-foreground">monthly searches</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">customer experience platform</div>
                          <div className="text-sm text-muted-foreground">competitor2.com ranks #4</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">5,500</div>
                          <div className="text-xs text-muted-foreground">monthly searches</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Content Gap Analysis</CardTitle>
                    <CardDescription>Content areas where competitors outperform you</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border-b pb-3">
                        <h4 className="font-medium flex items-center">
                          <span className="mr-2">Product Comparison Guides</span>
                          <Badge variant="outline" className="ml-auto">High Impact</Badge>
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          competitor1.com has 15 guides that rank for 87 keywords
                        </p>
                      </div>
                      
                      <div className="border-b pb-3">
                        <h4 className="font-medium flex items-center">
                          <span className="mr-2">Case Studies</span>
                          <Badge variant="outline" className="ml-auto">Medium Impact</Badge>
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          competitor2.com has 28 case studies that rank for 62 keywords
                        </p>
                      </div>
                      
                      <div className="border-b pb-3">
                        <h4 className="font-medium flex items-center">
                          <span className="mr-2">Industry Benchmarks</span>
                          <Badge variant="outline" className="ml-auto">High Impact</Badge>
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          competitor1.com publishes annual reports that rank for 34 keywords
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium flex items-center">
                          <span className="mr-2">Video Tutorials</span>
                          <Badge variant="outline" className="ml-auto">Medium Impact</Badge>
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          competitor3.com has a YouTube channel with content that ranks for 41 keywords
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <Dialog open={showAddWebsiteDialog} onOpenChange={setShowAddWebsiteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Website</DialogTitle>
            <DialogDescription>
              Add a website to monitor performance or track competitors
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="website-url">Website URL</Label>
              <div className="flex">
                <div className="flex items-center px-3 rounded-l-md border border-r-0 bg-muted">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                </div>
                <Input 
                  id="website-url" 
                  placeholder="e.g., https://example.com" 
                  className="rounded-l-none"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="website-type">Website Type</Label>
              <Select value={websiteType} onValueChange={setWebsiteType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select website type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="organization">Organization Website</SelectItem>
                  <SelectItem value="competitor">Competitor Website</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="scan-type">Scan Type</Label>
              <Select value={scanType} onValueChange={setScanType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select scan type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single Page</SelectItem>
                  <SelectItem value="full">Full Website Crawl</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddWebsiteDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddWebsite}>
              Add Website
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Website;
