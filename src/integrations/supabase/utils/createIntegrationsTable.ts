
import { supabase } from '../client';

export const createIntegrationsTable = async () => {
  try {
    // Check if the table already exists
    const { data: tableExists, error: tableCheckError } = await supabase
      .from('pg_tables')
      .select('tablename')
      .eq('schemaname', 'public')
      .eq('tablename', 'integrations');

    if (tableCheckError) {
      console.error('Error checking if integrations table exists:', tableCheckError);
      return false;
    }

    // If the table doesn't exist, create it
    if (!tableExists || tableExists.length === 0) {
      // We'll use raw SQL for table creation to ensure all constraints are set correctly
      const { error: createTableError } = await supabase.rpc('create_integrations_table');
      
      if (createTableError) {
        console.error('Error creating integrations table:', createTableError);
        return false;
      }
      
      console.log('Integrations table created successfully');
      return true;
    }
    
    console.log('Integrations table already exists');
    return true;
  } catch (error) {
    console.error('Unexpected error setting up integrations table:', error);
    return false;
  }
};

export default createIntegrationsTable;
