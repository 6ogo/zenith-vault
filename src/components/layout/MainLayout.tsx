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
  const [headerHeight, setHeaderHeight] = useState(0);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const toggleSidebarCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  useEffect(() => {
    const updateElementHeights = () => {
      if (footerRef.current) {
        setFooterHeight(footerRef.current.offsetHeight);
      }
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
    };

    updateElementHeights();
    window.addEventListener('resize', updateElementHeights);
    
    return () => {
      window.removeEventListener('resize', updateElementHeights);
    };
  }, []);
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Fixed header at the top */}
      <Header ref={headerRef} toggleSidebar={toggleSidebar} className="fixed top-0 left-0 w-full z-40" />
      
      {/* Content area with appropriate padding to account for fixed header */}
      <div className="flex flex-1 relative" style={{ marginTop: `${headerHeight}px` }}>
        {/* Mobile sidebar - absolute positioning */}
        <div className={`fixed inset-0 z-30 transform md:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`} style={{ top: `${headerHeight}px` }}>
          <div className="relative h-full w-64 max-w-xs">
            <div className="h-full">
              <Sidebar isCollapsed={false} onToggleCollapse={toggleSidebarCollapse} />
            </div>
            <div 
              className="absolute inset-0 -right-10 w-screen bg-black/50"
              onClick={toggleSidebar}
            ></div>
          </div>
        </div>
        
        {/* Desktop sidebar - fixed positioning */}
        <div 
          className={`hidden md:block fixed top-0 left-0 h-screen transition-all duration-300 z-20 ${
            sidebarCollapsed ? "w-16" : "w-64"
          }`}
          style={{ 
            top: `${headerHeight}px`, 
            height: `calc(100vh - ${headerHeight}px)`,
          }}
        >
          <div className="h-full overflow-auto" style={{ maxHeight: `calc(100vh - ${headerHeight}px)` }}>
            <Sidebar isCollapsed={sidebarCollapsed} onToggleCollapse={toggleSidebarCollapse} />
          </div>
        </div>
        
        {/* Main content with margin to account for sidebar */}
        <div className="flex-1">
          <main className={`p-4 md:p-6 w-full transition-all duration-300 ${
            sidebarCollapsed ? "md:ml-16" : "md:ml-64"
          }`}>
            <Outlet />
          </main>
        </div>
      </div>
      
      {/* Footer */}
      <Footer ref={footerRef} />
    </div>
  );
};

export default MainLayout;