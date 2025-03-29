
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, FileText, Database, Settings, Link, HelpCircle } from "lucide-react";

const Documentation = () => {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Documentation</h1>
        <p className="text-muted-foreground">
          Learn how to use and connect services to Zenith Vault
        </p>
      </div>
      
      <Alert className="mb-6">
        <Info className="h-4 w-4" />
        <AlertTitle>Documentation and Guides</AlertTitle>
        <AlertDescription>
          This documentation will help you understand how to use the platform, connect to external services, and get the most out of your data.
        </AlertDescription>
      </Alert>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="reports">Analytics & Reports</TabsTrigger>
          <TabsTrigger value="api">API & Custom</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Zenith Vault Overview</CardTitle>
              <CardDescription>
                Understanding the platform and its capabilities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">What is Zenith Vault?</h3>
                <p>Zenith Vault is an all-in-one online digital business platform that helps organizations manage every aspect of the customer lifecycle. From sales and customer service to marketing and website development, the platform brings together key business functions in one central hub.</p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Key Features</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Sales Management:</strong> Track leads, manage pipelines, automate follow-ups</li>
                  <li><strong>Customer Service:</strong> Support case management, self-service knowledge bases</li>
                  <li><strong>Marketing Automation:</strong> Create and manage personalized campaigns</li>
                  <li><strong>Customer Data Management:</strong> Centralized database for customer information</li>
                  <li><strong>Website Development:</strong> Templates and customization options</li>
                  <li><strong>Integration & Analytics:</strong> Connect with external services and get insights</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Demo vs Real Mode</h3>
                <p>Zenith Vault offers two operational modes:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Demo Mode:</strong> Shows sample data to help you understand the platform's capabilities</li>
                  <li><strong>Real Mode:</strong> Displays your actual organization data from connected systems</li>
                </ul>
                <p>You can toggle between these modes using the Data Mode switch on applicable pages.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Integration Guide</CardTitle>
              <CardDescription>
                How to connect external services to Zenith Vault
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Email Marketing Integrations</h3>
                <p>Connect your email marketing tools to automate campaigns and track results:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Mailchimp:</strong> Requires API key from your Mailchimp account</li>
                  <li><strong>SendGrid:</strong> Requires API key from your SendGrid dashboard</li>
                  <li><strong>Custom:</strong> Connect any email service that provides a REST API</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">CRM Integrations</h3>
                <p>Sync your customer relationship management data:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Salesforce:</strong> OAuth connection through your Salesforce account</li>
                  <li><strong>HubSpot:</strong> API key from your HubSpot developer settings</li>
                  <li><strong>Custom:</strong> Connect any CRM that provides API access</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Database Connections</h3>
                <p>Connect directly to your databases for advanced data integration:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>MySQL:</strong> Requires host, username, password, and database name</li>
                  <li><strong>PostgreSQL:</strong> Requires connection string with credentials</li>
                  <li><strong>Supabase:</strong> Requires project URL and API key</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Setting Up Custom API Connections</h3>
                <p>To connect a custom service:</p>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>Navigate to the Integrations page</li>
                  <li>Select the appropriate tab for your service type</li>
                  <li>Click on the "Custom" option</li>
                  <li>Enter your API endpoint and authentication details</li>
                  <li>Test the connection and save</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics & Reporting Guide</CardTitle>
              <CardDescription>
                How to create and use reports from your data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Available Report Types</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Sales Reports:</strong> Pipeline analysis, conversion rates, revenue forecasting</li>
                  <li><strong>Customer Reports:</strong> Satisfaction metrics, support ticket analysis</li>
                  <li><strong>Marketing Reports:</strong> Campaign performance, engagement metrics</li>
                  <li><strong>Website Reports:</strong> Traffic analysis, SEO performance</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Creating Custom Reports</h3>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>Navigate to the Reports page</li>
                  <li>Select "Create Custom Report" tab</li>
                  <li>Choose data sources and metrics</li>
                  <li>Configure visualizations (charts, tables)</li>
                  <li>Save and schedule automated delivery if needed</li>
                </ol>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Features in Development</h3>
                <p>The following reporting features are currently under development:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>AI-powered predictive analytics</li>
                  <li>Advanced cross-source correlation analysis</li>
                  <li>Custom calculation fields</li>
                  <li>Extended visualization options</li>
                  <li>Team performance benchmarking</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API & Custom Development</CardTitle>
              <CardDescription>
                Using the Zenith Vault API and custom integrations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">API Access</h3>
                <p>Zenith Vault provides a comprehensive REST API for custom integrations:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>API key generation is available in Settings -&gt; API</li>
                  <li>Base URL: <code>https://api.zenithvault.com/v1</code></li>
                  <li>Full API documentation available with examples and schemas</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Custom Data Flows</h3>
                <p>Connect systems with custom data flows:</p>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>Define source and destination systems</li>
                  <li>Map data fields between systems</li>
                  <li>Set triggers for data synchronization</li>
                  <li>Configure transformation rules if needed</li>
                  <li>Test and monitor the data flow</li>
                </ol>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">GIS Transfers</h3>
                <p>For geographic information system (GIS) data:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Supports common GIS formats (Shapefile, GeoJSON, KML)</li>
                  <li>API endpoints for spatial data import/export</li>
                  <li>Coordinate system transformation capabilities</li>
                  <li>Spatial relationship queries</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Webhook Support</h3>
                <p>Create webhooks to trigger external actions:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Configure in Settings -&gt; Webhooks</li>
                  <li>Available triggers for all major system events</li>
                  <li>Custom HTTP headers and authentication</li>
                  <li>Webhook activity monitoring and retry options</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="faq" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>
                Common questions and answers about Zenith Vault
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">How do I switch between Demo and Real data?</h3>
                <p>Use the Data Mode toggle available on dashboard and functional pages. This toggle affects data display across all applicable pages. Note that Integrations, Settings, and Organization pages always show real data.</p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">How secure is my data in Zenith Vault?</h3>
                <p>Zenith Vault uses end-to-end encryption, role-based access control, and regular security audits to ensure data security. All data is encrypted both at rest and in transit.</p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Can I export data from Zenith Vault?</h3>
                <p>Yes, data can be exported in various formats including CSV, Excel, PDF, and API access. Export options are available on relevant pages or through the Reports section.</p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">What if I need help connecting a service not listed?</h3>
                <p>Use the Custom API integration option available in each integration category. If you need further assistance, contact support through the Help & Support section.</p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">How often is Zenith Vault updated?</h3>
                <p>The platform receives regular updates with new features, improvements, and security patches. Major updates are announced in advance through the notification system.</p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">How can I manage user permissions?</h3>
                <p>User permissions are managed in the Organization section, where administrators can assign roles and specific permissions to team members based on their responsibilities.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Documentation;
