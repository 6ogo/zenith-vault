
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useDataMode } from "@/contexts/DataModeContext";

export interface IntegrationStatus {
  id: string;
  name: string;
  provider: string;
  category: string;
  status: "connected" | "disconnected" | "error";
  lastSync: string | null;
}

const demoIntegrations: IntegrationStatus[] = [
  {
    id: "1",
    name: "Salesforce CRM",
    provider: "Salesforce",
    category: "crm",
    status: "connected",
    lastSync: "2 hours ago"
  },
  {
    id: "2",
    name: "Mailchimp",
    provider: "Mailchimp",
    category: "marketing",
    status: "connected",
    lastSync: "1 day ago"
  },
  {
    id: "3",
    name: "Stripe Payments",
    provider: "Stripe",
    category: "payments",
    status: "error",
    lastSync: "3 days ago"
  }
];

const IntegrationStatusPanel = () => {
  const [integrations, setIntegrations] = useState<IntegrationStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { isRealData } = useDataMode();

  // Function to fetch integrations from Supabase
  const fetchIntegrations = async () => {
    setIsLoading(true);
    try {
      if (isRealData) {
        // Try to fetch data directly from the integrations table
        try {
          const { data, error } = await supabase
            .from('integrations')
            .select('*');
            
          if (error) {
            // If there's an error (like table doesn't exist), return empty array
            console.log('Error fetching integrations:', error);
            setIntegrations([]);
          } else if (data && data.length > 0) {
            // Map the data to the expected format
            const formattedIntegrations = data.map((item) => ({
              id: item.id,
              name: item.provider,
              provider: item.provider,
              category: item.provider_type || getCategoryFromProvider(item.provider),
              status: item.status as "connected" | "disconnected" | "error",
              lastSync: item.last_sync ? new Date(item.last_sync).toLocaleDateString() : null
            }));
            setIntegrations(formattedIntegrations);
          } else {
            setIntegrations([]);
          }
        } catch (error) {
          console.error("Error accessing integrations table:", error);
          setIntegrations([]);
        }
      } else {
        // Use demo data when in demo mode
        setIntegrations(demoIntegrations);
      }
    } catch (error) {
      console.error("Error fetching integrations:", error);
      toast({
        title: "Error",
        description: "Failed to load integrations. Please try again.",
        variant: "destructive",
      });
      setIntegrations(isRealData ? [] : demoIntegrations);
    }
    setIsLoading(false);
  };

  // Helper function to determine category from provider name
  const getCategoryFromProvider = (provider: string): string => {
    const lowerProvider = provider.toLowerCase();
    if (lowerProvider.includes('mail') || lowerProvider.includes('send')) return 'marketing';
    if (lowerProvider.includes('crm') || lowerProvider.includes('salesforce') || lowerProvider.includes('hubspot')) return 'crm';
    if (lowerProvider.includes('stripe') || lowerProvider.includes('pay')) return 'payments';
    if (lowerProvider.includes('erp') || lowerProvider.includes('sap') || lowerProvider.includes('netsuite')) return 'erp';
    if (lowerProvider.includes('postgres') || lowerProvider.includes('mysql') || lowerProvider.includes('mongo')) return 'database';
    return 'other';
  };

  // Helper function to get the logo based on provider
  const getProviderLogo = (provider: string): string => {
    const lowerProvider = provider.toLowerCase();
    
    const logoMap: Record<string, string> = {
      'mailchimp': '/logos/mailchimp.png',
      'sendgrid': '/logos/sendgrid.png',
      'constantcontact': '/logos/constantcontact.png',
      'salesforce': '/logos/salesforce.png',
      'hubspot': '/logos/hubspot.jpeg',
      'zoho': '/logos/zohocrm.png',
      'sap': '/logos/sap.png',
      'netsuite': '/logos/netsuite.png',
      'dynamics': '/logos/microsoftdynamics.webp',
      'postgresql': '/logos/postgres.svg',
      'postgres': '/logos/postgres.svg',
      'mysql': '/logos/mysql.jpg',
      'mongodb': '/logos/mongoDB.webp',
      'stripe': '/logos/stripe.png',
      'aws-s3': '/logos/amazonS3.png',
      'google-analytics': '/logos/googleanalytics.jpg',
      'twilio': '/logos/twilio.jpg'
    };
    
    for (const key in logoMap) {
      if (lowerProvider.includes(key)) {
        return logoMap[key];
      }
    }
    
    // Default to custom logo if none matched
    return '/logos/custom.png';
  };

  // Load integrations on component mount
  useEffect(() => {
    fetchIntegrations();
  }, [isRealData]);

  const refreshIntegrations = () => {
    if (isRealData) {
      fetchIntegrations();
      toast({
        title: "Refreshing integrations",
        description: "Checking for the latest integration status...",
      });
    } else {
      // Simulate refresh for demo mode
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        toast({
          title: "Integrations refreshed",
          description: "All integration statuses are up to date.",
        });
      }, 1000);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
      case "disconnected":
        return "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20";
      case "error":
        return "bg-red-500/10 text-red-500 hover:bg-red-500/20";
      default:
        return "bg-slate-500/10 text-slate-500 hover:bg-slate-500/20";
    }
  };

  // Helper function to get emoji or icon based on category
  const getCategoryIcon = (integration: IntegrationStatus) => {
    return (
      <div className="rounded-md border p-2 h-10 w-10 flex items-center justify-center overflow-hidden">
        <img 
          src={getProviderLogo(integration.provider)}
          alt={integration.provider}
          className="h-6 w-6 object-contain" 
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            // Fallback to category emojis
            if (integration.category === "crm") {
              target.outerHTML = "👥";
            } else if (integration.category === "marketing") {
              target.outerHTML = "📧";
            } else if (integration.category === "payments") {
              target.outerHTML = "💳";
            } else if (integration.category === "erp") {
              target.outerHTML = "🏢";
            } else if (integration.category === "database") {
              target.outerHTML = "💾";
            } else {
              target.outerHTML = "🔌";
            }
          }}
        />
      </div>
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold">Active Integrations</CardTitle>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1"
          onClick={refreshIntegrations}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {integrations.length > 0 ? (
          <div className="space-y-4">
            {integrations.map((integration) => (
              <div
                key={integration.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="flex items-center gap-3">
                  {getCategoryIcon(integration)}
                  <div>
                    <div className="font-medium">{integration.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Last synced: {integration.lastSync || "Never"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    className={`${getStatusColor(
                      integration.status
                    )} capitalize`}
                  >
                    {integration.status}
                  </Badge>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ExternalLink className="h-4 w-4" />
                    <span className="sr-only">Manage</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="mb-3 text-4xl">🔌</div>
            <h3 className="mb-1 text-lg font-medium">No active integrations</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {isRealData 
                ? "Connect your first integration to start syncing your data."
                : "You're viewing real data mode, but no integrations have been set up yet."}
            </p>
            <Button
              onClick={() => window.location.href = "/integrations"}
              className="gap-1"
            >
              <ExternalLink className="h-4 w-4" /> Set up integrations
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default IntegrationStatusPanel;
