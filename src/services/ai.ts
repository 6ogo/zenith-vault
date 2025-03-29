
import { supabase } from "@/integrations/supabase/client";

export interface AIRequestParams {
  prompt: string;
  feature?: 'sales' | 'customer_service' | 'marketing' | 'general';
  model?: string;
  temperature?: number;
  maxTokens?: number;
  organizationId?: string;
}

export interface AIResponse {
  response: string;
  model: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
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
        organizationId
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

// Helper functions for specific features
export const generateSalesInsight = (prompt: string) => 
  generateWithAI({ prompt, feature: 'sales' });

export const analyzeCustomerSentiment = (prompt: string) => 
  generateWithAI({ prompt, feature: 'customer_service' });

export const generateMarketingContent = (prompt: string) => 
  generateWithAI({ prompt, feature: 'marketing' });
