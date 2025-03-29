
import React, { useState, useEffect } from 'react';
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Permission, DEFAULT_FEATURES } from '@/types/organization';
import { useToast } from '@/hooks/use-toast';
import { Info } from 'lucide-react';

// Direct API calls for permissions since the type system doesn't recognize our new tables
async function fetchRolePermissions(roleId: string): Promise<Permission[]> {
  try {
    const response = await fetch(`https://edpshrimlntytiezfthj.supabase.co/rest/v1/rpc/get_role_permissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkcHNocmltbG50eXRpZXpmdGhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyMDQxNjIsImV4cCI6MjA1ODc4MDE2Mn0.YMBUAdv8jakBDWq2mymDyWvpW6ZKvDZcFav4HKJbowM',
        'Authorization': `Bearer ${localStorage.getItem('supabase.auth.token')}`
      },
      body: JSON.stringify({ role_id: roleId })
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch permissions');
    }
    
    return await response.json() as Permission[];
  } catch (error) {
    console.error('Error fetching permissions:', error);
    return [];
  }
}

async function saveRolePermissions(roleId: string, permissions: Permission[]): Promise<boolean> {
  try {
    const response = await fetch(`https://edpshrimlntytiezfthj.supabase.co/rest/v1/rpc/update_role_permissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkcHNocmltbG50eXRpZXpmdGhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyMDQxNjIsImV4cCI6MjA1ODc4MDE2Mn0.YMBUAdv8jakBDWq2mymDyWvpW6ZKvDZcFav4HKJbowM',
        'Authorization': `Bearer ${localStorage.getItem('supabase.auth.token')}`
      },
      body: JSON.stringify({
        role_id: roleId,
        permissions: permissions
      })
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error saving permissions:', error);
    return false;
  }
}

interface RolePermissionsEditorProps {
  roleId: string;
  isSystemRole: boolean;
  onPermissionsUpdated?: () => void;
}

const RolePermissionsEditor: React.FC<RolePermissionsEditorProps> = ({ 
  roleId, 
  isSystemRole, 
  onPermissionsUpdated 
}) => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // Load permissions for the role
  useEffect(() => {
    const loadPermissions = async () => {
      if (!roleId) return;
      
      try {
        setLoading(true);
        const fetchedPermissions = await fetchRolePermissions(roleId);
        
        // If no permissions are returned for existing features, create default ones
        if (fetchedPermissions.length === 0) {
          const defaultPermissions = DEFAULT_FEATURES.map(feature => ({
            role_id: roleId,
            feature,
            can_read: false,
            can_write: false,
            is_hidden: true
          }));
          setPermissions(defaultPermissions);
        } else {
          setPermissions(fetchedPermissions);
        }
      } catch (error) {
        console.error('Error loading permissions:', error);
        toast({
          title: 'Error',
          description: 'Failed to load role permissions',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    loadPermissions();
  }, [roleId, toast]);

  // Update a specific permission
  const updatePermission = (feature: string, field: 'can_read' | 'can_write' | 'is_hidden', value: boolean) => {
    setPermissions(prev => 
      prev.map(perm => 
        perm.feature === feature 
          ? { ...perm, [field]: value } 
          : perm
      )
    );
  };

  // Save all permissions
  const savePermissions = async () => {
    if (!roleId) return;
    
    try {
      setSaving(true);
      const success = await saveRolePermissions(roleId, permissions);
      
      if (success) {
        toast({
          title: 'Success',
          description: 'Role permissions saved successfully'
        });
        if (onPermissionsUpdated) {
          onPermissionsUpdated();
        }
      } else {
        toast({
          title: 'Error',
          description: 'Failed to save permissions',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error saving permissions:', error);
      toast({
        title: 'Error',
        description: 'Failed to save permissions',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-6">Loading permissions...</div>;
  }

  return (
    <div className="space-y-6">
      {isSystemRole && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>System Role</AlertTitle>
          <AlertDescription>
            This is a system role. While you can modify its permissions, we recommend caution as these roles are designed with specific access patterns.
          </AlertDescription>
        </Alert>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Feature Permissions</CardTitle>
          <CardDescription>
            Configure access rights for each feature in the application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-4 font-medium border-b pb-2">
            <div>Feature</div>
            <div className="text-center">Access Level</div>
            <div className="text-center">Visibility</div>
          </div>
          
          {permissions.map((permission) => (
            <div key={permission.feature} className="grid grid-cols-3 gap-4 items-center py-3 border-b">
              <div className="font-medium capitalize">{permission.feature}</div>
              <div className="flex justify-center space-x-4">
                <div className="flex flex-col items-center">
                  <span className="text-xs text-muted-foreground mb-1">Read</span>
                  <Switch 
                    checked={permission.can_read} 
                    onCheckedChange={(checked) => updatePermission(permission.feature, 'can_read', checked)} 
                  />
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xs text-muted-foreground mb-1">Write</span>
                  <Switch 
                    checked={permission.can_write} 
                    onCheckedChange={(checked) => updatePermission(permission.feature, 'can_write', checked)} 
                    disabled={!permission.can_read}
                  />
                </div>
              </div>
              <div className="flex justify-center">
                {permission.is_hidden ? (
                  <Badge variant="destructive">Hidden</Badge>
                ) : (
                  <Badge variant="success">Visible</Badge>
                )}
                <Switch 
                  className="ml-2"
                  checked={!permission.is_hidden} 
                  onCheckedChange={(checked) => updatePermission(permission.feature, 'is_hidden', !checked)} 
                />
              </div>
            </div>
          ))}
          
          <div className="mt-6 flex justify-end">
            <Button onClick={savePermissions} disabled={saving}>
              {saving ? 'Saving...' : 'Save Permissions'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RolePermissionsEditor;
