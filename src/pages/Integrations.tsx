
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, HelpCircle, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import EmailIntegrationCard from '@/components/integrations/EmailIntegrationCard';
import CRMIntegrationCard from '@/components/integrations/CRMIntegrationCard';
import ERPIntegrationCard from '@/components/integrations/ERPIntegrationCard';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const Integrations = () => {
  const [activeTab, setActiveTab] = useState("email");
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Mock integration status 
  const [integrations, setIntegrations] = useState({
    // Email marketing
    mailchimp: { status: 'disconnected' as const },
    sendgrid: { status: 'disconnected' as const },
    customEmail: { status: 'disconnected' as const },
    
    // CRM
    salesforce: { status: 'disconnected' as const },
    hubspot: { status: 'disconnected' as const },
    customCRM: { status: 'disconnected' as const },
    
    // ERP
    sap: { status: 'disconnected' as const },
    netsuite: { status: 'disconnected' as const },
    customERP: { status: 'disconnected' as const },
    
    // Database
    mysql: { status: 'disconnected' as const },
    postgres: { status: 'disconnected' as const },
    supabase: { status: 'disconnected' as const },
    customDB: { status: 'disconnected' as const },
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

  const handleHelpClick = () => {
    navigate('/documentation');
  };

  // Custom integration component for Database connections
  const DatabaseIntegrationCard = ({ provider, status, onConnect, onDisconnect }) => {
    const [showApiForm, setShowApiForm] = useState(false);
    const [apiKey, setApiKey] = useState('');
    const [apiEndpoint, setApiEndpoint] = useState('');
    
    const handleSubmit = (e) => {
      e.preventDefault();
      onConnect(provider);
      setShowApiForm(false);
      setApiKey('');
      setApiEndpoint('');
    };
    
    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">{provider}</CardTitle>
              <CardDescription>Database Integration</CardDescription>
            </div>
            {status === 'connected' ? (
              <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 px-2 py-1 rounded text-xs font-medium">
                Connected
              </div>
            ) : (
              <div className="bg-gray-100 dark:bg-gray-800 text-gray-500 px-2 py-1 rounded text-xs font-medium">
                Disconnected
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {status === 'connected' ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Your {provider} database is connected and ready to use.
              </p>
              <Button variant="destructive" size="sm" onClick={() => onDisconnect(provider)}>
                Disconnect
              </Button>
            </div>
          ) : showApiForm ? (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="connection-string">Connection String</Label>
                <Input 
                  id="connection-string" 
                  value={apiEndpoint} 
                  onChange={(e) => setApiEndpoint(e.target.value)} 
                  placeholder={`${provider.toLowerCase()}://user:password@host:port/database`}
                />
              </div>
              
              {provider !== 'Custom' && (
                <div className="space-y-1">
                  <Label htmlFor="api-key">API Key (if required)</Label>
                  <Input 
                    id="api-key" 
                    value={apiKey} 
                    onChange={(e) => setApiKey(e.target.value)} 
                    placeholder="Enter API key if needed"
                  />
                </div>
              )}
              
              <div className="flex gap-2 justify-end">
                <Button variant="outline" size="sm" onClick={() => setShowApiForm(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm">
                  Connect
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Connect your {provider} database for data integration.
              </p>
              <Button variant="outline" size="sm" onClick={() => setShowApiForm(true)}>
                Configure
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  // Custom API Integration component
  const CustomAPIIntegrationCard = ({ type, provider, status, onConnect, onDisconnect }) => {
    const [showApiForm, setShowApiForm] = useState(false);
    const [apiKey, setApiKey] = useState('');
    const [apiEndpoint, setApiEndpoint] = useState('');
    
    const handleSubmit = (e) => {
      e.preventDefault();
      onConnect(provider);
      setShowApiForm(false);
      setApiKey('');
      setApiEndpoint('');
    };
    
    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">{provider}</CardTitle>
              <CardDescription>Custom {type} Integration</CardDescription>
            </div>
            {status === 'connected' ? (
              <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 px-2 py-1 rounded text-xs font-medium">
                Connected
              </div>
            ) : (
              <div className="bg-gray-100 dark:bg-gray-800 text-gray-500 px-2 py-1 rounded text-xs font-medium">
                Disconnected
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {status === 'connected' ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Your custom {type} integration is connected and ready to use.
              </p>
              <Button variant="destructive" size="sm" onClick={() => onDisconnect(provider)}>
                Disconnect
              </Button>
            </div>
          ) : showApiForm ? (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="api-endpoint">API Endpoint</Label>
                <Input 
                  id="api-endpoint" 
                  value={apiEndpoint} 
                  onChange={(e) => setApiEndpoint(e.target.value)} 
                  placeholder="https://api.example.com/v1"
                />
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="api-key">API Key</Label>
                <Input 
                  id="api-key" 
                  value={apiKey} 
                  onChange={(e) => setApiKey(e.target.value)} 
                  placeholder="Enter your API key"
                />
              </div>
              
              <div className="flex gap-2 justify-end">
                <Button variant="outline" size="sm" onClick={() => setShowApiForm(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm">
                  Connect
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Configure a custom {type} integration with your own API endpoint.
              </p>
              <Button variant="outline" size="sm" onClick={() => setShowApiForm(true)}>
                Configure
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Integrations</h1>
          <p className="text-muted-foreground">
            Connect your third-party services to enhance your workflow
          </p>
        </div>
        <Button variant="outline" onClick={handleHelpClick}>
          <HelpCircle className="h-4 w-4 mr-2" />
          Documentation
        </Button>
      </div>
      
      <Alert className="mb-6">
        <Info className="h-4 w-4" />
        <AlertTitle>Integration Status</AlertTitle>
        <AlertDescription>
          Connect your third-party services to enhance your workflow and data management capabilities.
        </AlertDescription>
      </Alert>
      
      <Tabs defaultValue="email" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="email">Email Marketing</TabsTrigger>
          <TabsTrigger value="crm">CRM</TabsTrigger>
          <TabsTrigger value="erp">ERP</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
        </TabsList>
        
        <TabsContent value="email" className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
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
            
            <CustomAPIIntegrationCard 
              type="Email Marketing"
              provider="Custom" 
              status={integrations.customEmail.status}
              onConnect={() => handleConnect('customEmail')}
              onDisconnect={() => handleDisconnect('customEmail')}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="crm" className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
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
            
            <CustomAPIIntegrationCard 
              type="CRM"
              provider="Custom" 
              status={integrations.customCRM.status}
              onConnect={() => handleConnect('customCRM')}
              onDisconnect={() => handleDisconnect('customCRM')}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="erp" className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
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
            
            <CustomAPIIntegrationCard 
              type="ERP"
              provider="Custom" 
              status={integrations.customERP.status}
              onConnect={() => handleConnect('customERP')}
              onDisconnect={() => handleDisconnect('customERP')}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="database" className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <DatabaseIntegrationCard 
              provider="MySQL" 
              status={integrations.mysql.status}
              onConnect={() => handleConnect('mysql')}
              onDisconnect={() => handleDisconnect('mysql')}
            />
            
            <DatabaseIntegrationCard 
              provider="PostgreSQL" 
              status={integrations.postgres.status}
              onConnect={() => handleConnect('postgres')}
              onDisconnect={() => handleDisconnect('postgres')}
            />
            
            <DatabaseIntegrationCard 
              provider="Supabase" 
              status={integrations.supabase.status}
              onConnect={() => handleConnect('supabase')}
              onDisconnect={() => handleDisconnect('supabase')}
            />
            
            <DatabaseIntegrationCard 
              provider="Custom" 
              status={integrations.customDB.status}
              onConnect={() => handleConnect('customDB')}
              onDisconnect={() => handleDisconnect('customDB')}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Integrations;
