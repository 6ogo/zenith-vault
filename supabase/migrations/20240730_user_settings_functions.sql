
-- Function to get user settings
CREATE OR REPLACE FUNCTION public.get_user_settings(p_user_id UUID)
RETURNS SETOF public.user_settings
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM public.user_settings
  WHERE user_id = p_user_id;
END;
$$;

-- Function to update user notification preferences
CREATE OR REPLACE FUNCTION public.update_user_notification_preferences(
  p_user_id UUID,
  p_preferences JSONB
)
RETURNS SETOF public.user_settings
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_settings_id UUID;
  v_result public.user_settings;
BEGIN
  -- Check if settings exist for this user
  SELECT id INTO v_settings_id
  FROM public.user_settings
  WHERE user_id = p_user_id;
  
  -- If settings don't exist, create them
  IF v_settings_id IS NULL THEN
    INSERT INTO public.user_settings (
      user_id,
      notification_preferences
    )
    VALUES (
      p_user_id,
      p_preferences
    )
    RETURNING * INTO v_result;
  ELSE
    -- Update existing settings
    UPDATE public.user_settings
    SET 
      notification_preferences = p_preferences,
      updated_at = NOW()
    WHERE id = v_settings_id
    RETURNING * INTO v_result;
  END IF;
  
  RETURN NEXT v_result;
END;
$$;

-- Function to update user interface preferences
CREATE OR REPLACE FUNCTION public.update_user_interface_preferences(
  p_user_id UUID,
  p_preferences JSONB
)
RETURNS SETOF public.user_settings
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_settings_id UUID;
  v_result public.user_settings;
BEGIN
  -- Check if settings exist for this user
  SELECT id INTO v_settings_id
  FROM public.user_settings
  WHERE user_id = p_user_id;
  
  -- If settings don't exist, create them
  IF v_settings_id IS NULL THEN
    INSERT INTO public.user_settings (
      user_id,
      interface_preferences
    )
    VALUES (
      p_user_id,
      p_preferences
    )
    RETURNING * INTO v_result;
  ELSE
    -- Update existing settings
    UPDATE public.user_settings
    SET 
      interface_preferences = p_preferences,
      updated_at = NOW()
    WHERE id = v_settings_id
    RETURNING * INTO v_result;
  END IF;
  
  RETURN NEXT v_result;
END;
$$;
