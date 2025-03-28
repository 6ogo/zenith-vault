
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, MessageSquare, CheckCircle, XCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const tickets = [
  {
    id: "TKT-1001",
    customer: "Sarah Johnson",
    subject: "Login error after password reset",
    status: "open",
    priority: "high",
    assignedTo: "John Doe",
    created: "2 hours ago",
  },
  {
    id: "TKT-1002",
    customer: "Michael Chen",
    subject: "Billing question about subscription",
    status: "pending",
    priority: "medium",
    assignedTo: "Jane Smith",
    created: "4 hours ago",
  },
  {
    id: "TKT-1003",
    customer: "Emma Rodriguez",
    subject: "Feature request: Export to PDF",
    status: "open",
    priority: "low",
    assignedTo: "Unassigned",
    created: "1 day ago",
  },
  {
    id: "TKT-1004",
    customer: "David Lee",
    subject: "Missing data in monthly report",
    status: "closed",
    priority: "high",
    assignedTo: "John Doe",
    created: "3 days ago",
  },
];

const statusStyles = {
  open: { color: "bg-blue-100 text-blue-800", icon: <Clock className="h-3 w-3 mr-1" /> },
  pending: { color: "bg-yellow-100 text-yellow-800", icon: <Clock className="h-3 w-3 mr-1" /> },
  closed: { color: "bg-green-100 text-green-800", icon: <CheckCircle className="h-3 w-3 mr-1" /> },
};

const priorityStyles = {
  high: { color: "bg-red-100 text-red-800" },
  medium: { color: "bg-yellow-100 text-yellow-800" },
  low: { color: "bg-green-100 text-green-800" },
};

const Service = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Customer Service</h1>
          <p className="text-muted-foreground">
            Manage support tickets and customer inquiries.
          </p>
        </div>
        <Button size="sm" className="font-medium">
          <Plus className="h-4 w-4 mr-1" /> New Ticket
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="dashboard-card">
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <MessageSquare className="h-4 w-4 mr-1 text-blue-500" />
              All Tickets
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-3">
            <div className="text-2xl font-semibold">12</div>
          </CardContent>
        </Card>
        
        <Card className="dashboard-card">
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <Clock className="h-4 w-4 mr-1 text-yellow-500" />
              Open Tickets
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-3">
            <div className="text-2xl font-semibold">5</div>
          </CardContent>
        </Card>
        
        <Card className="dashboard-card">
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <XCircle className="h-4 w-4 mr-1 text-red-500" />
              Unassigned
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-3">
            <div className="text-2xl font-semibold">2</div>
          </CardContent>
        </Card>
        
        <Card className="dashboard-card">
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
              Resolved
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-3">
            <div className="text-2xl font-semibold">98</div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5 lg:w-[500px]">
          <TabsTrigger value="all">All Tickets</TabsTrigger>
          <TabsTrigger value="open">Open</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="closed">Closed</TabsTrigger>
          <TabsTrigger value="mine">My Tickets</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          <Card className="dashboard-card">
            <div className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-xs text-muted-foreground">
                      <th className="pb-2 font-medium text-left">Ticket</th>
                      <th className="pb-2 font-medium text-left">Customer</th>
                      <th className="pb-2 font-medium text-left">Subject</th>
                      <th className="pb-2 font-medium text-left">Assigned To</th>
                      <th className="pb-2 font-medium text-center">Status</th>
                      <th className="pb-2 font-medium text-center">Priority</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {tickets.map((ticket) => (
                      <tr key={ticket.id} className="py-2">
                        <td className="py-3 pr-4">
                          <div className="font-medium text-sm">{ticket.id}</div>
                          <div className="text-xs text-muted-foreground">
                            {ticket.created}
                          </div>
                        </td>
                        <td className="py-3 pr-4">
                          <div className="text-sm">{ticket.customer}</div>
                        </td>
                        <td className="py-3 pr-4">
                          <div className="text-sm">{ticket.subject}</div>
                        </td>
                        <td className="py-3 pr-4">
                          <div className="text-sm">{ticket.assignedTo}</div>
                        </td>
                        <td className="py-3 text-center">
                          <Badge
                            variant="secondary"
                            className={`flex items-center justify-center ${
                              statusStyles[ticket.status].color
                            }`}
                          >
                            {statusStyles[ticket.status].icon}
                            {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="py-3 text-center">
                          <Badge
                            variant="secondary"
                            className={priorityStyles[ticket.priority].color}
                          >
                            {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </TabsContent>
        <TabsContent value="open" className="mt-4">
          <div className="p-8 text-center text-muted-foreground">
            Open tickets will be filtered here in the next update.
          </div>
        </TabsContent>
        <TabsContent value="pending" className="mt-4">
          <div className="p-8 text-center text-muted-foreground">
            Pending tickets will be filtered here in the next update.
          </div>
        </TabsContent>
        <TabsContent value="closed" className="mt-4">
          <div className="p-8 text-center text-muted-foreground">
            Closed tickets will be filtered here in the next update.
          </div>
        </TabsContent>
        <TabsContent value="mine" className="mt-4">
          <div className="p-8 text-center text-muted-foreground">
            Your assigned tickets will be shown here in the next update.
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Service;
