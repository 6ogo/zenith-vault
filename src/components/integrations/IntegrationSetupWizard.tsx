
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Integration {
  id: string;
  name: string;
  logoUrl: string;
  isCustom?: boolean;
  description?: string;
  docsUrl?: string;
}

interface IntegrationSetupWizardProps {
  integration: Integration;
  onClose: () => void;
  isRealData?: boolean;
}

const IntegrationSetupWizard = ({ 
  integration, 
  onClose,
  isRealData = false
}: IntegrationSetupWizardProps) => {
  const [activeTab, setActiveTab] = useState("connect");
  const [apiKey, setApiKey] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleConnect = async () => {
    if (!apiKey && !webhookUrl) {
      toast({
        title: "Validation Error",
        description: "Please provide an API Key or Webhook URL",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      if (isRealData) {
        // In real data mode, we would save the integration to Supabase
        const { error } = await supabase
          .from('integrations')
          .insert({
            provider: integration.name,
            provider_id: integration.id,
            config: {
              api_key: apiKey ? `***${apiKey.slice(-4)}` : null, // Store masked key for UI
              webhook_url: webhookUrl || null
            },
            status: 'connected'
          })
          .select();

        if (error) throw error;

        toast({
          title: "Connection Successful",
          description: `Successfully connected to ${integration.name}`,
        });
      } else {
        // In demo mode, we just simulate success
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast({
          title: "Demo Connection",
          description: `In a real environment, ${integration.name} would now be connected.`,
        });
      }

      onClose();
    } catch (error) {
      console.error("Error saving integration:", error);
      toast({
        title: "Connection Failed",
        description: `Could not save ${integration.name} connection. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Set Up {integration.name}</DialogTitle>
          <DialogDescription>
            Configure your {integration.name} integration to enable seamless data flow and automation
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full py-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="connect">Connect</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="connect" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="grid w-full gap-2">
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder={`Enter your ${integration.name} API Key`}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  The API key will be encrypted and stored securely.
                </p>
              </div>
              
              {integration.isCustom && (
                <div className="grid w-full gap-2">
                  <Label htmlFor="webhookUrl">Webhook URL (Optional)</Label>
                  <Input
                    id="webhookUrl"
                    type="text"
                    placeholder="https://api.example.com/webhook"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    The webhook URL for receiving data from this integration.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4 mt-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Data Synchronization</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="syncContacts" className="rounded" defaultChecked />
                  <Label htmlFor="syncContacts">Sync Contacts</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="syncEvents" className="rounded" defaultChecked />
                  <Label htmlFor="syncEvents">Sync Events</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="syncMessages" className="rounded" defaultChecked />
                  <Label htmlFor="syncMessages">Sync Messages</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="syncFiles" className="rounded" />
                  <Label htmlFor="syncFiles">Sync Files</Label>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Sync Frequency</h3>
              <div className="grid grid-cols-1 gap-2">
                <select className="w-full p-2 border rounded-md">
                  <option value="15">Every 15 minutes</option>
                  <option value="30">Every 30 minutes</option>
                  <option value="60">Every hour</option>
                  <option value="360">Every 6 hours</option>
                  <option value="720">Every 12 hours</option>
                  <option value="1440">Daily</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Advanced Settings</h3>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="enableWebhooks" className="rounded" defaultChecked />
                <Label htmlFor="enableWebhooks">Enable Webhooks</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="enableAIInsights" className="rounded" defaultChecked />
                <Label htmlFor="enableAIInsights">Enable AI Insights</Label>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConnect} disabled={isLoading}>
            {isLoading ? 'Connecting...' : 'Connect Integration'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default IntegrationSetupWizard;
