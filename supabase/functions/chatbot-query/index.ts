
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
    // Get environment variables
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
    const requestData = await req.json();
    const { question, conversationId, messageHistory, organization_id, service_case_id } = requestData;
    
    if (!question) {
      throw new Error('No question provided');
    }
    
    console.log(`Processing question: "${question.substring(0, 50)}..."`);
    
    // Use GROQ's text-embeddings-model instead of LLaMA for embeddings
    const embeddingResponse = await fetch('https://api.groq.com/openai/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'text-embedding-3-small', // Using text-embedding model instead of llama
        input: question
      }),
    });
    
    if (!embeddingResponse.ok) {
      const errorData = await embeddingResponse.json();
      throw new Error(`GROQ API error: ${errorData.error?.message || 'Unknown error'}`);
    }
    
    const embeddingData = await embeddingResponse.json();
    const embedding = embeddingData.data[0].embedding;
    
    // Query Supabase for similar content
    // If organization_id is provided, prioritize organization-specific content
    let query = supabase
      .rpc('match_documents', {
        query_embedding: embedding,
        match_threshold: 0.5,
        match_count: 5
      });
    
    // If organization_id is provided, filter by that organization or null (general content)
    if (organization_id) {
      // We want both organization-specific content AND general content
      query = supabase
        .rpc('match_documents', {
          query_embedding: embedding,
          match_threshold: 0.5,
          match_count: 10
        })
        .or(`organization_id.eq.${organization_id},organization_id.is.null`);
    }
    
    const { data: similarDocuments, error: searchError } = await query;
    
    if (searchError) {
      throw new Error(`Error searching for similar documents: ${searchError.message}`);
    }
    
    // Prepare context from similar documents
    let context = "";
    const sources = [];
    
    if (similarDocuments && similarDocuments.length > 0) {
      // Sort by similarity and prioritize organization-specific content
      const sortedDocuments = similarDocuments.sort((a, b) => {
        // If one is organization-specific and the other is not, prioritize the organization-specific one
        if (a.organization_id === organization_id && b.organization_id !== organization_id) return -1;
        if (a.organization_id !== organization_id && b.organization_id === organization_id) return 1;
        // Otherwise, sort by similarity
        return b.similarity - a.similarity;
      });
      
      // Take the top 5 for context
      const topDocuments = sortedDocuments.slice(0, 5);
      
      context = topDocuments.map(doc => 
        `Title: ${doc.title}\nContent: ${doc.content}`
      ).join('\n\n');
      
      // Prepare sources for the response
      sources.push(...topDocuments.map(doc => ({
        title: doc.title,
        type: doc.type,
        similarity: doc.similarity
      })));
    }
    
    // Prepare conversation history if available
    let conversationContext = "";
    if (messageHistory && messageHistory.length > 0) {
      conversationContext = "Previous Messages:\n" + messageHistory.map(msg => 
        `${msg.role}: ${msg.content}`
      ).join('\n');
    }
    
    // Prepare specific context for service cases
    let serviceCaseContext = "";
    if (service_case_id) {
      // Fetch service case details
      const { data: serviceCase, error: serviceCaseError } = await supabase
        .from('service_cases')
        .select('*')
        .eq('id', service_case_id)
        .single();
      
      if (!serviceCaseError && serviceCase) {
        serviceCaseContext = `
Service Case Details:
Case ID: ${serviceCase.id}
Subject: ${serviceCase.subject}
Description: ${serviceCase.description}
Status: ${serviceCase.status}
Priority: ${serviceCase.priority}
        `;
      }
    }
    
    // Create a system prompt
    const systemPrompt = `You are Zenith Assistant, a helpful AI assistant for Zenith Vault users. Your primary goal is to provide clear, accurate, and concise information based on the knowledge base provided to you.

${organization_id ? "You are helping users of a specific organization. Prioritize organization-specific information when available." : ""}
${service_case_id ? "You are helping with a specific service case. Provide tailored support for resolving this issue." : ""}

Please follow these guidelines:
1. Answer based ONLY on the information provided in the context. If you don't know, say so clearly.
2. Do not make up information or links.
3. Keep responses concise and to the point.
4. For technical instructions, provide step-by-step guidance.
5. Be conversational but professional.
6. If the question is beyond the scope of Zenith Vault, politely explain this.`;

    // Build complete prompt
    let completePrompt = systemPrompt;
    
    if (context) {
      completePrompt += "\n\nKnowledge Base Context:\n" + context;
    }
    
    if (serviceCaseContext) {
      completePrompt += "\n\n" + serviceCaseContext;
    }
    
    if (conversationContext) {
      completePrompt += "\n\n" + conversationContext;
    }
    
    completePrompt += "\n\nUser Question: " + question;
    
    // Call GROQ for AI response
    const completionResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-70b-8192',
        messages: [
          { role: 'system', content: systemPrompt },
          ...(messageHistory || []).map(msg => ({ 
            role: msg.role, 
            content: msg.content 
          })),
          { role: 'user', content: question }
        ],
        temperature: 0.5,
        max_tokens: 1000,
      }),
    });
    
    if (!completionResponse.ok) {
      const errorData = await completionResponse.json();
      throw new Error(`GROQ API error: ${errorData.error?.message || 'Unknown error'}`);
    }
    
    const completionData = await completionResponse.json();
    const answer = completionData.choices[0].message.content;
    
    // Save the conversation message if conversationId is provided
    if (conversationId) {
      // Save user message
      await supabase
        .from('chat_messages')
        .insert({
          conversation_id: conversationId,
          role: 'user',
          content: question
        });
      
      // Save assistant message
      await supabase
        .from('chat_messages')
        .insert({
          conversation_id: conversationId,
          role: 'assistant',
          content: answer,
          metadata: { sources }
        });
    }
    
    return new Response(
      JSON.stringify({
        response: answer,
        sources: sources,
        model: completionData.model,
        usage: completionData.usage
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
    
  } catch (error) {
    console.error('Error in chatbot-query function:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
