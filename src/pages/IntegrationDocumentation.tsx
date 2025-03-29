
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, FileText, Code, Database, Mail, Users, Building2, Server, Webhook, Key, Shield } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

const IntegrationDocumentation = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Integration Documentation</h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive guides and references for platform integrations
          </p>
        </div>
        <Button asChild>
          <Link to="/integrations">
            Back to Integration Hub
          </Link>
        </Button>
      </div>

      <Alert className="mb-6">
        <Info className="h-4 w-4" />
        <AlertTitle>Integration Framework</AlertTitle>
        <AlertDescription>
          This documentation explains how to connect, configure, and extend integrations with third-party services.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="crm">CRM</TabsTrigger>
          <TabsTrigger value="erp">ERP</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
          <TabsTrigger value="custom">Custom APIs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Integration Framework Overview</CardTitle>
              <CardDescription>
                Understanding the platform's integration capabilities and architecture
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Key Features</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Unified API connection interface for all integration types</li>
                  <li>Secure credential storage with end-to-end encryption</li>
                  <li>Real-time data synchronization with change tracking</li>
                  <li>Customizable data mapping between systems</li>
                  <li>Automated error handling and retry mechanisms</li>
                  <li>Extensible framework for custom integration development</li>
                </ul>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Integration Architecture</h3>
                <p>
                  The platform uses a modular integration architecture with the following components:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center">
                      <Shield className="h-5 w-5 mr-2 text-primary" />
                      <h4 className="font-medium">Security Layer</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Handles authentication, credential encryption, and secure token storage.
                    </p>
                  </div>
                  
                  <div className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center">
                      <Webhook className="h-5 w-5 mr-2 text-primary" />
                      <h4 className="font-medium">Connectivity Layer</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Manages API connections, webhooks, and data transport protocols.
                    </p>
                  </div>
                  
                  <div className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center">
                      <Database className="h-5 w-5 mr-2 text-primary" />
                      <h4 className="font-medium">Data Layer</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Handles data mapping, transformation, and synchronization between systems.
                    </p>
                  </div>
                  
                  <div className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center">
                      <Server className="h-5 w-5 mr-2 text-primary" />
                      <h4 className="font-medium">Orchestration Layer</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Manages integration workflows, scheduling, and error handling.
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Getting Started</h3>
                <p>
                  To begin integrating with third-party services:
                </p>
                <ol className="list-decimal pl-6 space-y-2 mt-2">
                  <li className="text-sm">
                    <span className="font-medium">Identify your integration needs</span>
                    <p className="text-muted-foreground">Determine which third-party services you need to connect with and what data you need to exchange.</p>
                  </li>
                  <li className="text-sm">
                    <span className="font-medium">Navigate to the Integration Hub</span>
                    <p className="text-muted-foreground">Access the Integration Hub through the sidebar navigation or dashboard.</p>
                  </li>
                  <li className="text-sm">
                    <span className="font-medium">Select an integration category</span>
                    <p className="text-muted-foreground">Choose from Email, CRM, ERP, Database, or other service categories.</p>
                  </li>
                  <li className="text-sm">
                    <span className="font-medium">Set up your integration</span>
                    <p className="text-muted-foreground">Follow the guided setup wizard to configure your connection.</p>
                  </li>
                  <li className="text-sm">
                    <span className="font-medium">Test and verify</span>
                    <p className="text-muted-foreground">Confirm that data is flowing correctly between systems.</p>
                  </li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                <CardTitle>Email Marketing Integrations</CardTitle>
              </div>
              <CardDescription>
                Connect email marketing platforms to automate campaigns and track engagement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Supported Platforms</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-md p-3">
                    <h4 className="font-medium">Mailchimp</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Connect to Mailchimp for email campaign management, audience segmentation, and engagement tracking.
                    </p>
                    <div className="text-sm mt-2">
                      <div className="flex items-center">
                        <Key className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span>API Key authentication</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-3">
                    <h4 className="font-medium">SendGrid</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Integrate with SendGrid for transactional emails, marketing campaigns, and delivery analytics.
                    </p>
                    <div className="text-sm mt-2">
                      <div className="flex items-center">
                        <Key className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span>API Key authentication</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-3">
                    <h4 className="font-medium">Constant Contact</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Connect with Constant Contact for email marketing, event management, and surveys.
                    </p>
                    <div className="text-sm mt-2">
                      <div className="flex items-center">
                        <Shield className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span>OAuth authentication</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-3">
                    <h4 className="font-medium">Custom Email API</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Connect to any custom email marketing platform using REST API integration.
                    </p>
                    <div className="text-sm mt-2">
                      <div className="flex items-center">
                        <Code className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span>Custom configuration</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Key Integration Features</h3>
                <ul className="list-disc pl-6 space-y-1 text-sm">
                  <li>Bi-directional contact/subscriber synchronization</li>
                  <li>Campaign creation and scheduling</li>
                  <li>Template management and content personalization</li>
                  <li>Open, click, and conversion tracking</li>
                  <li>Automated list segmentation based on platform data</li>
                  <li>AI-powered content recommendations</li>
                </ul>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Implementation Steps</h3>
                <p className="text-sm">
                  Follow these steps to connect your email marketing platform:
                </p>
                <ol className="list-decimal pl-6 space-y-1 text-sm mt-2">
                  <li>Obtain API credentials from your email marketing provider</li>
                  <li>Navigate to the Integration Hub and select the Email tab</li>
                  <li>Choose your provider and follow the setup wizard</li>
                  <li>Configure data mappings between platform contacts and email subscribers</li>
                  <li>Set up synchronization schedules and triggers</li>
                  <li>Test the integration with a sample campaign</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="crm" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <CardTitle>CRM Integrations</CardTitle>
              </div>
              <CardDescription>
                Connect customer relationship management systems to unify customer data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Supported CRM Platforms</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-md p-3">
                    <h4 className="font-medium">Salesforce</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Enterprise-grade CRM integration with support for leads, opportunities, accounts, and custom objects.
                    </p>
                    <div className="text-sm mt-2">
                      <div className="flex items-center">
                        <Shield className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span>OAuth authentication</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-3">
                    <h4 className="font-medium">HubSpot</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Connect with HubSpot for contacts, deals, tickets, and marketing automation.
                    </p>
                    <div className="text-sm mt-2">
                      <div className="flex items-center">
                        <Key className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span>API Key authentication</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-3">
                    <h4 className="font-medium">Zoho CRM</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Integrate with Zoho for leads, contacts, accounts, and sales pipeline management.
                    </p>
                    <div className="text-sm mt-2">
                      <div className="flex items-center">
                        <Shield className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span>OAuth authentication</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-3">
                    <h4 className="font-medium">Custom CRM API</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Connect to any CRM system that offers a REST API interface.
                    </p>
                    <div className="text-sm mt-2">
                      <div className="flex items-center">
                        <Code className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span>Custom configuration</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Key Integration Features</h3>
                <ul className="list-disc pl-6 space-y-1 text-sm">
                  <li>Bi-directional contact and lead synchronization</li>
                  <li>Opportunity and deal tracking</li>
                  <li>Activity and task synchronization</li>
                  <li>Custom field mapping and data transformation</li>
                  <li>Triggered workflows based on CRM events</li>
                  <li>AI-powered lead scoring and prioritization</li>
                </ul>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Implementation Steps</h3>
                <p className="text-sm">
                  Follow these steps to connect your CRM platform:
                </p>
                <ol className="list-decimal pl-6 space-y-1 text-sm mt-2">
                  <li>Obtain API credentials or OAuth setup from your CRM provider</li>
                  <li>Navigate to the Integration Hub and select the CRM tab</li>
                  <li>Choose your CRM provider and follow the setup wizard</li>
                  <li>Configure object mappings (contacts, leads, opportunities)</li>
                  <li>Set up field mappings and data transformation rules</li>
                  <li>Configure synchronization frequency and conflict resolution</li>
                  <li>Test with sample data to verify correct operation</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="erp" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                <CardTitle>ERP Integrations</CardTitle>
              </div>
              <CardDescription>
                Connect enterprise resource planning systems to streamline operations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Supported ERP Systems</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-md p-3">
                    <h4 className="font-medium">SAP</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Enterprise-grade integration with SAP ERP systems for finance, inventory, and procurement.
                    </p>
                    <div className="text-sm mt-2">
                      <div className="flex items-center">
                        <Shield className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span>OAuth / API Key authentication</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-3">
                    <h4 className="font-medium">NetSuite</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Integrate with Oracle NetSuite for financial, inventory, and order management.
                    </p>
                    <div className="text-sm mt-2">
                      <div className="flex items-center">
                        <Key className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span>Token-based authentication</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-3">
                    <h4 className="font-medium">Microsoft Dynamics</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Connect with Microsoft Dynamics 365 for business operations and financial management.
                    </p>
                    <div className="text-sm mt-2">
                      <div className="flex items-center">
                        <Shield className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span>OAuth authentication</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-3">
                    <h4 className="font-medium">Custom ERP API</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Connect to any ERP system with a REST API interface using custom configuration.
                    </p>
                    <div className="text-sm mt-2">
                      <div className="flex items-center">
                        <Code className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span>Custom configuration</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Key Integration Features</h3>
                <ul className="list-disc pl-6 space-y-1 text-sm">
                  <li>Product and inventory synchronization</li>
                  <li>Order management and status tracking</li>
                  <li>Customer and vendor record synchronization</li>
                  <li>Financial data integration and reporting</li>
                  <li>Business process automation across systems</li>
                  <li>AI-powered inventory forecasting and optimization</li>
                </ul>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Implementation Steps</h3>
                <p className="text-sm">
                  Follow these steps to connect your ERP system:
                </p>
                <ol className="list-decimal pl-6 space-y-1 text-sm mt-2">
                  <li>Obtain API credentials and necessary permissions from your ERP administrator</li>
                  <li>Navigate to the Integration Hub and select the ERP tab</li>
                  <li>Choose your ERP provider and follow the setup wizard</li>
                  <li>Configure data entity mappings (products, orders, customers)</li>
                  <li>Set up field mappings and data transformation rules</li>
                  <li>Configure synchronization frequency and error handling</li>
                  <li>Test with non-production data before enabling in production</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                <CardTitle>Database Integrations</CardTitle>
              </div>
              <CardDescription>
                Connect to external databases for data import, export, and synchronization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Supported Database Systems</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-md p-3">
                    <h4 className="font-medium">PostgreSQL</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Connect to PostgreSQL databases for advanced relational data management.
                    </p>
                  </div>
                  
                  <div className="border rounded-md p-3">
                    <h4 className="font-medium">MySQL</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Integrate with MySQL or MariaDB instances for data synchronization.
                    </p>
                  </div>
                  
                  <div className="border rounded-md p-3">
                    <h4 className="font-medium">MongoDB</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Connect to MongoDB for document-oriented data storage and retrieval.
                    </p>
                  </div>
                  
                  <div className="border rounded-md p-3">
                    <h4 className="font-medium">Custom Database</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Support for other database systems through custom JDBC/ODBC drivers.
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Key Integration Features</h3>
                <ul className="list-disc pl-6 space-y-1 text-sm">
                  <li>Secure connection with encrypted credentials</li>
                  <li>Scheduled data imports and exports</li>
                  <li>Incremental data synchronization</li>
                  <li>Complex query support and data transformation</li>
                  <li>Schema mapping and validation</li>
                  <li>Change data capture for real-time updates</li>
                </ul>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Security Considerations</h3>
                <p className="text-sm">
                  Database integrations require careful security configuration:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-sm mt-2">
                  <li>Use read-only accounts where possible to minimize risk</li>
                  <li>Configure IP allowlisting to restrict database access</li>
                  <li>Encrypt all connection credentials in transit and at rest</li>
                  <li>Implement data minimization by only synchronizing required fields</li>
                  <li>Regular audit database access and operations</li>
                </ul>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Implementation Steps</h3>
                <p className="text-sm">
                  Follow these steps to connect your database:
                </p>
                <ol className="list-decimal pl-6 space-y-1 text-sm mt-2">
                  <li>Prepare your database for external connections (firewall, users)</li>
                  <li>Navigate to the Integration Hub and select the Database tab</li>
                  <li>Choose your database type and enter connection details</li>
                  <li>Test the connection and verify access</li>
                  <li>Configure which tables/collections to synchronize</li>
                  <li>Set up field mappings and transformations</li>
                  <li>Configure synchronization schedule and conflict resolution</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="custom" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Code className="h-5 w-5 text-primary" />
                <CardTitle>Custom API Integrations</CardTitle>
              </div>
              <CardDescription>
                Create custom integrations with any system that provides an API
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Custom Integration Framework</h3>
                <p className="text-sm">
                  The platform provides a flexible framework for creating custom integrations with any API-enabled system.
                  This allows you to extend the platform's capabilities beyond the pre-built integrations.
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Integration Types</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div className="border rounded-md p-3">
                    <h4 className="font-medium">RESTful API Integration</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Connect to any system with a RESTful API using HTTP/HTTPS.
                    </p>
                  </div>
                  
                  <div className="border rounded-md p-3">
                    <h4 className="font-medium">GraphQL Integration</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Connect to GraphQL endpoints for efficient data querying.
                    </p>
                  </div>
                  
                  <div className="border rounded-md p-3">
                    <h4 className="font-medium">SOAP/XML Integration</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Support for legacy SOAP and XML-based web services.
                    </p>
                  </div>
                  
                  <div className="border rounded-md p-3">
                    <h4 className="font-medium">Webhook Integration</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Create webhook endpoints to receive data from external systems.
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Custom Integration Development</h3>
                <p className="text-sm">
                  Administrators can develop custom integrations following these steps:
                </p>
                <ol className="list-decimal pl-6 space-y-1 text-sm mt-2">
                  <li>
                    <span className="font-medium">Define Integration Requirements</span>
                    <p className="text-muted-foreground">Identify the systems, data, and processes to be integrated.</p>
                  </li>
                  <li>
                    <span className="font-medium">Configure Connection Settings</span>
                    <p className="text-muted-foreground">Set up authentication, endpoints, and connection parameters.</p>
                  </li>
                  <li>
                    <span className="font-medium">Create Data Mappings</span>
                    <p className="text-muted-foreground">Define how data fields map between systems, including transformations.</p>
                  </li>
                  <li>
                    <span className="font-medium">Configure Synchronization Logic</span>
                    <p className="text-muted-foreground">Set up triggers, schedules, and conditions for data exchange.</p>
                  </li>
                  <li>
                    <span className="font-medium">Implement Error Handling</span>
                    <p className="text-muted-foreground">Define how to manage failures, retries, and notifications.</p>
                  </li>
                  <li>
                    <span className="font-medium">Test and Deploy</span>
                    <p className="text-muted-foreground">Validate the integration in a test environment before production use.</p>
                  </li>
                </ol>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Developer Resources</h3>
                <div className="space-y-2 text-sm">
                  <p className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-primary" />
                    <span className="font-medium">API Documentation</span> - Comprehensive reference for all platform APIs.
                  </p>
                  <p className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-primary" />
                    <span className="font-medium">Integration SDK</span> - Tools and libraries for custom integration development.
                  </p>
                  <p className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-primary" />
                    <span className="font-medium">Webhook Guide</span> - How to set up webhook endpoints for real-time data exchange.
                  </p>
                  <p className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-primary" />
                    <span className="font-medium">Code Samples</span> - Example implementations for common integration scenarios.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IntegrationDocumentation;
