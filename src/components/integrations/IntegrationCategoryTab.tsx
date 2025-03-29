
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import IntegrationSetupWizard from './IntegrationSetupWizard';
import { Plus, ExternalLink, Link2 } from 'lucide-react';
import { useDataMode } from '@/contexts/DataModeContext';
import { supabase } from '@/integrations/supabase/client';

interface Integration {
  id: string;
  name: string;
  logoUrl: string;
  isCustom?: boolean;
  description?: string;
  docsUrl?: string;
}

interface IntegrationCategoryTabProps {
  category: string;
  description: string;
  integrations: Integration[];
}

const IntegrationCategoryTab = ({ 
  category,
  description,
  integrations 
}: IntegrationCategoryTabProps) => {
  const { toast } = useToast();
  const [setupIntegration, setSetupIntegration] = useState<Integration | null>(null);
  const { isRealData } = useDataMode();
  const [isConnecting, setIsConnecting] = useState<string | null>(null);

  const handleSetupClick = (integration: Integration) => {
    setSetupIntegration(integration);
  };

  // Close the setup wizard
  const handleCloseWizard = () => {
    setSetupIntegration(null);
  };

  const handleConnectIntegration = async (integration: Integration) => {
    if (!isRealData) {
      // Demo mode just shows toast and opens setup wizard
      toast({
        title: "Demo Mode",
        description: `In a real environment, this would connect to ${integration.name}.`,
      });
      handleSetupClick(integration);
      return;
    }

    setIsConnecting(integration.id);
    
    try {
      // In real data mode, we would attempt to connect to the integration
      toast({
        title: "Connecting...",
        description: `Initiating connection to ${integration.name}`,
      });

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // For now, we'll simulate a success scenario
      // In a real implementation, this would involve OAuth flows or API key setup
      toast({
        title: "Connection Initiated",
        description: `Please complete the authentication process for ${integration.name}`,
      });
      
      // Open the setup wizard to complete the connection process
      handleSetupClick(integration);
    } catch (error) {
      console.error(`Error connecting to ${integration.name}:`, error);
      toast({
        title: "Connection Failed",
        description: `Could not connect to ${integration.name}. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsConnecting(null);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="mb-4">
          <h3 className="text-lg font-medium">{category}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {integrations.map((integration) => (
            <Card key={integration.id} className="border border-border">
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center space-x-3">
                  <div className="bg-background rounded-md h-10 w-10 flex items-center justify-center border">
                    <img 
                      src={integration.logoUrl} 
                      alt={integration.name} 
                      className="h-6 w-6" 
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.svg';
                      }}
                    />
                  </div>
                  <CardTitle className="text-base">{integration.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-2 pb-2">
                <p className="text-sm text-muted-foreground">
                  {integration.description || (integration.isCustom 
                    ? `Configure a custom ${category.toLowerCase()} integration with our API.` 
                    : `Connect your ${integration.name} account to enable AI-powered automation.`)}
                </p>
              </CardContent>
              <CardFooter className="p-4 pt-2 flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                <Button 
                  className="w-full sm:w-auto" 
                  onClick={() => handleConnectIntegration(integration)}
                  variant={integration.isCustom ? "outline" : "default"}
                  disabled={isConnecting === integration.id}
                >
                  {isConnecting === integration.id ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Connecting...
                    </>
                  ) : integration.isCustom ? (
                    <>
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Configure Custom
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Connect
                    </>
                  )}
                </Button>
                
                {integration.docsUrl && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs"
                    onClick={() => window.open(integration.docsUrl, '_blank')}
                  >
                    <Link2 className="mr-1 h-3 w-3" />
                    Documentation
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </Card>

      {setupIntegration && (
        <IntegrationSetupWizard 
          integration={setupIntegration}
          onClose={handleCloseWizard}
          isRealData={isRealData}
        />
      )}
    </div>
  );
};

export default IntegrationCategoryTab;
