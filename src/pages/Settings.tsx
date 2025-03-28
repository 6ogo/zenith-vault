
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

const Settings = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-5 lg:w-[600px]">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and profile settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" defaultValue="John Doe" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" defaultValue="john.doe@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="job-title">Job Title</Label>
                <Input id="job-title" defaultValue="Sales Manager" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input id="department" defaultValue="Sales" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Input id="bio" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Cancel</Button>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="account" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Manage your account preferences and security settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Security</h3>
                
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-medium">Enable 2FA</div>
                    <div className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </div>
                  </div>
                  <Switch />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Sessions</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <div>
                      <div className="font-medium">Current Session</div>
                      <div className="text-sm text-muted-foreground">
                        Chrome on Windows • IP 192.168.1.1
                      </div>
                    </div>
                    <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      Active
                    </div>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <div>
                      <div className="font-medium">Previous Session</div>
                      <div className="text-sm text-muted-foreground">
                        Safari on Mac • IP 192.168.1.2 • 2 days ago
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Revoke</Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Cancel</Button>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="team" className="mt-4">
          <div className="p-8 text-center text-muted-foreground">
            Team management features will be available in the next update.
          </div>
        </TabsContent>
        <TabsContent value="billing" className="mt-4">
          <div className="p-8 text-center text-muted-foreground">
            Billing management features will be available in the next update.
          </div>
        </TabsContent>
        <TabsContent value="notifications" className="mt-4">
          <div className="p-8 text-center text-muted-foreground">
            Notification settings will be available in the next update.
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
