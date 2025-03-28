
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import ZenithLogo from "@/components/common/ZenithLogo";
import Footer from "@/components/layout/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const navigate = useNavigate();

  const faqItems = [
    {
      question: "What is Zenith Vault?",
      answer: "Zenith Vault is an all-in-one digital business platform that helps organizations manage every aspect of the customer lifecycle. From sales and customer service to marketing and website development, our platform brings together key business functions in one central hub, enhanced by modern AI for predictive insights and task automation."
    },
    {
      question: "How does the pricing work?",
      answer: "Zenith Vault offers flexible subscription plans based on your business size and needs. We provide monthly and annual billing options with discounts for annual commitments. For detailed pricing information, please contact our sales team."
    },
    {
      question: "Is my data secure with Zenith Vault?",
      answer: "Yes, security is our top priority. We implement end-to-end encryption for all data (both in transit and at rest), role-based access control (RBAC), two-factor authentication (2FA), and regular security audits. Our platform is designed to comply with GDPR, CCPA, HIPAA, and other relevant regulations."
    },
    {
      question: "Can I integrate Zenith Vault with my existing tools?",
      answer: "Absolutely. Zenith Vault offers seamless integration with popular third-party tools including CRMs (like Salesforce and HubSpot), ERP systems (such as SAP and NetSuite), email marketing platforms (like Mailchimp and SendGrid), and social media channels."
    },
    {
      question: "Do I need technical expertise to use Zenith Vault?",
      answer: "No technical expertise is required for most features. Our platform is designed with intuitive interfaces for users of all technical levels. For website development, we offer both easy-to-use templates and drag-and-drop builders for non-technical users, as well as code editors for those who want more customization."
    },
    {
      question: "How does the AI component work?",
      answer: "Zenith Vault leverages GPT-4o for various AI-powered features including lead scoring, automated follow-ups, content generation, and sentiment analysis. The AI analyzes your business data to provide predictive insights and automate routine tasks, helping you make better decisions and save time."
    },
    {
      question: "Is there a free trial available?",
      answer: "Yes, we offer a free trial period so you can experience the full capabilities of Zenith Vault before committing. During the trial, you'll have access to all features with some usage limitations."
    },
    {
      question: "How can I get support if I have questions or issues?",
      answer: "Our support team is available via email, live chat, and phone during business hours. We also provide an extensive knowledge base with tutorials, guides, and FAQs to help you get the most out of Zenith Vault."
    },
    {
      question: "Can Zenith Vault scale with my business?",
      answer: "Yes, Zenith Vault is built on a scalable architecture that grows with your business. Whether you're a small startup or a large enterprise, our platform adjusts to your needs with flexible resource allocation via edge networks for global users."
    },
    {
      question: "What languages does Zenith Vault support?",
      answer: "Currently, Zenith Vault's interface is available in English, Spanish, Mandarin, and Swedish. We're continually working to add support for more languages."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="py-4 px-4 md:px-8 lg:px-12 border-b">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
            <ZenithLogo width={40} height={40} />
            <h1 className="text-xl font-bold text-primary">Zenith Vault</h1>
          </div>
          <div className="flex gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/")}
            >
              Home
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center mb-8">
            <ZenithLogo width={48} height={48} className="mr-4" />
            <h1 className="text-3xl font-bold text-primary">Frequently Asked Questions</h1>
          </div>
          
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg mb-6">
              Find answers to common questions about Zenith Vault. If you can't find what you're looking for, please contact our support team.
            </p>
            
            <Accordion type="single" collapsible className="w-full mt-6">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left font-medium">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">{item.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            
            <div className="bg-muted p-6 rounded-lg mt-12">
              <h3 className="text-lg font-medium mb-4">Still have questions?</h3>
              <Button 
                onClick={() => navigate("/contact")}
              >
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FAQ;
