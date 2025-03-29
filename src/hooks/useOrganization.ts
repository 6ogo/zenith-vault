
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export type OrganizationRole = 'admin' | 'user' | 'manager';
export type MemberStatus = 'active' | 'pending' | 'inactive';

export interface OrganizationMember {
  id: string;
  user_id: string;
  organization_id: string;
  role: OrganizationRole;
  status: MemberStatus;
  joined_at: string;
  full_name?: string;
  email?: string;
}

export interface Organization {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface OrganizationApproval {
  id: string;
  name: string;
  email: string;
  organization: string;
  role: string;
  requestedAt: string;
}

export interface UseOrganizationReturn {
  currentOrganization: Organization | null;
  loading: boolean;
  members: OrganizationMember[];
  approvals: OrganizationApproval[];
  refreshOrganization: () => Promise<void>;
  approveMember: (memberId: string) => Promise<boolean>;
  rejectMember: (memberId: string) => Promise<boolean>;
  removeMember: (memberId: string) => Promise<boolean>;
  updateMemberRole: (memberId: string, newRole: OrganizationRole) => Promise<boolean>;
}

export function useOrganization(): UseOrganizationReturn {
  const { user } = useAuth();
  const [currentOrganization, setCurrentOrganization] = useState<Organization | null>(null);
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [approvals, setApprovals] = useState<OrganizationApproval[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const refreshOrganization = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // First, find the user's organization membership
      const { data: memberData, error: memberError } = await supabase
        .from('organization_members')
        .select('organization_id, role, status')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();
      
      if (memberError) {
        console.error('Error fetching organization membership:', memberError);
        return;
      }
      
      if (!memberData || !memberData.organization_id) return;
      
      // Next, get the organization details
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', memberData.organization_id)
        .single();
      
      if (orgError) {
        console.error('Error fetching organization:', orgError);
        return;
      }
      
      setCurrentOrganization(orgData);
      
      // Get all members of this organization with their profiles
      const { data: membersData, error: membersError } = await supabase
        .from('organization_members')
        .select(`
          *,
          profiles:user_id (
            full_name,
            avatar_url,
            id
          )
        `)
        .eq('organization_id', memberData.organization_id);
      
      if (membersError) {
        console.error('Error fetching organization members:', membersError);
        return;
      }
      
      // Format members with profile data
      const formattedMembers: OrganizationMember[] = membersData.map(member => {
        const profile = member.profiles as any;
        return {
          ...member,
          full_name: profile?.full_name || 'Unknown User',
          email: profile?.email || 'No email'
        };
      });
      
      setMembers(formattedMembers);
      
      // If user is admin, get pending membership approvals
      if (memberData.role === 'admin') {
        const { data: pendingData, error: pendingError } = await supabase
          .from('organization_members')
          .select(`
            *,
            profiles:user_id (
              full_name,
              avatar_url,
              id
            )
          `)
          .eq('organization_id', memberData.organization_id)
          .eq('status', 'pending');
        
        if (pendingError) {
          console.error('Error fetching pending approvals:', pendingError);
          return;
        }
        
        // Format pending approvals
        const formattedApprovals: OrganizationApproval[] = pendingData.map(member => {
          const profile = member.profiles as any;
          return {
            id: member.id,
            name: profile?.full_name || 'Unknown User',
            email: profile?.email || 'No email',
            organization: orgData.name,
            role: member.role,
            requestedAt: member.joined_at
          };
        });
        
        setApprovals(formattedApprovals);
      }
    } catch (error) {
      console.error('Error in refreshOrganization:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);
  
  // Approve a pending member
  const approveMember = async (memberId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('organization_members')
        .update({ status: 'active' })
        .eq('id', memberId);
      
      if (error) {
        console.error('Error approving member:', error);
        toast({
          title: 'Error',
          description: 'Failed to approve member',
          variant: 'destructive'
        });
        return false;
      }
      
      toast({
        title: 'Member Approved',
        description: 'The member has been approved'
      });
      
      await refreshOrganization();
      return true;
    } catch (error) {
      console.error('Error in approveMember:', error);
      return false;
    }
  };
  
  // Reject a pending member
  const rejectMember = async (memberId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('organization_members')
        .delete()
        .eq('id', memberId);
      
      if (error) {
        console.error('Error rejecting member:', error);
        toast({
          title: 'Error',
          description: 'Failed to reject member',
          variant: 'destructive'
        });
        return false;
      }
      
      toast({
        title: 'Member Rejected',
        description: 'The membership request has been rejected'
      });
      
      await refreshOrganization();
      return true;
    } catch (error) {
      console.error('Error in rejectMember:', error);
      return false;
    }
  };
  
  // Remove an active member
  const removeMember = async (memberId: string): Promise<boolean> => {
    try {
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
        title: 'Member Removed',
        description: 'The member has been removed from the organization'
      });
      
      await refreshOrganization();
      return true;
    } catch (error) {
      console.error('Error in removeMember:', error);
      return false;
    }
  };
  
  // Update a member's role
  const updateMemberRole = async (memberId: string, newRole: OrganizationRole): Promise<boolean> => {
    try {
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
        title: 'Role Updated',
        description: `Member role has been updated to ${newRole}`
      });
      
      await refreshOrganization();
      return true;
    } catch (error) {
      console.error('Error in updateMemberRole:', error);
      return false;
    }
  };
  
  // Load organization data when user changes
  useEffect(() => {
    if (user) {
      refreshOrganization();
    } else {
      setCurrentOrganization(null);
      setMembers([]);
      setApprovals([]);
    }
  }, [user, refreshOrganization]);
  
  return {
    currentOrganization,
    loading,
    members,
    approvals,
    refreshOrganization,
    approveMember,
    rejectMember,
    removeMember,
    updateMemberRole
  };
}
