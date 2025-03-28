
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import ZenithLogo from "@/components/common/ZenithLogo";
import Footer from "@/components/layout/Footer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const Contact = () => {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const showComingSoonDialog = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDialogOpen(true);
  };

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
            <h1 className="text-3xl font-bold text-primary">Contact Us</h1>
          </div>
          
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg mb-6">
              We're here to answer your questions and help you get the most out of Zenith Vault.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              <div className="bg-muted p-6 rounded-lg">
                <h3 className="text-xl font-medium mb-4">Email Support</h3>
                <p className="mb-4">For general inquiries and customer support:</p>
                <a 
                  href="#" 
                  onClick={showComingSoonDialog}
                  className="text-primary hover:underline"
                >
                  support@zenithvault.com
                </a>
              </div>
              
              <div className="bg-muted p-6 rounded-lg">
                <h3 className="text-xl font-medium mb-4">Sales Inquiries</h3>
                <p className="mb-4">To learn more about our pricing and plans:</p>
                <a 
                  href="#" 
                  onClick={showComingSoonDialog}
                  className="text-primary hover:underline"
                >
                  sales@zenithvault.com
                </a>
              </div>
            </div>
            
            <div className="mt-12">
              <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
              <p className="mb-4">
                Find quick answers to common questions in our FAQ section.
              </p>
              <Button 
                variant="outline"
                onClick={() => navigate("/faq")}
              >
                Visit FAQ
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Coming Soon</DialogTitle>
            <DialogDescription>
              Our contact support system is currently being upgraded. Thank you for your patience.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Contact;
