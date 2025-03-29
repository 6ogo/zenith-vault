
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import IntegrationCategoryTab from '@/components/integrations/IntegrationCategoryTab';
import IntegrationStatusPanel from '@/components/integrations/IntegrationStatusPanel';
import IntegrationHelpPanel from '@/components/integrations/IntegrationHelpPanel';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

const IntegrationsHub = () => {
  const [activeTab, setActiveTab] = useState("email");
  const { toast } = useToast();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Integration Hub</h1>
          <p className="text-muted-foreground mt-2">
            Connect your business systems to unlock AI-driven insights and automation
          </p>
        </div>
        <Button asChild>
          <Link to="/integrations-documentation">
            Integration Documentation
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertTitle>Integration Hub</AlertTitle>
            <AlertDescription>
              Connect your third-party services to enhance workflow, enable AI insights, and automate tasks across your business processes.
            </AlertDescription>
          </Alert>

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
                  {id: 'mailchimp', name: 'Mailchimp', logoUrl: '/logos/mailchimp.png'},
                  {id: 'sendgrid', name: 'SendGrid', logoUrl: '/logos/sendgrid.png'},
                  {id: 'constantcontact', name: 'Constant Contact', logoUrl: '/logos/constantcontact.png'},
                  {id: 'custom-email', name: 'Custom Email API', logoUrl: '/logos/custom.png', isCustom: true}
                ]}
              />
            </TabsContent>

            <TabsContent value="crm" className="space-y-4">
              <IntegrationCategoryTab 
                category="CRM Systems" 
                description="Integrate with CRM platforms to synchronize customer data and enable AI-powered insights."
                integrations={[
                  {id: 'salesforce', name: 'Salesforce', logoUrl: '/logos/salesforce.png'},
                  {id: 'hubspot', name: 'HubSpot', logoUrl: '/logos/hubspot.jpeg'},
                  {id: 'zoho', name: 'Zoho CRM', logoUrl: '/logos/zohocrm.png'},
                  {id: 'custom-crm', name: 'Custom CRM API', logoUrl: '/logos/custom.png', isCustom: true}
                ]}
              />
            </TabsContent>

            <TabsContent value="erp" className="space-y-4">
              <IntegrationCategoryTab 
                category="ERP Solutions" 
                description="Connect with ERP systems to streamline operations and enable data-driven decision making."
                integrations={[
                  {id: 'sap', name: 'SAP', logoUrl: '/logos/sap.png'},
                  {id: 'netsuite', name: 'NetSuite', logoUrl: '/logos/netsuite.png'},
                  {id: 'dynamics', name: 'Microsoft Dynamics', logoUrl: '/logos/microsoftdynamics.webp'},
                  {id: 'custom-erp', name: 'Custom ERP API', logoUrl: '/logos/custom.png', isCustom: true}
                ]}
              />
            </TabsContent>

            <TabsContent value="database" className="space-y-4">
              <IntegrationCategoryTab 
                category="Database Connections" 
                description="Connect to external databases to import, export, and synchronize critical business data."
                integrations={[
                  {id: 'postgres', name: 'PostgreSQL', logoUrl: '/logos/postgres.svg'},
                  {id: 'mysql', name: 'MySQL', logoUrl: '/logos/mysql.jpg'},
                  {id: 'mongodb', name: 'MongoDB', logoUrl: '/logos/mongoDB.webp'},
                  {id: 'custom-db', name: 'Custom Database', logoUrl: '/logos/custom.png', isCustom: true}
                ]}
              />
            </TabsContent>

            <TabsContent value="other" className="space-y-4">
              <IntegrationCategoryTab 
                category="Additional Services" 
                description="Connect to storage, analytics, payment, and communication services."
                integrations={[
                  {id: 'stripe', name: 'Stripe', logoUrl: '/logos/stripe.png'},
                  {id: 'aws-s3', name: 'AWS S3', logoUrl: '/logos/amazonS3.png'},
                  {id: 'google-analytics', name: 'Google Analytics', logoUrl: '/logos/googleanalytics.jpg'},
                  {id: 'twilio', name: 'Twilio', logoUrl: '/logos/twilio.jpg'},
                  {id: 'custom-service', name: 'Custom Service', logoUrl: '/logos/custom.png', isCustom: true}
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

export default IntegrationsHub;
