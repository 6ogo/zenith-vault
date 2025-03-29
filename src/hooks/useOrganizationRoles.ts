
import { useState, useCallback } from 'react';
import { useToast } from './use-toast';
import { Role, Permission } from '@/types/organization';

export function useOrganizationRoles() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const getOrganizationRoles = useCallback(async (organizationId: string): Promise<Role[]> => {
    try {
      setLoading(true);
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
      return data;
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
      return data;
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

  return {
    loading,
    getOrganizationRoles,
    getRolePermissions,
    updateRolePermissions
  };
}
