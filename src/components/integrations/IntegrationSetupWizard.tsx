
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, AlertTriangle, Shield, Link, Database, Server, Key } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Integration {
  id: string;
  name: string;
  logoUrl: string;
  isCustom?: boolean;
}

interface IntegrationSetupWizardProps {
  integration: Integration;
  onClose: () => void;
}

const IntegrationSetupWizard = ({ integration, onClose }: IntegrationSetupWizardProps) => {
  const { toast } = useToast();
  
  // Wizard state
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    apiKey: '',
    apiSecret: '',
    apiUrl: integration.isCustom ? '' : `https://api.${integration.id.toLowerCase().replace('-', '')}.com/v1`,
    webhookUrl: '',
    username: '',
    password: '',
    databaseName: '',
    serverAddress: '',
    port: integration.id === 'postgres' ? '5432' : integration.id === 'mysql' ? '3306' : '27017'
  });

  // Connection test state
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);
  const [connectionMethod, setConnectionMethod] = useState<'api' | 'oauth' | 'database'>('api');

  const totalSteps = 3;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleTestConnection = () => {
    setTesting(true);
    setTestResult(null);
    
    // Simulate API call
    setTimeout(() => {
      // 80% chance of success for demo purposes
      const success = Math.random() > 0.2;
      
      setTesting(false);
      setTestResult(success ? 'success' : 'error');
      
      if (success) {
        toast({
          title: "Connection successful",
          description: `Successfully connected to ${integration.name}.`,
        });
      } else {
        toast({
          title: "Connection failed",
          description: "Please check your credentials and try again.",
          variant: "destructive",
        });
      }
    }, 2000);
  };

  const handleFinish = () => {
    toast({
      title: "Integration completed",
      description: `${integration.name} has been successfully integrated.`,
    });
    onClose();
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Step 1: Connection Method</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Choose how you want to connect to {integration.name}
            </p>
            
            <Tabs defaultValue="api" value={connectionMethod} onValueChange={(value) => setConnectionMethod(value as 'api' | 'oauth' | 'database')}>
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="api">API Keys</TabsTrigger>
                <TabsTrigger value="oauth">OAuth</TabsTrigger>
                <TabsTrigger value="database" disabled={!['postgres', 'mysql', 'mongodb'].includes(integration.id)}>
                  Database
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="api" className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center">
                      <Key className="mr-2 h-4 w-4" />
                      API Authentication
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-3">
                      <div className="grid gap-2">
                        <Label htmlFor="apiKey">API Key</Label>
                        <Input 
                          id="apiKey"
                          name="apiKey"
                          value={formData.apiKey}
                          onChange={handleInputChange}
                          placeholder="Enter your API key"
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="apiSecret">API Secret</Label>
                        <Input 
                          id="apiSecret"
                          name="apiSecret"
                          type="password"
                          value={formData.apiSecret}
                          onChange={handleInputChange}
                          placeholder="Enter your API secret"
                        />
                      </div>
                      
                      {integration.isCustom && (
                        <div className="grid gap-2">
                          <Label htmlFor="apiUrl">API URL</Label>
                          <Input 
                            id="apiUrl"
                            name="apiUrl"
                            value={formData.apiUrl}
                            onChange={handleInputChange}
                            placeholder="https://api.example.com/v1"
                          />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                <div className="flex items-center px-3 py-2 bg-muted rounded-md">
                  <Shield className="h-4 w-4 mr-2 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">
                    Your API credentials are encrypted before storage and never shared.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="oauth" className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center">
                      <Link className="mr-2 h-4 w-4" />
                      OAuth Authentication
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-4">
                      <Button className="mb-4">
                        Connect with {integration.name}
                      </Button>
                      <p className="text-xs text-muted-foreground">
                        You'll be redirected to {integration.name} to authorize access to your account.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="database" className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center">
                      <Database className="mr-2 h-4 w-4" />
                      Database Connection
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-3">
                      <div className="grid gap-2">
                        <Label htmlFor="serverAddress">Server Address</Label>
                        <Input 
                          id="serverAddress"
                          name="serverAddress"
                          value={formData.serverAddress}
                          onChange={handleInputChange}
                          placeholder="localhost or db.example.com"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div className="grid gap-2">
                          <Label htmlFor="port">Port</Label>
                          <Input 
                            id="port"
                            name="port"
                            value={formData.port}
                            onChange={handleInputChange}
                          />
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="databaseName">Database Name</Label>
                          <Input 
                            id="databaseName"
                            name="databaseName"
                            value={formData.databaseName}
                            onChange={handleInputChange}
                            placeholder="my_database"
                          />
                        </div>
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="username">Username</Label>
                        <Input 
                          id="username"
                          name="username"
                          value={formData.username}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input 
                          id="password"
                          name="password"
                          type="password"
                          value={formData.password}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="flex items-center px-3 py-2 bg-muted rounded-md">
                  <Server className="h-4 w-4 mr-2 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">
                    Make sure your database server allows remote connections from our IP addresses.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Step 2: Test Connection</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Verify that your credentials work correctly before proceeding
            </p>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  {testResult === null ? (
                    <div className="py-6">
                      <Button 
                        onClick={handleTestConnection} 
                        disabled={testing || 
                          (connectionMethod === 'api' && (!formData.apiKey || (integration.isCustom && !formData.apiUrl))) ||
                          (connectionMethod === 'database' && (!formData.serverAddress || !formData.username || !formData.databaseName))
                        }
                        className="mb-3"
                      >
                        {testing ? "Testing..." : "Test Connection"}
                      </Button>
                      <p className="text-sm text-muted-foreground">
                        This will validate your credentials with {integration.name}
                      </p>
                    </div>
                  ) : testResult === 'success' ? (
                    <div className="py-6 space-y-3">
                      <div className="flex justify-center">
                        <div className="bg-success/20 h-16 w-16 rounded-full flex items-center justify-center">
                          <CheckCircle2 className="h-8 w-8 text-success" />
                        </div>
                      </div>
                      <h3 className="text-lg font-medium">Connection Successful</h3>
                      <p className="text-sm text-muted-foreground">
                        Successfully connected to {integration.name}. You can now proceed to the next step.
                      </p>
                    </div>
                  ) : (
                    <div className="py-6 space-y-3">
                      <div className="flex justify-center">
                        <div className="bg-destructive/20 h-16 w-16 rounded-full flex items-center justify-center">
                          <AlertTriangle className="h-8 w-8 text-destructive" />
                        </div>
                      </div>
                      <h3 className="text-lg font-medium">Connection Failed</h3>
                      <p className="text-sm text-muted-foreground">
                        Unable to connect to {integration.name}. Please check your credentials and try again.
                      </p>
                      <Button 
                        onClick={handleTestConnection} 
                        variant="outline"
                        className="mt-2"
                      >
                        Retry Connection
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Step 3: Configuration & Finalize</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Configure additional options and complete the integration
            </p>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Webhook Configuration (Optional)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3">
                  <div className="grid gap-2">
                    <Label htmlFor="webhookUrl">Webhook URL</Label>
                    <Input 
                      id="webhookUrl"
                      name="webhookUrl"
                      value={formData.webhookUrl}
                      onChange={handleInputChange}
                      placeholder="https://example.com/webhook"
                    />
                    <p className="text-xs text-muted-foreground">
                      If provided, events from {integration.name} will be sent to this URL
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Data Mapping</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm">Customer ID</span>
                    <span className="text-sm text-muted-foreground">→ Contact ID</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm">Email</span>
                    <span className="text-sm text-muted-foreground">→ Email Address</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm">Phone</span>
                    <span className="text-sm text-muted-foreground">→ Phone Number</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm">Lead Score</span>
                    <span className="text-sm text-muted-foreground">→ Lead Rating</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="mt-4">
                  Customize Mapping
                </Button>
              </CardContent>
            </Card>
            
            <Alert>
              <AlertDescription>
                All data will be encrypted and stored securely. You can modify these settings anytime from the integration dashboard.
              </AlertDescription>
            </Alert>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span>Configure {integration.name} Integration</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex items-center justify-center my-2">
          <div className="flex items-center w-full max-w-md">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <React.Fragment key={index}>
                <div className="flex flex-col items-center">
                  <div 
                    className={`rounded-full h-8 w-8 flex items-center justify-center ${
                      step > index + 1 ? 'bg-primary text-primary-foreground' : 
                      step === index + 1 ? 'bg-primary text-primary-foreground' : 
                      'bg-muted text-muted-foreground'
                    }`}
                  >
                    {step > index + 1 ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <div className="text-xs mt-1 text-center">
                    {index === 0 ? 'Connection' : index === 1 ? 'Test' : 'Configure'}
                  </div>
                </div>
                {index < totalSteps - 1 && (
                  <div 
                    className={`h-0.5 flex-1 mx-2 ${
                      step > index + 1 ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
        
        <Separator className="my-2" />
        
        <div className="py-2">
          {renderStep()}
        </div>
        
        <DialogFooter>
          <div className="flex justify-between w-full">
            <Button 
              variant="outline" 
              onClick={step === 1 ? onClose : handleBack}
            >
              {step === 1 ? 'Cancel' : 'Back'}
            </Button>
            
            <Button 
              onClick={step === totalSteps ? handleFinish : handleNext}
              disabled={(step === 1 && connectionMethod === 'api' && !formData.apiKey) || 
                        (step === 2 && testResult !== 'success')}
            >
              {step === totalSteps ? 'Finish' : 'Continue'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default IntegrationSetupWizard;
