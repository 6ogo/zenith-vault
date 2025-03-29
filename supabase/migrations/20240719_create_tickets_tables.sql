
-- Create tickets table
CREATE TABLE IF NOT EXISTS public.tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('open', 'pending', 'resolved', 'closed')),
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
  type TEXT NOT NULL,
  customer_email TEXT,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  assigned_to UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create ticket comments table
CREATE TABLE IF NOT EXISTS public.ticket_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID REFERENCES public.tickets(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_comments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for tickets
CREATE POLICY "Users can view all tickets" 
  ON public.tickets FOR SELECT 
  USING (true);

CREATE POLICY "Users can insert their own tickets" 
  ON public.tickets FOR INSERT 
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own tickets or assigned tickets" 
  ON public.tickets FOR UPDATE 
  USING (auth.uid() = created_by OR auth.uid() = assigned_to);

-- Create RLS policies for ticket comments
CREATE POLICY "Users can view all ticket comments" 
  ON public.ticket_comments FOR SELECT 
  USING (true);

CREATE POLICY "Users can insert their own comments" 
  ON public.ticket_comments FOR INSERT 
  WITH CHECK (auth.uid() = created_by);

-- Create foreign key references to profiles table
ALTER TABLE public.tickets
ADD COLUMN creator_details UUID REFERENCES public.profiles(id);

ALTER TABLE public.tickets
ADD COLUMN assignee_details UUID REFERENCES public.profiles(id);

-- Create functions to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to call the function
CREATE TRIGGER set_tickets_updated_at
BEFORE UPDATE ON public.tickets
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();
