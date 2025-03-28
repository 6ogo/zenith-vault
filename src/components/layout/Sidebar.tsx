
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import ZenithLogo from "../common/ZenithLogo";
import { 
  LayoutDashboard, 
  Users, 
  ShoppingCart, 
  MessageSquare, 
  BarChart3, 
  Mail, 
  Laptop, 
  Settings,
  LogOut
} from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

const mainNavItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    label: "Sales",
    href: "/sales",
    icon: <ShoppingCart className="h-5 w-5" />,
  },
  {
    label: "Customers",
    href: "/customers",
    icon: <Users className="h-5 w-5" />,
  },
  {
    label: "Service",
    href: "/service",
    icon: <MessageSquare className="h-5 w-5" />,
  },
  {
    label: "Marketing",
    href: "/marketing",
    icon: <Mail className="h-5 w-5" />,
  },
  {
    label: "Analytics",
    href: "/analytics",
    icon: <BarChart3 className="h-5 w-5" />,
  },
  {
    label: "Website",
    href: "/website",
    icon: <Laptop className="h-5 w-5" />,
  },
];

const secondaryNavItems: NavItem[] = [
  {
    label: "Settings",
    href: "/settings",
    icon: <Settings className="h-5 w-5" />,
  },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  
  const isActiveRoute = (path: string) => {
    if (path === "/dashboard" && location.pathname === "/dashboard") {
      return true;
    }
    return location.pathname.startsWith(path) && path !== "/dashboard";
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user) return "ZV";
    
    const name = user.user_metadata?.full_name || user.email || "";
    if (!name) return "ZV";
    
    if (name.includes('@')) {
      return name.substring(0, 2).toUpperCase();
    }
    
    const parts = name.split(' ');
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground">
      <div className="p-4 border-b border-sidebar-border">
        <Link to="/dashboard" className="flex items-center gap-2">
          <ZenithLogo width={32} height={32} className="text-sidebar-primary-foreground" />
          <div className="font-semibold text-sidebar-foreground">Zenith Vault</div>
        </Link>
      </div>
      
      <div className="flex-1 py-4 flex flex-col">
        <nav className="px-2 space-y-1">
          {mainNavItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "nav-item",
                isActiveRoute(item.href) ? "nav-item-active" : "nav-item-inactive"
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
        
        <div className="mt-auto">
          <div className="px-3 py-2 text-xs font-semibold text-sidebar-foreground/60 uppercase">
            Admin
          </div>
          <nav className="px-2 space-y-1">
            {secondaryNavItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "nav-item",
                  isActiveRoute(item.href) ? "nav-item-active" : "nav-item-inactive"
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      
      <div className="p-3 border-t border-sidebar-border">
        <div className="flex items-center justify-between px-2 py-2">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-sidebar-primary flex items-center justify-center text-white font-medium">
              {getUserInitials()}
            </div>
            <div>
              <div className="text-sm font-medium">{user?.user_metadata?.full_name || "User"}</div>
              <div className="text-xs text-sidebar-foreground/70">{user?.user_metadata?.role || "User"}</div>
            </div>
          </div>
          <button 
            className="text-sidebar-foreground/70 hover:text-sidebar-foreground"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
