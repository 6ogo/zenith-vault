import React, { useState, useRef } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const footerRef = useRef<HTMLElement | null>(null);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const toggleSidebarCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Regular header - scrolls with content */}
      <Header toggleSidebar={toggleSidebar} />
      
      {/* Content area */}
      <div className="flex flex-1">
        {/* Mobile sidebar */}
        <div className={`fixed inset-0 z-30 transform md:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`}>
          <div className="relative h-full w-72 max-w-xs">
            <div className="h-full">
              <Sidebar isCollapsed={false} onToggleCollapse={toggleSidebarCollapse} />
            </div>
            <div className="absolute inset-0 -right-10 w-screen bg-black/50"
              onClick={toggleSidebar}></div>
          </div>
        </div>
        
        {/* Desktop sidebar - sticky with top-0 */}
        <div className={`hidden md:block sticky top-0 h-screen z-20 transition-all duration-300 ${
          sidebarCollapsed ? "w-16" : "w-72"
        }`}>
          <Sidebar isCollapsed={sidebarCollapsed} onToggleCollapse={toggleSidebarCollapse} />
        </div>
        
        {/* Main content */}
        <div className="flex-1">
          <main className="p-4 md:p-6 w-full overflow-x-auto">
            <Outlet />
          </main>
        </div>
      </div>
      
      {/* Footer - completely outside the content area */}
      <Footer ref={footerRef} />
    </div>
  );
};

export default MainLayout;