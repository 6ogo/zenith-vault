import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { TwoFactorSetup } from '@/components/auth/TwoFactorSetup';
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Define a type for the profile data that includes all the fields we need
type ProfileData = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  updated_at: string | null;
  is_mfa_enabled: boolean | null;
  job_title?: string | null;
  department?: string | null;
  phone_number?: string | null;
};

export default function Settings() {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [organization, setOrganization] = useState<any>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  
  const form = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      jobTitle: "",
      department: "",
    },
  });

  useEffect(() => {
    if (user) {
      fetchProfileData();
      fetchOrganization();
      fetchSessions();
    }
  }, [user]);

  useEffect(() => {
    if (profileData) {
      form.setValue("fullName", profileData.full_name || "");
      form.setValue("email", user?.email || "");
      form.setValue("phone", profileData.phone_number || "");
      form.setValue("jobTitle", profileData.job_title || "");
      form.setValue("department", profileData.department || "");
      
      if (!profileData.full_name || !profileData.job_title || !profileData.department) {
        setIsFirstLogin(true);
      }
    }
  }, [profileData, user, form]);

  const fetchProfileData = async () => {
    try {
      if (!user?.id) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Failed to load profile",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      
      if (data) {
        const typedData: ProfileData = {
          id: data.id,
          full_name: data.full_name,
          avatar_url: data.avatar_url,
          updated_at: data.updated_at,
          is_mfa_enabled: data.is_mfa_enabled,
          job_title: data.job_title || null,
          department: data.department || null,
          phone_number: data.phone_number || null,
        };
        
        setProfileData(typedData);
        
        form.setValue("fullName", typedData.full_name || "");
        form.setValue("email", user?.email || "");
        form.setValue("phone", typedData.phone_number || "");
        form.setValue("jobTitle", typedData.job_title || "");
        form.setValue("department", typedData.department || "");
        
        if (!typedData.full_name || !typedData.job_title || !typedData.department) {
          setIsFirstLogin(true);
        }
      } else {
        const { error: createError } = await supabase
          .from('profiles')
          .insert([{ 
            id: user.id,
            full_name: user.user_metadata?.full_name || '',
            avatar_url: user.user_metadata?.avatar_url || null
          }]);
        
        if (createError) {
          console.error('Error creating profile:', createError);
        } else {
          fetchProfileData();
        }
      }
    } catch (error: any) {
      console.error('Error in fetchProfileData:', error);
      toast({
        title: "Failed to load profile",
        description: "Could not load your profile information",
        variant: "destructive",
      });
    }
  };

  const fetchOrganization = async () => {
    try {
      const { data: memberData, error: memberError } = await supabase
        .from('organization_members')
        .select('organization_id, role, status')
        .eq('user_id', user?.id)
        .single();
      
      if (memberError) {
        if (memberError.code !== 'PGRST116') {
          throw memberError;
        }
        return;
      }
      
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', memberData.organization_id)
        .single();
      
      if (orgError) throw orgError;
      
      setOrganization({
        ...orgData,
        role: memberData.role,
        status: memberData.status
      });
    } catch (error: any) {
      console.error('Error fetching organization:', error);
    }
  };

  const fetchSessions = async () => {
    setSessions([
      {
        id: 'current',
        device: 'Current Session',
        info: `${getBrowser()} on ${getOS()}`,
        ip: '192.168.1.1',
        active: true,
        lastActivity: new Date(),
      },
      {
        id: 'previous',
        device: 'Previous Session',
        info: 'Safari on Mac',
        ip: '192.168.1.2',
        active: false,
        lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      }
    ]);
  };

  const getBrowser = () => {
    const userAgent = navigator.userAgent;
    if (userAgent.indexOf("Chrome") > -1) return "Chrome";
    if (userAgent.indexOf("Safari") > -1) return "Safari";
    if (userAgent.indexOf("Firefox") > -1) return "Firefox";
    if (userAgent.indexOf("MSIE") > -1 || userAgent.indexOf("Trident") > -1) return "Internet Explorer";
    if (userAgent.indexOf("Edge") > -1) return "Edge";
    return "Unknown Browser";
  };

  const getOS = () => {
    const userAgent = navigator.userAgent;
    if (userAgent.indexOf("Win") > -1) return "Windows";
    if (userAgent.indexOf("Mac") > -1) return "macOS";
    if (userAgent.indexOf("Linux") > -1) return "Linux";
    if (userAgent.indexOf("Android") > -1) return "Android";
    if (userAgent.indexOf("iPhone") > -1 || userAgent.indexOf("iPad") > -1) return "iOS";
    return "Unknown OS";
  };

  const handleUpdateProfile = async (values: any) => {
    setLoading(true);
    try {
      if (!user?.id) return;
      
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: values.fullName,
          phone_number: values.phone,
          job_title: values.jobTitle,
          department: values.department,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });
      
      setIsFirstLogin(false);
      await fetchProfileData();
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update failed",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Not implemented",
      description: "Password change functionality will be available in the next update.",
    });
  };

  const handleRevokeSession = (sessionId: string) => {
    setSessions(sessions.filter(session => session.id !== sessionId));
    toast({
      title: "Session revoked",
      description: "The session has been revoked successfully.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      {isFirstLogin && (
        <Card className="mb-8 border-primary">
          <CardHeader className="bg-primary/5">
            <CardTitle>Complete Your Profile</CardTitle>
            <CardDescription>
              Please take a moment to complete your profile information
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleUpdateProfile)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Your full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="jobTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Title *</FormLabel>
                        <FormControl>
                          <Input placeholder="Your job title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department *</FormLabel>
                        <FormControl>
                          <Input placeholder="Your department" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number (Optional)</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="+1 (555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save Profile"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-3">
          {/* Sidebar content */}
        </div>
        
        <div className="md:col-span-9 space-y-8">
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
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleUpdateProfile)} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          {...form.register("fullName")}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            {...form.register("email")}
                            disabled
                          />
                          <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number (Optional)</Label>
                          <Input
                            id="phone"
                            type="tel"
                            {...form.register("phone")}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="jobTitle">Job Title</Label>
                        <Input
                          id="jobTitle"
                          {...form.register("jobTitle")}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <Input
                          id="department"
                          {...form.register("department")}
                        />
                      </div>
                      {organization && (
                        <div className="space-y-2">
                          <Label htmlFor="organization">Organization</Label>
                          <Input
                            id="organization"
                            value={organization.name}
                            disabled
                          />
                          <p className="text-xs text-muted-foreground">
                            {organization.role === 'admin' 
                              ? "For organization name changes, please contact our support team." 
                              : "Contact your organization admin for any organization-related changes."}
                          </p>
                        </div>
                      )}
                      <CardFooter className="flex justify-between px-0 pt-5">
                        <Button variant="outline" type="button" onClick={() => form.reset()}>Cancel</Button>
                        <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save Changes"}</Button>
                      </CardFooter>
                    </form>
                  </Form>
                </CardContent>
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
                    
                    <form onSubmit={handlePasswordChange} className="grid grid-cols-1 gap-4">
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
                      <Button type="submit" className="w-full md:w-auto md:justify-self-end">
                        Update Password
                      </Button>
                    </form>
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
                      {sessions.map((session) => (
                        <div key={session.id} className="flex justify-between items-center pb-2 border-b">
                          <div>
                            <div className="font-medium">{session.device}</div>
                            <div className="text-sm text-muted-foreground">
                              {session.info} • IP {session.ip}
                              {!session.active && ` • ${new Date(session.lastActivity).toLocaleDateString()}`}
                            </div>
                          </div>
                          {session.active ? (
                            <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                              Active
                            </div>
                          ) : (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleRevokeSession(session.id)}
                            >
                              Revoke
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
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
      </div>
    </div>
  );
}
