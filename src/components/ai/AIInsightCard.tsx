
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Zap } from "lucide-react";
import { generateWithAI, AIRequestParams, AIResponse } from '@/services/ai';
import { toast } from '@/hooks/use-toast';

interface AIInsightCardProps {
  title: string;
  description: string;
  placeholder: string;
  feature?: 'sales' | 'customer_service' | 'marketing' | 'general';
}

const AIInsightCard = ({ 
  title, 
  description, 
  placeholder,
  feature = 'general'
}: AIInsightCardProps) => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateInsight = async () => {
    if (!prompt.trim()) {
      toast({
        variant: "destructive",
        title: "Prompt is required",
        description: "Please enter a prompt to generate insights."
      });
      return;
    }

    setIsLoading(true);
    setResponse('');

    try {
      const result = await generateWithAI({
        prompt,
        feature
      });
      
      setResponse(result.response);
      
      toast({
        title: "AI Insight Generated",
        description: `Generated using ${result.model} (${result.usage.total_tokens} tokens used)`
      });
    } catch (error) {
      console.error('Error generating AI insight:', error);
      toast({
        variant: "destructive",
        title: "Error generating insight",
        description: error instanceof Error ? error.message : "An unknown error occurred"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder={placeholder}
          className="min-h-24"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isLoading}
        />
        
        {response && (
          <div className="p-4 border rounded-md bg-muted/50">
            <p className="whitespace-pre-wrap">{response}</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleGenerateInsight} 
          disabled={isLoading || !prompt.trim()}
          className="ml-auto"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Zap className="mr-2 h-4 w-4" />
              Generate Insight
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AIInsightCard;
