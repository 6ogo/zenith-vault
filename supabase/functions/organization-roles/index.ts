
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const supabase = createClient(
      supabaseUrl || "",
      supabaseServiceRoleKey || ""
    );

    const url = new URL(req.url);
    const pathParts = url.pathname.split('/').filter(Boolean);
    const endpoint = pathParts[pathParts.length - 1];

    let responseBody = {};
    const { data: requestData } = await req.json();

    switch (endpoint) {
      case 'get_organization_roles':
        // Get roles for an organization
        if (!requestData.organization_id) {
          throw new Error('Organization ID is required');
        }
        
        const { data: roles, error: rolesError } = await supabase
          .from('org_roles')
          .select('*')
          .eq('organization_id', requestData.organization_id);
          
        if (rolesError) throw rolesError;
        responseBody = roles;
        break;

      case 'get_role_permissions':
        // Get permissions for a role
        if (!requestData.role_id) {
          throw new Error('Role ID is required');
        }
        
        const { data: permissions, error: permissionsError } = await supabase
          .from('role_permissions')
          .select('*')
          .eq('role_id', requestData.role_id);
          
        if (permissionsError) throw permissionsError;
        responseBody = permissions;
        break;

      case 'update_role_permissions':
        // Update permissions for a role
        if (!requestData.role_id || !requestData.permissions) {
          throw new Error('Role ID and permissions are required');
        }
        
        // First delete existing permissions
        const { error: deleteError } = await supabase
          .from('role_permissions')
          .delete()
          .eq('role_id', requestData.role_id);
          
        if (deleteError) throw deleteError;
        
        // Then insert the new ones
        const { error: insertError } = await supabase
          .from('role_permissions')
          .insert(requestData.permissions.map((permission: any) => ({
            role_id: requestData.role_id,
            feature: permission.feature,
            can_read: permission.can_read,
            can_write: permission.can_write,
            is_hidden: permission.is_hidden
          })));
          
        if (insertError) throw insertError;
        responseBody = { success: true };
        break;

      default:
        throw new Error(`Unknown endpoint: ${endpoint}`);
    }

    return new Response(
      JSON.stringify(responseBody),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error(`Error in organization-roles function:`, error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
