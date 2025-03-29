
import { supabase } from '@/integrations/supabase/client';

export interface TicketInput {
  subject: string;
  description: string;
  priority: string;
  type: string;
  customer_email?: string;
  status: string;
}

export interface TicketComment {
  ticket_id: string;
  content: string;
}

export const createTicket = async (ticket: TicketInput) => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase.from('tickets').insert({
    subject: ticket.subject,
    description: ticket.description,
    priority: ticket.priority,
    type: ticket.type,
    customer_email: ticket.customer_email || null,
    status: ticket.status || 'open',
    created_by: user.id
  }).select().single();

  if (error) throw error;
  return data;
};

export const listTickets = async (filter: string) => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error('User not authenticated');

  let query = supabase.from('tickets').select(`
    *,
    creator:profiles!tickets_created_by_fkey(*),
    assignee:profiles!tickets_assigned_to_fkey(*)
  `);

  if (filter === 'open') {
    query = query.eq('status', 'open');
  } else if (filter === 'pending') {
    query = query.eq('status', 'pending');
  } else if (filter === 'closed') {
    query = query.eq('status', 'closed');
  } else if (filter === 'mine') {
    query = query.eq('assigned_to', user.id);
  }

  const { data, error } = await query.order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const updateTicketStatus = async (ticketId: string, status: string) => {
  const { data, error } = await supabase
    .from('tickets')
    .update({ status })
    .eq('id', ticketId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const assignTicketToMe = async (ticketId: string) => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('tickets')
    .update({ assigned_to: user.id })
    .eq('id', ticketId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const addTicketComment = async (comment: TicketComment) => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('ticket_comments')
    .insert({
      ticket_id: comment.ticket_id,
      content: comment.content,
      created_by: user.id
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const getTicketComments = async (ticketId: string) => {
  const { data, error } = await supabase
    .from('ticket_comments')
    .select(`
      *,
      commenter:profiles!ticket_comments_created_by_fkey(*)
    `)
    .eq('ticket_id', ticketId)
    .order('created_at', { ascending: true });
  
  if (error) throw error;
  return data;
};
