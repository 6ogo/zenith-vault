import React from "react";
import { Shield, ArrowRight, BarChart, MessageSquare, Mail, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import ZenithLogo from "@/components/common/ZenithLogo";
import Footer from "@/components/layout/Footer";
import DataFlowBackground from "@/components/common/DataFlowBackground";
const Index = () => {
  const navigate = useNavigate();
  const {
    user
  } = useAuth();
  const features = [{
    title: "Sales Management",
    description: "Track leads, manage pipelines, and forecast sales with AI-powered tools.",
    icon: <BarChart className="h-8 w-8 text-secondary" />
  }, {
    title: "Customer Service",
    description: "Resolve issues faster with automated case management and sentiment analysis.",
    icon: <MessageSquare className="h-8 w-8 text-secondary" />
  }, {
    title: "Marketing Automation",
    description: "Create personalized campaigns and track engagement in real-time.",
    icon: <Mail className="h-8 w-8 text-secondary" />
  }, {
    title: "Website Development",
    description: "Build and host your site with easy-to-use templates or full customization.",
    icon: <Code className="h-8 w-8 text-secondary" />
  }];
  const handleGetStarted = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/auth/signup");
    }
  };
  return <div className="min-h-screen w-screen overflow-x-hidden overflow-y-auto dark:bg-gray-950 flex flex-col relative">
      <DataFlowBackground />
      
      {/* Header for landing page - removed border-b */}
      <header className="py-4 px-4 md:px-8 lg:px-12 relative z-10">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ZenithLogo width={40} height={40} />
            <h1 className="text-xl font-bold text-primary">Zenith Vault</h1>
          </div>
          <div className="flex gap-4">
            {!user ? <>
                <Button variant="ghost" onClick={() => navigate("/auth/login")}>
                  Log in
                </Button>
                <Button onClick={() => navigate("/auth/signup")}>
                  Sign up
                </Button>
              </> : <Button onClick={() => navigate("/dashboard")}>
                Dashboard
              </Button>}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4 md:px-8 flex-1 relative z-10 md:py-[122px]">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col items-center text-center animate-fade-in">
            <div className="mb-6">
              <ZenithLogo width={80} height={80} className="mx-auto" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-primary dark:text-primary">Welcome to Zenith Vault</h1>
            
            <p className="text-lg md:text-xl max-w-3xl mb-6 text-muted-foreground dark:text-muted-foreground">
              Transform Your Business with the Platform. Manage your business securely and efficiently with AI-driven insights.
            </p>
            <p className="text-xl md:text-2xl font-medium text-secondary mb-10 dark:text-secondary">Secure, Streamline, Succeed</p>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-medium" onClick={handleGetStarted}>
                {user ? "Go to Dashboard" : "Start Your Free Trial"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              {!user && <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/10 dark:border-primary dark:text-primary" onClick={() => navigate("/auth/login")}>
                  Sign In
                </Button>}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 md:px-8 bg-muted/50 dark:bg-gray-900 relative z-10 mt-auto">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-primary dark:text-primary">Key Features</h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto dark:text-muted-foreground">
              Zenith Vault is your central hub for every aspect of the customer lifecycle, 
              integrating cutting-edge AI to automate tasks and enhance decision-making.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => <Card key={index} className="border border-border hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground dark:text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground dark:text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-20 px-4 md:px-8 dark:bg-gray-950 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-6 dark:text-primary">
                Enterprise-Grade Security for Your Business
              </h2>
              <p className="text-muted-foreground mb-6 dark:text-muted-foreground">
                With robust security features—including end-to-end encryption and 
                role-based access—and seamless integrations with your favorite tools, 
                you can focus on what matters most: growing your business.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Shield className="h-6 w-6 text-secondary mr-3 flex-shrink-0 mt-0.5 dark:text-secondary" />
                  <span className="dark:text-gray-300">End-to-end encryption for all your sensitive data</span>
                </li>
                <li className="flex items-start">
                  <Shield className="h-6 w-6 text-secondary mr-3 flex-shrink-0 mt-0.5 dark:text-secondary" />
                  <span className="dark:text-gray-300">Role-based access control for team management</span>
                </li>
                <li className="flex items-start">
                  <Shield className="h-6 w-6 text-secondary mr-3 flex-shrink-0 mt-0.5 dark:text-secondary" />
                  <span className="dark:text-gray-300">Compliance with GDPR, CCPA, and HIPAA regulations</span>
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-8 flex items-center justify-center dark:from-primary/5 dark:to-secondary/5">
              <div className="text-center">
                <h3 className="text-2xl font-semibold mb-6 dark:text-gray-200">Ready to experience the zenith of business efficiency?</h3>
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-medium" onClick={handleGetStarted}>
                  {user ? "Go to Dashboard" : "Start Your Free Trial Today"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>;
};
export default Index;