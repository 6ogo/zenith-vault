
import React from "react";
import { Shield, ArrowRight, BarChart, MessageSquare, Mail, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "Sales Management",
      description: "Track leads, manage pipelines, and forecast sales with AI-powered tools.",
      icon: <BarChart className="h-8 w-8 text-secondary" />
    },
    {
      title: "Customer Service",
      description: "Resolve issues faster with automated case management and sentiment analysis.",
      icon: <MessageSquare className="h-8 w-8 text-secondary" />
    },
    {
      title: "Marketing Automation",
      description: "Create personalized campaigns and track engagement in real-time.",
      icon: <Mail className="h-8 w-8 text-secondary" />
    },
    {
      title: "Website Development",
      description: "Build and host your site with easy-to-use templates or full customization.",
      icon: <Code className="h-8 w-8 text-secondary" />
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 md:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col items-center text-center animate-fade-in">
            <h1 className="hero-title">Welcome to Zenith Vault</h1>
            <p className="slogan">Secure, Streamline, Succeed</p>
            <p className="hero-subtitle max-w-3xl mb-10">
              Transform Your Business with the Ultimate All-in-One Platform.
              Manage your business securely and efficiently with AI-driven insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Button 
                className="cta-button"
                onClick={() => navigate("/auth/signup")}
              >
                Start Your Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                className="border-primary text-primary hover:bg-primary/10"
                onClick={() => navigate("/auth/login")}
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 md:px-8 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-primary font-montserrat">Key Features</h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              Zenith Vault is your central hub for every aspect of the customer lifecycle, 
              integrating cutting-edge AI to automate tasks and enhance decision-making.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="feature-card">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-20 px-4 md:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-primary font-montserrat mb-6">
                Enterprise-Grade Security for Your Business
              </h2>
              <p className="text-muted-foreground mb-6">
                With robust security features—including end-to-end encryption and 
                role-based access—and seamless integrations with your favorite tools, 
                you can focus on what matters most: growing your business.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Shield className="h-6 w-6 text-secondary mr-3 flex-shrink-0 mt-0.5" />
                  <span>End-to-end encryption for all your sensitive data</span>
                </li>
                <li className="flex items-start">
                  <Shield className="h-6 w-6 text-secondary mr-3 flex-shrink-0 mt-0.5" />
                  <span>Role-based access control for team management</span>
                </li>
                <li className="flex items-start">
                  <Shield className="h-6 w-6 text-secondary mr-3 flex-shrink-0 mt-0.5" />
                  <span>Compliance with GDPR, CCPA, and HIPAA regulations</span>
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-8 flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-2xl font-semibold mb-6 font-montserrat">Ready to experience the zenith of business efficiency?</h3>
                <Button 
                  className="cta-button"
                  onClick={() => navigate("/auth/signup")}
                >
                  Start Your Free Trial Today
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
