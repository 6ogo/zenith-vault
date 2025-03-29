
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface EmailIntegrationCardProps {
  provider: 'Mailchimp' | 'SendGrid';
  status: 'connected' | 'disconnected';
  apiKey?: string;
  onConnect: () => void;
  onDisconnect: () => void;
  onApiKeyChange?: (apiKey: string) => void;
}

const EmailIntegrationCard = ({
  provider,
  status,
  apiKey,
  onConnect,
  onDisconnect,
  onApiKeyChange
}: EmailIntegrationCardProps) => {
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{provider}</CardTitle>
          <Badge variant={status === 'connected' ? 'success' : 'outline'}>
            {status === 'connected' ? 'Connected' : 'Disconnected'}
          </Badge>
        </div>
        <CardDescription>Email marketing integration</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {status === 'connected' && (
            <div className="flex items-center justify-between">
              <Label htmlFor={`${provider.toLowerCase()}-active`}>Active</Label>
              <Switch 
                id={`${provider.toLowerCase()}-active`} 
                defaultChecked={true} 
              />
            </div>
          )}
          
          <div className="text-sm">
            <p className="mb-2">
              Integrate with {provider} to manage your email marketing campaigns directly from within the platform.
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        {status === 'connected' ? (
          <Button variant="destructive" onClick={onDisconnect} className="w-full">
            Disconnect
          </Button>
        ) : (
          <Button onClick={onConnect} className="w-full">
            Connect {provider}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default EmailIntegrationCard;
