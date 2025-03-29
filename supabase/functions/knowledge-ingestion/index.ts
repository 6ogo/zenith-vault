
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
    const { entries, type } = await req.json();
    
    if (!entries || !Array.isArray(entries) || entries.length === 0) {
      throw new Error('No entries provided for ingestion');
    }
    
    if (!type || (type !== 'faq' && type !== 'documentation')) {
      throw new Error('Invalid type provided. Must be "faq" or "documentation"');
    }
    
    console.log(`Ingesting ${entries.length} ${type} entries`);
    
    // Process each entry
    const results = [];
    
    for (const entry of entries) {
      // Validate entry
      if (type === 'faq' && (!entry.question || !entry.answer)) {
        console.warn('Skipping invalid FAQ entry:', entry);
        continue;
      }
      
      if (type === 'documentation' && (!entry.title || !entry.content)) {
        console.warn('Skipping invalid documentation entry:', entry);
        continue;
      }
      
      // Prepare content based on entry type
      const title = type === 'faq' ? entry.question : entry.title;
      const content = type === 'faq' ? entry.answer : entry.content;
      
      // Generate embedding for the content
      const embeddingResponse = await fetch('https://api.groq.com/openai/v1/embeddings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${groqApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "text-embedding-ada-002",
          input: `${title} ${content}`
        }),
      });
      
      if (!embeddingResponse.ok) {
        const errorData = await embeddingResponse.json();
        console.error('GROQ API embedding error:', errorData);
        throw new Error(`GROQ API embedding error: ${errorData.error?.message || 'Unknown error'}`);
      }
      
      const embeddingData = await embeddingResponse.json();
      const embedding = embeddingData.data[0].embedding;
      
      // Save the entry to the knowledge base
      const { data, error } = await supabase
        .from('knowledge_base')
        .insert({
          title,
          content,
          type,
          embedding
        })
        .select();
      
      if (error) {
        console.error('Error inserting knowledge base entry:', error);
        throw new Error(`Error inserting knowledge base entry: ${error.message}`);
      }
      
      results.push(data[0]);
      console.log(`Successfully ingested entry: ${title.substring(0, 30)}...`);
    }
    
    return new Response(
      JSON.stringify({ 
        success: true,
        message: `Successfully ingested ${results.length} entries`,
        processed: results.length,
        total: entries.length
      }),
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
