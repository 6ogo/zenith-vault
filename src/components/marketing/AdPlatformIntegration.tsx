
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';

interface AdPlatformData {
  name: string;
  logo: string;
  description: string;
  status: 'connected' | 'disconnected';
}

interface AdPlatformIntegrationProps {
  platform: AdPlatformData;
  onConnect: (platformName: string, credentials: any) => void;
  onDisconnect: (platformName: string) => void;
}

const AdPlatformIntegration = ({
  platform,
  onConnect,
  onDisconnect
}: AdPlatformIntegrationProps) => {
  const [showConnectForm, setShowConnectForm] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [accountId, setAccountId] = useState('');
  const { toast } = useToast();
  
  const handleConnect = () => {
    if (!apiKey) {
      toast({
        title: 'Missing API key',
        description: 'Please enter your API key to connect',
        variant: 'destructive',
      });
      return;
    }
    
    const credentials = {
      apiKey,
      apiSecret,
      accountId
    };
    
    onConnect(platform.name, credentials);
    setShowConnectForm(false);
    setApiKey('');
    setApiSecret('');
    setAccountId('');
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img 
              src={platform.logo} 
              alt={`${platform.name} logo`} 
              className="w-6 h-6"
              onError={(e) => {
                // If image fails to load, show first letter of platform name
                e.currentTarget.outerHTML = `<div class="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">${platform.name.charAt(0)}</div>`;
              }}
            />
            <CardTitle className="text-lg">{platform.name}</CardTitle>
          </div>
          <Badge variant={platform.status === 'connected' ? 'success' : 'outline'}>
            {platform.status === 'connected' ? 'Connected' : 'Disconnected'}
          </Badge>
        </div>
        <CardDescription>{platform.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {platform.status === 'connected' && (
            <div className="flex items-center justify-between">
              <Label htmlFor={`${platform.name.toLowerCase()}-active`}>Active</Label>
              <Switch 
                id={`${platform.name.toLowerCase()}-active`} 
                defaultChecked={true} 
              />
            </div>
          )}
          
          {showConnectForm && (
            <div className="space-y-3 pt-2">
              <div>
                <Label htmlFor={`${platform.name.toLowerCase()}-api-key`}>API Key</Label>
                <Input 
                  id={`${platform.name.toLowerCase()}-api-key`}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder={`${platform.name} API Key`}
                  type="password"
                />
              </div>
              
              {platform.name !== 'Google Ads' && (
                <div>
                  <Label htmlFor={`${platform.name.toLowerCase()}-api-secret`}>API Secret</Label>
                  <Input 
                    id={`${platform.name.toLowerCase()}-api-secret`}
                    value={apiSecret}
                    onChange={(e) => setApiSecret(e.target.value)}
                    placeholder={`${platform.name} API Secret`}
                    type="password"
                  />
                </div>
              )}
              
              <div>
                <Label htmlFor={`${platform.name.toLowerCase()}-account-id`}>
                  {platform.name === 'Google Ads' ? 'Customer ID' : 
                   platform.name === 'Meta Ads' ? 'Ad Account ID' : 
                   'Account ID'}
                </Label>
                <Input 
                  id={`${platform.name.toLowerCase()}-account-id`}
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                  placeholder={platform.name === 'Google Ads' ? '123-456-7890' : 'Enter your account ID'}
                />
              </div>
              
              <div className="pt-2 flex space-x-2 justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => setShowConnectForm(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleConnect}>
                  Connect
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        {platform.status === 'connected' ? (
          <Button variant="destructive" onClick={() => onDisconnect(platform.name)} className="w-full">
            Disconnect
          </Button>
        ) : (
          <Button 
            onClick={() => showConnectForm ? handleConnect() : setShowConnectForm(true)} 
            className="w-full"
          >
            {showConnectForm ? 'Connect' : `Connect ${platform.name}`}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default AdPlatformIntegration;
