
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface UserApproval {
  id: string;
  name: string;
  email: string;
  organization: string;
  role: string;
  requestedAt: string;
}

interface PendingApprovalsProps {
  approvals?: UserApproval[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

const PendingApprovals = ({ approvals = [], onApprove, onReject }: PendingApprovalsProps) => {
  // This null check is already being handled by the default parameter, but we'll add an additional check
  // to be extra safe and clear about the intent
  const hasApprovals = approvals && approvals.length > 0;

  if (!hasApprovals) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pending Organization Approvals</CardTitle>
          <CardDescription>
            Manage access requests to your organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center py-8 text-muted-foreground">
            No pending approvals at this time
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Organization Approvals</CardTitle>
        <CardDescription>
          Manage access requests to your organization
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Organization</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Requested At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {approvals.map((approval) => (
              <TableRow key={approval.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{approval.name}</div>
                    <div className="text-sm text-muted-foreground">{approval.email}</div>
                  </div>
                </TableCell>
                <TableCell>{approval.organization}</TableCell>
                <TableCell>
                  <Badge variant="outline">{approval.role}</Badge>
                </TableCell>
                <TableCell>{new Date(approval.requestedAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-green-600 border-green-600 hover:bg-green-50"
                      onClick={() => onApprove(approval.id)}
                    >
                      Approve
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-600 border-red-600 hover:bg-red-50"
                      onClick={() => onReject(approval.id)}
                    >
                      Reject
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PendingApprovals;
