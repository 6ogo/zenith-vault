
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Role, Permission } from '@/types/organization';
import RolePermissionsEditor from '@/components/organization/RolePermissionsEditor';
import { ChevronLeft, Plus, Shield, User, BarChart } from 'lucide-react';

// Mock active organization ID - in a real app this would come from context or state
const MOCK_ORGANIZATION_ID = "1";

const RolesManagement = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [activeTab, setActiveTab] = useState('list');
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDescription, setNewRoleDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch roles when the component mounts
  useEffect(() => {
    fetchRoles();
  }, []);

  // Simple direct function to fetch roles since types aren't updated
  const fetchRoles = async () => {
    try {
      setLoading(true);
      
      // This would use the custom API function in production
      const mockRoles: Role[] = [
        {
          id: "1",
          name: "Admin",
          description: "Full access to all features",
          is_system_role: true,
          organization_id: MOCK_ORGANIZATION_ID,
          created_at: new Date().toISOString()
        },
        {
          id: "2",
          name: "User",
          description: "Standard access to common features",
          is_system_role: true,
          organization_id: MOCK_ORGANIZATION_ID,
          created_at: new Date().toISOString()
        },
        {
          id: "3",
          name: "Analyst",
          description: "Read-only access to analytics and reports",
          is_system_role: true,
          organization_id: MOCK_ORGANIZATION_ID,
          created_at: new Date().toISOString()
        }
      ];
      
      setRoles(mockRoles);
    } catch (error) {
      console.error('Error fetching roles:', error);
      toast({
        title: 'Error',
        description: 'Failed to load roles',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRole = async () => {
    try {
      if (!newRoleName.trim()) {
        toast({
          title: 'Error',
          description: 'Role name is required',
          variant: 'destructive'
        });
        return;
      }
      
      setLoading(true);
      
      // Mock creating a role - in production this would call the API
      const newRole: Role = {
        id: `custom-${Date.now()}`,
        name: newRoleName,
        description: newRoleDescription,
        is_system_role: false,
        organization_id: MOCK_ORGANIZATION_ID,
        created_at: new Date().toISOString()
      };
      
      // Add to local state
      setRoles([...roles, newRole]);
      
      // Reset form
      setNewRoleName('');
      setNewRoleDescription('');
      setActiveTab('list');
      
      toast({
        title: 'Success',
        description: `Role "${newRoleName}" created successfully`
      });
    } catch (error) {
      console.error('Error creating role:', error);
      toast({
        title: 'Error',
        description: 'Failed to create role',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRole = (role: Role) => {
    setSelectedRole(role);
    setSelectedRoleId(role.id);
    setActiveTab('edit');
  };

  const handleDeleteRole = async (roleId: string) => {
    try {
      if (!roleId) return;
      
      const roleToDelete = roles.find(r => r.id === roleId);
      
      if (!roleToDelete) {
        toast({
          title: 'Error',
          description: 'Role not found',
          variant: 'destructive'
        });
        return;
      }
      
      if (roleToDelete.is_system_role) {
        toast({
          title: 'Action not allowed',
          description: 'System roles cannot be deleted',
          variant: 'destructive'
        });
        return;
      }
      
      setLoading(true);
      
      // Mock deleting a role - in production this would call the API
      setRoles(roles.filter(r => r.id !== roleId));
      
      // If we're editing this role, go back to the list
      if (selectedRoleId === roleId) {
        setSelectedRoleId(null);
        setSelectedRole(null);
        setActiveTab('list');
      }
      
      toast({
        title: 'Success',
        description: 'Role deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting role:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete role',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (roleName: string) => {
    const name = roleName.toLowerCase();
    if (name.includes('admin')) return <Shield className="w-4 h-4 mr-2" />;
    if (name.includes('analyst')) return <BarChart className="w-4 h-4 mr-2" />;
    return <User className="w-4 h-4 mr-2" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Button 
            variant="outline" 
            size="sm" 
            className="mr-2"
            onClick={() => navigate('/organization')}
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Role Management</h1>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="list">Roles</TabsTrigger>
          <TabsTrigger value="create">Create Role</TabsTrigger>
          <TabsTrigger value="edit" disabled={!selectedRoleId}>Edit Role</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Organization Roles</CardTitle>
              <CardDescription>
                Manage the roles and permissions in your organization
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-6">Loading roles...</div>
              ) : roles.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  No roles found. Create a new role to get started.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Role</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {roles.map((role) => (
                      <TableRow key={role.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            {getRoleIcon(role.name)}
                            {role.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={role.is_system_role ? "secondary" : "outline"}>
                            {role.is_system_role ? 'System' : 'Custom'}
                          </Badge>
                        </TableCell>
                        <TableCell>{role.description}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="mr-2"
                            onClick={() => handleSelectRole(role)}
                          >
                            Manage
                          </Button>
                          {!role.is_system_role && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-red-500 hover:text-red-700"
                              onClick={() => handleDeleteRole(role.id)}
                            >
                              Delete
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
              
              <div className="mt-4">
                <Button onClick={() => setActiveTab('create')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Role
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create New Role</CardTitle>
              <CardDescription>Define a new role with custom permissions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="roleName" className="block text-sm font-medium mb-1">
                  Role Name*
                </label>
                <Input 
                  id="roleName" 
                  value={newRoleName} 
                  onChange={(e) => setNewRoleName(e.target.value)} 
                  placeholder="e.g., Marketing Manager"
                  className="w-full"
                />
              </div>
              
              <div>
                <label htmlFor="roleDescription" className="block text-sm font-medium mb-1">
                  Description
                </label>
                <Textarea 
                  id="roleDescription" 
                  value={newRoleDescription} 
                  onChange={(e) => setNewRoleDescription(e.target.value)} 
                  placeholder="Describe the role's responsibilities and access level"
                  className="w-full"
                  rows={3}
                />
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setActiveTab('list')}>
                  Cancel
                </Button>
                <Button onClick={handleCreateRole} disabled={loading || !newRoleName.trim()}>
                  {loading ? 'Creating...' : 'Create Role'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="edit">
          {selectedRole && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="flex items-center">
                        {getRoleIcon(selectedRole.name)}
                        {selectedRole.name}
                      </CardTitle>
                      <CardDescription>{selectedRole.description}</CardDescription>
                    </div>
                    <Badge variant={selectedRole.is_system_role ? "secondary" : "outline"}>
                      {selectedRole.is_system_role ? 'System Role' : 'Custom Role'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <RolePermissionsEditor 
                    roleId={selectedRole.id} 
                    isSystemRole={selectedRole.is_system_role} 
                  />
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RolesManagement;
