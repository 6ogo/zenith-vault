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
    <div className="flex min-h-screen bg-background flex-col">
      {/* Header */}
      <Header toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1">
        {/* Sidebar for mobile (absolutely positioned) */}
        <div
          className={`fixed inset-0 z-30 transform md:hidden ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out`}
        >
          <div className="relative h-full w-72 max-w-xs">
            <div className="h-full">
              <Sidebar isCollapsed={false} onToggleCollapse={toggleSidebarCollapse} />
            </div>
            {/* Close sidebar when clicking outside */}
            <div
              className="absolute inset-0 -right-10 w-screen bg-black/50"
              onClick={toggleSidebar}
            ></div>
          </div>
        </div>
        
        {/* Desktop sidebar - fixed position instead of sticky */}
        <div className={`hidden md:block fixed top-16 left-0 h-[calc(100vh-4rem)] overflow-y-auto z-20 transition-all duration-300 ${
          sidebarCollapsed ? "w-16" : "w-72"
        }`}>
          <Sidebar isCollapsed={sidebarCollapsed} onToggleCollapse={toggleSidebarCollapse} />
        </div>
        
        {/* Main content with margin to accommodate sidebar */}
        <div className={`flex flex-col flex-1 w-full ${
          sidebarCollapsed ? "md:ml-16" : "md:ml-72"
        }`}>
          <main className="flex-1 p-4 md:p-6 max-w-full overflow-x-auto">
            <Outlet />
          </main>
          
          {/* Footer - now full width relative to the main content area */}
          <Footer ref={footerRef} />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;