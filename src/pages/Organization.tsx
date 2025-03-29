import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Users, Shield, Settings, Eye, EyeOff, Menu, Layers, LogOut, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Demo organization data
const organizationData = {
  name: "Acme Corporation",
  plan: "Enterprise",
  id: "org-123456",
  created: "Jan 15, 2023",
  domain: "acmecorp.com",
  logo: "",
};

// Demo members data
const membersData = [
  {
    id: "user-001",
    name: "John Smith",
    email: "john.smith@acmecorp.com",
    role: "Admin",
    status: "active",
    lastActive: "2 hours ago",
    avatar: "",
  },
  {
    id: "user-002",
    name: "Sarah Johnson",
    email: "sarah.johnson@acmecorp.com",
    role: "Admin",
    status: "active",
    lastActive: "1 day ago",
    avatar: "",
  },
  {
    id: "user-003",
    name: "Michael Chen",
    email: "michael.chen@acmecorp.com",
    role: "Member",
    status: "active",
    lastActive: "Just now",
    avatar: "",
  },
  {
    id: "user-004",
    name: "Emily Rodriguez",
    email: "emily.r@acmecorp.com",
    role: "Analytics",
    status: "active",
    lastActive: "3 days ago",
    avatar: "",
  },
  {
    id: "user-005",
    name: "David Wilson",
    email: "david.wilson@acmecorp.com",
    role: "Member",
    status: "pending",
    lastActive: "Never",
    avatar: "",
  },
];

// Demo roles data
const rolesData = [
  {
    id: "role-001",
    name: "Admin",
    description: "Full access to all features and settings",
    members: 2,
    permissions: [
      "Manage users and permissions",
      "Access all data and reports",
      "Configure organization settings",
      "Manage billing and subscriptions",
      "Create and manage custom roles"
    ],
    isDefault: true,
    canEdit: false
  },
  {
    id: "role-002",
    name: "Member",
    description: "Standard access to most features",
    members: 2,
    permissions: [
      "Access assigned dashboards",
      "Create and edit reports",
      "View customer data",
      "Manage sales pipeline",
      "Create tickets and respond to customers"
    ],
    isDefault: true,
    canEdit: false
  },
  {
    id: "role-003",
    name: "Analytics",
    description: "Access to analytics and reporting features",
    members: 1,
    permissions: [
      "View all analytics dashboards",
      "Create and export reports",
      "Access historical data",
      "Create custom dashboards",
      "Share reports with team members"
    ],
    isDefault: false,
    canEdit: true
  },
  {
    id: "role-004",
    name: "Sales",
    description: "Access to sales features and customer data",
    members: 0,
    permissions: [
      "View and manage sales pipeline",
      "Access customer records",
      "Create and edit deals",
      "View sales reports",
      "Manage leads and opportunities"
    ],
    isDefault: false,
    canEdit: true
  }
];

// Demo sidebar apps data
const sidebarAppsData = [
  { id: "app-001", name: "Dashboard", enabled: true, icon: "LayoutDashboard", visibleTo: ["All roles"] },
  { id: "app-002", name: "Sales", enabled: true, icon: "BarChart", visibleTo: ["Admin", "Member", "Sales"] },
  { id: "app-003", name: "Customers", enabled: true, icon: "Users", visibleTo: ["All roles"] },
  { id: "app-004", name: "Service", enabled: true, icon: "LifeBuoy", visibleTo: ["Admin", "Member", "Support"] },
  { id: "app-005", name: "Marketing", enabled: true, icon: "Megaphone", visibleTo: ["Admin", "Member", "Marketing"] },
  { id: "app-006", name: "Analytics", enabled: true, icon: "Globe", visibleTo: ["Admin", "Analytics"] },
  { id: "app-007", name: "Website", enabled: true, icon: "Home", visibleTo: ["Admin", "Member", "Marketing"] },
  { id: "app-008", name: "Data Files", enabled: true, icon: "Database", visibleTo: ["Admin", "Analytics"] },
  { id: "app-009", name: "Integrations", enabled: true, icon: "Gitlab", visibleTo: ["Admin"] }
];

const Organization = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("members");
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isAddRoleDialogOpen, setIsAddRoleDialogOpen] = useState(false);
  const [isAddAppDialogOpen, setIsAddAppDialogOpen] = useState(false);

  // Filtered members based on search
  const filteredMembers = membersData.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInviteUser = () => {
    toast({
      title: "Invitation sent",
      description: "The invitation has been sent to the user's email address",
    });
    setIsInviteDialogOpen(false);
  };

  const handleAddRole = () => {
    toast({
      title: "Role created",
      description: "The new role has been created successfully",
    });
    setIsAddRoleDialogOpen(false);
  };

  const handleAddApp = () => {
    toast({
      title: "App added",
      description: "The custom app has been added to the sidebar",
    });
    setIsAddAppDialogOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Organization Settings</h1>
          <p className="text-muted-foreground">
            Manage your organization, users, roles, and permissions
          </p>
        </div>
        <div className="flex gap-3">
          <Button size="sm" className="font-medium">
            <Settings className="h-4 w-4 mr-1" /> Organization Settings
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-10 w-10">
                <AvatarFallback>{organizationData.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{organizationData.name}</CardTitle>
                <CardDescription>{organizationData.domain} • {organizationData.plan} Plan</CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Active</Badge>
          </CardHeader>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 max-w-[600px]">
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
          <TabsTrigger value="apps">Sidebar Apps</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="members" className="mt-6">
          <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Organization Members</CardTitle>
                <CardDescription>
                  Manage users and their roles within your organization
                </CardDescription>
              </div>
              <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-1" /> Invite User
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Invite User</DialogTitle>
                    <DialogDescription>
                      Send an invitation to join your organization
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email address</Label>
                      <Input id="email" type="email" placeholder="user@example.com" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="role">Role</Label>
                      <Select defaultValue="member">
                        <SelectTrigger id="role">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="member">Member</SelectItem>
                          <SelectItem value="analytics">Analytics</SelectItem>
                          <SelectItem value="sales">Sales</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="message">Personal message (optional)</Label>
                      <Input id="message" placeholder="Join our team on Zenith Vault" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleInviteUser}>Send Invitation</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-4">
                <div className="relative max-w-md w-full">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search members..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Active</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMembers.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{member.name}</div>
                              <div className="text-sm text-muted-foreground">{member.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{member.role}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={member.status === "active" ? "default" : "secondary"}
                            className={member.status === "active" ? "bg-green-500" : ""}
                          >
                            {member.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{member.lastActive}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm">Edit</Button>
                            {member.status === "pending" ? (
                              <Button variant="outline" size="sm">Resend</Button>
                            ) : (
                              <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                                <LogOut className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="roles" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Roles & Permissions</CardTitle>
                <CardDescription>
                  Manage roles and their associated permissions
                </CardDescription>
              </div>
              <Dialog open={isAddRoleDialogOpen} onOpenChange={setIsAddRoleDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-1" /> Create Role
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Create New Role</DialogTitle>
                    <DialogDescription>
                      Define a new role with custom permissions
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="role-name">Role Name</Label>
                      <Input id="role-name" placeholder="e.g., Marketing Manager" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="role-description">Description</Label>
                      <Input id="role-description" placeholder="Brief description of this role" />
                    </div>
                    <div className="space-y-4">
                      <Label>Permissions</Label>
                      <div className="grid gap-3">
                        <div className="flex items-center space-x-2">
                          <Switch id="perm-1" defaultChecked />
                          <Label htmlFor="perm-1">Access Dashboard</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="perm-2" defaultChecked />
                          <Label htmlFor="perm-2">View Customer Data</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="perm-3" />
                          <Label htmlFor="perm-3">Manage Users</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="perm-4" />
                          <Label htmlFor="perm-4">Access Billing</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="perm-5" defaultChecked />
                          <Label htmlFor="perm-5">Create Reports</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddRoleDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddRole}>Create Role</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rolesData.map(role => (
                  <Card key={role.id} className="shadow-sm">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {role.name}
                            {role.isDefault && <Badge variant="outline" className="text-xs">Default</Badge>}
                          </CardTitle>
                          <CardDescription>{role.description}</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{role.members} {role.members === 1 ? 'member' : 'members'}</Badge>
                          {role.canEdit && (
                            <Button variant="outline" size="sm">Edit</Button>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                        {role.permissions.map((permission, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-primary" />
                            <span className="text-sm">{permission}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="apps" className="mt-6">
          <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Sidebar Applications</CardTitle>
                <CardDescription>
                  Manage which apps are visible in the sidebar and to which roles
                </CardDescription>
              </div>
              <Dialog open={isAddAppDialogOpen} onOpenChange={setIsAddAppDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-1" /> Add Custom App
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Custom App</DialogTitle>
                    <DialogDescription>
                      Create a custom application for your sidebar
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="app-name">App Name</Label>
                      <Input id="app-name" placeholder="e.g., Project Management" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="app-icon">Icon</Label>
                      <Select defaultValue="layers">
                        <SelectTrigger id="app-icon">
                          <SelectValue placeholder="Select an icon" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="layers">Layers</SelectItem>
                          <SelectItem value="settings">Settings</SelectItem>
                          <SelectItem value="users">Users</SelectItem>
                          <SelectItem value="chart">Chart</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="app-url">URL or Path</Label>
                      <Input id="app-url" placeholder="/custom/app" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="app-visibility">Visible to</Label>
                      <Select defaultValue="all">
                        <SelectTrigger id="app-visibility">
                          <SelectValue placeholder="Select roles" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All roles</SelectItem>
                          <SelectItem value="admin">Admin only</SelectItem>
                          <SelectItem value="custom">Select roles...</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddAppDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddApp}>Add App</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>App</TableHead>
                      <TableHead>Visible To</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sidebarAppsData.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-md flex items-center justify-center bg-primary/10">
                              <Menu className="h-5 w-5 text-primary" />
                            </div>
                            <div className="font-medium">{app.name}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {app.visibleTo.map((role, idx) => (
                              <Badge key={idx} variant="outline">{role}</Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {app.enabled ? (
                              <>
                                <Eye className="h-4 w-4 text-green-500" />
                                <span>Visible</span>
                              </>
                            ) : (
                              <>
                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Hidden</span>
                              </>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm">Edit</Button>
                            <Button variant="outline" size="sm">
                              {app.enabled ? "Hide" : "Show"}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Organization Settings</CardTitle>
              <CardDescription>
                Manage your organization details, domain, and security
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">General Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="org-name">Organization Name</Label>
                    <Input id="org-name" defaultValue={organizationData.name} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="org-domain">Domain</Label>
                    <Input id="org-domain" defaultValue={organizationData.domain} />
                    <p className="text-xs text-muted-foreground">
                      Users with this email domain can request to join automatically
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="org-logo">Organization Logo</Label>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="text-lg">{organizationData.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <Button variant="outline">Upload Logo</Button>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-medium">Security Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Require 2FA</Label>
                      <p className="text-sm text-muted-foreground">
                        Require all members to set up two-factor authentication
                      </p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Auto-Approve Domain Users</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically approve users from your verified domain
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Single Sign-On (SSO)</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable SSO with your identity provider
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Enterprise Plan</Badge>
                      <Switch disabled />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-medium">Danger Zone</h3>
                <div className="rounded-md border border-red-200 p-4">
                  <div className="flex items-start gap-4">
                    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium text-red-500">Delete Organization</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Permanently delete this organization and all its data. This action cannot be undone.
                      </p>
                      <Button variant="destructive" size="sm">Delete Organization</Button>
                    </div>
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
      </Tabs>
    </div >
  );
};

export default Organization;
