
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
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
    href: "/",
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
  
  const isActiveRoute = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground">
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="bg-sidebar-primary rounded-md p-1">
            <div className="font-bold text-sidebar-primary-foreground text-xl">SC</div>
          </div>
          <div className="font-semibold text-sidebar-foreground">SalesCraft Hub</div>
        </div>
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
            <div className="h-8 w-8 rounded-full bg-salescraft-600 flex items-center justify-center text-white font-medium">
              JD
            </div>
            <div>
              <div className="text-sm font-medium">John Doe</div>
              <div className="text-xs text-sidebar-foreground/70">Admin</div>
            </div>
          </div>
          <button className="text-sidebar-foreground/70 hover:text-sidebar-foreground">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
