
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, FileText, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import IntegrationCategoryTab from '@/components/integrations/IntegrationCategoryTab';
import IntegrationStatusPanel from '@/components/integrations/IntegrationStatusPanel';
import IntegrationHelpPanel from '@/components/integrations/IntegrationHelpPanel';
import { useToast } from '@/hooks/use-toast';

const Integrations = () => {
  const [activeTab, setActiveTab] = useState("email");
  const { toast } = useToast();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Integrations</h1>
          <p className="text-muted-foreground mt-2">
            Connect your business systems to unlock AI-driven insights and automation
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to="/integration-documentation">
            <FileText className="mr-2 h-4 w-4" />
            Documentation
          </Link>
        </Button>
      </div>

      <Alert className="mb-6">
        <Info className="h-4 w-4" />
        <AlertTitle>Integration Hub</AlertTitle>
        <AlertDescription>
          Connect your third-party services to enhance workflow, enable AI insights, and automate tasks across your business processes.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="email" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid grid-cols-5 w-full">
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="crm">CRM</TabsTrigger>
              <TabsTrigger value="erp">ERP</TabsTrigger>
              <TabsTrigger value="database">Database</TabsTrigger>
              <TabsTrigger value="other">Other</TabsTrigger>
            </TabsList>

            <TabsContent value="email" className="space-y-4">
              <IntegrationCategoryTab 
                category="Email Marketing" 
                description="Connect your email marketing platforms to automate campaigns and analyze engagement metrics."
                integrations={[
                  {
                    id: 'mailchimp', 
                    name: 'Mailchimp', 
                    logoUrl: '/placeholder.svg',
                    description: "Connect your Mailchimp account to automate marketing campaigns and analyze audience engagement.",
                    docsUrl: "https://mailchimp.com/developer/"
                  },
                  {
                    id: 'sendgrid', 
                    name: 'SendGrid', 
                    logoUrl: '/placeholder.svg',
                    description: "Integrate with SendGrid to manage transactional and marketing emails with detailed analytics.",
                    docsUrl: "https://docs.sendgrid.com/"
                  },
                  {
                    id: 'constantcontact', 
                    name: 'Constant Contact', 
                    logoUrl: '/placeholder.svg',
                    description: "Connect Constant Contact to enhance your email marketing with engagement tracking."
                  },
                  {
                    id: 'custom-email', 
                    name: 'Custom Email API', 
                    logoUrl: '/placeholder.svg', 
                    isCustom: true,
                    description: "Configure a custom email integration using SMTP or API-based system."
                  }
                ]}
              />
            </TabsContent>

            <TabsContent value="crm" className="space-y-4">
              <IntegrationCategoryTab 
                category="CRM Systems" 
                description="Integrate with CRM platforms to synchronize customer data and enable AI-powered insights."
                integrations={[
                  {
                    id: 'salesforce', 
                    name: 'Salesforce', 
                    logoUrl: '/placeholder.svg',
                    description: "Connect Salesforce to sync customer data, sales pipelines, and opportunities.",
                    docsUrl: "https://developer.salesforce.com/docs"
                  },
                  {
                    id: 'hubspot', 
                    name: 'HubSpot', 
                    logoUrl: '/placeholder.svg',
                    description: "Integrate with HubSpot to manage marketing, sales, and customer service data.",
                    docsUrl: "https://developers.hubspot.com/"
                  },
                  {
                    id: 'zoho', 
                    name: 'Zoho CRM', 
                    logoUrl: '/placeholder.svg',
                    description: "Connect Zoho CRM to manage your sales pipeline and customer relationships."
                  },
                  {
                    id: 'custom-crm', 
                    name: 'Custom CRM API', 
                    logoUrl: '/placeholder.svg', 
                    isCustom: true,
                    description: "Configure a custom CRM integration with your existing system."
                  }
                ]}
              />
            </TabsContent>

            <TabsContent value="erp" className="space-y-4">
              <IntegrationCategoryTab 
                category="ERP Solutions" 
                description="Connect with ERP systems to streamline operations and enable data-driven decision making."
                integrations={[
                  {
                    id: 'sap', 
                    name: 'SAP', 
                    logoUrl: '/placeholder.svg',
                    description: "Integrate with SAP to connect your enterprise resource planning data.",
                    docsUrl: "https://developers.sap.com/"
                  },
                  {
                    id: 'netsuite', 
                    name: 'NetSuite', 
                    logoUrl: '/placeholder.svg',
                    description: "Connect Oracle NetSuite to manage financial and business operations data."
                  },
                  {
                    id: 'dynamics', 
                    name: 'Microsoft Dynamics', 
                    logoUrl: '/placeholder.svg',
                    description: "Integrate Microsoft Dynamics to connect business applications and analytics."
                  },
                  {
                    id: 'custom-erp', 
                    name: 'Custom ERP API', 
                    logoUrl: '/placeholder.svg', 
                    isCustom: true,
                    description: "Configure a custom ERP integration with your existing business systems."
                  }
                ]}
              />
            </TabsContent>

            <TabsContent value="database" className="space-y-4">
              <IntegrationCategoryTab 
                category="Database Connections" 
                description="Connect to external databases to import, export, and synchronize critical business data."
                integrations={[
                  {
                    id: 'postgres', 
                    name: 'PostgreSQL', 
                    logoUrl: '/placeholder.svg',
                    description: "Connect to PostgreSQL databases to import and synchronize your data.",
                    docsUrl: "https://www.postgresql.org/docs/"
                  },
                  {
                    id: 'mysql', 
                    name: 'MySQL', 
                    logoUrl: '/placeholder.svg',
                    description: "Connect to MySQL databases to streamline data integration."
                  },
                  {
                    id: 'mongodb', 
                    name: 'MongoDB', 
                    logoUrl: '/placeholder.svg',
                    description: "Integrate with MongoDB to connect document-based data sources."
                  },
                  {
                    id: 'custom-db', 
                    name: 'Custom Database', 
                    logoUrl: '/placeholder.svg', 
                    isCustom: true,
                    description: "Configure a custom database connection with tailored data mapping."
                  }
                ]}
              />
            </TabsContent>

            <TabsContent value="other" className="space-y-4">
              <IntegrationCategoryTab 
                category="Additional Services" 
                description="Connect to storage, analytics, payment, and communication services."
                integrations={[
                  {
                    id: 'stripe', 
                    name: 'Stripe', 
                    logoUrl: '/placeholder.svg',
                    description: "Connect Stripe to manage payment processing and subscription services.",
                    docsUrl: "https://stripe.com/docs/api"
                  },
                  {
                    id: 'aws-s3', 
                    name: 'AWS S3', 
                    logoUrl: '/placeholder.svg',
                    description: "Integrate with Amazon S3 for secure cloud storage and file management."
                  },
                  {
                    id: 'google-analytics', 
                    name: 'Google Analytics', 
                    logoUrl: '/placeholder.svg',
                    description: "Connect Google Analytics to import website traffic and user behavior data."
                  },
                  {
                    id: 'twilio', 
                    name: 'Twilio', 
                    logoUrl: '/placeholder.svg',
                    description: "Integrate Twilio for SMS, voice, and messaging communications."
                  },
                  {
                    id: 'custom-service', 
                    name: 'Custom Service', 
                    logoUrl: '/placeholder.svg', 
                    isCustom: true,
                    description: "Configure a custom integration with your specialized business services."
                  }
                ]}
              />
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <IntegrationStatusPanel />
          <IntegrationHelpPanel category={activeTab} />
        </div>
      </div>
    </div>
  );
};

export default Integrations;
