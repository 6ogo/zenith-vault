
import React, { useState, useRef, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [footerHeight, setFooterHeight] = useState(0);
  const footerRef = useRef<HTMLElement | null>(null);
  const location = useLocation();
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const toggleSidebarCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Update footer height when it changes
  useEffect(() => {
    const updateFooterHeight = () => {
      if (footerRef.current) {
        setFooterHeight(footerRef.current.offsetHeight);
      }
    };

    updateFooterHeight();
    window.addEventListener("resize", updateFooterHeight);
    
    return () => {
      window.removeEventListener("resize", updateFooterHeight);
    };
  }, []);
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header - not sticky */}
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
        
        {/* Desktop sidebar - sticky with top-16 (header height) and stop at footer */}
        <div 
          className={`hidden md:block sticky top-16 h-[calc(100vh-4rem-${footerHeight}px)] z-20 transition-all duration-300 ${
            sidebarCollapsed ? "w-16" : "w-72"
          }`} 
          style={{ 
            height: `calc(100vh - 4rem - ${footerHeight}px)`,
            maxHeight: `calc(100vh - 4rem - ${footerHeight}px)`
          }}
        >
          <Sidebar isCollapsed={sidebarCollapsed} onToggleCollapse={toggleSidebarCollapse} />
        </div>
        
        {/* Main content - full width */}
        <div className="flex-1 w-full">
          <main className="p-4 md:p-6 w-full">
            <Outlet />
          </main>
        </div>
      </div>
      
      {/* Footer - full width outside the content area */}
      <Footer ref={footerRef} />
    </div>
  );
};

export default MainLayout;
