
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
            <h1 className="text-3xl font-bold text-primary">Website Development</h1>
          </div>
          
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg mb-6">
              Build and maintain your online presence with our flexible Website Development tools, designed for users of all technical levels.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">Key Features</h2>
            
            <h3 className="text-lg font-medium mt-6 mb-2">Pre-built Industry Templates</h3>
            <p>
              Get started quickly with professionally designed templates tailored to your industry. Choose from a variety of layouts and styles that reflect your brand identity.
            </p>
            
            <h3 className="text-lg font-medium mt-6 mb-2">Visual Drag-and-Drop Builder</h3>
            <p>
              Create and modify your website without coding knowledge. Our intuitive visual editor lets you arrange elements, customize styles, and preview changes in real-time.
            </p>
            
            <h3 className="text-lg font-medium mt-6 mb-2">Pro-Code Customization</h3>
            <p>
              For developers and advanced users, access the full code editor to implement custom features and designs. Take complete control of your website's functionality and appearance.
            </p>
            
            <h3 className="text-lg font-medium mt-6 mb-2">Automated Deployment and Hosting</h3>
            <p>
              Publish your website with one click and let us handle the technical details. Your site is automatically optimized for speed and security on our reliable hosting infrastructure.
            </p>
            
            <div className="bg-muted p-6 rounded-lg mt-8">
              <h3 className="text-lg font-medium mb-4">Ready to build your perfect website?</h3>
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
