
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Zap, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MarketingCampaigns from "@/components/dashboard/MarketingCampaigns";
import AdPlatformIntegration from "@/components/marketing/AdPlatformIntegration";
import { useToast } from '@/hooks/use-toast';
import DataModeToggle from "@/components/dashboard/DataModeToggle";
import { useDataMode } from "@/contexts/DataModeContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Marketing = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { isRealData, setIsRealData } = useDataMode();
  const { toast } = useToast();
  
  const [adPlatforms, setAdPlatforms] = useState([
    {
      name: 'Google Ads',
      logo: 'https://www.gstatic.com/images/branding/product/2x/hh_ads_64dp.png',
      description: 'Connect to Google Ads to create and manage ad campaigns.',
      status: 'disconnected' as const,
    },
    {
      name: 'Meta Ads',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/120px-Facebook_Logo_%282019%29.png',
      description: 'Connect to Facebook & Instagram ads to manage social campaigns.',
      status: 'disconnected' as const,
    },
    {
      name: 'LinkedIn Ads',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/120px-LinkedIn_logo_initials.png',
      description: 'Connect to LinkedIn Marketing Solutions for B2B advertising.',
      status: 'disconnected' as const,
    },
    {
      name: 'Mailchimp',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Mailchimp_Logo_%282019-2020%29.svg/120px-Mailchimp_Logo_%282019-2020%29.svg.png',
      description: 'Connect to Mailchimp for email marketing campaign automation.',
      status: 'disconnected' as const,
    }
  ]);
  
  const handleConnectPlatform = (platformName: string, credentials: any) => {
    console.log(`Connecting to ${platformName} with:`, credentials);
    
    // In a real implementation, you would send these credentials to your backend
    // or store them securely. For this demo, we'll just update the UI.
    setAdPlatforms(platforms => 
      platforms.map(p => 
        p.name === platformName 
          ? { ...p, status: 'connected' as const } 
          : p
      )
    );
    
    toast({
      title: 'Connection successful',
      description: `Your ${platformName} account has been connected successfully.`,
      duration: 3000,
    });
  };
  
  const handleDisconnectPlatform = (platformName: string) => {
    setAdPlatforms(platforms => 
      platforms.map(p => 
        p.name === platformName 
          ? { ...p, status: 'disconnected' as const } 
          : p
      )
    );
    
    toast({
      title: 'Disconnected',
      description: `Your ${platformName} account has been disconnected.`,
      duration: 3000,
    });
  };
  
  const handleCreateCampaign = () => {
    if (!adPlatforms.some(p => p.status === 'connected')) {
      toast({
        title: 'No platforms connected',
        description: 'Please connect at least one advertising platform to create a campaign.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsDialogOpen(false);
    
    toast({
      title: 'Campaign created',
      description: 'Your marketing campaign has been created successfully.',
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Marketing Automation</h1>
          <p className="text-muted-foreground">
            Create and manage your marketing campaigns.
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="font-medium">
              <Plus className="h-4 w-4 mr-1" /> New Campaign
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Campaign</DialogTitle>
              <DialogDescription>
                Create a new marketing campaign and publish it to your connected platforms.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="text-center p-8">
                <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Campaign Builder Coming Soon</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Our campaign builder is under development. Connect your ad platforms now to be ready when it launches.
                </p>
                <Button onClick={handleCreateCampaign}>
                  Create Sample Campaign
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <DataModeToggle isRealData={isRealData} onToggle={setIsRealData} />
      
      <Tabs defaultValue="campaigns" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="platforms">Platforms</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="campaigns" className="mt-4">
          <div className="grid grid-cols-1 gap-4">
            <MarketingCampaigns />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="dashboard-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold">Email Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Open Rate</span>
                        <span className="text-sm font-medium">72%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-salescraft-600 h-2.5 rounded-full" style={{ width: "72%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Click Rate</span>
                        <span className="text-sm font-medium">38%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-salescraft-600 h-2.5 rounded-full" style={{ width: "38%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Conversion Rate</span>
                        <span className="text-sm font-medium">12%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-salescraft-600 h-2.5 rounded-full" style={{ width: "12%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Bounce Rate</span>
                        <span className="text-sm font-medium">3%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-red-500 h-2.5 rounded-full" style={{ width: "3%" }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="dashboard-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold">Campaign ROI</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4">
                    <div className="inline-flex items-center justify-center p-4 bg-green-50 rounded-full mb-4">
                      <div className="text-3xl font-bold text-green-600">167%</div>
                    </div>
                    <div className="space-y-3 mt-4 text-left">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <div className="text-sm text-muted-foreground">Total Spend</div>
                          <div className="font-semibold">$12,450</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Revenue Generated</div>
                          <div className="font-semibold">$33,215</div>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Most Profitable Campaign</div>
                        <div className="font-semibold">Summer Sale Promotion</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="platforms" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {adPlatforms.map(platform => (
              <AdPlatformIntegration 
                key={platform.name}
                platform={platform}
                onConnect={handleConnectPlatform}
                onDisconnect={handleDisconnectPlatform}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="audience" className="mt-4">
          <div className="p-8 text-center">
            <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Audience Management</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-4">
              Create and manage audience segments for targeted marketing campaigns.
              This feature will be available in the next update.
            </p>
            <Button variant="outline">
              Get Notified When Ready
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="mt-4">
          <div className="p-8 text-center text-muted-foreground">
            Marketing analytics features will be available in the next update.
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Marketing;
