// src/components/layout/Sidebar.tsx
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import {
  Home,
  LayoutDashboard,
  BarChart,
  Users,
  ShoppingCart,
  LifeBuoy,
  Megaphone,
  Globe,
  Settings,
  ChevronLeft,
  ChevronRight,
  Gitlab,
  Building2,
  Database,
  FileUp,
  FileText,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface SidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const Sidebar = ({ isCollapsed, onToggleCollapse }: SidebarProps) => {
  const location = useLocation();

  const routes = [
    {
      path: "/dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
    },
    {
      path: "/sales",
      icon: BarChart,
      label: "Sales",
    },
    {
      path: "/customers",
      icon: Users,
      label: "Customers",
    },
    {
      path: "/service",
      icon: LifeBuoy,
      label: "Service",
    },
    {
      path: "/marketing",
      icon: Megaphone,
      label: "Marketing",
    },
    {
      path: "/analytics",
      icon: Globe,
      label: "Analytics",
    },
    {
      path: "/reports",
      icon: FileText,
      label: "Reports",
    },
    {
      path: "/website",
      icon: Home,
      label: "Website",
    },
    {
      path: "/data",
      icon: Database,
      label: "Data Files",
    },
    {
      path: "/integrations",
      icon: Gitlab,
      label: "Integrations",
    },
    {
      path: "/organization",
      icon: Building2,
      label: "Organization",
    },
    {
      path: "/settings",
      icon: Settings,
      label: "Settings",
    },
  ];

  return (
    <div className={cn(
      "flex flex-col h-full bg-[#003366] border-r border-border transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="flex items-center h-16 px-4 border-b border-border justify-between">
        <button
          onClick={onToggleCollapse}
          className="flex items-center justify-between w-full text-sm text-sidebar-foreground hover:text-white transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5 mx-auto" />
          ) : (
            <>
              <span>Collapse</span>
              <ChevronLeft className="w-5 h-5" />
            </>
          )}
        </button>
      </div>

      <Separator className="my-2" />

      <div className="flex flex-col flex-grow overflow-y-auto">
        <ScrollArea className="flex-grow">
          <div className="p-4">
            <nav className="flex flex-col space-y-1">
              {routes.map((route) => (
                <NavLink
                  key={route.path}
                  to={route.path}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground",
                      isCollapsed ? "justify-center" : "justify-start"
                    )
                  }
                >
                  {isCollapsed ? (
                    <route.icon className="w-5 h-5" />
                  ) : (
                    <>
                      <route.icon className="w-5 h-5" />
                      <span className="ml-2">{route.label}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default Sidebar;