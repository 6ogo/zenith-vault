
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import ZenithLogo from "@/components/common/ZenithLogo";
import Footer from "@/components/layout/Footer";

const Terms = () => {
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
            <h1 className="text-4xl font-bold text-primary">Terms of Service</h1>
            <p className="text-muted-foreground mt-4">Last Updated: July 1, 2023</p>
          </div>

          <div className="prose dark:prose-invert max-w-none">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using the Zenith Vault platform, you agree to be bound by these Terms of Service. If you do not 
              agree to these terms, please do not use our platform.
            </p>

            <h2>2. Description of Service</h2>
            <p>
              Zenith Vault provides an all-in-one online digital business platform designed to help organizations manage 
              customer lifecycles, including sales management, customer service, marketing automation, and website development.
            </p>

            <h2>3. User Accounts</h2>
            <p>
              To access certain features of the platform, you must register for an account. You are responsible for maintaining 
              the confidentiality of your account credentials and for all activities that occur under your account. You agree to 
              provide accurate and complete information during registration and to update your information as needed.
            </p>

            <h2>4. Subscription and Billing</h2>
            <p>
              Zenith Vault offers various subscription plans with different features and pricing. By subscribing to a paid plan, 
              you agree to pay the applicable fees as they become due. Subscription fees are charged at the beginning of each 
              billing cycle. Unless otherwise specified, subscriptions automatically renew until canceled.
            </p>

            <h2>5. User Content</h2>
            <p>
              Users may upload, store, and share content through the platform. You retain ownership of your content, but grant 
              Zenith Vault a license to use, reproduce, and display such content solely for the purpose of providing and improving 
              the platform. You are solely responsible for the content you submit and must ensure it does not violate any third-party rights.
            </p>

            <h2>6. Prohibited Use</h2>
            <p>
              You agree not to use the platform to:
            </p>
            <ul>
              <li>Violate any applicable laws or regulations.</li>
              <li>Infringe upon the rights of others.</li>
              <li>Transmit any harmful code or malware.</li>
              <li>Attempt to gain unauthorized access to the platform or other users' accounts.</li>
              <li>Engage in any activity that could damage, disable, or impair the platform's functionality.</li>
            </ul>

            <h2>7. Termination</h2>
            <p>
              Zenith Vault reserves the right to suspend or terminate your access to the platform for violation of these Terms 
              of Service or for any other reason deemed appropriate by Zenith Vault. Upon termination, your right to use the 
              platform will immediately cease.
            </p>

            <h2>8. Disclaimer of Warranties</h2>
            <p>
              The platform is provided "as is" and "as available" without warranties of any kind, either express or implied, 
              including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement.
            </p>

            <h2>9. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, Zenith Vault shall not be liable for any indirect, incidental, special, 
              consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly.
            </p>

            <h2>10. Changes to Terms</h2>
            <p>
              Zenith Vault may modify these Terms of Service at any time. We will notify you of significant changes by posting 
              a notice on our website or sending an email. Your continued use of the platform after such modifications constitutes 
              your acceptance of the updated terms.
            </p>

            <h2>11. Contact Information</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <p>
              Email: legal@zenithvault.com<br />
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

export default Terms;
