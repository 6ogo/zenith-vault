
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';
import PendingApprovals from '@/components/organization/PendingApprovals';
import OrganizationMembers from '@/components/organization/OrganizationMembers';

// Sample data - would come from API in real app
const mockPendingApprovals = [
  {
    id: '1',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    organization: 'Acme Inc',
    role: 'sales',
    requestedAt: '2023-05-15T09:24:00',
  },
  {
    id: '2',
    name: 'Robert Johnson',
    email: 'robert.j@example.com',
    organization: 'Acme Inc',
    role: 'marketing',
    requestedAt: '2023-05-16T14:30:00',
  },
];

const mockMembers = [
  {
    id: '3',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'admin',
    status: 'active' as const,
    joinedAt: '2023-01-10T08:00:00',
  },
  {
    id: '4',
    name: 'Alice Williams',
    email: 'alice.w@example.com',
    role: 'sales',
    status: 'active' as const,
    joinedAt: '2023-02-15T10:15:00',
  },
  {
    id: '5',
    name: 'Michael Brown',
    email: 'michael.b@example.com',
    role: 'service',
    status: 'active' as const,
    joinedAt: '2023-03-22T11:30:00',
  },
];

const Organization = () => {
  const { toast } = useToast();
  const [orgName, setOrgName] = useState('Acme Inc');
  const [pendingApprovals, setPendingApprovals] = useState(mockPendingApprovals);
  const [members, setMembers] = useState(mockMembers);
  
  const handleUpdateOrg = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Organization updated",
      description: "Your organization details have been updated successfully",
    });
  };
  
  const handleApproveUser = (id: string) => {
    // In a real app, this would call an API
    const approvedUser = pendingApprovals.find(user => user.id === id);
    
    if (approvedUser) {
      // Remove from pending and add to members
      setPendingApprovals(pendingApprovals.filter(user => user.id !== id));
      
      setMembers([...members, {
        id,
        name: approvedUser.name,
        email: approvedUser.email,
        role: approvedUser.role,
        status: 'active' as const,
        joinedAt: new Date().toISOString(),
      }]);
      
      toast({
        title: "User approved",
        description: `${approvedUser.name} has been added to your organization`,
      });
    }
  };
  
  const handleRejectUser = (id: string) => {
    const rejectedUser = pendingApprovals.find(user => user.id === id);
    
    setPendingApprovals(pendingApprovals.filter(user => user.id !== id));
    
    if (rejectedUser) {
      toast({
        title: "User rejected",
        description: `${rejectedUser.name}'s request has been rejected`,
      });
    }
  };
  
  const handleChangeRole = (id: string, newRole: string) => {
    setMembers(members.map(member => 
      member.id === id 
        ? { ...member, role: newRole } 
        : member
    ));
    
    toast({
      title: "Role updated",
      description: `User role has been updated to ${newRole}`,
    });
  };
  
  const handleRemoveMember = (id: string) => {
    const removedMember = members.find(member => member.id === id);
    
    setMembers(members.filter(member => member.id !== id));
    
    if (removedMember) {
      toast({
        title: "Member removed",
        description: `${removedMember.name} has been removed from your organization`,
      });
    }
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Organization Management</h1>
      
      <Tabs defaultValue="details" className="space-y-6">
        <TabsList className="grid w-full md:w-auto grid-cols-3 md:inline-flex">
          <TabsTrigger value="details">Organization Details</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="approvals">Pending Approvals</TabsTrigger>
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
                  />
                </div>
                
                <Button type="submit">Update Organization</Button>
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
        
        <TabsContent value="approvals">
          <PendingApprovals 
            approvals={pendingApprovals}
            onApprove={handleApproveUser}
            onReject={handleRejectUser}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Organization;
