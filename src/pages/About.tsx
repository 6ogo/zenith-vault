
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import ZenithLogo from "@/components/common/ZenithLogo";
import Footer from "@/components/layout/Footer";

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="py-4 px-4 md:px-8 lg:px-12 border-b">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ZenithLogo width={40} height={40} />
            <h1 className="text-xl font-bold text-primary">Zenith Vault</h1>
          </div>
          <Button 
            onClick={() => navigate("/")}
            variant="outline"
          >
            Back to Home
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-12 px-4 md:px-8">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <ZenithLogo width={60} height={60} className="mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-primary">About Zenith Vault</h1>
            <p className="text-muted-foreground mt-4">Your partner in business transformation and growth</p>
          </div>

          <div className="prose dark:prose-invert max-w-none">
            <h2>Our Mission</h2>
            <p>
              At Zenith Vault, our mission is to empower businesses with the tools they need to thrive in a digital-first world. 
              We believe that every organization, regardless of size, should have access to enterprise-level technology that can 
              drive growth, enhance customer experiences, and streamline operations.
            </p>

            <h2>Our Story</h2>
            <p>
              Founded in 2023, Zenith Vault was born out of a simple observation: businesses were using too many disconnected 
              tools to manage their operations. This fragmentation was leading to inefficiency, data silos, and missed opportunities.
            </p>
            
            <p>
              Our team of industry veterans came together with a vision to create a unified platform that would bring sales, 
              customer service, marketing, and website management under one roof—all powered by cutting-edge AI to deliver 
              actionable insights and automation.
            </p>

            <h2>Our Approach</h2>
            <p>
              Zenith Vault is built on three core principles:
            </p>
            <ul>
              <li>
                <strong>Integration:</strong> Breaking down silos between departments to create a seamless flow of information.
              </li>
              <li>
                <strong>Intelligence:</strong> Leveraging AI to transform raw data into actionable insights and automate routine tasks.
              </li>
              <li>
                <strong>Security:</strong> Implementing enterprise-grade security measures to protect sensitive business data.
              </li>
            </ul>

            <h2>Our Team</h2>
            <p>
              Our diverse team brings together expertise from software development, data science, cybersecurity, and business 
              operations. We're passionate about creating technology that makes a tangible difference for our clients, and we're 
              committed to providing exceptional support at every step of the journey.
            </p>

            <h2>Join Us</h2>
            <p>
              Ready to experience the zenith of business efficiency? Start your free trial today and discover how our platform 
              can transform your operations, enhance customer relationships, and drive sustainable growth.
            </p>
          </div>

          <div className="mt-12 text-center">
            <Button 
              size="lg"
              onClick={() => navigate("/")}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default About;
