
import React from "react";
import { Link } from "react-router-dom";
import ZenithLogo from "../common/ZenithLogo";

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border py-8 px-4 md:px-6">
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
              <li><Link to="/features/sales" className="text-muted-foreground hover:text-primary transition-colors">Sales Management</Link></li>
              <li><Link to="/features/service" className="text-muted-foreground hover:text-primary transition-colors">Customer Service</Link></li>
              <li><Link to="/features/marketing" className="text-muted-foreground hover:text-primary transition-colors">Marketing Automation</Link></li>
              <li><Link to="/features/website" className="text-muted-foreground hover:text-primary transition-colors">Website Development</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/faq" className="text-muted-foreground hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link to="/docs" className="text-muted-foreground hover:text-primary transition-colors">Documentation</Link></li>
              <li><a href="mailto:support@zenithvault.com" className="text-muted-foreground hover:text-primary transition-colors">support@zenithvault.com</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Zenith Vault. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="text-muted-foreground hover:text-primary text-xs">Privacy</a>
            <a href="#" className="text-muted-foreground hover:text-primary text-xs">Terms</a>
            <a href="#" className="text-muted-foreground hover:text-primary text-xs">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
