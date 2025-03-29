import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import AIConfigSection from "@/components/ai/AIConfigSection";
import AISettingsPanel from "@/components/ai/AISettingsPanel";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Settings = () => {
  const { user } = useAuth();
  const userEmail = user?.email || "Not available";
  const userRole = user?.user_metadata?.role || "user";
  const userName = user?.user_metadata?.full_name || "User";

  const handleSaveProfile = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved."
    });
  };

  const handleSavePreferences = () => {
    toast({
      title: "Preferences Updated",
      description: "Your preferences have been saved."
    });
  };

  const handleSaveSecurity = () => {
    toast({
      title: "Security Settings Updated",
      description: "Your security settings have been saved."
    });
  };

  const isAdmin = user?.user_metadata?.role === 'admin';

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

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="w-full md:w-auto grid grid-cols-2 md:grid-cols-5 gap-1">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          {isAdmin && <TabsTrigger value="ai-settings">AI Settings</TabsTrigger>}
        </TabsList>

        <TabsContent value="profile" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Manage your personal information and how it appears across the platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1 space-y-4">
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      defaultValue={userName}
                    />
                  </div>

                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      defaultValue={userEmail}
                      disabled
                    />
                    <p className="text-xs text-muted-foreground">
                      Email cannot be changed.
                    </p>
                  </div>

                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="role">Role</Label>
                    <Input
                      id="role"
                      defaultValue={userRole}
                      disabled
                    />
                    <p className="text-xs text-muted-foreground">
                      Your role is managed by your organization admin.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Profile Photo</Label>
                  <div className="flex flex-col items-center gap-2">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback className="text-2xl">
                        {userName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Upload
                      </Button>
                      <Button variant="outline" size="sm">
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveProfile}>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Configure how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <Switch id="email-notifications" defaultChecked />
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="sales-alerts">Sales Alerts</Label>
                  <Switch id="sales-alerts" defaultChecked />
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="marketing-updates">Marketing Updates</Label>
                  <Switch id="marketing-updates" defaultChecked />
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="customer-service-alerts">Customer Service Alerts</Label>
                  <Switch id="customer-service-alerts" defaultChecked />
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSavePreferences}>Save Preferences</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Interface Preferences</CardTitle>
              <CardDescription>
                Customize your experience with the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="dark-mode">Dark Mode</Label>
                  <Switch id="dark-mode" defaultChecked />
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="reduced-motion">Reduced Motion</Label>
                  <Switch id="reduced-motion" />
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSavePreferences}>Save Preferences</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Change your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>

              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>

              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" />
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveSecurity}>Update Password</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>
                Add an extra layer of security to your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <div>
                  <p className="font-medium">Enable Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">
                    Protect your account with an authenticator app
                  </p>
                </div>
                <Switch id="two-factor" />
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveSecurity}>Save Security Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4 mt-4">
          <AIConfigSection />

          <Card>
            <CardHeader>
              <CardTitle>Connected Services</CardTitle>
              <CardDescription>
                Manage the third-party services connected to your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-x-2 p-2 border rounded-md">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-muted rounded-md flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg>
                  </div>
                  <div>
                    <p className="font-medium">Stripe</p>
                    <p className="text-sm text-muted-foreground">
                      Payment processing integration
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Configure</Button>
              </div>

              <div className="flex items-center justify-between space-x-2 p-2 border rounded-md">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-muted rounded-md flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M21 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3" /><path d="M21 16v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3" /><path d="M4 12H20" /><path d="M14 12v.01" /></svg>
                  </div>
                  <div>
                    <p className="font-medium">Mailchimp</p>
                    <p className="text-sm text-muted-foreground">
                      Email marketing integration
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Configure</Button>
              </div>

              <div className="flex items-center justify-between space-x-2 p-2 border rounded-md">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-muted rounded-md flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M17 6.1H3" /><path d="M21 12.1H3" /><path d="M15.1 18H3" /></svg>
                  </div>
                  <div>
                    <p className="font-medium">Salesforce</p>
                    <p className="text-sm text-muted-foreground">
                      CRM integration
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Configure</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {isAdmin && (
          <TabsContent value="ai-settings" className="space-y-4 mt-4">
            <AISettingsPanel />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default Settings;
