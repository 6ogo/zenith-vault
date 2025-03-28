
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import ZenithLogo from "@/components/common/ZenithLogo";
import Footer from "@/components/layout/Footer";

const CustomerService = () => {
  const navigate = useNavigate();

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
            <h1 className="text-3xl font-bold text-primary">Customer Service</h1>
          </div>
          
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg mb-6">
              Provide exceptional support to your customers with our comprehensive Customer Service module.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">Key Features</h2>
            
            <h3 className="text-lg font-medium mt-6 mb-2">Support Case Management</h3>
            <p>
              Track, prioritize, and resolve customer issues efficiently with our intuitive ticket management system. Categorize cases, assign ownership, and monitor resolution progress all in one place.
            </p>
            
            <h3 className="text-lg font-medium mt-6 mb-2">AI Chatbot Integration</h3>
            <p>
              Provide instant responses to common inquiries with our intelligent chatbot. Automatically route complex issues to the appropriate human agent for specialized assistance.
            </p>
            
            <h3 className="text-lg font-medium mt-6 mb-2">Sentiment Analysis</h3>
            <p>
              Understand customer emotions and tailor your responses accordingly. Our AI analyzes communication tone and suggests appropriate replies to improve customer satisfaction.
            </p>
            
            <h3 className="text-lg font-medium mt-6 mb-2">Self-Service Knowledge Base</h3>
            <p>
              Empower customers to find answers independently with a comprehensive, searchable repository of support articles, FAQs, and how-to guides.
            </p>
            
            <div className="bg-muted p-6 rounded-lg mt-8">
              <h3 className="text-lg font-medium mb-4">Ready to elevate your customer service?</h3>
              <Button onClick={() => navigate("/auth/signup")}>Start Your Free Trial</Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CustomerService;
