
import React from "react";
import { Link } from "react-router-dom";
import ZenithLogo from "../common/ZenithLogo";
import { scrollToTop } from "@/utils/scrollUtils";
import { useToast } from "@/hooks/use-toast";

const Footer = () => {
  const { toast } = useToast();
  
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    scrollToTop();
  };
  
  const handleSupportEmailClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    toast({
      title: "Coming Soon",
      description: "Support email functionality will be available soon.",
    });
  };

  return (
    <footer className="w-full bg-background border-t border-border py-8 px-4 md:px-6 mt-auto">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <ZenithLogo width={36} height={36} />
              <span className="text-xl font-bold text-primary">Zenith Vault</span>
            </div>
            <p className="text-muted-foreground text-sm">
              The ultimate all-in-one platform for managing your business securely and efficiently with AI-driven insights.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground mb-4">Features</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/features/sales-management" className="text-muted-foreground hover:text-primary transition-colors" onClick={handleLinkClick}>Sales Management</Link></li>
              <li><Link to="/features/customer-service" className="text-muted-foreground hover:text-primary transition-colors" onClick={handleLinkClick}>Customer Service</Link></li>
              <li><Link to="/features/marketing-automation" className="text-muted-foreground hover:text-primary transition-colors" onClick={handleLinkClick}>Marketing Automation</Link></li>
              <li><Link to="/features/website-development" className="text-muted-foreground hover:text-primary transition-colors" onClick={handleLinkClick}>Website Development</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="text-muted-foreground hover:text-primary transition-colors" onClick={handleLinkClick}>About Us</Link></li>
              <li><Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors" onClick={handleLinkClick}>Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors" onClick={handleLinkClick}>Terms of Service</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors" onClick={handleLinkClick}>Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/faq" className="text-muted-foreground hover:text-primary transition-colors" onClick={handleLinkClick}>FAQ</Link></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors" onClick={handleSupportEmailClick}>support@zenithvault.com</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Zenith Vault. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link to="/privacy" className="text-muted-foreground hover:text-primary text-xs" onClick={handleLinkClick}>Privacy</Link>
            <Link to="/terms" className="text-muted-foreground hover:text-primary text-xs" onClick={handleLinkClick}>Terms</Link>
            <Link to="/faq" className="text-muted-foreground hover:text-primary text-xs" onClick={handleLinkClick}>FAQ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
