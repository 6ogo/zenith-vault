import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface OrganizationMember {
  id: string;
  user_id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  joined_at: string;
}

export interface OrganizationApproval {
  id: string;
  name: string;
  email: string;
  organization: string;
  role: string;
  requestedAt: string;
}

export interface OrganizationSettings {
  id: string;
  name: string;
  website?: string;
  address?: string;
  settings?: Record<string, any>;
}

export function useOrganization() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchUserOrganization = useCallback(async () => {
    if (!user) return null;
    
    try {
      setLoading(true);
      
      // Get the organization member record for the current user
      const { data: memberData, error: memberError } = await supabase
        .from('organization_members')
        .select('organization_id')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();
        
      if (memberError) {
        console.error('Error fetching user organization:', memberError);
        return null;
      }
      
      if (!memberData) {
        return null;
      }
      
      // Get the organization details
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', memberData.organization_id)
        .single();
        
      if (orgError) {
        console.error('Error fetching organization details:', orgError);
        return null;
      }
      
      return orgData;
    } catch (error) {
      console.error('Error in fetchUserOrganization:', error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchOrganizationMembers = useCallback(async (organizationId: string) => {
    try {
      setLoading(true);
      
      // Join organization_members with profiles to get user details
      const { data, error } = await supabase
        .from('organization_members')
        .select(`
          id,
          user_id,
          role,
          status,
          joined_at,
          profiles:user_id (
            full_name
          ),
          users:user_id (
            email
          )
        `)
        .eq('organization_id', organizationId);
        
      if (error) {
        console.error('Error fetching organization members:', error);
        return [];
      }
      
      // Format the data for the UI
      const formattedMembers: OrganizationMember[] = data.map(member => ({
        id: member.id,
        user_id: member.user_id,
        name: member.profiles?.full_name || 'Unknown',
        email: member.users?.email || 'Unknown',
        role: member.role,
        status: member.status as 'active' | 'inactive' | 'pending',
        joined_at: member.joined_at
      }));
      
      return formattedMembers;
    } catch (error) {
      console.error('Error in fetchOrganizationMembers:', error);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPendingApprovals = useCallback(async (organizationId: string) => {
    try {
      setLoading(true);
      
      // Get pending organization members and join with profiles
      const { data, error } = await supabase
        .from('organization_members')
        .select(`
          id,
          user_id,
          role,
          joined_at,
          profiles:user_id (
            full_name
          ),
          users:user_id (
            email
          ),
          organizations:organization_id (
            name
          )
        `)
        .eq('organization_id', organizationId)
        .eq('status', 'pending');
        
      if (error) {
        console.error('Error fetching pending approvals:', error);
        return [];
      }
      
      // Format the data for the UI
      const formattedApprovals: OrganizationApproval[] = data.map(approval => ({
        id: approval.id,
        name: approval.profiles?.full_name || 'Unknown',
        email: approval.users?.email || 'Unknown',
        organization: approval.organizations?.name || 'Unknown',
        role: approval.role,
        requestedAt: approval.joined_at
      }));
      
      return formattedApprovals;
    } catch (error) {
      console.error('Error in fetchPendingApprovals:', error);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const updateMemberRole = useCallback(async (memberId: string, newRole: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('organization_members')
        .update({ role: newRole })
        .eq('id', memberId);
        
      if (error) {
        console.error('Error updating member role:', error);
        toast({
          title: 'Error',
          description: 'Failed to update member role',
          variant: 'destructive'
        });
        return false;
      }
      
      toast({
        title: 'Role updated',
        description: `User role has been updated to ${newRole}`
      });
      
      return true;
    } catch (error) {
      console.error('Error in updateMemberRole:', error);
      toast({
        title: 'Error',
        description: 'Failed to update member role',
        variant: 'destructive'
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const removeMember = useCallback(async (memberId: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('organization_members')
        .delete()
        .eq('id', memberId);
        
      if (error) {
        console.error('Error removing member:', error);
        toast({
          title: 'Error',
          description: 'Failed to remove member',
          variant: 'destructive'
        });
        return false;
      }
      
      toast({
        title: 'Member removed',
        description: 'The member has been removed from your organization'
      });
      
      return true;
    } catch (error) {
      console.error('Error in removeMember:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove member',
        variant: 'destructive'
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const approveRequest = useCallback(async (memberId: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('organization_members')
        .update({ status: 'active' })
        .eq('id', memberId);
        
      if (error) {
        console.error('Error approving request:', error);
        toast({
          title: 'Error',
          description: 'Failed to approve request',
          variant: 'destructive'
        });
        return false;
      }
      
      toast({
        title: 'User approved',
        description: 'The user has been added to your organization'
      });
      
      return true;
    } catch (error) {
      console.error('Error in approveRequest:', error);
      toast({
        title: 'Error',
        description: 'Failed to approve request',
        variant: 'destructive'
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const rejectRequest = useCallback(async (memberId: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('organization_members')
        .delete()
        .eq('id', memberId);
        
      if (error) {
        console.error('Error rejecting request:', error);
        toast({
          title: 'Error',
          description: 'Failed to reject request',
          variant: 'destructive'
        });
        return false;
      }
      
      toast({
        title: 'Request rejected',
        description: 'The membership request has been rejected'
      });
      
      return true;
    } catch (error) {
      console.error('Error in rejectRequest:', error);
      toast({
        title: 'Error',
        description: 'Failed to reject request',
        variant: 'destructive'
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const updateOrganizationSettings = useCallback(async (organizationId: string, settings: Partial<OrganizationSettings>) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('organizations')
        .update({
          name: settings.name,
          updated_at: new Date().toISOString()
        })
        .eq('id', organizationId);
        
      if (error) {
        console.error('Error updating organization settings:', error);
        toast({
          title: 'Error',
          description: 'Failed to update organization settings',
          variant: 'destructive'
        });
        return false;
      }
      
      // Check if organization settings exists
      const { data, error: fetchError } = await supabase
        .from('organization_settings')
        .select('id')
        .eq('organization_id', organizationId)
        .eq('settings_type', 'general')
        .single();
        
      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error checking organization settings:', fetchError);
        toast({
          title: 'Error',
          description: 'Failed to update organization settings',
          variant: 'destructive'
        });
        return false;
      }
      
      // Create or update organization settings
      const settingsData = {
        website: settings.website,
        address: settings.address,
        ...settings.settings
      };
      
      let settingsError;
      
      if (data) {
        // Update existing settings
        const result = await supabase
          .from('organization_settings')
          .update({
            settings_value: settingsData,
            updated_at: new Date().toISOString()
          })
          .eq('id', data.id);
          
        settingsError = result.error;
      } else {
        // Insert new settings
        const result = await supabase
          .from('organization_settings')
          .insert({
            organization_id: organizationId,
            settings_type: 'general',
            settings_value: settingsData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
          
        settingsError = result.error;
      }
      
      if (settingsError) {
        console.error('Error updating organization settings details:', settingsError);
        toast({
          title: 'Warning',
          description: 'Organization name updated but failed to save additional settings',
          variant: 'destructive'
        });
        return false;
      }
      
      toast({
        title: 'Settings updated',
        description: 'Organization settings have been updated successfully'
      });
      
      return true;
    } catch (error) {
      console.error('Error in updateOrganizationSettings:', error);
      toast({
        title: 'Error',
        description: 'Failed to update organization settings',
        variant: 'destructive'
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return {
    loading,
    fetchUserOrganization,
    fetchOrganizationMembers,
    fetchPendingApprovals,
    updateMemberRole,
    removeMember,
    approveRequest,
    rejectRequest,
    updateOrganizationSettings
  };
}
