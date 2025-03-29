import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useDataMode } from "@/contexts/DataModeContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import CreateTicketForm from "@/components/service/CreateTicketForm";
import TicketList from "@/components/service/TicketList";
import ServiceSolvedCasesPieChart from "@/components/service/ServiceSolvedCasesPieChart";
import { Search, X, MessageSquare, CheckCircle } from "lucide-react";

interface Ticket {
  id: string;
  subject: string;
  customer: {
    name: string;
    email: string;
    avatar?: string;
  };
  status: 'open' | 'closed' | 'pending';
  priority: 'low' | 'medium' | 'high';
  category: string;
  created_at: string;
  messages: {
    id: string;
    sender: 'customer' | 'agent';
    senderName: string;
    message: string;
    timestamp: string;
  }[];
}

const demoTickets: Ticket[] = [
  {
    id: "T-1001",
    subject: "Cannot access my account",
    customer: {
      name: "John Smith",
      email: "john@example.com"
    },
    status: "open",
    priority: "high",
    category: "Authentication",
    created_at: "2023-05-28T10:30:00Z",
    messages: [
      {
        id: "M-1",
        sender: "customer",
        senderName: "John Smith",
        message: "I cannot login to my account. It says my password is incorrect, but I'm sure I'm using the right one.",
        timestamp: "2023-05-28T10:30:00Z"
      },
      {
        id: "M-2",
        sender: "agent",
        senderName: "Support Agent",
        message: "Hello John, I'm sorry to hear you're having trouble accessing your account. Have you tried resetting your password?",
        timestamp: "2023-05-28T11:15:00Z"
      },
      {
        id: "M-3",
        sender: "customer",
        senderName: "John Smith",
        message: "Yes, I tried that but I'm not receiving the password reset email.",
        timestamp: "2023-05-28T11:45:00Z"
      }
    ]
  },
  {
    id: "T-1002",
    subject: "Billing discrepancy in my invoice",
    customer: {
      name: "Sarah Johnson",
      email: "sarah@example.com"
    },
    status: "open",
    priority: "medium",
    category: "Billing",
    created_at: "2023-05-27T14:20:00Z",
    messages: [
      {
        id: "M-4",
        sender: "customer",
        senderName: "Sarah Johnson",
        message: "I was charged $59.99 on my last invoice but my plan should be $49.99. Please help.",
        timestamp: "2023-05-27T14:20:00Z"
      }
    ]
  },
  {
    id: "T-1003",
    subject: "Feature request: Dark mode",
    customer: {
      name: "Michael Chang",
      email: "michael@example.com"
    },
    status: "open",
    priority: "low",
    category: "Feature Request",
    created_at: "2023-05-26T09:10:00Z",
    messages: [
      {
        id: "M-5",
        sender: "customer",
        senderName: "Michael Chang",
        message: "Would love to see a dark mode option added to the platform. It would be easier on the eyes when working late.",
        timestamp: "2023-05-26T09:10:00Z"
      },
      {
        id: "M-6",
        sender: "agent",
        senderName: "Support Agent",
        message: "Thank you for the suggestion, Michael! We'll forward this to our product team for consideration.",
        timestamp: "2023-05-26T10:30:00Z"
      }
    ]
  }
];

const Service = () => {
  const { toast } = useToast();
  const { isRealData } = useDataMode();
  const [activeTab, setActiveTab] = useState("open");
  const [searchQuery, setSearchQuery] = useState('');
  const [tickets, setTickets] = useState<Ticket[]>(demoTickets);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showTicketDialog, setShowTicketDialog] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const [closeReason, setCloseReason] = useState('');

  const solvedCasesData = [
    { name: 'John Doe', value: 42, color: '#4f46e5' },
    { name: 'Jane Smith', value: 28, color: '#10b981' },
    { name: 'Mike Johnson', value: 15, color: '#f59e0b' },
    { name: 'Sarah Wilson', value: 10, color: '#6366f1' }
  ];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = 
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = 
      (activeTab === 'open' && ticket.status === 'open') ||
      (activeTab === 'closed' && ticket.status === 'closed') ||
      (activeTab === 'all');
    
    return matchesSearch && matchesStatus;
  });

  const handleViewTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setShowTicketDialog(true);
  };

  const handleReply = () => {
    if (!replyText.trim() || !selectedTicket) return;
    
    const newMessage = {
      id: `M-${Date.now()}`,
      sender: 'agent' as const,
      senderName: 'Support Agent',
      message: replyText,
      timestamp: new Date().toISOString()
    };
    
    const updatedTicket = {
      ...selectedTicket,
      messages: [...selectedTicket.messages, newMessage]
    };
    
    setTickets(tickets.map(t => t.id === selectedTicket.id ? updatedTicket : t));
    
    setSelectedTicket(updatedTicket);
    
    setReplyText('');
    
    toast({
      title: "Reply sent",
      description: "Your reply has been sent to the customer.",
    });
  };

  const handleShowCloseDialog = () => {
    if (!selectedTicket) return;
    setShowCloseDialog(true);
  };

  const handleCloseTicket = () => {
    if (!selectedTicket) return;
    
    const closingMessage = {
      id: `M-${Date.now()}`,
      sender: 'agent' as const,
      senderName: 'Support Agent',
      message: `This ticket was closed. Reason: ${closeReason || 'Issue resolved'}`,
      timestamp: new Date().toISOString()
    };
    
    const updatedTicket = {
      ...selectedTicket,
      status: 'closed' as const,
      messages: [...selectedTicket.messages, closingMessage]
    };
    
    setTickets(tickets.map(t => t.id === selectedTicket.id ? updatedTicket : t));
    
    setSelectedTicket(updatedTicket);
    
    setShowCloseDialog(false);
    
    toast({
      title: "Ticket closed",
      description: "The ticket has been closed successfully.",
    });
  };

  const renderTicketStatus = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge variant="default">Open</Badge>;
      case 'closed':
        return <Badge variant="secondary">Closed</Badge>;
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const renderPriority = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High</Badge>;
      case 'medium':
        return <Badge variant="default">Medium</Badge>;
      case 'low':
        return <Badge variant="outline">Low</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customer Service</h1>
          <p className="text-muted-foreground mt-1">
            Manage support tickets and customer inquiries
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => toast({
            title: "Coming Soon",
            description: "Ticket assignment will be available in the next update."
          })}>
            Assign to Me
          </Button>
          <Button onClick={() => toast({
            title: "Coming Soon",
            description: "The create ticket form will be available in the next update."
          })}>
            New Ticket
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative sm:flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tickets..."
            className="pl-8"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <Button variant="outline" onClick={() => setSearchQuery('')} disabled={!searchQuery}>
          Clear <X className="ml-1 h-4 w-4" />
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="open">Open</TabsTrigger>
          <TabsTrigger value="closed">Closed</TabsTrigger>
          <TabsTrigger value="all">All Tickets</TabsTrigger>
        </TabsList>
        
        <TabsContent value="open" className="mt-0">
          {isRealData ? (
            <Card className="mt-6">
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">No real ticket data available yet. Connect your customer service platform.</p>
                <Button 
                  onClick={() => window.location.href = "/integrations"}
                  className="mt-4"
                >
                  Set up Integrations
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 mt-6 grid-cols-1 lg:grid-cols-3">
              <div className="col-span-2">
                {filteredTickets.length > 0 ? (
                  <div className="border rounded-md overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="text-left py-3 px-4 text-sm font-medium">ID</th>
                          <th className="text-left py-3 px-4 text-sm font-medium">Subject</th>
                          <th className="text-left py-3 px-4 text-sm font-medium">Customer</th>
                          <th className="text-left py-3 px-4 text-sm font-medium">Priority</th>
                          <th className="text-left py-3 px-4 text-sm font-medium">Status</th>
                          <th className="text-right py-3 px-4 text-sm font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTickets.map((ticket) => (
                          <tr key={ticket.id} className="border-t hover:bg-muted/40 transition-colors">
                            <td className="py-3 px-4 text-sm">{ticket.id}</td>
                            <td className="py-3 px-4">
                              <div className="font-medium">{ticket.subject}</div>
                              <div className="text-xs text-muted-foreground">{new Date(ticket.created_at).toLocaleDateString()}</div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback>{ticket.customer.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="text-sm font-medium">{ticket.customer.name}</div>
                                  <div className="text-xs text-muted-foreground">{ticket.customer.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">{renderPriority(ticket.priority)}</td>
                            <td className="py-3 px-4">{renderTicketStatus(ticket.status)}</td>
                            <td className="py-3 px-4 text-right">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleViewTicket(ticket)}
                              >
                                View
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <p className="text-muted-foreground">No tickets found matching your search criteria.</p>
                    </CardContent>
                  </Card>
                )}
              </div>
              
              <div className="col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Ticket Statistics</CardTitle>
                    <CardDescription>Overview of support tickets</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Tickets by Status</h4>
                      <div className="h-[200px]">
                        <ServiceSolvedCasesPieChart data={solvedCasesData} />
                      </div>
                    </div>
                    
                    <div className="border-t pt-4">
                      <h4 className="text-sm font-medium mb-3">Tickets by Category</h4>
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">Authentication</span>
                            <span className="font-medium">34%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: '34%' }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">Billing</span>
                            <span className="font-medium">28%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: '28%' }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">Feature Request</span>
                            <span className="font-medium">22%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: '22%' }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">Other</span>
                            <span className="font-medium">16%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: '16%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="closed" className="mt-0">
          {isRealData ? (
            <Card className="mt-6">
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">No real ticket data available yet. Connect your customer service platform.</p>
                <Button 
                  onClick={() => window.location.href = "/integrations"}
                  className="mt-4"
                >
                  Set up Integrations
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="border rounded-md overflow-hidden mt-6">
              {filteredTickets.length > 0 ? (
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="text-left py-3 px-4 text-sm font-medium">ID</th>
                      <th className="text-left py-3 px-4 text-sm font-medium">Subject</th>
                      <th className="text-left py-3 px-4 text-sm font-medium">Customer</th>
                      <th className="text-left py-3 px-4 text-sm font-medium">Resolution</th>
                      <th className="text-left py-3 px-4 text-sm font-medium">Closed At</th>
                      <th className="text-right py-3 px-4 text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTickets.map((ticket) => (
                      <tr key={ticket.id} className="border-t hover:bg-muted/40 transition-colors">
                        <td className="py-3 px-4 text-sm">{ticket.id}</td>
                        <td className="py-3 px-4">
                          <div className="font-medium">{ticket.subject}</div>
                          <div className="text-xs text-muted-foreground">{new Date(ticket.created_at).toLocaleDateString()}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback>{ticket.customer.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="text-sm font-medium">{ticket.customer.name}</div>
                              <div className="text-xs text-muted-foreground">{ticket.customer.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm">Issue resolved</td>
                        <td className="py-3 px-4 text-sm">
                          {ticket.status === 'closed' 
                            ? new Date(ticket.messages[ticket.messages.length - 1].timestamp).toLocaleDateString() 
                            : '-'}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleViewTicket(ticket)}
                          >
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-6 text-center">
                  <p className="text-muted-foreground">No closed tickets found matching your search criteria.</p>
                </div>
              )}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="all" className="mt-0">
          {isRealData ? (
            <Card className="mt-6">
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">No real ticket data available yet. Connect your customer service platform.</p>
                <Button 
                  onClick={() => window.location.href = "/integrations"}
                  className="mt-4"
                >
                  Set up Integrations
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="border rounded-md overflow-hidden mt-6">
              {filteredTickets.length > 0 ? (
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="text-left py-3 px-4 text-sm font-medium">ID</th>
                      <th className="text-left py-3 px-4 text-sm font-medium">Subject</th>
                      <th className="text-left py-3 px-4 text-sm font-medium">Customer</th>
                      <th className="text-left py-3 px-4 text-sm font-medium">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium">Last Updated</th>
                      <th className="text-right py-3 px-4 text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTickets.map((ticket) => (
                      <tr key={ticket.id} className="border-t hover:bg-muted/40 transition-colors">
                        <td className="py-3 px-4 text-sm">{ticket.id}</td>
                        <td className="py-3 px-4">
                          <div className="font-medium">{ticket.subject}</div>
                          <div className="text-xs text-muted-foreground">{new Date(ticket.created_at).toLocaleDateString()}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback>{ticket.customer.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="text-sm font-medium">{ticket.customer.name}</div>
                              <div className="text-xs text-muted-foreground">{ticket.customer.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">{renderTicketStatus(ticket.status)}</td>
                        <td className="py-3 px-4 text-sm">
                          {new Date(ticket.messages[ticket.messages.length - 1].timestamp).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleViewTicket(ticket)}
                          >
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-6 text-center">
                  <p className="text-muted-foreground">No tickets found matching your search criteria.</p>
                </div>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {selectedTicket && (
        <Dialog open={showTicketDialog} onOpenChange={setShowTicketDialog}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle className="flex items-start justify-between">
                <span>{selectedTicket.subject}</span>
                <Badge className="ml-2">{selectedTicket.id}</Badge>
              </DialogTitle>
              <DialogDescription className="flex flex-col sm:flex-row sm:items-center gap-2 justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback>{selectedTicket.customer.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span>{selectedTicket.customer.name} ({selectedTicket.customer.email})</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  {renderPriority(selectedTicket.priority)}
                  {renderTicketStatus(selectedTicket.status)}
                  <span className="text-muted-foreground">
                    {new Date(selectedTicket.created_at).toLocaleString()}
                  </span>
                </div>
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex-1 overflow-auto mt-4 pr-2">
              <div className="space-y-4">
                {selectedTicket.messages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`flex gap-4 ${message.sender === 'agent' ? 'justify-end' : ''}`}
                  >
                    {message.sender === 'customer' && (
                      <Avatar className="h-8 w-8 mt-1">
                        <AvatarFallback>{selectedTicket.customer.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div className={`flex flex-col max-w-[80%] ${message.sender === 'agent' ? 'items-end' : ''}`}>
                      <div className={`px-4 py-3 rounded-lg ${
                        message.sender === 'agent' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted'
                      }`}>
                        <div className="text-sm">{message.message}</div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <span>{message.senderName}</span>
                        <span>•</span>
                        <span>{new Date(message.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                    
                    {message.sender === 'agent' && (
                      <Avatar className="h-8 w-8 mt-1">
                        <AvatarFallback>A</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {selectedTicket.status !== 'closed' && (
              <div className="mt-4 border-t pt-4">
                <div className="flex items-start gap-4">
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarFallback>A</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Textarea
                      placeholder="Type your reply..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="resize-none mb-2"
                      rows={3}
                    />
                    <div className="flex justify-between">
                      <Button variant="outline" onClick={handleShowCloseDialog}>
                        <CheckCircle className="h-4 w-4 mr-1" /> Close Ticket
                      </Button>
                      <Button onClick={handleReply} disabled={!replyText.trim()}>
                        <MessageSquare className="h-4 w-4 mr-1" /> Reply
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}

      <Dialog open={showCloseDialog} onOpenChange={setShowCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Close Ticket</DialogTitle>
            <DialogDescription>
              Are you sure you want to close this ticket? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Label htmlFor="close-reason">Reason for closing (optional)</Label>
            <Textarea
              id="close-reason"
              placeholder="Enter the reason for closing this ticket..."
              value={closeReason}
              onChange={(e) => setCloseReason(e.target.value)}
              className="mt-1"
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCloseDialog(false)}>
              Cancel
            </Button>
            <Button variant="default" onClick={handleCloseTicket}>
              Close Ticket
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Service;
