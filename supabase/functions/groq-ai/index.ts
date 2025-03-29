import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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

    const { prompt, model, temperature, maxTokens, feature } = await req.json();
    
    // Default values
    const aiModel = model || 'llama3-8b-8192';
    const aiTemp = temperature || 0.7;
    const aiMaxTokens = maxTokens || 1024;
    
    console.log(`Processing ${feature} request with GROQ model: ${aiModel}`);

    let systemPrompt = "You are a helpful AI assistant for a business platform.";
    
    // Adjust system prompt based on feature
    switch (feature) {
      case 'sales':
        systemPrompt = "You are a sales assistant that helps with lead scoring, follow-ups, and sales predictions.";
        break;
      case 'customer_service':
        systemPrompt = "You are a customer service assistant that helps with sentiment analysis and providing helpful responses.";
        break;
      case 'marketing':
        systemPrompt = "You are a marketing assistant that helps with content generation and campaign optimization.";
        break;
      default:
        // Keep default system prompt
        break;
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
