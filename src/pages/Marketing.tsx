
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import MarketingCampaigns from "@/components/dashboard/MarketingCampaigns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Marketing = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Marketing Automation</h1>
          <p className="text-muted-foreground">
            Create and manage your marketing campaigns.
          </p>
        </div>
        <Button size="sm" className="font-medium">
          <Plus className="h-4 w-4 mr-1" /> New Campaign
        </Button>
      </div>
      
      <Tabs defaultValue="campaigns" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
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
        <TabsContent value="email" className="mt-4">
          <div className="p-8 text-center text-muted-foreground">
            Email marketing features will be available in the next update.
          </div>
        </TabsContent>
        <TabsContent value="social" className="mt-4">
          <div className="p-8 text-center text-muted-foreground">
            Social media marketing features will be available in the next update.
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
