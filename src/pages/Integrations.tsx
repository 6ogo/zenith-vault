
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import EmailIntegrationCard from '@/components/integrations/EmailIntegrationCard';
import CRMIntegrationCard from '@/components/integrations/CRMIntegrationCard';
import ERPIntegrationCard from '@/components/integrations/ERPIntegrationCard';
import { useToast } from '@/hooks/use-toast';

const Integrations = () => {
  const [activeTab, setActiveTab] = useState("email");
  const { toast } = useToast();

  // Mock integration status 
  const [integrations, setIntegrations] = useState({
    mailchimp: { status: 'disconnected' as const },
    sendgrid: { status: 'disconnected' as const },
    salesforce: { status: 'disconnected' as const },
    hubspot: { status: 'disconnected' as const },
    sap: { status: 'disconnected' as const },
    netsuite: { status: 'disconnected' as const },
  });

  const handleConnect = (provider: string) => {
    // In a real implementation, this would trigger an OAuth flow or API key input
    toast({
      title: "Connection initiated",
      description: `Starting connection process for ${provider}...`,
    });

    // Mock successful connection after a delay
    setTimeout(() => {
      setIntegrations(prev => ({
        ...prev,
        [provider.toLowerCase()]: { status: 'connected' }
      }));

      toast({
        title: "Connection successful",
        description: `${provider} has been successfully connected`,
      });
    }, 1500);
  };

  const handleDisconnect = (provider: string) => {
    toast({
      title: "Disconnecting",
      description: `Disconnecting from ${provider}...`,
    });

    // Mock disconnect
    setTimeout(() => {
      setIntegrations(prev => ({
        ...prev,
        [provider.toLowerCase()]: { status: 'disconnected' }
      }));

      toast({
        title: "Disconnected",
        description: `${provider} has been disconnected`,
      });
    }, 1000);
  };

  return (
    <div className="space-y-6 w-full">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Integrations</h1>
          <p className="text-muted-foreground mt-2">
            Connect your third-party services to enhance your workflow
          </p>
        </div>
      </div>

      <Alert className="mb-6">
        <Info className="h-4 w-4" />
        <AlertTitle>Integration Status</AlertTitle>
        <AlertDescription>
          Connect your third-party services to enhance your workflow and data management capabilities.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="email" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="email">Email Marketing</TabsTrigger>
          <TabsTrigger value="crm">CRM</TabsTrigger>
          <TabsTrigger value="erp">ERP</TabsTrigger>
        </TabsList>

        <TabsContent value="email" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <EmailIntegrationCard
              provider="Mailchimp"
              status={integrations.mailchimp.status}
              onConnect={() => handleConnect('Mailchimp')}
              onDisconnect={() => handleDisconnect('Mailchimp')}
            />

            <EmailIntegrationCard
              provider="SendGrid"
              status={integrations.sendgrid.status}
              onConnect={() => handleConnect('SendGrid')}
              onDisconnect={() => handleDisconnect('SendGrid')}
            />
          </div>
        </TabsContent>

        <TabsContent value="crm" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <CRMIntegrationCard
              provider="Salesforce"
              status={integrations.salesforce.status}
              onConnect={() => handleConnect('Salesforce')}
              onDisconnect={() => handleDisconnect('Salesforce')}
            />

            <CRMIntegrationCard
              provider="HubSpot"
              status={integrations.hubspot.status}
              onConnect={() => handleConnect('HubSpot')}
              onDisconnect={() => handleDisconnect('HubSpot')}
            />
          </div>
        </TabsContent>

        <TabsContent value="erp" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <ERPIntegrationCard
              provider="SAP"
              status={integrations.sap.status}
              onConnect={() => handleConnect('SAP')}
              onDisconnect={() => handleDisconnect('SAP')}
            />

            <ERPIntegrationCard
              provider="NetSuite"
              status={integrations.netsuite.status}
              onConnect={() => handleConnect('NetSuite')}
              onDisconnect={() => handleDisconnect('NetSuite')}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Integrations;
