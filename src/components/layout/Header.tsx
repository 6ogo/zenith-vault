
import React from "react";
import { Bell, Search, MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
  return (
    <header className="h-16 px-4 flex items-center justify-between border-b border-border bg-white">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={toggleSidebar}
      >
        <MenuIcon className="h-5 w-5" />
      </Button>
      
      <div className="flex-1 flex items-center mx-4 max-w-lg">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full pl-9 bg-secondary border-none focus-visible:ring-1"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        </Button>
        <div className="h-8 w-px bg-border mx-2 hidden sm:block"></div>
        <div className="text-sm text-right mr-2 hidden sm:block">
          <div className="font-medium">John Doe</div>
          <div className="text-xs text-muted-foreground">Administrator</div>
        </div>
        <div className="h-9 w-9 rounded-full bg-salescraft-600 flex items-center justify-center text-white font-medium">
          JD
        </div>
      </div>
    </header>
  );
};

export default Header;
