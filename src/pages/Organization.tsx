
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import PendingApprovals from '@/components/organization/PendingApprovals';
import OrganizationMembers from '@/components/organization/OrganizationMembers';

const Organization = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [orgLoading, setOrgLoading] = useState(true);
  const [orgName, setOrgName] = useState('');
  const [organization, setOrganization] = useState<any>(null);
  const [pendingApprovals, setPendingApprovals] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user) {
      fetchOrganizationData();
    }
  }, [user]);

  const fetchOrganizationData = async () => {
    setOrgLoading(true);
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
        setOrgLoading(false);
        return;
      }
      
      const isUserAdmin = memberData.role === 'admin';
      setIsAdmin(isUserAdmin);
      
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', memberData.organization_id)
        .single();
      
      if (orgError) throw orgError;
      
      setOrganization(orgData);
      setOrgName(orgData.name);
      
      if (isUserAdmin) {
        await fetchPendingApprovals(memberData.organization_id);
        await fetchOrganizationMembers(memberData.organization_id);
      } else {
        await fetchOrganizationMembers(memberData.organization_id);
      }
    } catch (error: any) {
      console.error('Error fetching organization data:', error);
      toast({
        title: "Error loading organization",
        description: "Failed to load organization details. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setOrgLoading(false);
    }
  };

  const fetchPendingApprovals = async (organizationId: string) => {
    try {
      const { data, error } = await supabase
        .from('organization_members')
        .select(`
          id,
          user_id,
          role,
          status,
          joined_at,
          profiles(full_name)
        `)
        .eq('organization_id', organizationId)
        .eq('status', 'pending');
      
      if (error) throw error;
      
      const formattedPendingMembers = data?.map(member => ({
        id: member.id,
        name: member.profiles?.full_name || 'Unknown',
        email: 'Email not available',
        organization: orgName,
        role: member.role,
        requestedAt: member.joined_at,
      })) || [];
      
      setPendingApprovals(formattedPendingMembers);
    } catch (error: any) {
      console.error('Error fetching pending approvals:', error);
    }
  };

  const fetchOrganizationMembers = async (organizationId: string) => {
    try {
      const { data, error } = await supabase
        .from('organization_members')
        .select(`
          id,
          user_id,
          role,
          status,
          joined_at,
          profiles(full_name)
        `)
        .eq('organization_id', organizationId)
        .eq('status', 'active');
      
      if (error) throw error;
      
      const formattedMembers = data?.map(member => ({
        id: member.id,
        name: member.profiles?.full_name || 'Unknown',
        email: 'Email not available',
        role: member.role,
        status: member.status,
        joinedAt: member.joined_at,
      })) || [];
      
      setMembers(formattedMembers);
    } catch (error: any) {
      console.error('Error fetching organization members:', error);
    }
  };

  const handleUpdateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAdmin) {
      toast({
        title: "Permission denied",
        description: "Only administrators can update organization details.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('organizations')
        .update({ name: orgName, updated_at: new Date().toISOString() })
        .eq('id', organization?.id);
      
      if (error) throw error;
      
      toast({
        title: "Organization updated",
        description: "Your organization details have been updated successfully",
      });
    } catch (error: any) {
      console.error('Error updating organization:', error);
      toast({
        title: "Update failed",
        description: error.message || "Failed to update organization. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApproveUser = async (id: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('organization_members')
        .update({ status: 'active' })
        .eq('id', id);
      
      if (error) throw error;
      
      if (organization) {
        await fetchPendingApprovals(organization.id);
        await fetchOrganizationMembers(organization.id);
      }
      
      toast({
        title: "User approved",
        description: "The user has been added to your organization",
      });
    } catch (error: any) {
      console.error('Error approving user:', error);
      toast({
        title: "Approval failed",
        description: error.message || "Failed to approve user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRejectUser = async (id: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('organization_members')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      if (organization) {
        await fetchPendingApprovals(organization.id);
      }
      
      setPendingApprovals(pendingApprovals.filter(user => user.id !== id));
      
      toast({
        title: "User rejected",
        description: "The user's request has been rejected",
      });
    } catch (error: any) {
      console.error('Error rejecting user:', error);
      toast({
        title: "Rejection failed",
        description: error.message || "Failed to reject user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangeRole = async (id: string, newRole: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('organization_members')
        .update({ role: newRole })
        .eq('id', id);
      
      if (error) throw error;
      
      setMembers(members.map(member => 
        member.id === id 
          ? { ...member, role: newRole } 
          : member
      ));
      
      toast({
        title: "Role updated",
        description: `User role has been updated to ${newRole}`,
      });
    } catch (error: any) {
      console.error('Error changing role:', error);
      toast({
        title: "Update failed",
        description: error.message || "Failed to update role. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (id: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('organization_members')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setMembers(members.filter(member => member.id !== id));
      
      toast({
        title: "Member removed",
        description: "The member has been removed from your organization",
      });
    } catch (error: any) {
      console.error('Error removing member:', error);
      toast({
        title: "Removal failed",
        description: error.message || "Failed to remove member. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (orgLoading) {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Organization Management</h1>
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <p className="mb-4">Loading organization data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Organization Management</h1>
        <Card>
          <CardHeader>
            <CardTitle>No Organization</CardTitle>
            <CardDescription>
              You are not currently part of any organization.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Sign up with an organization name to create or join an organization.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Organization Management</h1>
      
      <Tabs defaultValue="details" className="space-y-6">
        <TabsList className="grid w-full md:w-auto grid-cols-3 md:inline-flex">
          <TabsTrigger value="details">Organization Details</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          {isAdmin && <TabsTrigger value="approvals">Pending Approvals</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Organization Details</CardTitle>
              <CardDescription>
                Manage your organization information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateOrg} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="orgName">Organization Name</Label>
                  <Input
                    id="orgName"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    disabled={!isAdmin || loading}
                  />
                  {!isAdmin && (
                    <p className="text-xs text-muted-foreground">
                      Contact your organization administrator for any changes to the organization.
                    </p>
                  )}
                  {isAdmin && (
                    <p className="text-xs text-muted-foreground">
                      Organization name changes may affect user access. For major changes, please contact our support team.
                    </p>
                  )}
                </div>
                
                {isAdmin && (
                  <Button type="submit" disabled={loading}>
                    {loading ? "Updating..." : "Update Organization"}
                  </Button>
                )}
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="members">
          <OrganizationMembers 
            members={members}
            onChangeRole={handleChangeRole}
            onRemoveMember={handleRemoveMember}
          />
        </TabsContent>
        
        {isAdmin && (
          <TabsContent value="approvals">
            <PendingApprovals 
              approvals={pendingApprovals}
              onApprove={handleApproveUser}
              onReject={handleRejectUser}
            />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default Organization;
