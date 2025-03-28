
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import ZenithLogo from "@/components/common/ZenithLogo";
import Footer from "@/components/layout/Footer";

const SalesManagement = () => {
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
            <h1 className="text-3xl font-bold text-primary">Sales Management</h1>
          </div>
          
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg mb-6">
              Our Sales Management module provides all the tools your sales team needs to convert leads into customers efficiently.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">Key Features</h2>
            
            <h3 className="text-lg font-medium mt-6 mb-2">Lead Tracking and Pipeline Management</h3>
            <p>
              Capture, organize, and follow up with leads throughout the sales cycle. Our visual pipeline gives you a clear view of every opportunity's status and helps you prioritize your team's efforts.
            </p>
            
            <h3 className="text-lg font-medium mt-6 mb-2">Automated Follow-ups</h3>
            <p>
              Never miss an opportunity with automated email reminders and notifications. Set up personalized follow-up sequences that keep prospects engaged without requiring manual intervention.
            </p>
            
            <h3 className="text-lg font-medium mt-6 mb-2">Sales Forecasting</h3>
            <p>
              Make data-driven decisions with accurate sales predictions. Our forecasting tools analyze historical performance and current pipeline to project future results.
            </p>
            
            <h3 className="text-lg font-medium mt-6 mb-2">AI-Powered Lead Scoring</h3>
            <p>
              Focus on your most promising leads first. Our AI engine automatically evaluates and scores leads based on engagement, behavior patterns, and demographic fit with your ideal customer profile.
            </p>
            
            <div className="bg-muted p-6 rounded-lg mt-8">
              <h3 className="text-lg font-medium mb-4">Ready to transform your sales process?</h3>
              <Button onClick={() => navigate("/auth/signup")}>Start Your Free Trial</Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SalesManagement;
