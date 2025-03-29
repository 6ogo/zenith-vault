import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AdPlatformIntegration from "@/components/marketing/AdPlatformIntegration";
import { MarketingPlatform, PlatformStatus } from "@/components/marketing/AdPlatformIntegration";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Users, Plus, Filter, BarChart, Calendar, FileText, ArrowUpDown, Trash, Edit } from "lucide-react";
import DataModeToggle from "@/components/dashboard/DataModeToggle";
import { useDataMode } from "@/contexts/DataModeContext";

const audienceSegments = [
  {
    id: "segment-001",
    name: "High-Value Customers",
    description: "Customers with LTV over $10,000",
    count: 245,
    createdAt: "2023-04-15",
    lastUpdated: "2023-05-10",
    rules: [
      { field: "lifetime_value", operator: "greater_than", value: "$10,000" },
      { field: "active_status", operator: "equals", value: "active" }
    ]
  },
  {
    id: "segment-002",
    name: "Recently Active",
    description: "Users who've logged in within the last 7 days",
    count: 1240,
    createdAt: "2023-05-01",
    lastUpdated: "2023-05-11",
    rules: [
      { field: "last_login", operator: "within_days", value: "7" }
    ]
  },
  {
    id: "segment-003",
    name: "Email Engaged",
    description: "Users who open and click on emails",
    count: 873,
    createdAt: "2023-03-22",
    lastUpdated: "2023-05-08",
    rules: [
      { field: "email_open_rate", operator: "greater_than", value: "25%" },
      { field: "email_click_rate", operator: "greater_than", value: "10%" }
    ]
  },
  {
    id: "segment-004",
    name: "Enterprise Prospects",
    description: "Enterprise-level companies showing interest",
    count: 92,
    createdAt: "2023-04-28",
    lastUpdated: "2023-05-09",
    rules: [
      { field: "company_size", operator: "greater_than", value: "500" },
      { field: "website_visits", operator: "greater_than", value: "3" },
      { field: "pricing_page_views", operator: "greater_than", value: "1" }
    ]
  }
];

const contentItems = [
  {
    id: "content-001",
    title: "10 Ways to Improve Your Sales Pipeline",
    type: "blog_post",
    status: "published",
    createdAt: "2023-05-08",
    author: "Sarah Wilson",
    image: "/images/blog1.jpg",
    performance: {
      views: 1240,
      conversions: 38,
      shares: 75
    }
  },
  {
    id: "content-002",
    title: "Enterprise Solution Guide",
    type: "whitepaper",
    status: "published",
    createdAt: "2023-04-22",
    author: "David Smith",
    image: "/images/whitepaper.jpg",
    performance: {
      views: 543,
      conversions: 112,
      shares: 28
    }
  },
  {
    id: "content-003",
    title: "Product Demo Video",
    type: "video",
    status: "published",
    createdAt: "2023-05-01",
    author: "Michael Chen",
    image: "/images/video-thumbnail.jpg",
    performance: {
      views: 2150,
      conversions: 65,
      shares: 124
    }
  },
  {
    id: "content-004",
    title: "Summer Sale Email Template",
    type: "email",
    status: "draft",
    createdAt: "2023-05-10",
    author: "Emily Rodriguez",
    image: "/images/email-template.jpg",
    performance: {
      views: 0,
      conversions: 0,
      shares: 0
    }
  },
  {
    id: "content-005",
    title: "Customer Success Story: Acme Corp",
    type: "case_study",
    status: "review",
    createdAt: "2023-05-09",
    author: "Lisa Johnson",
    image: "/images/case-study.jpg",
    performance: {
      views: 0,
      conversions: 0,
      shares: 0
    }
  }
];

const Marketing = () => {
  const { isRealData } = useDataMode();
  const [activeTab, setActiveTab] = useState("campaigns");
  
  const [adPlatforms, setAdPlatforms] = useState<MarketingPlatform[]>([
    {
      name: "Google Ads",
      logo: "/images/google-ads.svg",
      description: "Create and manage Google search and display ads",
      status: "disconnected",
    },
    {
      name: "Meta Ads",
      logo: "/images/meta-ads.svg",
      description: "Create and manage Facebook and Instagram ads",
      status: "disconnected",
    },
    {
      name: "LinkedIn Ads",
      logo: "/images/linkedin-ads.svg",
      description: "Create and manage LinkedIn sponsored content",
      status: "disconnected",
    },
    {
      name: "Mailchimp",
      logo: "/images/mailchimp.svg",
      description: "Create and send email marketing campaigns",
      status: "disconnected",
    },
  ]);

  const handleConnect = (platformName: string) => {
    setAdPlatforms(platforms => 
      platforms.map(platform => 
        platform.name === platformName 
          ? { ...platform, status: platform.status === "connected" ? "disconnected" : "connected" as PlatformStatus }
          : platform
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Marketing Hub</h1>
          <p className="text-muted-foreground mt-2">
            Create and manage marketing campaigns across multiple platforms
          </p>
        </div>
        <DataModeToggle />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 md:w-[600px]">
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="campaigns" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Campaigns</CardTitle>
              <CardDescription>
                View and manage your current marketing campaigns
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isRealData ? (
                <div className="p-8 text-center">
                  <p className="text-muted-foreground">No active marketing campaigns found. Connect your marketing platforms to see real campaign data.</p>
                  <Button className="mt-4" onClick={() => setActiveTab('integrations')}>
                    Connect Platforms
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3, 4, 5].map((_, index) => (
                      <Card key={index}>
                        <CardContent className="p-6">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Summer Sale {2023 + index}</span>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                index % 3 === 0 ? "bg-green-100 text-green-800" : 
                                index % 3 === 1 ? "bg-blue-100 text-blue-800" : 
                                "bg-yellow-100 text-yellow-800"
                              }`}>
                                {index % 3 === 0 ? "Active" : 
                                 index % 3 === 1 ? "Scheduled" : 
                                 "Draft"}
                              </span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {index % 2 === 0 ? "Google Ads" : "Meta Ads"} • {index % 2 === 0 ? "Search" : "Social"}
                            </div>
                            <div className="mt-4 text-2xl font-semibold">
                              ${(1000 + index * 540).toLocaleString()}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Budget • ${(20 + index * 10).toLocaleString()} daily
                            </div>
                            <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary" 
                                style={{ width: `${25 + index * 15}%` }}
                              ></div>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span>{25 + index * 15}% spent</span>
                              <span>{5 + index} days left</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="audience" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Audience Segments</CardTitle>
                <CardDescription>
                  Create and manage audience segments for targeting
                </CardDescription>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-1" /> New Segment
              </Button>
            </CardHeader>
            <CardContent>
              {isRealData ? (
                <div className="p-8 text-center">
                  <p className="text-muted-foreground">No audience segments found. Connect your marketing platforms to see real audience data.</p>
                  <Button className="mt-4" onClick={() => setActiveTab('integrations')}>
                    Connect Platforms
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <div className="relative w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="search"
                          placeholder="Search segments..."
                          className="pl-9"
                        />
                      </div>
                      <Button variant="outline" size="icon">
                        <Filter className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>Total audience: 32,450 contacts</span>
                    </div>
                  </div>
                  
                  <div className="rounded-md border">
                    <div className="overflow-x-auto">
                      <table className="w-full table-auto">
                        <thead>
                          <tr className="border-b bg-muted/50">
                            <th className="px-4 py-3 text-left text-sm font-medium">Segment Name</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Description</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Contacts</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Last Updated</th>
                            <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {audienceSegments.map(segment => (
                            <tr key={segment.id} className="border-b hover:bg-muted/50 transition-colors">
                              <td className="px-4 py-3 font-medium">{segment.name}</td>
                              <td className="px-4 py-3 text-sm">{segment.description}</td>
                              <td className="px-4 py-3 text-sm">{segment.count.toLocaleString()}</td>
                              <td className="px-4 py-3 text-sm">{segment.lastUpdated}</td>
                              <td className="px-4 py-3 text-right">
                                <div className="flex justify-end gap-2">
                                  <Button variant="ghost" size="sm">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Audience Insights</CardTitle>
                      <CardDescription>Overall analytics of your audience</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="border rounded-lg p-4">
                          <div className="text-sm text-muted-foreground mb-1">Demographics</div>
                          <div className="text-2xl font-bold">65% / 35%</div>
                          <div className="text-sm">Male / Female</div>
                          <div className="mt-4 text-xs text-muted-foreground">Most common: 25-34 age range</div>
                        </div>
                        <div className="border rounded-lg p-4">
                          <div className="text-sm text-muted-foreground mb-1">Geographic</div>
                          <div className="text-2xl font-bold">42%</div>
                          <div className="text-sm">North America</div>
                          <div className="mt-4 text-xs text-muted-foreground">Top cities: New York, San Francisco, London</div>
                        </div>
                        <div className="border rounded-lg p-4">
                          <div className="text-sm text-muted-foreground mb-1">Engagement</div>
                          <div className="text-2xl font-bold">28%</div>
                          <div className="text-sm">Email open rate</div>
                          <div className="mt-4 text-xs text-muted-foreground">+5% improvement over last month</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="content" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Content Library</CardTitle>
                <CardDescription>
                  Manage your marketing content and assets
                </CardDescription>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-1" /> Create Content
              </Button>
            </CardHeader>
            <CardContent>
              {isRealData ? (
                <div className="p-8 text-center">
                  <p className="text-muted-foreground">No content found. Connect your marketing platforms to see real content data.</p>
                  <Button className="mt-4" onClick={() => setActiveTab('integrations')}>
                    Connect Platforms
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <div className="relative w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="search"
                          placeholder="Search content..."
                          className="pl-9"
                        />
                      </div>
                      <Button variant="outline" size="icon">
                        <Filter className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <ArrowUpDown className="h-4 w-4 mr-1" /> Sort
                      </Button>
                    </div>
                  </div>
                  
                  <div className="rounded-md border">
                    <div className="overflow-x-auto">
                      <table className="w-full table-auto">
                        <thead>
                          <tr className="border-b bg-muted/50">
                            <th className="px-4 py-3 text-left text-sm font-medium">Title</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Type</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Author</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Performance</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Created</th>
                            <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {contentItems.map(item => (
                            <tr key={item.id} className="border-b hover:bg-muted/50 transition-colors">
                              <td className="px-4 py-3 font-medium">{item.title}</td>
                              <td className="px-4 py-3 text-sm capitalize">{item.type.replace('_', ' ')}</td>
                              <td className="px-4 py-3 text-sm">
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-6 w-6">
                                    <AvatarFallback className="text-xs">{item.author.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <span>{item.author}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <Badge
                                  variant={item.status === "published" ? "default" : item.status === "review" ? "secondary" : "outline"}
                                >
                                  {item.status}
                                </Badge>
                              </td>
                              <td className="px-4 py-3 text-sm">
                                {item.status === "published" ? (
                                  <div className="flex items-center gap-2">
                                    <BarChart className="h-4 w-4 text-muted-foreground" />
                                    <span>{item.performance.views.toLocaleString()} views</span>
                                  </div>
                                ) : (
                                  <span className="text-muted-foreground">-</span>
                                )}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-muted-foreground" />
                                  <span>{item.createdAt}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <div className="flex justify-end gap-2">
                                  <Button variant="ghost" size="sm">
                                    <FileText className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Content Performance</CardTitle>
                      <CardDescription>Overall analytics of your content</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="border rounded-lg p-4">
                          <div className="text-sm text-muted-foreground mb-1">Total Engagement</div>
                          <div className="text-2xl font-bold">4,250</div>
                          <div className="text-sm">Interactions</div>
                          <div className="mt-4 text-xs text-muted-foreground">+18% from last month</div>
                        </div>
                        <div className="border rounded-lg p-4">
                          <div className="text-sm text-muted-foreground mb-1">Top Content Type</div>
                          <div className="text-2xl font-bold">Videos</div>
                          <div className="text-sm">2,150 views</div>
                          <div className="mt-4 text-xs text-muted-foreground">3.2x more effective than blog posts</div>
                        </div>
                        <div className="border rounded-lg p-4">
                          <div className="text-sm text-muted-foreground mb-1">Conversion Rate</div>
                          <div className="text-2xl font-bold">3.8%</div>
                          <div className="text-sm">Avg. across all content</div>
                          <div className="mt-4 text-xs text-muted-foreground">Whitepapers have highest at 12.5%</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="integrations" className="mt-6">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            {adPlatforms.map((platform) => (
              <AdPlatformIntegration
                key={platform.name}
                name={platform.name}
                logo={platform.logo}
                description={platform.description}
                status={platform.status}
                onConnect={() => handleConnect(platform.name)}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Marketing;
