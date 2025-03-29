
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import ZenithLogo from "@/components/common/ZenithLogo";
import Footer from "@/components/layout/Footer";

const WebsiteDevelopment = () => {
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
            <h1 className="text-3xl font-bold text-primary">Website Overview</h1>
          </div>
          
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg mb-6">
              Get an edge with our SEO and performance ranker, plus competitor analysis. Optimize your online presence and stay competitive.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">Key Features</h2>
            
            <h3 className="text-lg font-medium mt-6 mb-2">SEO Performance Analysis</h3>
            <p>
              Gain insights into your website's search engine ranking with detailed SEO metrics and recommendations for improvement.
            </p>
            
            <h3 className="text-lg font-medium mt-6 mb-2">Competitor Analysis</h3>
            <p>
              Benchmark your website against competitors to identify opportunities and stay ahead in your industry.
            </p>
            
            <h3 className="text-lg font-medium mt-6 mb-2">Performance Optimization</h3>
            <p>
              Enhance your website's speed and user experience with targeted performance improvements based on detailed analysis.
            </p>
            
            <h3 className="text-lg font-medium mt-6 mb-2">Automated Recommendations</h3>
            <p>
              Receive AI-powered suggestions to improve your online presence, tailored to your specific business needs and goals.
            </p>
            
            <div className="bg-muted p-6 rounded-lg mt-8">
              <h3 className="text-lg font-medium mb-4">Ready to optimize your online presence?</h3>
              <Button onClick={() => navigate("/auth/signup")}>Start Your Free Trial</Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default WebsiteDevelopment;
