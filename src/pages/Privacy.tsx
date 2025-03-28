
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import ZenithLogo from "@/components/common/ZenithLogo";
import Footer from "@/components/layout/Footer";

const Privacy = () => {
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
            <h1 className="text-4xl font-bold text-primary">Privacy Policy</h1>
            <p className="text-muted-foreground mt-4">Last Updated: July 1, 2023</p>
          </div>

          <div className="prose dark:prose-invert max-w-none">
            <h2>Introduction</h2>
            <p>
              At Zenith Vault, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, 
              and safeguard your information when you use our platform. Please read this policy carefully to understand our 
              practices regarding your personal data and how we will treat it.
            </p>

            <h2>Information We Collect</h2>
            <p>
              We collect several types of information from and about users of our platform, including:
            </p>
            <ul>
              <li>
                <strong>Personal Information:</strong> Including name, email address, telephone number, company details, 
                and payment information when you register for an account or make a purchase.
              </li>
              <li>
                <strong>Usage Data:</strong> Information about how you use our platform, including features accessed, 
                time spent, and actions taken.
              </li>
              <li>
                <strong>Customer Data:</strong> Data you input into the platform about your customers, sales, marketing 
                activities, and other business information.
              </li>
              <li>
                <strong>Technical Data:</strong> IP address, browser type, device information, and other technical details.
              </li>
            </ul>

            <h2>How We Use Your Information</h2>
            <p>
              We use the information we collect to:
            </p>
            <ul>
              <li>Provide, maintain, and improve our platform.</li>
              <li>Process transactions and send related information.</li>
              <li>Send administrative notifications, such as updates, security alerts, and support messages.</li>
              <li>Personalize your experience and deliver content relevant to your business needs.</li>
              <li>Analyze usage patterns to enhance our platform's functionality and user experience.</li>
              <li>Protect against unauthorized access and legal liability.</li>
            </ul>

            <h2>Data Security</h2>
            <p>
              We implement robust security measures to protect your personal information, including:
            </p>
            <ul>
              <li>End-to-end encryption for sensitive data.</li>
              <li>Role-based access control to limit data accessibility.</li>
              <li>Regular security audits and vulnerability assessments.</li>
              <li>Employee training on data security best practices.</li>
            </ul>

            <h2>Your Rights</h2>
            <p>
              Depending on your location, you may have certain rights regarding your personal information, including:
            </p>
            <ul>
              <li>The right to access your personal data.</li>
              <li>The right to correct inaccurate information.</li>
              <li>The right to delete your personal data.</li>
              <li>The right to restrict or object to processing.</li>
              <li>The right to data portability.</li>
            </ul>

            <h2>Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or our data practices, please contact us at:
            </p>
            <p>
              Email: privacy@zenithvault.com<br />
              Address: 123 Business Ave, Tech City, CA 94043
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

export default Privacy;
