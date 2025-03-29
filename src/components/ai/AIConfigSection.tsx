
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import { Loader2 } from 'lucide-react';

const AIConfigSection = () => {
  const { user } = useAuth();
  const [isCheckingConfig, setIsCheckingConfig] = React.useState(false);
  const [isConfigured, setIsConfigured] = React.useState<boolean | null>(null);

  const checkAIConfiguration = async () => {
    setIsCheckingConfig(true);
    try {
      const { data, error } = await supabase.functions.invoke('groq-ai', {
        body: {
          prompt: "Hello, is the AI service configured properly?",
          feature: "general",
          maxTokens: 10
        }
      });

      if (error) {
        console.error('Error checking AI configuration:', error);
        setIsConfigured(false);
        toast({
          variant: "destructive",
          title: "AI Configuration Error",
          description: "The AI service is not configured properly. Please contact an administrator."
        });
      } else {
        setIsConfigured(true);
        toast({
          title: "AI Configuration Check",
          description: "The GROQ AI service is configured properly and ready to use."
        });
      }
    } catch (error) {
      console.error('Error in AI configuration check:', error);
      setIsConfigured(false);
      toast({
        variant: "destructive",
        title: "AI Configuration Error",
        description: error instanceof Error ? error.message : "An unknown error occurred"
      });
    } finally {
      setIsCheckingConfig(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <InfoCircledIcon className="h-5 w-5" />
          AI Configuration
        </CardTitle>
        <CardDescription>
          Check and manage your AI service integration
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-md bg-muted p-4">
          <p className="text-sm">
            This platform uses GROQ AI for various AI-powered features including sales insights, 
            customer service assistance, and marketing content generation. The AI service requires
            a valid API key to be configured by an administrator.
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Status:</p>
            <p className="text-sm text-muted-foreground">
              {isConfigured === null ? 'Not checked' : 
               isConfigured ? 'Configured properly' : 'Configuration issue detected'}
            </p>
          </div>
          <Button 
            onClick={checkAIConfiguration}
            disabled={isCheckingConfig}
            variant="outline"
          >
            {isCheckingConfig ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Checking...
              </>
            ) : (
              'Check Configuration'
            )}
          </Button>
        </div>

        {user?.user_metadata?.role === 'admin' && (
          <div className="pt-4 border-t">
            <p className="text-sm mb-2">
              <strong>Administrator Note:</strong> To configure the GROQ AI service, you need to set the GROQ_API_KEY 
              in your Supabase edge function secrets. Visit the Supabase dashboard to manage your secrets.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIConfigSection;
