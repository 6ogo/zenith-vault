
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import ZenithLogo from "@/components/common/ZenithLogo";
import Footer from "@/components/layout/Footer";

const MarketingAutomation = () => {
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
            <h1 className="text-3xl font-bold text-primary">Marketing Automation</h1>
          </div>
          
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg mb-6">
              Scale your marketing efforts and engage customers effectively with our powerful Marketing Automation tools.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">Key Features</h2>
            
            <h3 className="text-lg font-medium mt-6 mb-2">Personalized Campaign Management</h3>
            <p>
              Create and manage targeted email and social media campaigns that resonate with your audience. Tailor messaging based on customer segments, behaviors, and preferences.
            </p>
            
            <h3 className="text-lg font-medium mt-6 mb-2">Real-time Engagement Tracking</h3>
            <p>
              Monitor campaign performance as it happens. Track opens, clicks, conversions, and other key metrics to understand what's working and optimize on the fly.
            </p>
            
            <h3 className="text-lg font-medium mt-6 mb-2">AI-Driven Content Generation</h3>
            <p>
              Accelerate content creation with AI assistance. Generate compelling email subject lines, social media posts, and campaign copy that drives engagement.
            </p>
            
            <h3 className="text-lg font-medium mt-6 mb-2">Customer Segmentation</h3>
            <p>
              Divide your audience into targeted groups based on demographics, purchase history, engagement level, and other relevant criteria to deliver the right message to the right people.
            </p>
            
            <div className="bg-muted p-6 rounded-lg mt-8">
              <h3 className="text-lg font-medium mb-4">Ready to supercharge your marketing efforts?</h3>
              <Button onClick={() => navigate("/auth/signup")}>Start Your Free Trial</Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MarketingAutomation;
