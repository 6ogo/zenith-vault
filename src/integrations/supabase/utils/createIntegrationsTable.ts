
import { supabase } from '../client';

export const createIntegrationsTable = async () => {
  try {
    // Instead of checking if the table exists, use the RPC function we created
    const { data, error } = await supabase.rpc('create_integrations_table');
    
    if (error) {
      console.error('Error creating integrations table:', error);
      return false;
    }
    
    if (data) {
      console.log('Integrations table created successfully');
    } else {
      console.log('Integrations table already exists');
    }
    
    return true;
  } catch (error) {
    console.error('Unexpected error setting up integrations table:', error);
    return false;
  }
};

export default createIntegrationsTable;
