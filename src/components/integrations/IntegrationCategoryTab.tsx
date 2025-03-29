
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import IntegrationSetupWizard from './IntegrationSetupWizard';
import { Plus, ExternalLink } from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  logoUrl: string;
  isCustom?: boolean;
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

  const handleSetupClick = (integration: Integration) => {
    setSetupIntegration(integration);
  };

  // Close the setup wizard
  const handleCloseWizard = () => {
    setSetupIntegration(null);
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
                  {integration.isCustom 
                    ? `Configure a custom ${category.toLowerCase()} integration with our API.` 
                    : `Connect your ${integration.name} account to enable AI-powered automation.`}
                </p>
              </CardContent>
              <CardFooter className="p-4 pt-2">
                <Button 
                  className="w-full" 
                  onClick={() => handleSetupClick(integration)}
                  variant={integration.isCustom ? "outline" : "default"}
                >
                  {integration.isCustom ? (
                    <>
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Configure Custom
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Quick Connect
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </Card>

      {setupIntegration && (
        <IntegrationSetupWizard 
          integration={setupIntegration}
          onClose={handleCloseWizard}
        />
      )}
    </div>
  );
};

export default IntegrationCategoryTab;
