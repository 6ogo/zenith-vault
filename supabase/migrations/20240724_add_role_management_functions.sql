
-- Function to get all organization roles
CREATE OR REPLACE FUNCTION public.get_organization_roles(organization_id UUID)
RETURNS SETOF public.org_roles AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM public.org_roles
  WHERE org_roles.organization_id = get_organization_roles.organization_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get role permissions
CREATE OR REPLACE FUNCTION public.get_role_permissions(role_id UUID)
RETURNS SETOF public.role_permissions AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM public.role_permissions
  WHERE role_permissions.role_id = get_role_permissions.role_id;
END;
$$ LANGUAGE plpgsql;

-- Function to update a role
CREATE OR REPLACE FUNCTION public.update_organization_role(
  p_role_id UUID,
  p_name TEXT,
  p_description TEXT
)
RETURNS public.org_roles AS $$
DECLARE
  updated_role public.org_roles;
BEGIN
  UPDATE public.org_roles
  SET 
    name = p_name,
    description = p_description,
    updated_at = NOW()
  WHERE id = p_role_id
  RETURNING * INTO updated_role;
  
  RETURN updated_role;
END;
$$ LANGUAGE plpgsql;

-- Function to update member's role
CREATE OR REPLACE FUNCTION public.update_member_role(
  p_member_id UUID,
  p_role_id UUID
)
RETURNS public.organization_members AS $$
DECLARE
  updated_member public.organization_members;
BEGIN
  UPDATE public.organization_members
  SET 
    role_id = p_role_id
  WHERE id = p_member_id
  RETURNING * INTO updated_member;
  
  RETURN updated_member;
END;
$$ LANGUAGE plpgsql;
