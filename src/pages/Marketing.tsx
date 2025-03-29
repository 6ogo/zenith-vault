
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AdPlatformIntegration from "@/components/marketing/AdPlatformIntegration";
import { MarketingPlatform, PlatformStatus } from "@/components/marketing/AdPlatformIntegration";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DataModeToggle from "@/components/dashboard/DataModeToggle";
import { useDataMode } from "@/contexts/DataModeContext";

const Marketing = () => {
  const { isRealData, setIsRealData } = useDataMode();
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
        <DataModeToggle isRealData={isRealData} onToggle={val => setIsRealData(val)} />
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
                  <p className="text-muted-foreground">Connect your marketing platforms to see real campaign data</p>
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
            <CardHeader>
              <CardTitle>Audience Segments</CardTitle>
              <CardDescription>
                Create and manage audience segments for targeting
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isRealData ? (
                <div className="p-8 text-center">
                  <p className="text-muted-foreground">Connect your marketing platforms to see real audience data</p>
                  <Button className="mt-4" onClick={() => setActiveTab('integrations')}>
                    Connect Platforms
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p>Demo audience segments shown</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="content" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Content Library</CardTitle>
              <CardDescription>
                Manage your marketing content and assets
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isRealData ? (
                <div className="p-8 text-center">
                  <p className="text-muted-foreground">Connect your marketing platforms to see real content data</p>
                  <Button className="mt-4" onClick={() => setActiveTab('integrations')}>
                    Connect Platforms
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p>Demo content library shown</p>
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
                onConnect={handleConnect}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Marketing;
