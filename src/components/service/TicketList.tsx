
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  CheckCircle, 
  Clock, 
  MessageSquare, 
  MoreHorizontal, 
  Loader2,
  User
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { 
  listTickets,
  updateTicketStatus,
  assignTicketToMe,
  addTicketComment,
  getTicketComments
} from '@/supabase/ticketFunctions';

interface Ticket {
  id: string;
  subject: string;
  description: string;
  status: 'open' | 'pending' | 'closed' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  type: string;
  customer_email?: string;
  created_by: string;
  assigned_to?: string;
  created_at: string;
  updated_at: string;
  creator?: {
    full_name?: string;
    avatar_url?: string;
  };
  assignee?: {
    full_name?: string;
    avatar_url?: string;
  };
}

interface Comment {
  id: string;
  ticket_id: string;
  content: string;
  created_by: string;
  created_at: string;
  commenter?: {
    full_name?: string;
    avatar_url?: string;
  };
}

interface TicketListProps {
  filter: 'all' | 'open' | 'pending' | 'closed' | 'mine';
  refreshTrigger: number;
}

const statusStyles = {
  open: { color: "bg-blue-100 text-blue-800", icon: <Clock className="h-3 w-3 mr-1" /> },
  pending: { color: "bg-yellow-100 text-yellow-800", icon: <Clock className="h-3 w-3 mr-1" /> },
  closed: { color: "bg-green-100 text-green-800", icon: <CheckCircle className="h-3 w-3 mr-1" /> },
  resolved: { color: "bg-green-100 text-green-800", icon: <CheckCircle className="h-3 w-3 mr-1" /> },
};

const priorityStyles = {
  high: { color: "bg-red-100 text-red-800" },
  medium: { color: "bg-yellow-100 text-yellow-800" },
  low: { color: "bg-green-100 text-green-800" },
};

const TicketList: React.FC<TicketListProps> = ({ filter, refreshTrigger }) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedTicket, setExpandedTicket] = useState<string | null>(null);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  useEffect(() => {
    fetchTickets();
  }, [filter, refreshTrigger]);
  
  const fetchTickets = async () => {
    setLoading(true);
    try {
      const data = await listTickets(filter);
      setTickets(data as unknown as Ticket[]);
    } catch (error: any) {
      console.error('Error fetching tickets:', error);
      toast({
        title: 'Error fetching tickets',
        description: error.message || 'Failed to load tickets',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleStatusChange = async (ticketId: string, newStatus: 'open' | 'pending' | 'closed' | 'resolved') => {
    try {
      await updateTicketStatus(ticketId, newStatus);
      
      setTickets(tickets.map(ticket => 
        ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
      ));
      
      toast({
        title: 'Status updated',
        description: `Ticket status updated to ${newStatus}`,
      });
    } catch (error: any) {
      toast({
        title: 'Error updating status',
        description: error.message || 'Failed to update ticket status',
        variant: 'destructive',
      });
    }
  };
  
  const handleAssignToMe = async (ticketId: string) => {
    try {
      const updatedTicket = await assignTicketToMe(ticketId);
      
      setTickets(tickets.map(ticket => 
        ticket.id === ticketId ? { ...ticket, assigned_to: user!.id } : ticket
      ));
      
      toast({
        title: 'Ticket assigned',
        description: 'Ticket has been assigned to you',
      });
    } catch (error: any) {
      toast({
        title: 'Error assigning ticket',
        description: error.message || 'Failed to assign ticket',
        variant: 'destructive',
      });
    }
  };
  
  const toggleExpandTicket = async (ticketId: string) => {
    if (expandedTicket === ticketId) {
      setExpandedTicket(null);
      return;
    }
    
    setExpandedTicket(ticketId);
    
    if (!comments[ticketId]) {
      setLoadingComments(true);
      try {
        const commentsData = await getTicketComments(ticketId);
        setComments(prev => ({ ...prev, [ticketId]: commentsData as unknown as Comment[] }));
      } catch (error: any) {
        console.error('Error fetching comments:', error);
        toast({
          title: 'Error fetching comments',
          description: error.message || 'Failed to load comments',
          variant: 'destructive',
        });
      } finally {
        setLoadingComments(false);
      }
    }
  };
  
  const handleSubmitComment = async (ticketId: string) => {
    if (!newComment.trim()) return;
    
    setSubmittingComment(true);
    try {
      const comment = await addTicketComment({
        ticket_id: ticketId,
        content: newComment
      });
      
      // Update comments in state
      const updatedComment = {
        ...comment,
        commenter: {
          full_name: user?.user_metadata?.full_name || 'You',
          avatar_url: user?.user_metadata?.avatar_url
        }
      };
      
      setComments(prev => ({
        ...prev,
        [ticketId]: [...(prev[ticketId] || []), updatedComment as unknown as Comment]
      }));
      
      setNewComment('');
      toast({
        title: 'Comment added',
        description: 'Your comment has been added to the ticket',
      });
    } catch (error: any) {
      console.error('Error adding comment:', error);
      toast({
        title: 'Error adding comment',
        description: error.message || 'Failed to add comment',
        variant: 'destructive',
      });
    } finally {
      setSubmittingComment(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  if (tickets.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        No tickets found for the selected filter.
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {tickets.map(ticket => (
        <Card key={ticket.id} className="p-4">
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-medium text-lg">{ticket.subject}</h3>
                  <Badge variant="outline" className="text-xs">
                    {ticket.id.slice(0, 8)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {new Date(ticket.created_at).toLocaleString()}
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Badge 
                  variant="secondary"
                  className={priorityStyles[ticket.priority].color}
                >
                  {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                </Badge>
                
                <Badge 
                  variant="secondary"
                  className={statusStyles[ticket.status].color}
                >
                  {statusStyles[ticket.status].icon}
                  {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                </Badge>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleStatusChange(ticket.id, 'open')}>
                      Mark as Open
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange(ticket.id, 'pending')}>
                      Mark as Pending
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange(ticket.id, 'closed')}>
                      Mark as Closed
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAssignToMe(ticket.id)}>
                      Assign to Me
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <div className="flex items-center space-x-1">
                  <User className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    From: {ticket.creator?.full_name || 'Unknown'}
                  </span>
                </div>
                
                {ticket.assigned_to && (
                  <div className="flex items-center space-x-1">
                    <User className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      Assigned: {ticket.assignee?.full_name || 'Unknown'}
                    </span>
                  </div>
                )}
                
                {ticket.customer_email && (
                  <div className="flex items-center space-x-1">
                    <span className="text-xs text-muted-foreground">
                      Customer: {ticket.customer_email}
                    </span>
                  </div>
                )}
              </div>
              
              <p className="text-sm">{ticket.description}</p>
            </div>
            
            <div className="flex items-center justify-between">
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={() => toggleExpandTicket(ticket.id)}
              >
                <MessageSquare className="h-4 w-4" />
                {expandedTicket === ticket.id ? 'Hide Comments' : 'Show Comments'}
              </Button>
              
              {!ticket.assigned_to && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleAssignToMe(ticket.id)}
                >
                  Assign to Me
                </Button>
              )}
            </div>
            
            {expandedTicket === ticket.id && (
              <div className="mt-4 space-y-4">
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium mb-2">Comments</h4>
                  
                  {loadingComments ? (
                    <div className="flex justify-center py-4">
                      <Loader2 className="h-5 w-5 animate-spin" />
                    </div>
                  ) : comments[ticket.id]?.length > 0 ? (
                    <div className="space-y-3">
                      {comments[ticket.id].map(comment => (
                        <div key={comment.id} className="bg-muted p-3 rounded-md">
                          <div className="flex items-center justify-between mb-1">
                            <div className="text-sm font-medium">
                              {comment.commenter?.full_name || 'Unknown User'}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(comment.created_at).toLocaleString()}
                            </div>
                          </div>
                          <p className="text-sm">{comment.content}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-2">
                      No comments yet
                    </p>
                  )}
                  
                  <div className="mt-4">
                    <Textarea
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={e => setNewComment(e.target.value)}
                      className="mb-2"
                    />
                    <Button 
                      size="sm"
                      disabled={!newComment.trim() || submittingComment}
                      onClick={() => handleSubmitComment(ticket.id)}
                    >
                      {submittingComment ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        'Add Comment'
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default TicketList;
