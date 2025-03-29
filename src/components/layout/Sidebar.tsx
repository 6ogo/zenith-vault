
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Building2,
  UserCircle,
  Settings,
  BarChart3,
  ListFilter,
  Users,
  HeadphonesIcon,
  LineChart,
  FileBarChart,
  PuzzleIcon,
  FolderIcon,
  Globe,
  MessageCircle
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  className?: string;
}

// MenuItem type definition
type MenuItem = {
  title: string;
  icon: React.ReactNode;
  path: string;
  children?: MenuItem[];
};

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const [salesOpen, setSalesOpen] = useState(false);
  const [marketingOpen, setMarketingOpen] = useState(false);
  const [integrationsOpen, setIntegrationsOpen] = useState(false);

  const menuItems: MenuItem[] = [
    {
      title: 'Dashboard',
      icon: <BarChart3 className="h-5 w-5" />,
      path: '/dashboard'
    },
    {
      title: 'Organization',
      icon: <Building2 className="h-5 w-5" />,
      path: '/organization'
    },
    {
      title: 'Sales',
      icon: <LineChart className="h-5 w-5" />,
      path: '/sales',
      children: [
        {
          title: 'Overview',
          icon: <LineChart className="h-4 w-4" />,
          path: '/sales'
        },
        {
          title: 'Customers',
          icon: <Users className="h-4 w-4" />,
          path: '/customers'
        }
      ]
    },
    {
      title: 'Service',
      icon: <HeadphonesIcon className="h-5 w-5" />,
      path: '/service'
    },
    {
      title: 'Marketing',
      icon: <ListFilter className="h-5 w-5" />,
      path: '/marketing',
      children: [
        {
          title: 'Overview',
          icon: <ListFilter className="h-4 w-4" />,
          path: '/marketing'
        },
        {
          title: 'Analytics',
          icon: <BarChart3 className="h-4 w-4" />,
          path: '/analytics'
        }
      ]
    },
    {
      title: 'Reports',
      icon: <FileBarChart className="h-5 w-5" />,
      path: '/reports'
    },
    {
      title: 'Integrations',
      icon: <PuzzleIcon className="h-5 w-5" />,
      path: '/integrations',
      children: [
        {
          title: 'Overview',
          icon: <PuzzleIcon className="h-4 w-4" />,
          path: '/integrations'
        },
        {
          title: 'Documentation',
          icon: <FolderIcon className="h-4 w-4" />,
          path: '/integration-documentation'
        }
      ]
    },
    {
      title: 'Data Files',
      icon: <FolderIcon className="h-5 w-5" />,
      path: '/data-files'
    },
    {
      title: 'Website',
      icon: <Globe className="h-5 w-5" />,
      path: '/website'
    },
    {
      title: 'Chatbot',
      icon: <MessageCircle className="h-5 w-5" />,
      path: '/chatbot-admin'
    },
    {
      title: 'Profile',
      icon: <UserCircle className="h-5 w-5" />,
      path: '/profile'
    },
    {
      title: 'Settings',
      icon: <Settings className="h-5 w-5" />,
      path: '/settings'
    }
  ];

  const renderMenuItem = (item: MenuItem) => {
    if (item.children) {
      const isOpen = 
        (item.title === 'Sales' && salesOpen) || 
        (item.title === 'Marketing' && marketingOpen) || 
        (item.title === 'Integrations' && integrationsOpen);
      
      const setOpen = (open: boolean) => {
        if (item.title === 'Sales') setSalesOpen(open);
        else if (item.title === 'Marketing') setMarketingOpen(open);
        else if (item.title === 'Integrations') setIntegrationsOpen(open);
      };
      
      return (
        <Collapsible 
          key={item.path} 
          open={isOpen} 
          onOpenChange={setOpen}
          className="w-full"
        >
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "flex w-full items-center justify-between px-2 py-2 text-muted-foreground hover:bg-muted hover:text-foreground rounded-md transition-colors",
                isOpen && "text-foreground bg-muted"
              )}
            >
              <div className="flex items-center">
                {item.icon}
                <span className="ml-2">{item.title}</span>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  isOpen ? "rotate-180 transform" : ""
                )}
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pl-4 space-y-1 mt-1">
            {item.children.map(child => (
              <NavLink
                key={child.path}
                to={child.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center px-2 py-2 text-sm rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors",
                    isActive && "text-foreground bg-muted"
                  )
                }
              >
                {child.icon}
                <span className="ml-2">{child.title}</span>
              </NavLink>
            ))}
          </CollapsibleContent>
        </Collapsible>
      );
    } else {
      return (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            cn(
              "flex items-center px-2 py-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors",
              isActive && "text-foreground bg-muted"
            )
          }
        >
          {item.icon}
          <span className="ml-2">{item.title}</span>
        </NavLink>
      );
    }
  };

  return (
    <div className={cn("flex flex-col space-y-1 p-2", className)}>
      {menuItems.map(renderMenuItem)}
    </div>
  );
};

export default Sidebar;
