
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldAlert } from "lucide-react";
import { Permission } from '@/types/organization';

// Helper function to convert feature names to display friendly format
const formatFeatureName = (feature: string): string => {
  return feature
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Helper function to get a description for each feature
const getFeatureDescription = (feature: string): string => {
  const descriptions: Record<string, string> = {
    dashboard: 'Access to the main dashboard and overview data.',
    sales: 'Access to sales data, leads, and pipeline management.',
    customers: 'Access to customer information and management.',
    service: 'Access to service tickets and customer support features.',
    marketing: 'Access to marketing campaigns and analytics.',
    analytics: 'Access to detailed analytics and data insights.',
    reports: 'Access to reports and export functionality.',
    integrations: 'Access to third-party integrations and configuration.',
    website: 'Access to website builder and management tools.',
    organization: 'Access to organization settings and member management.',
    chatbot: 'Access to configure and manage AI chatbots.',
    settings: 'Access to user settings and preferences.'
  };

  return descriptions[feature] || 'Access to this feature.';
};

interface RolePermissionsEditorProps {
  permissions: Permission[];
  isSystemRole: boolean;
  onChange: (permissions: Permission[]) => void;
  onSave: () => void;
}

const RolePermissionsEditor: React.FC<RolePermissionsEditorProps> = ({
  permissions,
  isSystemRole,
  onChange,
  onSave
}) => {
  const handleTogglePermission = (
    index: number,
    field: 'can_read' | 'can_write' | 'is_hidden',
    value: boolean
  ) => {
    if (isSystemRole) return; // Don't allow changes to system roles
    
    const updatedPermissions = [...permissions];
    updatedPermissions[index] = {
      ...updatedPermissions[index],
      [field]: value
    };
    
    // If setting is_hidden to true, also set can_read and can_write to false
    if (field === 'is_hidden' && value === true) {
      updatedPermissions[index].can_read = false;
      updatedPermissions[index].can_write = false;
    }
    
    // If setting can_write to true, also set can_read to true
    if (field === 'can_write' && value === true) {
      updatedPermissions[index].can_read = true;
    }
    
    // If setting can_read to false, also set can_write to false
    if (field === 'can_read' && value === false) {
      updatedPermissions[index].can_write = false;
    }
    
    // If setting is_hidden to false, at least set can_read to true
    if (field === 'is_hidden' && value === false) {
      updatedPermissions[index].can_read = true;
    }
    
    onChange(updatedPermissions);
  };
  
  return (
    <div className="space-y-4">
      {isSystemRole && (
        <Alert>
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>System Role Permissions</AlertTitle>
          <AlertDescription>
            This is a system role with predefined permissions. You cannot modify system role permissions.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Feature</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-center w-[100px]">Can View</TableHead>
              <TableHead className="text-center w-[100px]">Can Edit</TableHead>
              <TableHead className="text-center w-[100px]">Hidden</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {permissions.map((permission, index) => (
              <TableRow key={`${permission.role_id}-${permission.feature}`}>
                <TableCell className="font-medium">
                  {formatFeatureName(permission.feature)}
                  {permission.feature === 'dashboard' && (
                    <Badge className="ml-2" variant="outline">
                      Required
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {getFeatureDescription(permission.feature)}
                </TableCell>
                <TableCell className="text-center">
                  <Switch
                    checked={permission.can_read}
                    onCheckedChange={(checked) => 
                      handleTogglePermission(index, 'can_read', checked)
                    }
                    disabled={isSystemRole || permission.feature === 'dashboard'}
                  />
                </TableCell>
                <TableCell className="text-center">
                  <Switch
                    checked={permission.can_write}
                    onCheckedChange={(checked) => 
                      handleTogglePermission(index, 'can_write', checked)
                    }
                    disabled={
                      isSystemRole || 
                      !permission.can_read || 
                      permission.is_hidden
                    }
                  />
                </TableCell>
                <TableCell className="text-center">
                  <Switch
                    checked={permission.is_hidden}
                    onCheckedChange={(checked) => 
                      handleTogglePermission(index, 'is_hidden', checked)
                    }
                    disabled={
                      isSystemRole || 
                      permission.feature === 'dashboard'
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex justify-end">
        <Button 
          onClick={onSave}
          disabled={isSystemRole}
        >
          Save Permissions
        </Button>
      </div>
    </div>
  );
};

export default RolePermissionsEditor;
