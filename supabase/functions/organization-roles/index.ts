
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
    console.log("Organization roles function called");
    
    // Get Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceRoleKey) {
      throw new Error("Missing Supabase environment variables");
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
    
    // Parse request body
    const requestBody = await req.json();
    console.log("Request body:", requestBody);
    
    const action = requestBody.action;
    
    if (!action) {
      // If no action is specified, look for the pattern in the URL (backward compatibility)
      const url = new URL(req.url);
      const pathParts = url.pathname.split('/').filter(Boolean);
      const endpoint = pathParts[pathParts.length - 1];
      
      if (endpoint) {
        console.log("Using endpoint from URL:", endpoint);
        return await handleAction(endpoint, requestBody.data || requestBody, supabase);
      } else {
        throw new Error("No action specified");
      }
    } else {
      // Use the action from the request body
      console.log("Using action from request body:", action);
      return await handleAction(action, requestBody, supabase);
    }
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

async function handleAction(action: string, data: any, supabase: any) {
  let responseBody = {};
  
  switch (action) {
    case 'get_organization_roles':
      // Get roles for an organization
      if (!data.organization_id) {
        throw new Error('Organization ID is required');
      }
      
      console.log(`Fetching roles for organization: ${data.organization_id}`);
      
      const { data: roles, error: rolesError } = await supabase
        .from('org_roles')
        .select('*')
        .eq('organization_id', data.organization_id);
        
      if (rolesError) {
        console.error("Error fetching roles:", rolesError);
        throw rolesError;
      }
      
      console.log(`Found ${roles?.length || 0} roles`);
      responseBody = roles;
      break;

    case 'get_role_permissions':
      // Get permissions for a role
      if (!data.role_id) {
        throw new Error('Role ID is required');
      }
      
      console.log(`Fetching permissions for role: ${data.role_id}`);
      
      const { data: permissions, error: permissionsError } = await supabase
        .from('role_permissions')
        .select('*')
        .eq('role_id', data.role_id);
        
      if (permissionsError) {
        console.error("Error fetching permissions:", permissionsError);
        throw permissionsError;
      }
      
      console.log(`Found ${permissions?.length || 0} permissions`);
      responseBody = permissions;
      break;

    case 'update_role_permissions':
      // Update permissions for a role
      if (!data.role_id || !data.permissions) {
        throw new Error('Role ID and permissions are required');
      }
      
      console.log(`Updating permissions for role: ${data.role_id}, ${data.permissions.length} permissions`);
      
      // First delete existing permissions
      const { error: deleteError } = await supabase
        .from('role_permissions')
        .delete()
        .eq('role_id', data.role_id);
        
      if (deleteError) {
        console.error("Error deleting existing permissions:", deleteError);
        throw deleteError;
      }
      
      // Then insert the new ones
      if (data.permissions.length > 0) {
        const permissionsToInsert = data.permissions.map((permission: any) => ({
          role_id: data.role_id,
          feature: permission.feature,
          can_read: permission.can_read,
          can_write: permission.can_write,
          is_hidden: permission.is_hidden
        }));
        
        const { error: insertError } = await supabase
          .from('role_permissions')
          .insert(permissionsToInsert);
          
        if (insertError) {
          console.error("Error inserting new permissions:", insertError);
          throw insertError;
        }
      }
      
      console.log("Permissions updated successfully");
      responseBody = { success: true };
      break;

    default:
      throw new Error(`Unknown action: ${action}`);
  }

  return new Response(
    JSON.stringify(responseBody),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200 
    }
  );
}
