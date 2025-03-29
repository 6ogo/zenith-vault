
import { useState, useCallback } from 'react';
import { useToast } from './use-toast';
import { Role, Permission } from '@/types/organization';
import { supabase } from '@/integrations/supabase/client';

export function useOrganizationRoles() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const getOrganizationRoles = useCallback(async (organizationId: string): Promise<Role[]> => {
    try {
      setLoading(true);
      console.log('Fetching roles for organization:', organizationId);
      
      // First attempt to use the Supabase Edge Function
      const functionResponse = await supabase.functions.invoke('organization-roles', {
        body: { 
          action: 'get_organization_roles',
          organization_id: organizationId 
        }
      });
      
      if (functionResponse.error) {
        console.error('Error invoking edge function:', functionResponse.error);
        
        // Fallback to direct API call if edge function fails
        const response = await fetch(`${window.location.origin}/api/organization-roles/get_organization_roles`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ data: { organization_id: organizationId } }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch organization roles');
        }
        
        const data = await response.json();
        console.log('Fetched roles:', data);
        return data;
      }
      
      console.log('Fetched roles from edge function:', functionResponse.data);
      return functionResponse.data as Role[];
    } catch (error) {
      console.error('Error fetching roles:', error);
      toast({
        title: 'Error',
        description: 'Failed to load organization roles',
        variant: 'destructive',
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const getRolePermissions = useCallback(async (roleId: string): Promise<Permission[]> => {
    try {
      setLoading(true);
      console.log('Fetching permissions for role:', roleId);
      
      // First attempt to use the Supabase Edge Function
      const functionResponse = await supabase.functions.invoke('organization-roles', {
        body: { 
          action: 'get_role_permissions',
          role_id: roleId 
        }
      });
      
      if (functionResponse.error) {
        console.error('Error invoking edge function:', functionResponse.error);
        
        // Fallback to direct API call
        const response = await fetch(`${window.location.origin}/api/organization-roles/get_role_permissions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ data: { role_id: roleId } }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch role permissions');
        }
        
        const data = await response.json();
        console.log('Fetched permissions:', data);
        return data;
      }
      
      console.log('Fetched permissions from edge function:', functionResponse.data);
      return functionResponse.data as Permission[];
    } catch (error) {
      console.error('Error fetching permissions:', error);
      toast({
        title: 'Error',
        description: 'Failed to load role permissions',
        variant: 'destructive',
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const updateRolePermissions = useCallback(async (roleId: string, permissions: Permission[]): Promise<boolean> => {
    try {
      setLoading(true);
      console.log('Updating permissions for role:', roleId, permissions);
      
      // First attempt to use the Supabase Edge Function
      const functionResponse = await supabase.functions.invoke('organization-roles', {
        body: { 
          action: 'update_role_permissions',
          role_id: roleId,
          permissions: permissions
        }
      });
      
      if (functionResponse.error) {
        console.error('Error invoking edge function:', functionResponse.error);
        
        // Fallback to direct API call
        const response = await fetch(`${window.location.origin}/api/organization-roles/update_role_permissions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            data: { 
              role_id: roleId,
              permissions: permissions
            } 
          }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to update role permissions');
        }
      } else {
        console.log('Updated permissions via edge function:', functionResponse.data);
      }
      
      toast({
        title: 'Success',
        description: 'Role permissions updated successfully',
      });
      
      return true;
    } catch (error) {
      console.error('Error updating permissions:', error);
      toast({
        title: 'Error',
        description: 'Failed to update role permissions',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const createRole = useCallback(async (organizationId: string, roleName: string, description?: string): Promise<Role | null> => {
    try {
      setLoading(true);
      console.log('Creating new role:', roleName, 'for organization:', organizationId);
      
      const { data, error } = await supabase
        .from('org_roles')
        .insert({
          name: roleName,
          description: description || `${roleName} role`,
          organization_id: organizationId,
          is_system_role: false
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating role:', error);
        throw error;
      }
      
      console.log('Role created:', data);
      
      toast({
        title: 'Success',
        description: `Role "${roleName}" created successfully`,
      });
      
      return data as Role;
    } catch (error) {
      console.error('Error creating role:', error);
      toast({
        title: 'Error',
        description: 'Failed to create role',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const updateMemberRole = useCallback(async (memberId: string, roleId: string): Promise<boolean> => {
    try {
      setLoading(true);
      console.log('Updating member role:', memberId, 'to role:', roleId);
      
      const { error } = await supabase
        .from('organization_members')
        .update({ role_id: roleId })
        .eq('id', memberId);
      
      if (error) {
        console.error('Error updating member role:', error);
        throw error;
      }
      
      toast({
        title: 'Success',
        description: 'Member role updated successfully',
      });
      
      return true;
    } catch (error) {
      console.error('Error updating member role:', error);
      toast({
        title: 'Error',
        description: 'Failed to update member role',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return {
    loading,
    getOrganizationRoles,
    getRolePermissions,
    updateRolePermissions,
    createRole,
    updateMemberRole
  };
}
