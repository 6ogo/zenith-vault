import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ArrowUpRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import MarketingCampaigns from "@/components/dashboard/MarketingCampaigns";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDataMode } from "@/contexts/DataModeContext";

type MarketingPlatform = {
  id: string;
  name: string;
  connected: boolean;
};

type AudienceSegment = {
  id: string;
  name: string;
  size: number;
  engagement: number;
};

const audienceSegments: AudienceSegment[] = [
  { id: "segment-1", name: "High-Value Customers", size: 2450, engagement: 0.85 },
  { id: "segment-2", name: "Potential Leads", size: 1875, engagement: 0.62 },
  { id: "segment-3", name: "Inactive Users", size: 3200, engagement: 0.28 },
];

type ContentItem = {
  id: string;
  title: string;
  type: string;
  clicks: number;
  impressions: number;
};

const contentItems: ContentItem[] = [
  { id: "content-1", title: "Summer Sale Email", type: "Email", clicks: 528, impressions: 1875 },
  { id: "content-2", title: "New Product Blog Post", type: "Blog Post", clicks: 872, impressions: 2450 },
  { id: "content-3", title: "Social Media Ad", type: "Social Media", clicks: 1240, impressions: 4200 },
];

const Marketing = () => {
  const { isRealData } = useDataMode();
  const [activeTab, setActiveTab] = useState("campaigns");

  const [adPlatforms, setAdPlatforms] = useState<MarketingPlatform[]>([
    { id: "google-ads", name: "Google Ads", connected: false },
    { id: "facebook-ads", name: "Facebook Ads", connected: false },
    { id: "linkedin-ads", name: "LinkedIn Ads", connected: false },
    { id: "twitter-ads", name: "Twitter Ads", connected: false },
  ]);

  const toggleAdPlatformConnection = (id: string) => {
    setAdPlatforms(platforms =>
      platforms.map(platform =>
        platform.id === id
          ? { ...platform, connected: !platform.connected }
          : platform
      )
    );
  };

  return (
    <div className="space-y-6 w-full animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>
      </div>
  
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
        </TabsList>
        <TabsContent value="campaigns" className="mt-4">
          {isRealData ? (
            <div className="grid grid-cols-1 gap-4">
              <Card className="dashboard-card p-6">
                <div className="text-center">
                  <p className="text-muted-foreground mb-4">
                    No marketing campaign data available. Connect your marketing platforms through the integrations page.
                  </p>
                  <Button onClick={() => window.location.href = "/integrations"}>
                    <ArrowUpRight className="h-4 w-4 mr-1" /> Go to Integrations
                  </Button>
                </div>
              </Card>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              <MarketingCampaigns />
            </div>
          )}
        </TabsContent>
        <TabsContent value="audience" className="mt-4">
          {isRealData ? (
            <div className="grid grid-cols-1 gap-4">
              <Card className="dashboard-card p-6">
                <div className="text-center">
                  <p className="text-muted-foreground mb-4">
                    No audience data available. Connect your marketing platforms through the integrations page.
                  </p>
                  <Button onClick={() => window.location.href = "/integrations"}>
                    <ArrowUpRight className="h-4 w-4 mr-1" /> Go to Integrations
                  </Button>
                </div>
              </Card>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {audienceSegments.map((segment) => (
                <Card key={segment.id} className="dashboard-card">
                  <CardHeader>
                    <CardTitle>{segment.name}</CardTitle>
                    <CardDescription>
                      Segment Size: {segment.size.toLocaleString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Engagement Rate:{" "}
                        <span className="font-medium">
                          {(segment.engagement * 100).toFixed(1)}%
                        </span>
                      </p>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${segment.engagement * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="content" className="mt-4">
          {isRealData ? (
            <div className="grid grid-cols-1 gap-4">
              <Card className="dashboard-card p-6">
                <div className="text-center">
                  <p className="text-muted-foreground mb-4">
                    No content performance data available. Connect your marketing platforms through the integrations page.
                  </p>
                  <Button onClick={() => window.location.href = "/integrations"}>
                    <ArrowUpRight className="h-4 w-4 mr-1" /> Go to Integrations
                  </Button>
                </div>
              </Card>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {contentItems.map((item) => (
                <Card key={item.id} className="dashboard-card">
                  <CardHeader>
                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription>Type: {item.type}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Clicks: <span className="font-medium">{item.clicks}</span>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Impressions:{" "}
                        <span className="font-medium">
                          {item.impressions.toLocaleString()}
                        </span>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Marketing;
