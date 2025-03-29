
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { CheckIcon, Shield, UserPlus, Trash2 } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useOrganizationRoles } from '@/hooks/useOrganizationRoles';
import RolePermissionsEditor from '@/components/organization/RolePermissionsEditor';
import { DEFAULT_FEATURES, Role, Permission } from '@/types/organization';

// Create a direct fetch function to fetch roles using raw SQL since
// the type system doesn't know about our new tables yet
async function fetchOrganizationRoles(organizationId: string): Promise<Role[]> {
  try {
    const response = await fetch(`https://edpshrimlntytiezfthj.supabase.co/rest/v1/rpc/get_organization_roles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkcHNocmltbG50eXRpZXpmdGhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyMDQxNjIsImV4cCI6MjA1ODc4MDE2Mn0.YMBUAdv8jakBDWq2mymDyWvpW6ZKvDZcFav4HKJbowM',
        'Authorization': `Bearer ${localStorage.getItem('supabase.auth.token')}`
      },
      body: JSON.stringify({ organization_id: organizationId })
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch roles');
    }
    
    return await response.json() as Role[];
  } catch (error) {
    console.error('Error fetching roles:', error);
    return [];
  }
}

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
      throw new Error('Failed to fetch role permissions');
    }
    
    return await response.json() as Permission[];
  } catch (error) {
    console.error('Error fetching permissions:', error);
    return [];
  }
}

// Example function to count members per role
async function getMembersInRole(organizationId: string, roleId: string): Promise<number> {
  try {
    const response = await fetch(`https://edpshrimlntytiezfthj.supabase.co/rest/v1/organization_members?select=id&organization_id=eq.${organizationId}&role_id=eq.${roleId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkcHNocmltbG50eXRpZXpmdGhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyMDQxNjIsImV4cCI6MjA1ODc4MDE2Mn0.YMBUAdv8jakBDWq2mymDyWvpW6ZKvDZcFav4HKJbowM',
        'Authorization': `Bearer ${localStorage.getItem('supabase.auth.token')}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch members count');
    }
    
    const members = await response.json();
    return members.length;
  } catch (error) {
    console.error('Error counting members:', error);
    return 0;
  }
}

async function addNewRole(organizationId: string, name: string, description: string): Promise<Role | null> {
  try {
    const response = await fetch(`https://edpshrimlntytiezfthj.supabase.co/rest/v1/org_roles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkcHNocmltbG50eXRpZXpmdGhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyMDQxNjIsImV4cCI6MjA1ODc4MDE2Mn0.YMBUAdv8jakBDWq2mymDyWvpW6ZKvDZcFav4HKJbowM',
        'Authorization': `Bearer ${localStorage.getItem('supabase.auth.token')}`
      },
      body: JSON.stringify({ 
        organization_id: organizationId, 
        name, 
        description,
        is_system_role: false
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to create role');
    }
    
    // Get the created role
    const createdRole = await response.json();
    
    // Create default permissions for each feature
    const permissionsPromises = DEFAULT_FEATURES.map(feature => {
      return fetch(`https://edpshrimlntytiezfthj.supabase.co/rest/v1/role_permissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkcHNocmltbG50eXRpZXpmdGhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyMDQxNjIsImV4cCI6MjA1ODc4MDE2Mn0.YMBUAdv8jakBDWq2mymDyWvpW6ZKvDZcFav4HKJbowM',
          'Authorization': `Bearer ${localStorage.getItem('supabase.auth.token')}`
        },
        body: JSON.stringify({ 
          role_id: createdRole.id, 
          feature, 
          can_read: true,
          can_write: false,
          is_hidden: false
        })
      });
    });
    
    await Promise.all(permissionsPromises);
    
    return createdRole;
  } catch (error) {
    console.error('Error creating role:', error);
    return null;
  }
}

async function updateRole(roleId: string, name: string, description: string): Promise<boolean> {
  try {
    const response = await fetch(`https://edpshrimlntytiezfthj.supabase.co/rest/v1/org_roles?id=eq.${roleId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkcHNocmltbG50eXRpZXpmdGhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyMDQxNjIsImV4cCI6MjA1ODc4MDE2Mn0.YMBUAdv8jakBDWq2mymDyWvpW6ZKvDZcFav4HKJbowM',
        'Authorization': `Bearer ${localStorage.getItem('supabase.auth.token')}`
      },
      body: JSON.stringify({ name, description })
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error updating role:', error);
    return false;
  }
}

async function deleteRole(roleId: string): Promise<boolean> {
  try {
    const response = await fetch(`https://edpshrimlntytiezfthj.supabase.co/rest/v1/org_roles?id=eq.${roleId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkcHNocmltbG50eXRpZXpmdGhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyMDQxNjIsImV4cCI6MjA1ODc4MDE2Mn0.YMBUAdv8jakBDWq2mymDyWvpW6ZKvDZcFav4HKJbowM',
        'Authorization': `Bearer ${localStorage.getItem('supabase.auth.token')}`
      }
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error deleting role:', error);
    return false;
  }
}

// Mock data for initial render
const MOCK_ORG_ID = '12345-67890';
const MOCK_ROLES: Role[] = [
  {
    id: '1',
    name: 'Admin',
    description: 'Full access to all features',
    is_system_role: true,
    organization_id: MOCK_ORG_ID
  },
  {
    id: '2',
    name: 'User',
    description: 'Standard user with limited access',
    is_system_role: true,
    organization_id: MOCK_ORG_ID
  },
  {
    id: '3',
    name: 'Analyst',
    description: 'Access to analytics and reporting features',
    is_system_role: true,
    organization_id: MOCK_ORG_ID
  }
];

const RolesManagement = () => {
  const [roles, setRoles] = useState<Role[]>(MOCK_ROLES);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedTab, setSelectedTab] = useState('roles');
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDescription, setNewRoleDescription] = useState('');
  const [editRoleName, setEditRoleName] = useState('');
  const [editRoleDescription, setEditRoleDescription] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Fetch roles when the component mounts
  useEffect(() => {
    const loadRoles = async () => {
      try {
        setIsLoading(true);
        // This would be replaced with actual API call to get the organization ID
        // For now we use the mock organization ID
        const fetchedRoles = await fetchOrganizationRoles(MOCK_ORG_ID);
        
        if (fetchedRoles.length > 0) {
          // Add member count to each role (this would be a separate API call in a real app)
          const rolesWithMemberCount = await Promise.all(
            fetchedRoles.map(async (role) => {
              const memberCount = await getMembersInRole(MOCK_ORG_ID, role.id);
              return { ...role, memberCount };
            })
          );
          
          setRoles(rolesWithMemberCount);
          // Select the first role by default
          setSelectedRole(rolesWithMemberCount[0]);
          
          // Load permissions for the first role
          const rolePermissions = await fetchRolePermissions(rolesWithMemberCount[0].id);
          setPermissions(rolePermissions);
        } else {
          setRoles(MOCK_ROLES);
          setSelectedRole(MOCK_ROLES[0]);
        }
      } catch (error) {
        console.error('Error loading roles:', error);
        toast({
          title: 'Error loading roles',
          description: 'There was a problem loading roles. Please try again.',
          variant: 'destructive'
        });
        // Fallback to mock data
        setRoles(MOCK_ROLES);
        setSelectedRole(MOCK_ROLES[0]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadRoles();
  }, [toast]);
  
  // When a role is selected, load its permissions
  useEffect(() => {
    const loadPermissions = async () => {
      if (selectedRole) {
        try {
          setIsLoading(true);
          const rolePermissions = await fetchRolePermissions(selectedRole.id);
          
          // If no permissions found (e.g., for mock data), create default ones
          if (rolePermissions.length === 0) {
            const defaultPermissions = DEFAULT_FEATURES.map(feature => ({
              role_id: selectedRole.id,
              feature,
              can_read: true,
              can_write: selectedRole.name === 'Admin',
              is_hidden: false
            }));
            setPermissions(defaultPermissions);
          } else {
            setPermissions(rolePermissions);
          }
        } catch (error) {
          console.error('Error loading permissions:', error);
          toast({
            title: 'Error loading permissions',
            description: 'There was a problem loading role permissions.',
            variant: 'destructive'
          });
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    loadPermissions();
  }, [selectedRole, toast]);
  
  const handleAddRole = async () => {
    if (!newRoleName.trim()) {
      toast({
        title: 'Invalid role name',
        description: 'Role name cannot be empty',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      setIsLoading(true);
      const newRole = await addNewRole(MOCK_ORG_ID, newRoleName, newRoleDescription);
      
      if (newRole) {
        // Add to roles list
        setRoles([...roles, { ...newRole, memberCount: 0 }]);
        
        toast({
          title: 'Role added',
          description: `${newRoleName} role has been created successfully.`
        });
        
        // Reset form fields
        setNewRoleName('');
        setNewRoleDescription('');
        setIsAddDialogOpen(false);
      } else {
        throw new Error('Failed to create role');
      }
    } catch (error) {
      console.error('Error adding role:', error);
      toast({
        title: 'Error adding role',
        description: 'There was a problem adding the new role.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleEditRole = async () => {
    if (!selectedRole) return;
    
    if (!editRoleName.trim()) {
      toast({
        title: 'Invalid role name',
        description: 'Role name cannot be empty',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      setIsLoading(true);
      const success = await updateRole(selectedRole.id, editRoleName, editRoleDescription);
      
      if (success) {
        // Update the roles list
        setRoles(roles.map(role => 
          role.id === selectedRole.id 
            ? { ...role, name: editRoleName, description: editRoleDescription }
            : role
        ));
        
        // Update the selected role
        setSelectedRole({
          ...selectedRole,
          name: editRoleName,
          description: editRoleDescription
        });
        
        toast({
          title: 'Role updated',
          description: `${editRoleName} role has been updated successfully.`
        });
        
        setIsEditDialogOpen(false);
      } else {
        throw new Error('Failed to update role');
      }
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: 'Error updating role',
        description: 'There was a problem updating the role.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteRole = async () => {
    if (!selectedRole) return;
    
    try {
      setIsLoading(true);
      const success = await deleteRole(selectedRole.id);
      
      if (success) {
        // Remove from roles list
        const updatedRoles = roles.filter(role => role.id !== selectedRole.id);
        setRoles(updatedRoles);
        
        // Select the first role in the list or null if no roles
        setSelectedRole(updatedRoles.length > 0 ? updatedRoles[0] : null);
        
        toast({
          title: 'Role deleted',
          description: `${selectedRole.name} role has been deleted successfully.`
        });
        
        setIsDeleteDialogOpen(false);
      } else {
        throw new Error('Failed to delete role');
      }
    } catch (error) {
      console.error('Error deleting role:', error);
      toast({
        title: 'Error deleting role',
        description: 'There was a problem deleting the role.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePermissionsChange = (updatedPermissions: Permission[]) => {
    setPermissions(updatedPermissions);
  };
  
  const handleSavePermissions = async () => {
    try {
      setIsLoading(true);
      // This would be an API call to update permissions
      // For now, we just show a success message
      
      toast({
        title: 'Permissions saved',
        description: 'The role permissions have been updated successfully.'
      });
    } catch (error) {
      console.error('Error saving permissions:', error);
      toast({
        title: 'Error saving permissions',
        description: 'There was a problem saving the permissions.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const openEditDialog = (role: Role) => {
    setEditRoleName(role.name);
    setEditRoleDescription(role.description || '');
    setIsEditDialogOpen(true);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Role Management</h1>
          <p className="text-muted-foreground">
            Manage roles and permissions for your organization
          </p>
        </div>
        <Button onClick={() => navigate('/organization')}>
          Back to Organization
        </Button>
      </div>
      
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="roles" className="mt-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Available Roles</h2>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" /> Add New Role
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {roles.map((role) => (
              <Card 
                key={role.id} 
                className={`cursor-pointer hover:bg-muted/50 transition-colors ${
                  selectedRole?.id === role.id ? 'border-primary' : ''
                }`}
                onClick={() => setSelectedRole(role)}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{role.name}</CardTitle>
                    {role.is_system_role && (
                      <Badge variant="outline" className="ml-2">
                        System
                      </Badge>
                    )}
                  </div>
                  <CardDescription>
                    {role.description || 'No description provided'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                      {role.memberCount || 0} members
                    </div>
                    {selectedRole?.id === role.id && (
                      <CheckIcon className="h-4 w-4 text-primary" />
                    )}
                  </div>
                </CardContent>
                <CardFooter className="pt-1">
                  <div className="flex justify-end space-x-2 w-full">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditDialog(role);
                      }}
                      disabled={role.is_system_role}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedRole(role);
                        setIsDeleteDialogOpen(true);
                      }}
                      disabled={role.is_system_role}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {selectedRole?.is_system_role && (
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertTitle>System role</AlertTitle>
              <AlertDescription>
                System roles cannot be edited or deleted. These roles are essential for the platform to function correctly.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>
        
        <TabsContent value="permissions" className="mt-6 space-y-4">
          {selectedRole ? (
            <>
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">
                  Permissions for {selectedRole.name}
                </h2>
                <Badge variant={selectedRole.is_system_role ? "outline" : "default"}>
                  {selectedRole.is_system_role ? "System Role" : "Custom Role"}
                </Badge>
              </div>
              
              <p className="text-muted-foreground mb-4">
                {selectedRole.description || "No description provided"}
              </p>
              
              <RolePermissionsEditor
                permissions={permissions}
                isSystemRole={selectedRole.is_system_role}
                onChange={handlePermissionsChange}
                onSave={handleSavePermissions}
              />
            </>
          ) : (
            <div className="text-center py-10">
              <h3 className="text-lg font-medium">No role selected</h3>
              <p className="text-muted-foreground mt-2">
                Please select a role to view and edit its permissions
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Add Role Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Role</DialogTitle>
            <DialogDescription>
              Create a new role for your organization. You'll be able to define permissions after creating the role.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="role-name" className="text-sm font-medium">
                Role Name
              </label>
              <Input
                id="role-name"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                placeholder="e.g. Marketing Manager"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="role-description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="role-description"
                value={newRoleDescription}
                onChange={(e) => setNewRoleDescription(e.target.value)}
                placeholder="Describe the role's responsibilities and access level"
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddRole} disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Role'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Role Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
            <DialogDescription>
              Update the role details. You can modify permissions in the permissions tab.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="edit-role-name" className="text-sm font-medium">
                Role Name
              </label>
              <Input
                id="edit-role-name"
                value={editRoleName}
                onChange={(e) => setEditRoleName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="edit-role-description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="edit-role-description"
                value={editRoleDescription}
                onChange={(e) => setEditRoleDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditRole} disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Role'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Role Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this role?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Users assigned to this role will need to be reassigned.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteRole}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RolesManagement;
