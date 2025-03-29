
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Documentation = () => {
  return (
    <div className="container mx-auto py-6">
      <Helmet>
        <title>Documentation | Zenith Platform</title>
      </Helmet>
      
      <h1 className="text-3xl font-bold mb-6">Documentation</h1>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="api">API Connections</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Platform Overview</CardTitle>
              <CardDescription>A comprehensive guide to the Zenith platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="text-xl font-semibold">Introduction</h3>
              <p>
                The Zenith Platform is a comprehensive all-in-one online digital business platform designed to streamline
                every aspect of your customer lifecycle. From sales and customer service to marketing and website development,
                our solution brings together key business functions in one central hub.
              </p>
              
              <h3 className="text-xl font-semibold mt-6">Key Features</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Sales Management:</strong> Track leads, manage pipelines, and automate follow-ups with AI-powered insights.</li>
                <li><strong>Customer Service:</strong> Handle support cases, implement chatbots, and utilize sentiment analysis.</li>
                <li><strong>Marketing Automation:</strong> Create and manage personalized campaigns with real-time analytics.</li>
                <li><strong>Website Development:</strong> Build and maintain your web presence using templates or custom solutions.</li>
                <li><strong>Integrations:</strong> Connect with third-party services including CRMs, ERPs, and marketing tools.</li>
                <li><strong>Analytics & Reporting:</strong> Generate insights with comprehensive data visualization and reporting.</li>
              </ul>
              
              <h3 className="text-xl font-semibold mt-6">Getting Started</h3>
              <p>
                New users should begin by setting up their organization profile and inviting team members.
                Then, connect your existing systems through our Integrations page and import your data.
                For detailed step-by-step instructions, please refer to the specific module documentation.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>Integration Guide</CardTitle>
              <CardDescription>Connect your existing systems with the Zenith platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="text-xl font-semibold">Available Integrations</h3>
              <p>
                The Zenith Platform supports integration with a wide range of systems:
              </p>
              
              <h4 className="text-lg font-medium mt-4">Email Marketing</h4>
              <ul className="list-disc pl-6">
                <li><strong>Mailchimp:</strong> Connect via OAuth or API key</li>
                <li><strong>SendGrid:</strong> Connect via API key</li>
                <li><strong>Custom:</strong> Set up a custom integration using our API</li>
              </ul>
              
              <h4 className="text-lg font-medium mt-4">CRM Systems</h4>
              <ul className="list-disc pl-6">
                <li><strong>Salesforce:</strong> Connect via OAuth</li>
                <li><strong>HubSpot:</strong> Connect via OAuth or API key</li>
                <li><strong>Custom:</strong> Set up a custom CRM integration</li>
              </ul>
              
              <h4 className="text-lg font-medium mt-4">ERP Systems</h4>
              <ul className="list-disc pl-6">
                <li><strong>SAP:</strong> Connect via API</li>
                <li><strong>NetSuite:</strong> Connect via OAuth or API key</li>
                <li><strong>Custom:</strong> Set up a custom ERP integration</li>
              </ul>
              
              <h4 className="text-lg font-medium mt-4">Databases</h4>
              <ul className="list-disc pl-6">
                <li><strong>MySQL:</strong> Connect via direct connection or API</li>
                <li><strong>PostgreSQL:</strong> Connect via direct connection or API</li>
                <li><strong>Supabase:</strong> Connect via API key</li>
              </ul>
              
              <h3 className="text-xl font-semibold mt-6">Setting Up Integrations</h3>
              <p>
                To set up an integration, navigate to the Integrations page and select the service you wish to connect.
                Follow the prompts to authenticate your account and authorize access. For API-based integrations,
                you'll need to generate and provide an API key from your service provider.
              </p>
              
              <h3 className="text-xl font-semibold mt-6">Custom API Connections</h3>
              <p>
                For systems not directly supported, you can create custom connections using our API framework.
                Refer to the API documentation for details on endpoints, authentication methods, and data formats.
                Our support team is available to assist with custom integration requirements.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Reports & Analytics</CardTitle>
              <CardDescription>Insights and reporting capabilities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="text-xl font-semibold">Available Reports</h3>
              <p>
                The Zenith Platform offers a comprehensive suite of reports and analytics tools:
              </p>
              
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Sales Performance:</strong> Track conversion rates, pipeline stages, and sales forecasts.</li>
                <li><strong>Customer Metrics:</strong> Monitor acquisition costs, lifetime value, and churn rates.</li>
                <li><strong>Service Effectiveness:</strong> Analyze response times, resolution rates, and customer satisfaction.</li>
                <li><strong>Marketing ROI:</strong> Measure campaign performance across channels and segments.</li>
                <li><strong>Website Analytics:</strong> Track visitor behavior, conversion funnels, and engagement metrics.</li>
              </ul>
              
              <h3 className="text-xl font-semibold mt-6">Creating Custom Reports</h3>
              <p>
                To create a custom report:
              </p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Navigate to the Reports section</li>
                <li>Click "Create New Report"</li>
                <li>Select data sources and metrics</li>
                <li>Configure visualizations (charts, tables, etc.)</li>
                <li>Set up filters and parameters</li>
                <li>Schedule automated delivery (optional)</li>
              </ol>
              
              <h3 className="text-xl font-semibold mt-6">Upcoming Features</h3>
              <p>
                We're continuously enhancing our reporting capabilities. Features under development include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Advanced AI-driven predictions and recommendations</li>
                <li>Interactive dashboard builder with drag-and-drop interface</li>
                <li>Expanded data visualization options including heatmaps and geographical displays</li>
                <li>Enhanced mobile reporting experience</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle>API Documentation</CardTitle>
              <CardDescription>Technical information for developers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="text-xl font-semibold">API Overview</h3>
              <p>
                The Zenith Platform offers a robust RESTful API that allows developers to access and manipulate data
                programmatically. This enables custom integrations, automation workflows, and extending the platform's functionality.
              </p>
              
              <h3 className="text-xl font-semibold mt-6">Authentication</h3>
              <p>
                All API requests require authentication using API keys or OAuth tokens. To generate an API key:
              </p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Navigate to Settings {">"} API Access</li>
                <li>Click "Generate New API Key"</li>
                <li>Set appropriate permissions and expiration</li>
                <li>Store your key securely - it won't be displayed again</li>
              </ol>
              
              <h3 className="text-xl font-semibold mt-6">API Endpoints</h3>
              <p>
                Key endpoints include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><code>/api/v1/customers</code> - Manage customer data</li>
                <li><code>/api/v1/sales</code> - Access and modify sales information</li>
                <li><code>/api/v1/service</code> - Handle support tickets and cases</li>
                <li><code>/api/v1/marketing</code> - Manage campaigns and analytics</li>
              </ul>
              
              <h3 className="text-xl font-semibold mt-6">Rate Limits</h3>
              <p>
                API usage is subject to rate limits based on your subscription tier:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Standard:</strong> 100 requests per minute</li>
                <li><strong>Professional:</strong> 500 requests per minute</li>
                <li><strong>Enterprise:</strong> 2,000 requests per minute</li>
              </ul>
              
              <h3 className="text-xl font-semibold mt-6">Webhooks</h3>
              <p>
                Subscribe to events and receive real-time notifications via webhooks:
              </p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Navigate to Settings {">"} Webhooks</li>
                <li>Click "Add Webhook"</li>
                <li>Enter your endpoint URL</li>
                <li>Select events to subscribe to</li>
                <li>Configure security settings (HMAC verification recommended)</li>
              </ol>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="faq">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Common questions and answers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold">What is the difference between Demo and Real data mode?</h3>
                <p className="mt-2">
                  Demo mode displays sample data to help you explore platform capabilities without affecting your actual business data.
                  Real mode shows your actual organization data pulled from your connected systems. You can toggle between modes
                  from the Dashboard to test features or conduct training.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold">How do I add users to my organization?</h3>
                <p className="mt-2">
                  Navigate to Organization {">"} Members and click "Invite Member." Enter their email address and assign appropriate roles and permissions.
                  They'll receive an invitation email with instructions to create their account.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold">Can I customize the dashboard for different user roles?</h3>
                <p className="mt-2">
                  Yes, administrators can configure role-specific dashboards from Settings {">"} Role Configurations.
                  This allows you to tailor the information and tools available to different team members based on their responsibilities.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold">How secure is my data on the platform?</h3>
                <p className="mt-2">
                  The platform employs robust security measures including end-to-end encryption, role-based access controls,
                  two-factor authentication, and regular security audits. All data is encrypted both in transit and at rest,
                  and we comply with major regulations like GDPR, CCPA, and HIPAA.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold">How do I get technical support?</h3>
                <p className="mt-2">
                  Support is available through multiple channels:
                </p>
                <ul className="list-disc pl-6 mt-2">
                  <li>In-app chat support (click the help icon in the bottom right)</li>
                  <li>Email support at support@zenithplatform.com</li>
                  <li>Phone support for Enterprise customers</li>
                  <li>Knowledge base at help.zenithplatform.com</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Documentation;
