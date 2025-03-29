
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface ERPIntegrationCardProps {
  provider: 'SAP' | 'NetSuite';
  status: 'connected' | 'disconnected';
  onConnect: () => void;
  onDisconnect: () => void;
}

const ERPIntegrationCard = ({
  provider,
  status,
  onConnect,
  onDisconnect
}: ERPIntegrationCardProps) => {
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{provider}</CardTitle>
          <Badge variant={status === 'connected' ? 'success' : 'outline'}>
            {status === 'connected' ? 'Connected' : 'Disconnected'}
          </Badge>
        </div>
        <CardDescription>ERP system integration</CardDescription>
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
              Integrate with {provider} to streamline your enterprise resource planning and business operations.
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

export default ERPIntegrationCard;
