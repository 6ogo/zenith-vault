
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
    const groqApiKey = Deno.env.get('GROQ_API_KEY');
    if (!groqApiKey) {
      throw new Error('GROQ_API_KEY is not configured in environment variables');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    // Create a Supabase client with the service role key
    const supabase = createClient(
      supabaseUrl || "",
      supabaseServiceRoleKey || ""
    );
    
    // Get the request body
    const { entries, type, organization_id } = await req.json();
    
    if (!entries || !Array.isArray(entries) || entries.length === 0) {
      throw new Error('No entries provided or invalid format');
    }
    
    if (!type || !['faq', 'documentation'].includes(type)) {
      throw new Error('Invalid entry type. Must be "faq" or "documentation"');
    }
    
    console.log(`Processing ${entries.length} entries of type '${type}'${organization_id ? ` for organization ${organization_id}` : ''}`);
    
    // Process results
    const results = {
      success: true,
      processed: 0,
      total: entries.length,
      errors: []
    };
    
    // Process each entry
    for (const entry of entries) {
      try {
        if (!entry.title || !entry.content) {
          throw new Error('Entry missing title or content');
        }
        
        // Generate embedding for the content (combination of title and content for better context)
        const embeddingText = `${entry.title}\n${entry.content}`;
        
        // Call the embedding API
        const embeddingResponse = await fetch('https://api.groq.com/openai/v1/embeddings', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${groqApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'text-embedding-ada-002',
            input: embeddingText
          }),
        });
        
        if (!embeddingResponse.ok) {
          const errorData = await embeddingResponse.json();
          throw new Error(`GROQ API error: ${errorData.error?.message || 'Unknown error'}`);
        }
        
        const embeddingData = await embeddingResponse.json();
        const embedding = embeddingData.data[0].embedding;
        
        // Store in Supabase
        const insertData = {
          title: entry.title,
          content: entry.content,
          type: type,
          embedding: embedding,
          organization_id: organization_id || null
        };
        
        const { error: insertError } = await supabase
          .from('knowledge_base')
          .insert(insertData);
        
        if (insertError) {
          throw new Error(`Error inserting into Supabase: ${insertError.message}`);
        }
        
        results.processed++;
      } catch (error) {
        console.error(`Error processing entry: ${error.message}`);
        results.errors.push(error.message);
      }
    }
    
    results.success = results.processed > 0;
    
    return new Response(
      JSON.stringify(results),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
    
  } catch (error) {
    console.error('Error in knowledge-ingestion function:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
