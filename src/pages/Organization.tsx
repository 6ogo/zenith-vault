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
import { Link } from 'react-router-dom';
import { Users, Shield } from 'lucide-react';

// Mock data for organization members
const MOCK_MEMBERS = [
  {
    id: "1",
    name: "Jane Cooper",
    email: "jane.cooper@example.com",
    role: "admin",
    status: "active" as const,
    joinedAt: "2023-01-10T08:00:00Z"
  },
  {
    id: "2",
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    role: "user",
    status: "active" as const,
    joinedAt: "2023-02-15T09:30:00Z"
  },
  {
    id: "3",
    name: "Michael Brown",
    email: "michael.brown@example.com",
    role: "user",
    status: "inactive" as const,
    joinedAt: "2023-03-20T14:45:00Z"
  }
];

// Mock data for pending approvals
const MOCK_APPROVALS = [
  {
    id: "101",
    name: "Sarah Wilson",
    email: "sarah.wilson@example.com",
    organization: "Zenith Technologies Inc.",
    role: "user",
    requestedAt: "2023-04-05T10:15:00Z"
  },
  {
    id: "102",
    name: "David Martinez",
    email: "david.martinez@example.com",
    organization: "Zenith Technologies Inc.",
    role: "user",
    requestedAt: "2023-04-07T16:30:00Z"
  }
];

const Organization = () => {
  const [activeTab, setActiveTab] = useState("members");
  const { toast } = useToast();
  const [showRemoveDataModeDialog, setShowRemoveDataModeDialog] = useState(false);
  const { isRealData, setIsRealData } = useDataMode();
  const [permanentRealData, setPermanentRealData] = useState(() => {
    return localStorage.getItem('permanentRealData') === 'true';
  });
  const [members, setMembers] = useState(MOCK_MEMBERS);
  const [pendingApprovals, setPendingApprovals] = useState(MOCK_APPROVALS);

  useEffect(() => {
    // Check if permanent real data mode is enabled
    if (permanentRealData) {
      setIsRealData(true);
    }
  }, [permanentRealData, setIsRealData]);

  const handleChangeRole = (id: string, newRole: string) => {
    setMembers(members.map(member => 
      member.id === id ? { ...member, role: newRole } : member
    ));
    toast({
      title: "Role updated",
      description: `User role has been updated to ${newRole}`,
      duration: 3000
    });
  };

  const handleRemoveMember = (id: string) => {
    setMembers(members.filter(member => member.id !== id));
    toast({
      title: "Member removed",
      description: "The member has been removed from your organization",
      duration: 3000
    });
  };

  const handleApproveRequest = (id: string) => {
    const approvedUser = pendingApprovals.find(approval => approval.id === id);
    if (approvedUser) {
      // Add to members list
      setMembers([...members, {
        id: approvedUser.id,
        name: approvedUser.name,
        email: approvedUser.email,
        role: approvedUser.role,
        status: "active" as const,
        joinedAt: new Date().toISOString()
      }]);
      
      // Remove from pending approvals
      setPendingApprovals(pendingApprovals.filter(approval => approval.id !== id));
      
      toast({
        title: "User approved",
        description: `${approvedUser.name} has been added to your organization`,
        duration: 3000
      });
    }
  };

  const handleRejectRequest = (id: string) => {
    setPendingApprovals(pendingApprovals.filter(approval => approval.id !== id));
    toast({
      title: "Request rejected",
      description: "The membership request has been rejected",
      duration: 3000
    });
  };

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
          <div className="space-y-4">
            <PendingApprovals 
              approvals={pendingApprovals} 
              onApprove={handleApproveRequest} 
              onReject={handleRejectRequest} 
            />
            <OrganizationMembers 
              members={members} 
              onChangeRole={handleChangeRole} 
              onRemoveMember={handleRemoveMember} 
            />
          </div>
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
          
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Role Management</CardTitle>
              <CardDescription>Configure roles and permissions for users in your organization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground mb-4">
                  Create custom roles and define granular permissions for different features in the application.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4 flex items-start space-x-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Shield className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Custom Roles</h4>
                      <p className="text-sm text-muted-foreground">
                        Create roles with specific access levels to different features
                      </p>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4 flex items-start space-x-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">User Assignment</h4>
                      <p className="text-sm text-muted-foreground">
                        Assign users to specific roles with appropriate permissions
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button asChild>
                    <Link to="/organization/roles">
                      Manage Roles
                    </Link>
                  </Button>
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
