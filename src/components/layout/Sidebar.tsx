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
  ToggleLeft,
  ToggleRight,
  Gitlab,
  Building2,
} from "lucide-react";

interface SidebarProps {
  isCollapsed?: boolean;
}

const Sidebar = ({ isCollapsed }: SidebarProps) => {
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
      path: "/website",
      icon: Home,
      label: "Website",
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
      "flex flex-col w-full h-full bg-secondary border-r border-border",
      isCollapsed ? "w-16" : "w-72"
    )}>
      <div className="flex items-center h-16 px-4 border-b border-border">
        <span className="font-bold text-lg">
          {isCollapsed ? "AC" : "Admin Console"}
        </span>
      </div>
      <div className="flex-grow p-4">
        <nav className="flex flex-col space-y-1">
          {routes.map((route) => (
            <NavLink
              key={route.path}
              to={route.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-muted hover:text-foreground transition-colors",
                  isActive
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground",
                  isCollapsed ? "justify-center" : "justify-start"
                )
              }
            >
              <route.icon className="w-4 h-4 mr-2" />
              {!isCollapsed && <span>{route.label}</span>}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {isCollapsed ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4 mr-2" />}
            {!isCollapsed && "Collapse"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
