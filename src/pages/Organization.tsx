
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import OrganizationMembers from "@/components/organization/OrganizationMembers";
import PendingApprovals from "@/components/organization/PendingApprovals";
import { useDataMode } from "@/contexts/DataModeContext";

const Organization = () => {
  const [activeTab, setActiveTab] = useState("members");
  const { toast } = useToast();
  const [showRemoveDataModeDialog, setShowRemoveDataModeDialog] = useState(false);
  const { isRealData, setIsRealData } = useDataMode();
  const [permanentRealData, setPermanentRealData] = useState(() => {
    return localStorage.getItem('permanentRealData') === 'true';
  });

  useEffect(() => {
    // Check if permanent real data mode is enabled
    if (permanentRealData) {
      setIsRealData(true);
    }
  }, [permanentRealData, setIsRealData]);

  const handleRemoveDataModeToggle = (checked: boolean) => {
    if (checked) {
      setShowRemoveDataModeDialog(true);
    } else {
      setPermanentRealData(false);
      localStorage.setItem('permanentRealData', 'false');
      toast({
        title: "Data mode setting updated",
        description: "Demo data mode is now available.",
        duration: 3000
      });
    }
  };

  const confirmRemoveDataMode = () => {
    setPermanentRealData(true);
    setIsRealData(true);
    localStorage.setItem('permanentRealData', 'true');
    toast({
      title: "Data mode permanently changed",
      description: "Your application will now only show real data from your integrated systems.",
      duration: 3000
    });
    setShowRemoveDataModeDialog(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Organization</h1>
          <p className="text-muted-foreground">
            Manage your organization settings and members
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>
        
        <TabsContent value="members" className="mt-6 space-y-4">
          <PendingApprovals />
          <OrganizationMembers />
        </TabsContent>
        
        <TabsContent value="settings" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Organization Profile</CardTitle>
              <CardDescription>Manage your organization details and branding</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="org-name">Organization Name</Label>
                <Input id="org-name" defaultValue="Zenith Technologies Inc." />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="org-website">Website</Label>
                <Input id="org-website" defaultValue="https://zenith-tech.example.com" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="org-address">Address</Label>
                <Input id="org-address" defaultValue="123 Innovation Drive, Tech City, CA 94103" />
              </div>
              
              <Button 
                onClick={() => toast({
                  title: "Profile updated",
                  description: "Your organization profile has been updated successfully.",
                  duration: 3000
                })}
              >
                Save Changes
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Data Settings</CardTitle>
              <CardDescription>Configure how data is displayed in your organization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Remove Data Mode Toggle</h4>
                  <p className="text-sm text-muted-foreground">
                    When enabled, the application will only show real data from your connected systems
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="remove-data-mode">Enabled</Label>
                  <Switch
                    id="remove-data-mode"
                    checked={permanentRealData}
                    onCheckedChange={handleRemoveDataModeToggle}
                    disabled={permanentRealData} // Once enabled, can't be disabled
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="billing" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Subscription</CardTitle>
              <CardDescription>Manage your organization's subscription plan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">Current Plan</h3>
                  <Badge>Enterprise</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Your plan renews on October 15, 2023
                </p>
                <div className="flex gap-2">
                  <Button variant="outline">Change Plan</Button>
                  <Button variant="outline" className="text-destructive border-destructive hover:bg-destructive/10">
                    Cancel Subscription
                  </Button>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Payment Method</h3>
                <div className="flex items-center gap-3">
                  <div className="bg-background border rounded-md p-2">
                    <div className="text-sm font-medium">•••• •••• •••• 4242</div>
                    <div className="text-xs text-muted-foreground">Expires 12/25</div>
                  </div>
                  <Button variant="outline" size="sm">Update</Button>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Billing History</h3>
                <div className="text-sm text-center py-4 text-muted-foreground">
                  No billing history available yet.
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <AlertDialog open={showRemoveDataModeDialog} onOpenChange={setShowRemoveDataModeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Have you set up your integrations and are ready to transform your organization?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently switch your application to only display real data from your integrated systems. 
              The demo data mode will no longer be available.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, we're not completely ready yet</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRemoveDataMode}>Yes, only show our data</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Organization;
