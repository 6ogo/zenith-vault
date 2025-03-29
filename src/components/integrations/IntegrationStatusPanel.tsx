
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCcw, CheckCircle, XCircle, Settings, Trash2 } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface IntegrationStatus {
  id: string;
  name: string;
  category: string;
  status: 'connected' | 'error' | 'syncing';
  lastSync: string;
}

// Mock data - in a real implementation, this would come from your state management or API
const mockIntegrations: IntegrationStatus[] = [
  { 
    id: 'mailchimp-1', 
    name: 'Mailchimp', 
    category: 'Email',
    status: 'connected',
    lastSync: '2023-07-15T14:32:21Z'
  },
  { 
    id: 'salesforce-1', 
    name: 'Salesforce', 
    category: 'CRM',
    status: 'error',
    lastSync: '2023-07-14T09:15:43Z'
  },
  { 
    id: 'aws-s3-1', 
    name: 'AWS S3', 
    category: 'Storage',
    status: 'syncing',
    lastSync: '2023-07-15T16:45:12Z'
  }
];

const IntegrationStatusPanel = () => {
  const { toast } = useToast();
  const [integrations, setIntegrations] = useState<IntegrationStatus[]>(mockIntegrations);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleSyncClick = (integrationId: string) => {
    setIntegrations(prev => 
      prev.map(integration => 
        integration.id === integrationId 
          ? { ...integration, status: 'syncing' as const } 
          : integration
      )
    );

    toast({
      title: "Sync initiated",
      description: "Synchronizing data, this might take a few moments.",
    });

    // Simulate sync completion
    setTimeout(() => {
      setIntegrations(prev => 
        prev.map(integration => 
          integration.id === integrationId 
            ? { 
                ...integration, 
                status: 'connected' as const,
                lastSync: new Date().toISOString()
              } 
            : integration
        )
      );

      toast({
        title: "Sync completed",
        description: "Data has been successfully synchronized.",
      });
    }, 2500);
  };

  const handleRemoveClick = (integrationId: string) => {
    toast({
      title: "Confirm deletion",
      description: "This will remove the integration. Are you sure?",
      action: (
        <Button 
          variant="destructive" 
          onClick={() => {
            setIntegrations(prev => prev.filter(i => i.id !== integrationId));
            toast({
              title: "Integration removed",
              description: "The integration has been successfully removed.",
            });
          }}
        >
          Remove
        </Button>
      )
    });
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Active Integrations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {integrations.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No active integrations. Connect a service to get started.
            </p>
          ) : (
            integrations.map((integration) => (
              <div 
                key={integration.id} 
                className="p-3 border rounded-md flex items-center justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{integration.name}</span>
                    <Badge 
                      variant={
                        integration.status === 'connected' ? 'success' : 
                        integration.status === 'error' ? 'destructive' : 
                        'outline'
                      }
                      className="text-xs"
                    >
                      {integration.status === 'connected' ? 'Connected' : 
                       integration.status === 'error' ? 'Error' : 
                       'Syncing...'}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center space-x-1">
                    <span>Last sync:</span>
                    <span>{formatDate(integration.lastSync)}</span>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7"
                          onClick={() => handleSyncClick(integration.id)}
                          disabled={integration.status === 'syncing'}
                        >
                          <RefreshCcw className={`h-4 w-4 ${integration.status === 'syncing' ? 'animate-spin' : ''}`} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Sync data</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7"
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Configure</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 text-destructive hover:text-destructive"
                          onClick={() => handleRemoveClick(integration.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Remove</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default IntegrationStatusPanel;
