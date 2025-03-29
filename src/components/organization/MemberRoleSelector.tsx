
import React, { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Role } from '@/types/organization';
import { useToast } from '@/hooks/use-toast';

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

interface MemberRoleSelectorProps {
  memberId: string;
  organizationId: string;
  initialRoleId?: string;
  onChange: (memberId: string, roleId: string) => void;
}

const MemberRoleSelector: React.FC<MemberRoleSelectorProps> = ({ 
  memberId, 
  organizationId, 
  initialRoleId,
  onChange 
}) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadRoles = async () => {
      try {
        setLoading(true);
        const fetchedRoles = await fetchOrganizationRoles(organizationId);
        setRoles(fetchedRoles);
      } catch (error) {
        console.error('Error loading roles:', error);
        toast({
          title: 'Error',
          description: 'Failed to load roles',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    loadRoles();
  }, [organizationId, toast]);

  const handleRoleChange = (value: string) => {
    onChange(memberId, value);
  };

  if (loading || roles.length === 0) {
    return <div className="text-sm text-muted-foreground">Loading roles...</div>;
  }

  return (
    <Select onValueChange={handleRoleChange} defaultValue={initialRoleId}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a role" />
      </SelectTrigger>
      <SelectContent>
        {roles.map((role) => (
          <SelectItem key={role.id} value={role.id}>
            {role.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default MemberRoleSelector;
