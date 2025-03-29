
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
    const { question, conversationId, messageHistory = [] } = await req.json();
    
    if (!question) {
      throw new Error('No question provided');
    }
    
    console.log(`Processing chatbot query: ${question.substring(0, 50)}...`);
    
    // Generate embedding for the question
    const embeddingResponse = await fetch('https://api.groq.com/openai/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "text-embedding-ada-002",
        input: question
      }),
    });
    
    if (!embeddingResponse.ok) {
      const errorData = await embeddingResponse.json();
      console.error('GROQ API embedding error:', errorData);
      throw new Error(`GROQ API embedding error: ${errorData.error?.message || 'Unknown error'}`);
    }
    
    const embeddingData = await embeddingResponse.json();
    const embedding = embeddingData.data[0].embedding;
    
    // Perform similarity search to find relevant knowledge base entries
    const { data: matches, error: matchError } = await supabase.rpc(
      'match_knowledge_base',
      {
        query_embedding: embedding,
        match_threshold: 0.7,
        match_count: 5
      }
    );
    
    if (matchError) {
      console.error('Error performing similarity search:', matchError);
      throw new Error(`Error performing similarity search: ${matchError.message}`);
    }
    
    // Build context from matches
    let context = "";
    if (matches && matches.length > 0) {
      // Group by type for better organization
      const faqMatches = matches.filter(match => match.type === 'faq');
      const docMatches = matches.filter(match => match.type === 'documentation');
      
      if (docMatches.length > 0) {
        context += "Here's some helpful information from our documentation:\n";
        docMatches.forEach(match => {
          context += `- ${match.title}: ${match.content}\n`;
        });
        context += "\n";
      }
      
      if (faqMatches.length > 0) {
        context += "Here are some frequently asked questions that may be relevant:\n";
        faqMatches.forEach(match => {
          context += `- ${match.title}: ${match.content}\n`;
        });
        context += "\n";
      }
    } else {
      context = "I don't have specific information about this in my knowledge base. I'll try to provide a general answer.\n\n";
    }
    
    // Build conversation history for context
    let conversationContext = "";
    if (messageHistory && messageHistory.length > 0) {
      conversationContext = "This is the recent conversation history:\n";
      
      // Only use up to the last 5 messages to avoid token limits
      const recentMessages = messageHistory.slice(-5);
      recentMessages.forEach(msg => {
        const role = msg.role === 'user' ? 'User' : 'Assistant';
        conversationContext += `${role}: ${msg.content}\n`;
      });
      
      conversationContext += "\n";
    }
    
    // Build the complete prompt
    const prompt = `You are Zenith Assistant, an AI chatbot for Zenith Vault - an all-in-one digital business platform.
    
${context}

${conversationContext}

Answer the following question concisely and professionally. If the information isn't in the provided context and you're uncertain, say so politely and suggest contacting support for more assistance.

User question: ${question}`;
    
    // Log token usage
    console.log(`Prompt length: ${prompt.length} characters`);
    
    // Send the prompt to GROQ API
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "llama3-8b-8192", // Fast, good balance of quality and performance
        messages: [
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('GROQ API error:', errorData);
      throw new Error(`GROQ API error: ${errorData.error?.message || 'Unknown error'}`);
    }
    
    const data = await response.json();
    const assistantResponse = data.choices[0].message.content;
    
    // Save the conversation and messages if conversation ID is provided
    if (conversationId) {
      // Check if conversation exists
      const { data: convData, error: convError } = await supabase
        .from('chat_conversations')
        .select('id')
        .eq('id', conversationId)
        .single();
      
      // If conversation doesn't exist or there was an error, don't attempt to save messages
      if (convError || !convData) {
        console.warn(`Conversation with ID ${conversationId} not found or error: ${convError?.message}`);
      } else {
        // Save user message
        const { error: userMsgError } = await supabase
          .from('chat_messages')
          .insert({
            conversation_id: conversationId,
            role: 'user',
            content: question
          });
          
        if (userMsgError) {
          console.error('Error saving user message:', userMsgError);
        }
        
        // Save assistant message
        const { error: assistantMsgError } = await supabase
          .from('chat_messages')
          .insert({
            conversation_id: conversationId,
            role: 'assistant',
            content: assistantResponse
          });
          
        if (assistantMsgError) {
          console.error('Error saving assistant message:', assistantMsgError);
        }
        
        // Update conversation last updated time
        const { error: updateError } = await supabase
          .from('chat_conversations')
          .update({ updated_at: new Date().toISOString() })
          .eq('id', conversationId);
          
        if (updateError) {
          console.error('Error updating conversation timestamp:', updateError);
        }
      }
    }
    
    // Prepare sources info for citation
    const sources = matches && matches.length > 0 
      ? matches.slice(0, 3).map(match => ({
          title: match.title,
          type: match.type,
          similarity: match.similarity
        }))
      : [];
    
    console.log(`Successfully generated chatbot response`);
    
    return new Response(
      JSON.stringify({ 
        response: assistantResponse,
        sources: sources,
        model: "llama3-8b-8192",
        usage: data.usage
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
