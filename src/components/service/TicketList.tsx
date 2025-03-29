
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  CheckCircle, 
  Clock, 
  MessageSquare,
  MoreVertical, 
  AlertCircle,
  XCircle,
  PauseCircle,
  ArrowUpCircle,
  RefreshCw
} from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from '@/components/ui/textarea';

interface Ticket {
  id: string;
  subject: string;
  description: string;
  status: 'open' | 'pending' | 'closed' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  type: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  assigned_to?: string;
  customer_email?: string;
  creator_details?: {
    full_name?: string;
  };
  assignee_details?: {
    full_name?: string;
  };
}

interface TicketListProps {
  filter?: string;
  refreshTrigger?: number;
}

const statusStyles = {
  open: { color: "bg-blue-100 text-blue-800", icon: <Clock className="h-3 w-3 mr-1" /> },
  pending: { color: "bg-yellow-100 text-yellow-800", icon: <PauseCircle className="h-3 w-3 mr-1" /> },
  resolved: { color: "bg-green-100 text-green-800", icon: <CheckCircle className="h-3 w-3 mr-1" /> },
  closed: { color: "bg-gray-100 text-gray-800", icon: <XCircle className="h-3 w-3 mr-1" /> },
};

const priorityStyles = {
  high: { color: "bg-red-100 text-red-800", icon: <ArrowUpCircle className="h-3 w-3 mr-1" /> },
  medium: { color: "bg-yellow-100 text-yellow-800" },
  low: { color: "bg-green-100 text-green-800" },
};

const TicketList = ({ filter = 'all', refreshTrigger = 0 }: TicketListProps) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [comment, setComment] = useState('');
  const [includeCustomer, setIncludeCustomer] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const { toast } = useToast();
  const { user } = useAuth();
  
  useEffect(() => {
    fetchTickets();
  }, [filter, refreshTrigger]);
  
  const fetchTickets = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      let query = supabase
        .from('tickets')
        .select(`
          *,
          creator_details:profiles!tickets_created_by_fkey(full_name),
          assignee_details:profiles!tickets_assigned_to_fkey(full_name)
        `)
        .order('created_at', { ascending: false });
      
      // Apply filters
      if (filter === 'mine') {
        query = query.eq('created_by', user.id);
      } else if (filter === 'assigned') {
        query = query.eq('assigned_to', user.id);
      } else if (filter === 'open') {
        query = query.eq('status', 'open');
      } else if (filter === 'pending') {
        query = query.eq('status', 'pending');
      } else if (filter === 'closed') {
        query = query.in('status', ['closed', 'resolved']);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      setTickets(data as Ticket[]);
    } catch (error: any) {
      console.error('Error fetching tickets:', error);
      toast({
        title: 'Failed to load tickets',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const updateTicketStatus = async (ticketId: string, newStatus: Ticket['status']) => {
    try {
      const { error } = await supabase
        .from('tickets')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', ticketId);
      
      if (error) throw error;
      
      toast({
        title: 'Ticket updated',
        description: `Ticket status changed to ${newStatus}`,
      });
      
      // Update the local state
      setTickets(tickets.map(ticket => 
        ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
      ));
      
      // If we're viewing this ticket details, update that too
      if (selectedTicket?.id === ticketId) {
        setSelectedTicket({ ...selectedTicket, status: newStatus });
      }
    } catch (error: any) {
      console.error('Error updating ticket:', error);
      toast({
        title: 'Failed to update ticket',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    }
  };
  
  const assignToMe = async (ticketId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('tickets')
        .update({ assigned_to: user.id, updated_at: new Date().toISOString() })
        .eq('id', ticketId);
      
      if (error) throw error;
      
      toast({
        title: 'Ticket assigned',
        description: 'Ticket has been assigned to you',
      });
      
      // Update local state & refetch to get updated assignee details
      fetchTickets();
    } catch (error: any) {
      console.error('Error assigning ticket:', error);
      toast({
        title: 'Failed to assign ticket',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    }
  };
  
  const addComment = async () => {
    if (!selectedTicket || !comment.trim() || !user) return;
    
    setSubmittingComment(true);
    try {
      // Add comment to ticket_comments table
      const { error: commentError } = await supabase
        .from('ticket_comments')
        .insert({
          ticket_id: selectedTicket.id,
          content: comment,
          created_by: user.id,
        });
      
      if (commentError) throw commentError;
      
      // Update ticket's updated_at timestamp
      const { error: updateError } = await supabase
        .from('tickets')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', selectedTicket.id);
      
      if (updateError) throw updateError;
      
      // If includeCustomer is true and there's a customer email, send email
      if (includeCustomer && selectedTicket.customer_email) {
        // In a real implementation, you would call an edge function to send the email
        console.log('Would send email to:', selectedTicket.customer_email);
        console.log('Email content:', comment);
      }
      
      setComment('');
      setIncludeCustomer(false);
      
      toast({
        title: 'Comment added',
        description: includeCustomer && selectedTicket.customer_email 
          ? 'Comment added and sent to customer' 
          : 'Comment added to ticket',
      });
      
      // Close the dialog
      setDialogOpen(false);
    } catch (error: any) {
      console.error('Error adding comment:', error);
      toast({
        title: 'Failed to add comment',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setSubmittingComment(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };
  
  if (loading) {
    return (
      <div className="w-full p-8 text-center">
        <RefreshCw className="h-6 w-6 animate-spin mx-auto text-primary" />
        <p className="mt-2 text-muted-foreground">Loading tickets...</p>
      </div>
    );
  }
  
  if (tickets.length === 0) {
    return (
      <div className="w-full p-8 text-center border rounded-md">
        <AlertCircle className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
        <h3 className="text-lg font-medium mb-1">No tickets found</h3>
        <p className="text-sm text-muted-foreground">
          {filter === 'mine' 
            ? "You haven't created any tickets yet." 
            : filter === 'assigned' 
              ? "You don't have any tickets assigned to you."
              : "No tickets match the current filter."}
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      {tickets.map((ticket) => (
        <Card key={ticket.id} className="p-4 hover:bg-accent/5 transition-colors">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium text-sm sm:text-base">{ticket.subject}</h3>
                <Badge variant="secondary" className={priorityStyles[ticket.priority]?.color || ""}>
                  {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                </Badge>
                <Badge variant="secondary" className={statusStyles[ticket.status]?.color || ""}>
                  {statusStyles[ticket.status]?.icon}
                  {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                </Badge>
              </div>
              
              <div className="text-xs text-muted-foreground flex flex-wrap gap-x-4 gap-y-1 mb-2">
                <span>ID: {ticket.id.slice(0, 8)}</span>
                <span>Created: {formatDate(ticket.created_at)}</span>
                {ticket.creator_details?.full_name && (
                  <span>By: {ticket.creator_details.full_name}</span>
                )}
                {ticket.assignee_details?.full_name && (
                  <span>Assigned to: {ticket.assignee_details.full_name}</span>
                )}
                {ticket.customer_email && (
                  <span>Customer: {ticket.customer_email}</span>
                )}
              </div>
              
              <Dialog open={dialogOpen && selectedTicket?.id === ticket.id} onOpenChange={(open) => {
                setDialogOpen(open);
                if (!open) setSelectedTicket(null);
              }}>
                <DialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="px-2 h-7"
                    onClick={() => setSelectedTicket(ticket)}
                  >
                    <MessageSquare className="h-3.5 w-3.5 mr-1" />
                    <span className="text-xs">View Details</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Ticket Details</DialogTitle>
                    <DialogDescription>
                      View and respond to ticket #{ticket.id.slice(0, 8)}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 mt-2">
                    <div>
                      <h3 className="font-medium text-lg">{ticket.subject}</h3>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <Badge variant="secondary" className={priorityStyles[ticket.priority]?.color || ""}>
                          {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)} Priority
                        </Badge>
                        <Badge variant="secondary" className={statusStyles[ticket.status]?.color || ""}>
                          {statusStyles[ticket.status]?.icon}
                          {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                        </Badge>
                        <Badge variant="outline">
                          {ticket.type.charAt(0).toUpperCase() + ticket.type.slice(1)}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Created by</p>
                        <p>{ticket.creator_details?.full_name || 'Unknown'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Created at</p>
                        <p>{formatDate(ticket.created_at)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Assigned to</p>
                        <p>{ticket.assignee_details?.full_name || 'Unassigned'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Last updated</p>
                        <p>{formatDate(ticket.updated_at)}</p>
                      </div>
                      {ticket.customer_email && (
                        <div className="col-span-2">
                          <p className="text-muted-foreground">Customer email</p>
                          <p>{ticket.customer_email}</p>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-1">Description</h4>
                      <div className="bg-muted p-3 rounded-md whitespace-pre-wrap text-sm">
                        {ticket.description}
                      </div>
                    </div>
                    
                    <div className="pt-2">
                      <h4 className="font-medium mb-2">Add Response</h4>
                      <Textarea
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                        placeholder="Enter your comment or response..."
                        className="min-h-[100px] mb-2"
                      />
                      
                      {ticket.customer_email && (
                        <div className="flex items-center space-x-2 mb-4">
                          <Checkbox
                            id="send-to-customer"
                            checked={includeCustomer}
                            onCheckedChange={(checked) => 
                              setIncludeCustomer(checked as boolean)
                            }
                          />
                          <label
                            htmlFor="send-to-customer"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Send email to customer
                          </label>
                        </div>
                      )}
                      
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          onClick={() => setDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button 
                          onClick={addComment} 
                          disabled={!comment.trim() || submittingComment}
                        >
                          {submittingComment ? 'Sending...' : 'Add Response'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                {ticket.status !== 'resolved' && (
                  <DropdownMenuItem onClick={() => updateTicketStatus(ticket.id, 'resolved')}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark as Resolved
                  </DropdownMenuItem>
                )}
                
                {ticket.status !== 'closed' && (
                  <DropdownMenuItem onClick={() => updateTicketStatus(ticket.id, 'closed')}>
                    <XCircle className="h-4 w-4 mr-2" />
                    Close Ticket
                  </DropdownMenuItem>
                )}
                
                {ticket.status !== 'pending' && (
                  <DropdownMenuItem onClick={() => updateTicketStatus(ticket.id, 'pending')}>
                    <PauseCircle className="h-4 w-4 mr-2" />
                    Mark as Pending
                  </DropdownMenuItem>
                )}
                
                {ticket.status !== 'open' && (
                  <DropdownMenuItem onClick={() => updateTicketStatus(ticket.id, 'open')}>
                    <Clock className="h-4 w-4 mr-2" />
                    Reopen Ticket
                  </DropdownMenuItem>
                )}
                
                {!ticket.assigned_to && (
                  <DropdownMenuItem onClick={() => assignToMe(ticket.id)}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Assign to Me
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default TicketList;
