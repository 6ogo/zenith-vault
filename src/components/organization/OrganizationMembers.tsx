
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, ShieldCheck, UserX } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  joinedAt: string;
}

interface OrganizationMembersProps {
  members: Member[];
  onChangeRole: (id: string, newRole: string) => void;
  onRemoveMember: (id: string) => void;
}

const OrganizationMembers = ({ members, onChangeRole, onRemoveMember }: OrganizationMembersProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Organization Members</CardTitle>
        <CardDescription>
          Manage the members of your organization
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{member.name}</div>
                    <div className="text-sm text-muted-foreground">{member.email}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={member.role === 'admin' ? "secondary" : "outline"}>
                    {member.role === 'admin' && <ShieldCheck className="w-3 h-3 mr-1" />}
                    {member.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={member.status === 'active' ? "success" : "destructive"}>
                    {member.status}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(member.joinedAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onChangeRole(member.id, 'admin')}>
                        Make Admin
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onChangeRole(member.id, 'user')}>
                        Set as Regular User
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => onRemoveMember(member.id)}
                      >
                        <UserX className="w-4 h-4 mr-2" />
                        Remove Member
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default OrganizationMembers;
