
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Bot, Lightbulb, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryChatbot } from "@/services/ai";
import { useAuth } from "@/contexts/AuthContext";

interface ServiceCaseAIHelperProps {
  serviceCaseId: string;
  caseSubject: string;
  caseDescription: string;
}

const ServiceCaseAIHelper = ({ serviceCaseId, caseSubject, caseDescription }: ServiceCaseAIHelperProps) => {
  const [question, setQuestion] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const organizationId = user?.user_metadata?.organization_id;

  const handleAskAI = async () => {
    if (!question.trim()) return;

    try {
      setIsLoading(true);
      
      const result = await queryChatbot({
        question: question,
        organization_id: organizationId,
        service_case_id: serviceCaseId,
      });

      setResponse(result.response);
    } catch (error) {
      console.error('Error getting AI response:', error);
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = async (suggestedQuestion: string) => {
    setQuestion(suggestedQuestion);
    try {
      setIsLoading(true);
      
      const result = await queryChatbot({
        question: suggestedQuestion,
        organization_id: organizationId,
        service_case_id: serviceCaseId,
      });

      setResponse(result.response);
    } catch (error) {
      console.error('Error getting AI response:', error);
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Generate suggested questions based on the case details
  const suggestedQuestions = [
    `How do I resolve "${caseSubject.substring(0, 30)}${caseSubject.length > 30 ? '...' : ''}"?`,
    "What are the next steps I should take?",
    "What information should I collect from the customer?",
    "What common solutions can I try?",
  ];

  return (
    <Card className="mt-4">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-xl">
          <Bot className="h-5 w-5 mr-2 text-primary" />
          AI Assistance
        </CardTitle>
        <CardDescription>
          Get AI-powered help with this service case
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {!response && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium flex items-center">
                <Lightbulb className="h-4 w-4 mr-1 text-primary" />
                Suggested Questions
              </h4>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((q, i) => (
                  <Button 
                    key={i}
                    variant="outline" 
                    size="sm"
                    className="text-xs"
                    onClick={() => handleSuggestionClick(q)}
                    disabled={isLoading}
                  >
                    {q}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Textarea
              placeholder="Ask for help with this case..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={2}
              className="resize-none"
            />
            <div className="flex justify-end">
              <Button 
                size="sm" 
                onClick={handleAskAI}
                disabled={!question.trim() || isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                ) : (
                  <Send className="h-4 w-4 mr-1" />
                )}
                Ask AI
              </Button>
            </div>
          </div>

          {response && (
            <div className="rounded-md border p-4 mt-4">
              <h4 className="text-sm font-medium mb-2 flex items-center">
                <Bot className="h-4 w-4 mr-1 text-primary" />
                AI Response
              </h4>
              <div className="text-sm whitespace-pre-wrap">
                {response}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceCaseAIHelper;
