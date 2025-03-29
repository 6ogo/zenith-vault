
import { supabase } from '@/integrations/supabase/client';

/**
 * Extracts and formats content from the Integration Documentation page
 * for ingestion into the knowledge base
 */
export const extractIntegrationDocumentation = () => {
  // This is a simplified representation of the Integration Documentation content
  // In a real-world scenario, this could be dynamic content stored in the database
  const documentationData = [
    {
      title: "Integration Framework Overview",
      content: "The platform provides a unified API connection interface, secure credential storage with end-to-end encryption, real-time data synchronization with change tracking, customizable data mapping between systems, automated error handling and retry mechanisms, and an extensible framework for custom integration development."
    },
    {
      title: "Integration Architecture",
      content: "The platform uses a modular integration architecture with components including: Security Layer (handles authentication, credential encryption, and secure token storage), Connectivity Layer (manages API connections, webhooks, and data transport protocols), Data Layer (handles data mapping, transformation, and synchronization between systems), and Orchestration Layer (manages integration workflows, scheduling, and error handling)."
    },
    {
      title: "Email Marketing Integrations",
      content: "Connect email marketing platforms like Mailchimp, SendGrid, Constant Contact, or custom email APIs to automate campaigns and track engagement. Features include bi-directional contact/subscriber synchronization, campaign creation and scheduling, template management, content personalization, tracking, automated list segmentation, and AI-powered content recommendations."
    },
    {
      title: "CRM Integrations",
      content: "Connect CRM systems like Salesforce, HubSpot, Zoho CRM, or custom CRM APIs to unify customer data. Features include bi-directional contact and lead synchronization, opportunity and deal tracking, activity and task synchronization, custom field mapping and data transformation, triggered workflows, and AI-powered lead scoring and prioritization."
    },
    {
      title: "ERP Integrations",
      content: "Connect ERP systems like SAP, NetSuite, Microsoft Dynamics, or custom ERP APIs to streamline operations. Features include product and inventory synchronization, order management and status tracking, customer and vendor record synchronization, financial data integration and reporting, business process automation, and AI-powered inventory forecasting and optimization."
    },
    {
      title: "Database Integrations",
      content: "Connect to external databases like PostgreSQL, MySQL, MongoDB, or custom database systems for data import, export, and synchronization. Features include secure connection with encrypted credentials, scheduled data imports and exports, incremental data synchronization, complex query support and data transformation, schema mapping and validation, and change data capture for real-time updates."
    },
    {
      title: "Custom API Integrations",
      content: "Create custom integrations with any system that provides an API, including RESTful, GraphQL, SOAP/XML, and webhook integrations. Administrators can develop custom integrations by defining integration requirements, configuring connection settings, creating data mappings, configuring synchronization logic, implementing error handling, and testing before deployment."
    },
    {
      title: "Setting Up GROQ API Integration",
      content: "To integrate GROQ API with Zenith Vault, go to Project Settings > Edge Functions Secrets and add your GROQ API key as 'GROQ_API_KEY'. The chatbot uses GROQ's LLaMA 3 model for embeddings and responses. Make sure to use a valid API key from your GROQ account dashboard."
    },
    {
      title: "Integration Authentication Methods",
      content: "The platform supports various authentication methods for integrations including OAuth 2.0, API keys, JWT tokens, and basic authentication. Each method has specific configuration requirements and security considerations. OAuth 2.0 is recommended for user-centric integrations, while API keys are suitable for server-to-server communications."
    },
    {
      title: "Webhook Integration Setup",
      content: "To configure webhook integrations, use the Integrations Hub to define webhook endpoints, event triggers, payload structures, and security settings. The platform provides built-in webhook verification with HMAC signatures and replay protection. Test webhooks in the development environment before deploying to production."
    }
  ];

  return documentationData.map(item => ({
    title: item.title,
    content: item.content
  }));
};

/**
 * Helper function to populate the knowledge base with integration documentation
 */
export const populateIntegrationDocs = async () => {
  try {
    const entries = extractIntegrationDocumentation();
    
    // Use the knowledge-ingestion function to add entries
    const { data, error } = await supabase.functions.invoke('knowledge-ingestion', {
      body: { 
        entries: entries, 
        type: 'documentation'
      }
    });
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error populating integration documentation:', error);
    throw error;
  }
};

/**
 * Populate the knowledge base with organization-specific documentation
 */
export const populateOrganizationDocumentation = async (organizationId: string, entries: { title: string; content: string }[]) => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('User not authenticated');
    }
    
    // Add organization_id to each entry
    const entriesWithOrgId = entries.map(entry => ({
      ...entry,
      organization_id: organizationId
    }));
    
    // Use the knowledge-ingestion function to add entries
    const { data, error } = await supabase.functions.invoke('knowledge-ingestion', {
      body: { 
        entries: entriesWithOrgId, 
        type: 'documentation',
        organization_id: organizationId
      }
    });
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error populating organization documentation:', error);
    throw error;
  }
};
