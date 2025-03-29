
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { HelpCircle, FileText, ExternalLink } from "lucide-react";

interface IntegrationHelpPanelProps {
  category: string;
}

const IntegrationHelpPanel = ({ category }: IntegrationHelpPanelProps) => {
  // Define help content based on category
  const getHelpContent = () => {
    switch (category) {
      case 'email':
        return {
          title: 'Email Marketing Integrations',
          description: 'Connect your email marketing platforms to automate campaigns and analyze engagement.',
          links: [
            { title: 'Email integration guide', url: '/integrations/documentation#email' },
            { title: 'Mailchimp API documentation', url: 'https://mailchimp.com/developer/' },
            { title: 'SendGrid API documentation', url: 'https://docs.sendgrid.com/api-reference' }
          ]
        };
      case 'crm':
        return {
          title: 'CRM Integrations',
          description: 'Sync customer data between your CRM system and platform to provide unified insights.',
          links: [
            { title: 'CRM integration guide', url: '/integrations/documentation#crm' },
            { title: 'Salesforce API documentation', url: 'https://developer.salesforce.com/docs' },
            { title: 'HubSpot API documentation', url: 'https://developers.hubspot.com/docs/api/overview' }
          ]
        };
      case 'erp':
        return {
          title: 'ERP Integrations',
          description: 'Connect with your ERP system to streamline operations and enhance decision making.',
          links: [
            { title: 'ERP integration guide', url: '/integrations/documentation#erp' },
            { title: 'SAP API documentation', url: 'https://developers.sap.com/' },
            { title: 'NetSuite API documentation', url: 'https://docs.oracle.com/en/cloud/saas/netsuite/index.html' }
          ]
        };
      case 'database':
        return {
          title: 'Database Connections',
          description: 'Configure connections to external databases for data import, export, and synchronization.',
          links: [
            { title: 'Database integration guide', url: '/integrations/documentation#database' },
            { title: 'PostgreSQL connection guide', url: '/integrations/documentation#postgres' },
            { title: 'MySQL connection guide', url: '/integrations/documentation#mysql' }
          ]
        };
      default:
        return {
          title: 'Additional Services',
          description: 'Connect to various third-party services to extend platform functionality.',
          links: [
            { title: 'Services integration guide', url: '/integrations/documentation#services' },
            { title: 'Custom API integration', url: '/integrations/documentation#custom-api' },
            { title: 'Webhooks configuration', url: '/integrations/documentation#webhooks' }
          ]
        };
    }
  };

  const helpContent = getHelpContent();

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-primary" />
          Help & Resources
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-1">{helpContent.title}</h4>
            <p className="text-sm text-muted-foreground">{helpContent.description}</p>
          </div>
          
          <div className="space-y-2">
            <h5 className="text-sm font-medium">Useful Resources:</h5>
            <ul className="space-y-1.5">
              {helpContent.links.map((link, index) => (
                <li key={index} className="text-sm">
                  <Link 
                    to={link.url.startsWith('http') ? '' : link.url} 
                    className="flex items-center text-primary hover:underline"
                    {...(link.url.startsWith('http') ? { 
                      as: 'a', 
                      href: link.url,
                      target: "_blank",
                      rel: "noopener noreferrer"
                    } : {})}
                  >
                    {link.url.startsWith('http') ? (
                      <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                    ) : (
                      <FileText className="mr-1.5 h-3.5 w-3.5" />
                    )}
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="pt-2">
            <Link 
              to="/integrations/documentation" 
              className="text-sm text-primary hover:underline flex items-center"
            >
              <FileText className="mr-1.5 h-3.5 w-3.5" />
              View complete integration documentation
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IntegrationHelpPanel;
