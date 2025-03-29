
-- Create the function to create the integrations table
CREATE OR REPLACE FUNCTION public.create_integrations_table()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if the table exists
  IF NOT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'integrations'
  ) THEN
    -- Create the integrations table
    CREATE TABLE public.integrations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      provider VARCHAR(255) NOT NULL,
      provider_id VARCHAR(255),
      provider_type VARCHAR(50),
      status VARCHAR(50) NOT NULL DEFAULT 'disconnected',
      config JSONB,
      last_sync TIMESTAMP WITH TIME ZONE,
      sync_status VARCHAR(50),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      user_id UUID REFERENCES auth.users(id)
    );

    -- Add RLS policies
    ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;

    -- Users can only see their own integrations
    CREATE POLICY "Users can view their own integrations" 
      ON public.integrations 
      FOR SELECT 
      USING (auth.uid() = user_id);

    -- Users can only insert their own integrations
    CREATE POLICY "Users can create their own integrations" 
      ON public.integrations 
      FOR INSERT 
      WITH CHECK (auth.uid() = user_id);

    -- Users can only update their own integrations
    CREATE POLICY "Users can update their own integrations" 
      ON public.integrations 
      FOR UPDATE 
      USING (auth.uid() = user_id);

    -- Users can only delete their own integrations
    CREATE POLICY "Users can delete their own integrations" 
      ON public.integrations 
      FOR DELETE 
      USING (auth.uid() = user_id);

    -- Add a trigger to update the updated_at column
    CREATE TRIGGER set_integrations_updated_at
    BEFORE UPDATE ON public.integrations
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

    RETURN TRUE;
  ELSE
    RETURN FALSE;
  END IF;
END;
$$;
