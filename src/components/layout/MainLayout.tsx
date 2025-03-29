
import React, { useState, useRef, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const footerRef = useRef<HTMLElement | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);
  const location = useLocation();
  const [footerHeight, setFooterHeight] = useState(0);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const toggleSidebarCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  useEffect(() => {
    const updateFooterHeight = () => {
      if (footerRef.current) {
        setFooterHeight(footerRef.current.offsetHeight);
      }
    };

    updateFooterHeight();
    window.addEventListener('resize', updateFooterHeight);
    
    return () => {
      window.removeEventListener('resize', updateFooterHeight);
    };
  }, []);
  
  // Define styling for the sidebar to ensure consistent behavior across all pages
  const getSidebarStyle = () => {
    return {
      position: "fixed",
      top: "64px", // height of header (h-16)
      height: `calc(100vh - 64px)`,
      overflowY: "auto",
      maxHeight: `calc(100vh - 64px - ${footerHeight}px)`, // Account for header and footer
      zIndex: 20
    } as React.CSSProperties;
  };
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Regular header - normal flow, not fixed */}
      <Header ref={headerRef} toggleSidebar={toggleSidebar} className="w-full z-40" />
      
      {/* Content area */}
      <div className="flex flex-1 relative">
        {/* Mobile sidebar */}
        <div className={`fixed inset-0 z-30 transform md:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`}>
          <div className="relative h-full w-64 max-w-xs">
            <div className="h-full">
              <Sidebar isCollapsed={false} onToggleCollapse={toggleSidebarCollapse} />
            </div>
            <div className="absolute inset-0 -right-10 w-screen bg-black/50"
              onClick={toggleSidebar}></div>
          </div>
        </div>
        
        {/* Desktop sidebar - fixed with top adjusted to header height */}
        <div 
          style={getSidebarStyle()}
          className={`hidden md:block transition-all duration-300 ${
            sidebarCollapsed ? "w-16" : "w-64"
          }`}
        >
          <Sidebar isCollapsed={sidebarCollapsed} onToggleCollapse={toggleSidebarCollapse} />
        </div>
        
        {/* Main content with margin to account for fixed sidebar */}
        <div className="flex-1">
          <main className={`p-4 md:p-6 w-full ${
            sidebarCollapsed ? "md:ml-16" : "md:ml-64"
          }`}>
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
