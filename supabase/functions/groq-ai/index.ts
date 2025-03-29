
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
    
    const { prompt, model, temperature, maxTokens, feature, organizationId, embedding_input } = await req.json();
    
    // Check if this is an embedding request
    if (feature === "embedding") {
      console.log("Generating embedding for text");
      
      const embeddingInput = embedding_input || prompt;
      
      if (!embeddingInput) {
        throw new Error("No text provided for embedding generation");
      }
      
      // Use the appropriate embedding endpoint
      const response = await fetch('https://api.groq.com/openai/v1/embeddings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${groqApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "embedding-model-e5", // Using Groq's recommended embedding model
          input: embeddingInput
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('GROQ API embedding error:', errorData);
        throw new Error(`GROQ API embedding error: ${errorData.error?.message || 'Unknown error'}`);
      }
      
      const data = await response.json();
      console.log("Successfully generated embedding");
      
      return new Response(
        JSON.stringify({
          embedding: data.data[0].embedding,
          model: data.model,
          usage: data.usage
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }
    
    // Try to get organization's AI settings if organization ID is provided
    let orgSettings = null;
    if (organizationId) {
      const { data, error } = await supabase
        .from('organization_settings')
        .select('settings_value')
        .eq('organization_id', organizationId)
        .eq('settings_type', 'ai_configuration')
        .single();
      
      if (data && !error) {
        orgSettings = data.settings_value;
        console.log('Using organization AI settings:', orgSettings);
      }
    }
    
    // Default values - either use provided values, organization settings, or fallback defaults
    const aiModel = model || (orgSettings?.model) || 'llama3-8b-8192';
    const aiTemp = temperature ?? (orgSettings?.temperature) ?? 0.7;
    const aiMaxTokens = maxTokens || (orgSettings?.maxTokens) || 1024;
    
    console.log(`Processing ${feature} request with GROQ model: ${aiModel}`);

    let systemPrompt = "You are a helpful AI assistant for a business platform.";
    
    // Adjust system prompt based on feature
    switch (feature) {
      case 'sales':
        systemPrompt = "You are a sales assistant that helps with lead scoring, follow-ups, and sales predictions. Keep your responses focused on helpful business insights and actionable recommendations.";
        break;
      case 'customer_service':
        systemPrompt = "You are a customer service assistant that helps with sentiment analysis and providing helpful responses to inquiries. Focus on clarity, empathy, and practical solutions.";
        break;
      case 'marketing':
        systemPrompt = "You are a marketing assistant that helps with content generation and campaign optimization. Provide creative, audience-focused suggestions that align with marketing best practices.";
        break;
      case 'chatbot':
        systemPrompt = "You are Zenith Assistant, an AI chatbot for Zenith Vault - an all-in-one digital business platform. Answer user questions based on the context provided. If you don't know the answer, say so politely and suggest contacting support. Keep answers concise and professional. Always maintain a helpful, friendly tone.";
        break;
      default:
        // Keep default system prompt
        break;
    }

    // If org settings exist, add context about what data the AI can access
    if (orgSettings?.dataSources) {
      let dataContext = "You have access to the following data sources: ";
      if (orgSettings.dataSources.includes('sales_data')) {
        dataContext += "sales records, customer purchase history, and sales pipeline information; ";
      }
      if (orgSettings.dataSources.includes('customer_data')) {
        dataContext += "customer profiles, preferences, and interaction history; ";
      }
      if (orgSettings.dataSources.includes('marketing_data')) {
        dataContext += "marketing campaigns, content analytics, and engagement metrics; ";
      }
      if (orgSettings.dataSources.includes('service_data')) {
        dataContext += "support tickets, customer feedback, and service ratings; ";
      }
      systemPrompt += " " + dataContext;
    }

    // If org settings exist, add context about AI functions
    if (orgSettings?.enabledFunctions) {
      systemPrompt += " You can help with the following functions: ";
      if (orgSettings.enabledFunctions.includes('lead_scoring')) {
        systemPrompt += "lead scoring and prioritization, ";
      }
      if (orgSettings.enabledFunctions.includes('content_generation')) {
        systemPrompt += "marketing content creation, ";
      }
      if (orgSettings.enabledFunctions.includes('sentiment_analysis')) {
        systemPrompt += "customer sentiment analysis, ";
      }
      if (orgSettings.enabledFunctions.includes('sales_forecasting')) {
        systemPrompt += "sales trend forecasting, ";
      }
      // Remove trailing comma and space
      systemPrompt = systemPrompt.replace(/, $/, ".");
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: aiModel,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: aiTemp,
        max_tokens: aiMaxTokens,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('GROQ API error:', errorData);
      throw new Error(`GROQ API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const assistantResponse = data.choices[0].message.content;

    console.log(`Successfully generated response for ${feature}`);
    
    return new Response(
      JSON.stringify({ 
        response: assistantResponse,
        model: aiModel,
        usage: data.usage
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
    
  } catch (error) {
    console.error('Error in groq-ai function:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
