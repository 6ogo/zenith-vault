
-- Function to create a ticket
CREATE OR REPLACE FUNCTION public.create_ticket(
  p_subject TEXT,
  p_description TEXT,
  p_priority TEXT,
  p_type TEXT,
  p_customer_email TEXT,
  p_status TEXT
) RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_ticket_id UUID;
BEGIN
  -- Insert ticket and get the ID
  INSERT INTO public.tickets (
    subject,
    description,
    priority,
    type,
    customer_email,
    status,
    created_by,
    updated_at
  ) VALUES (
    p_subject,
    p_description,
    p_priority,
    p_type,
    p_customer_email,
    p_status,
    auth.uid(),
    now()
  ) RETURNING id INTO v_ticket_id;
  
  RETURN json_build_object('ticket_id', v_ticket_id);
END;
$$;

-- Function to get ticket details
CREATE OR REPLACE FUNCTION public.get_ticket_details(
  p_ticket_id UUID
) RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result json;
BEGIN
  SELECT
    json_build_object(
      'id', t.id,
      'subject', t.subject,
      'description', t.description,
      'status', t.status,
      'priority', t.priority,
      'type', t.type,
      'created_at', t.created_at,
      'updated_at', t.updated_at,
      'created_by', t.created_by,
      'assigned_to', t.assigned_to,
      'customer_email', t.customer_email,
      'creator_details', (SELECT json_build_object('full_name', p.full_name) FROM profiles p WHERE p.id = t.created_by),
      'assignee_details', (SELECT json_build_object('full_name', p.full_name) FROM profiles p WHERE p.id = t.assigned_to)
    )
  INTO v_result
  FROM tickets t
  WHERE t.id = p_ticket_id;
  
  RETURN v_result;
END;
$$;

-- Function to list tickets with filtering
CREATE OR REPLACE FUNCTION public.list_tickets(
  p_filter TEXT DEFAULT 'all'
) RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result json;
BEGIN
  SELECT json_agg(
    json_build_object(
      'id', t.id,
      'subject', t.subject,
      'description', t.description,
      'status', t.status,
      'priority', t.priority,
      'type', t.type,
      'created_at', t.created_at,
      'updated_at', t.updated_at,
      'created_by', t.created_by,
      'assigned_to', t.assigned_to,
      'customer_email', t.customer_email,
      'creator_details', (SELECT json_build_object('full_name', p.full_name) FROM profiles p WHERE p.id = t.created_by),
      'assignee_details', (SELECT json_build_object('full_name', p.full_name) FROM profiles p WHERE p.id = t.assigned_to)
    )
  )
  INTO v_result
  FROM tickets t
  WHERE 
    CASE 
      WHEN p_filter = 'mine' THEN t.created_by = auth.uid()
      WHEN p_filter = 'assigned' THEN t.assigned_to = auth.uid()
      WHEN p_filter = 'open' THEN t.status = 'open'
      WHEN p_filter = 'pending' THEN t.status = 'pending'
      WHEN p_filter = 'closed' THEN t.status IN ('closed', 'resolved')
      ELSE true
    END
  ORDER BY t.created_at DESC;
  
  RETURN COALESCE(v_result, '[]'::json);
END;
$$;

-- Function to update ticket status
CREATE OR REPLACE FUNCTION public.update_ticket_status(
  p_ticket_id UUID,
  p_status TEXT
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE tickets 
  SET 
    status = p_status,
    updated_at = now()
  WHERE 
    id = p_ticket_id AND
    (created_by = auth.uid() OR assigned_to = auth.uid());
  
  RETURN FOUND;
END;
$$;

-- Function to assign ticket to the current user
CREATE OR REPLACE FUNCTION public.assign_ticket_to_me(
  p_ticket_id UUID
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE tickets 
  SET 
    assigned_to = auth.uid(),
    updated_at = now()
  WHERE 
    id = p_ticket_id;
  
  RETURN FOUND;
END;
$$;

-- Function to add a comment to a ticket
CREATE OR REPLACE FUNCTION public.add_ticket_comment(
  p_ticket_id UUID,
  p_content TEXT
) RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_comment_id UUID;
BEGIN
  -- Insert comment and get the ID
  INSERT INTO public.ticket_comments (
    ticket_id,
    content,
    created_by
  ) VALUES (
    p_ticket_id,
    p_content,
    auth.uid()
  ) RETURNING id INTO v_comment_id;
  
  -- Update the ticket's updated_at timestamp
  UPDATE tickets
  SET updated_at = now()
  WHERE id = p_ticket_id;
  
  RETURN json_build_object('comment_id', v_comment_id);
END;
$$;
