
import { supabase } from "@/integrations/supabase/client";

export interface AIRequestParams {
  prompt: string;
  feature?: 'sales' | 'customer_service' | 'marketing' | 'general' | 'reports' | 'chatbot' | 'embedding';
  model?: string;
  temperature?: number;
  maxTokens?: number;
  organizationId?: string;
  embedding_input?: string;
}

export interface AIResponse {
  response: string;
  model: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  sources?: {
    title: string;
    type: string;
    similarity: number;
  }[];
}

export const generateWithAI = async (params: AIRequestParams): Promise<AIResponse> => {
  try {
    // Get current user to retrieve organization ID if available
    const { data: { user } } = await supabase.auth.getUser();
    const organizationId = params.organizationId || user?.user_metadata?.organization_id;
    
    const { data, error } = await supabase.functions.invoke('groq-ai', {
      body: {
        prompt: params.prompt,
        feature: params.feature || 'general',
        model: params.model,
        temperature: params.temperature,
        maxTokens: params.maxTokens,
        organizationId,
        embedding_input: params.embedding_input
      }
    });

    if (error) {
      console.error('Error calling AI service:', error);
      throw new Error(error.message);
    }

    return data as AIResponse;
  } catch (error) {
    console.error('Error in generateWithAI:', error);
    throw error;
  }
}

export const generateEmbedding = async (text: string): Promise<number[]> => {
  try {
    const { data, error } = await supabase.functions.invoke('groq-ai', {
      body: {
        prompt: '',
        feature: 'embedding',
        embedding_input: text
      }
    });

    if (error) {
      console.error('Error generating embedding:', error);
      throw new Error(error.message);
    }

    return data.embedding;
  } catch (error) {
    console.error('Error in generateEmbedding:', error);
    throw error;
  }
}

export interface ChatbotQueryParams {
  question: string;
  conversationId?: string;
  messageHistory?: Array<{role: 'user' | 'assistant', content: string}>;
  organization_id?: string;
  service_case_id?: string;
}

export const queryChatbot = async (params: ChatbotQueryParams): Promise<AIResponse> => {
  try {
    const { data, error } = await supabase.functions.invoke('chatbot-query', {
      body: params
    });

    if (error) {
      console.error('Error calling chatbot service:', error);
      throw new Error(error.message);
    }

    return data as AIResponse;
  } catch (error) {
    console.error('Error in queryChatbot:', error);
    throw error;
  }
}

export interface KnowledgeBaseEntry {
  title: string;
  content: string;
}

export interface IngestKnowledgeBaseResponse {
  success: boolean;
  processed: number;
  total: number;
  errors?: string[];
}

export interface ChatbotQueryResponse {
  response: string;
  sources?: {
    title: string;
    type: string;
    similarity: number;
  }[];
  model?: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface ChatbotQueryRequest {
  question: string;
  conversationId?: string;
  messageHistory?: { role: 'user' | 'assistant', content: string }[];
  organization_id?: string;
  service_case_id?: string;
}

/**
 * Add entries to the knowledge base
 */
export const ingestKnowledgeBase = async (
  entries: { title: string; content: string }[],
  type: 'faq' | 'documentation',
  organization_id?: string
): Promise<IngestKnowledgeBaseResponse> => {
  try {
    const { data, error } = await supabase.functions.invoke('knowledge-ingestion', {
      body: { entries, type, organization_id }
    });
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error ingesting knowledge base entries:', error);
    return {
      success: false,
      processed: 0,
      total: entries.length,
      errors: [error.message || 'Unknown error occurred']
    };
  }
};

/**
 * Query the chatbot with a question
 */
export const queryChatbot = async (request: ChatbotQueryRequest): Promise<ChatbotQueryResponse> => {
  try {
    const { data, error } = await supabase.functions.invoke('chatbot-query', {
      body: request
    });
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error querying chatbot:', error);
    throw error;
  }
};

export const generateSalesInsight = (prompt: string) => 
  generateWithAI({ prompt, feature: 'sales' });

export const analyzeCustomerSentiment = (prompt: string) => 
  generateWithAI({ prompt, feature: 'customer_service' });

export const generateMarketingContent = (prompt: string) => 
  generateWithAI({ prompt, feature: 'marketing' });

export const generateReportInsight = (prompt: string) =>
  generateWithAI({ prompt, feature: 'reports' });
