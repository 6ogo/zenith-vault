import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search, Plus, ArrowRight, MessageSquare, Clock, Calendar, CheckCircle, AlertCircle, AlertTriangle } from "lucide-react";
import { useDataMode } from "@/contexts/DataModeContext";
import DataModeToggle from "@/components/dashboard/DataModeToggle";

// Demo ticket data
const demoTickets = [
  {
    id: "ticket-001",
    subject: "Dashboard loading error",
    description: "I'm experiencing an error when trying to load the analytics dashboard. The page keeps showing a loading spinner indefinitely.",
    status: "open",
    priority: "high",
    customer: {
      name: "Michael Chen",
      email: "michael.chen@example.com",
      company: "InnoTech Solutions"
    },
    assignedTo: "Sarah Wilson",
    createdAt: "2023-05-10T14:23:00Z",
    updatedAt: "2023-05-10T17:45:00Z",
    category: "technical",
    comments: [
      {
        id: "comment-001",
        author: "Sarah Wilson",
        content: "I've replicated the issue on our end. It seems to be related to the latest update. We're working on a fix.",
        createdAt: "2023-05-10T15:30:00Z",
        isInternal: true
      },
      {
        id: "comment-002",
        author: "Michael Chen",
        content: "Thank you for looking into this. Is there an ETA for the fix?",
        createdAt: "2023-05-10T16:15:00Z",
        isInternal: false
      },
      {
        id: "comment-003",
        author: "Sarah Wilson",
        content: "We expect to have this resolved within the next 24 hours. In the meantime, you can access the data through the Reports section as a workaround.",
        createdAt: "2023-05-10T17:45:00Z",
        isInternal: false
      }
    ]
  },
  {
    id: "ticket-002",
    subject: "Billing question",
    description: "I was charged twice for the monthly subscription. Can you please check my account and process a refund for the duplicate charge?",
    status: "open",
    priority: "medium",
    customer: {
      name: "Emily Rodriguez",
      email: "emily.r@example.com",
      company: "Global Merchants"
    },
    assignedTo: "John Davis",
    createdAt: "2023-05-08T09:15:00Z",
    updatedAt: "2023-05-09T11:20:00Z",
    category: "billing",
    comments: [
      {
        id: "comment-004",
        author: "John Davis",
        content: "I've checked your account and confirmed the duplicate charge. I've initiated a refund which should be processed in 3-5 business days.",
        createdAt: "2023-05-09T11:20:00Z",
        isInternal: false
      }
    ]
  },
  {
    id: "ticket-003",
    subject: "Feature request: Export to CSV",
    description: "It would be very helpful if we could export all reports to CSV format for further analysis in Excel.",
    status: "pending",
    priority: "low",
    customer: {
      name: "David Smith",
      email: "david.smith@example.com",
      company: "Smith & Associates"
    },
    assignedTo: "Lisa Johnson",
    createdAt: "2023-05-05T13:40:00Z",
    updatedAt: "2023-05-06T10:30:00Z",
    category: "feature-request",
    comments: [
      {
        id: "comment-005",
        author: "Lisa Johnson",
        content: "Thank you for the suggestion! We've added this to our feature roadmap and expect to implement it in the next quarter.",
        createdAt: "2023-05-06T10:30:00Z",
        isInternal: false
      },
      {
        id: "comment-006",
        author: "Marketing Team",
        content: "This is a common request from enterprise customers. Let's prioritize this for the next sprint.",
        createdAt: "2023-05-06T14:15:00Z",
        isInternal: true
      }
    ]
  },
  {
    id: "ticket-004",
    subject: "Unable to integrate with Salesforce",
    description: "After following the integration guide, I'm still unable to connect my Salesforce account. The connection test fails with an error code 403.",
    status: "open",
    priority: "high",
    customer: {
      name: "Sarah Johnson",
      email: "sarah.johnson@example.com",
      company: "Acme Corp"
    },
    assignedTo: "Alex Martinez",
    createdAt: "2023-05-11T08:20:00Z",
    updatedAt: "2023-05-11T09:45:00Z",
    category: "integration",
    comments: [
      {
        id: "comment-007",
        author: "Alex Martinez",
        content: "It sounds like a permissions issue. Could you check that the API user in Salesforce has the correct permissions set?",
        createdAt: "2023-05-11T09:45:00Z",
        isInternal: false
      }
    ]
  },
  {
    id: "ticket-005",
    subject: "Account access issue",
    description: "Our team member Jane cannot log in despite having the correct credentials. The system keeps saying 'invalid password' even after resetting it.",
    status: "closed",
    priority: "medium",
    customer: {
      name: "Robert Taylor",
      email: "robert.t@example.com",
      company: "Taylor Enterprises"
    },
    assignedTo: "Sarah Wilson",
    createdAt: "2023-05-01T11:30:00Z",
    updatedAt: "2023-05-03T14:20:00Z",
    resolution: "User account was locked due to multiple failed login attempts. Account has been unlocked and password reset.",
    category: "access",
    comments: [
      {
        id: "comment-008",
        author: "Sarah Wilson",
        content: "I've identified the issue. The account was locked due to multiple failed login attempts. I've unlocked it now.",
        createdAt: "2023-05-02T13:15:00Z",
        isInternal: false
      },
      {
        id: "comment-009",
        author: "Robert Taylor",
        content: "Thank you! Jane can now log in successfully.",
        createdAt: "2023-05-03T10:45:00Z",
        isInternal: false
      },
      {
        id: "comment-010",
        author: "Sarah Wilson",
        content: "Glad to hear it's resolved. I'm closing this ticket now. Please don't hesitate to reach out if you have any other issues.",
        createdAt: "2023-05-03T14:20:00Z",
        isInternal: false
      }
    ]
  },
  {
    id: "ticket-006",
    subject: "Data import failed",
    description: "Tried to import customer data using the bulk import tool, but it failed with an error message about column mapping.",
    status: "closed",
    priority: "medium",
    customer: {
      name: "Michael Chen",
      email: "michael.chen@example.com",
      company: "InnoTech Solutions"
    },
    assignedTo: "John Davis",
    createdAt: "2023-04-28T15:45:00Z",
    updatedAt: "2023-04-30T11:20:00Z",
    resolution: "Provided correct CSV template and customer successfully imported their data.",
    category: "technical",
    comments: [
      {
        id: "comment-011",
        author: "John Davis",
        content: "I've reviewed the error logs. The issue is with the column headers in your CSV file. They need to match our expected format exactly.",
        createdAt: "2023-04-29T09:30:00Z",
        isInternal: false
      },
      {
        id: "comment-012",
        author: "John Davis",
        content: "I've attached a template CSV file with the correct headers. Please try using this format.",
        createdAt: "2023-04-29T09:32:00Z",
        isInternal: false
      },
      {
        id: "comment-013",
        author: "Michael Chen",
        content: "Thanks! I'll try that and get back to you.",
        createdAt: "2023-04-29T10:15:00Z",
        isInternal: false
      },
      {
        id: "comment-014",
        author: "Michael Chen",
        content: "It worked! All our data has been imported successfully.",
        createdAt: "2023-04-30T10:45:00Z",
        isInternal: false
      }
    ]
  },
  {
    id: "ticket-007",
    subject: "Need help with advanced reporting",
    description: "I'm trying to create a custom report that shows conversion rates by marketing channel, but I'm not sure how to set up the right filters.",
    status: "pending",
    priority: "low",
    customer: {
      name: "Emily Rodriguez",
      email: "emily.r@example.com",
      company: "Global Merchants"
    },
    assignedTo: "Lisa Johnson",
    createdAt: "2023-05-09T16:20:00Z",
    updatedAt: "2023-05-10T13:15:00Z",
    category: "reporting",
    comments: [
      {
        id: "comment-015",
        author: "Lisa Johnson",
        content: "I'd be happy to help you set up this report. Could we schedule a quick 15-minute call to go through this together?",
        createdAt: "2023-05-10T13:15:00Z",
        isInternal: false
      }
    ]
  }
];

const CustomerService = () => {
  const { isRealData } = useDataMode();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<typeof demoTickets[0] | null>(null);
  const [filteredTickets, setFilteredTickets] = useState(demoTickets);
  const [activeTab, setActiveTab] = useState("all");

  // Filter tickets based on search query and active tab
  React.useEffect(() => {
    let filtered = demoTickets;
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(ticket => 
        ticket.subject.toLowerCase().includes(query) ||
        ticket.customer.name.toLowerCase().includes(query) ||
        ticket.customer.email.toLowerCase().includes(query) ||
        ticket.description.toLowerCase().includes(query)
      );
    }
    
    // Filter by status
    if (activeTab !== "all") {
      filtered = filtered.filter(ticket => ticket.status === activeTab);
    }
    
    setFilteredTickets(filtered);
  }, [searchQuery, activeTab]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // Get counts for each status
  const counts = {
    all: demoTickets.length,
    open: demoTickets.filter(t => t.status === 'open').length,
    pending: demoTickets.filter(t => t.status === 'pending').length,
    closed: demoTickets.filter(t => t.status === 'closed').length
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Customer Service</h1>
          <p className="text-muted-foreground">
            Manage support tickets and customer inquiries.
          </p>
        </div>
        <div className="flex gap-3">
          <DataModeToggle />
          <Button size="sm" className="font-medium">
            <Plus className="h-4 w-4 mr-1" /> New Ticket
          </Button>
        </div>
      </div>
      
      <div className="flex items-center">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search tickets..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {selectedTicket ? (
        <TicketDetail 
          ticket={selectedTicket} 
          onBack={() => setSelectedTicket(null)} 
        />
      ) : (
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
            <TabsTrigger value="all">All ({counts.all})</TabsTrigger>
            <TabsTrigger value="open">Open ({counts.open})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({counts.pending})</TabsTrigger>
            <TabsTrigger value="closed">Closed ({counts.closed})</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-4">
            {renderTicketList(filteredTickets, setSelectedTicket, isRealData)}
          </TabsContent>
          <TabsContent value="open" className="mt-4">
            {renderTicketList(filteredTickets, setSelectedTicket, isRealData)}
          </TabsContent>
          <TabsContent value="pending" className="mt-4">
            {renderTicketList(filteredTickets, setSelectedTicket, isRealData)}
          </TabsContent>
          <TabsContent value="closed" className="mt-4">
            {renderTicketList(filteredTickets, setSelectedTicket, isRealData)}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

// Helper function to render ticket list
const renderTicketList = (
  tickets: typeof demoTickets, 
  setSelectedTicket: React.Dispatch<React.SetStateAction<typeof demoTickets[0] | null>>,
  isRealData: boolean
) => {
  if (isRealData) {
    return (
      <Card className="dashboard-card p-6">
        <div className="text-center p-8">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No tickets available</h3>
          <p className="text-muted-foreground mb-4">
            Connect your support system to view and manage customer tickets.
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-1" /> Add Ticket
          </Button>
        </div>
      </Card>
    );
  }

  if (tickets.length === 0) {
    return (
      <Card className="dashboard-card p-6">
        <div className="text-center p-8">
          <h3 className="text-lg font-semibold mb-2">No tickets found</h3>
          <p className="text-muted-foreground mb-4">
            Try a different search term or status filter.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="rounded-md border">
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left text-sm font-medium">ID</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Subject</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Customer</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Priority</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Assigned To</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Updated</th>
              <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id} className="border-b hover:bg-muted/50 transition-colors">
                <td className="px-4 py-3 text-sm font-mono">{ticket.id.split('-')[1]}</td>
                <td className="px-4 py-3 font-medium">{ticket.subject}</td>
                <td className="px-4 py-3 text-sm">{ticket.customer.name}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={ticket.status} />
                </td>
                <td className="px-4 py-3">
                  <PriorityBadge priority={ticket.priority} />
                </td>
                <td className="px-4 py-3 text-sm">{ticket.assignedTo}</td>
                <td className="px-4 py-3 text-sm">
                  {new Date(ticket.updatedAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-right">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setSelectedTicket(ticket)}
                  >
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Helper components for badges
const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case 'open':
      return <Badge className="bg-blue-500">{status}</Badge>;
    case 'pending':
      return <Badge variant="outline" className="text-amber-500 border-amber-500">{status}</Badge>;
    case 'closed':
      return <Badge variant="secondary">{status}</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

const PriorityBadge = ({ priority }: { priority: string }) => {
  switch (priority) {
    case 'high':
      return <Badge variant="outline" className="text-red-500 border-red-500">{priority}</Badge>;
    case 'medium':
      return <Badge variant="outline" className="text-amber-500 border-amber-500">{priority}</Badge>;
    case 'low':
      return <Badge variant="outline" className="text-green-500 border-green-500">{priority}</Badge>;
    default:
      return <Badge variant="outline">{priority}</Badge>;
  }
};

// Ticket detail component
interface TicketDetailProps {
  ticket: typeof demoTickets[0];
  onBack: () => void;
}

const TicketDetail = ({ ticket, onBack }: TicketDetailProps) => {
  return (
    <div className="space-y-6">
      <Button variant="outline" onClick={onBack} className="mb-4">
        <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
        Back to tickets
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Ticket #{ticket.id.split('-')[1]}</div>
                <CardTitle>{ticket.subject}</CardTitle>
              </div>
              <StatusBadge status={ticket.status} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm whitespace-pre-line">{ticket.description}</p>
                <div className="mt-3 text-xs text-muted-foreground flex items-center">
                  <Calendar className="h-3 w-3 mr-1" /> 
                  {new Date(ticket.createdAt).toLocaleString()}
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Conversation</h3>
                
                {ticket.comments.map((comment) => (
                  <div 
                    key={comment.id} 
                    className={`p-4 rounded-lg border ${
                      comment.isInternal 
                        ? "bg-muted/50 border-muted" 
                        : comment.author === ticket.customer.name
                          ? "bg-blue-50 border-blue-100"
                          : "bg-green-50 border-green-100"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">{comment.author.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-sm">{comment.author}</span>
                      {comment.isInternal && (
                        <Badge variant="outline" className="text-xs h-5">Internal Note</Badge>
                      )}
                    </div>
                    <p className="text-sm">{comment.content}</p>
                    <div className="mt-2 text-xs text-muted-foreground flex items-center">
                      <Clock className="h-3 w-3 mr-1" /> 
                      {new Date(comment.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))}
                
                {ticket.status === 'closed' && ticket.resolution && (
                  <div className="p-4 rounded-lg border border-green-200 bg-green-50">
                    <div className="flex gap-2 items-center mb-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <h4 className="font-medium">Resolution</h4>
                    </div>
                    <p className="text-sm">{ticket.resolution}</p>
                  </div>
                )}
              </div>
              
              <div>
                <Input
                  placeholder={ticket.status === 'closed' ? "This ticket is closed" : "Add a reply..."}
                  disabled={ticket.status === 'closed'}
                  className="w-full"
                />
                {ticket.status !== 'closed' && (
                  <div className="flex gap-2 mt-2 justify-end">
                    <Button variant="outline" size="sm">Add Internal Note</Button>
                    <Button size="sm">Reply</Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Ticket Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-2">Priority</h3>
                <PriorityBadge priority={ticket.priority} />
                {ticket.priority === 'high' && (
                  <div className="flex items-center gap-1 mt-2 text-sm text-red-500">
                    <AlertCircle className="h-4 w-4" />
                    <span>Requires attention</span>
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Assigned To</h3>
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarFallback>{ticket.assignedTo.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span>{ticket.assignedTo}</span>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Customer</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarFallback>{ticket.customer.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{ticket.customer.name}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">{ticket.customer.email}</div>
                  <div className="text-sm text-muted-foreground">{ticket.customer.company}</div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Category</h3>
                <Badge variant="outline">
                  {ticket.category.replace('-', ' ')}
                </Badge>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Dates</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created:</span>
                    <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Updated:</span>
                    <span>{new Date(ticket.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              {ticket.status !== 'closed' && (
                <div className="pt-4 border-t">
                  <Button className="w-full" variant={ticket.status === 'open' ? 'default' : 'outline'}>
                    {ticket.status === 'open' ? 'Resolve Ticket' : 'Reopen Ticket'}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomerService;
