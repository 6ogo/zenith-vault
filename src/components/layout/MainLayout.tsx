
import React, { useState, useRef, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const footerRef = useRef<HTMLElement | null>(null);
  const [sidebarHeight, setSidebarHeight] = useState<string>("calc(100vh - 4rem)");
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const toggleSidebarCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Adjust sidebar height when footer position changes
  useEffect(() => {
    const updateSidebarHeight = () => {
      if (footerRef.current) {
        const footerTop = footerRef.current.getBoundingClientRect().top;
        const headerHeight = 64; // 4rem or 64px
        const viewportHeight = window.innerHeight;
        
        // If footer is in view, adjust sidebar height
        if (footerTop < viewportHeight) {
          const newHeight = footerTop - headerHeight;
          setSidebarHeight(`${newHeight}px`);
        } else {
          // Footer not in view, sidebar can take full height minus header
          setSidebarHeight("calc(100vh - 4rem)");
        }
      }
    };

    // Run on mount and when window is resized or scrolled
    updateSidebarHeight();
    window.addEventListener("resize", updateSidebarHeight);
    window.addEventListener("scroll", updateSidebarHeight);

    return () => {
      window.removeEventListener("resize", updateSidebarHeight);
      window.removeEventListener("scroll", updateSidebarHeight);
    };
  }, []);
  
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
        
        {/* Sidebar for desktop - positioned below header with dynamic height */}
        <div className={`hidden md:block sticky top-16 z-20 transition-all duration-300 ${
          sidebarCollapsed ? "w-16" : "w-72"
        }`} style={{ height: sidebarHeight }}>
          <div className="flex flex-col w-full h-full">
            <Sidebar isCollapsed={sidebarCollapsed} onToggleCollapse={toggleSidebarCollapse} />
          </div>
        </div>
        
        {/* Main content - full width */}
        <div className="flex flex-col flex-1 w-full">
          <main className="flex-1 p-4 md:p-6 w-full max-w-full overflow-x-auto">
            <Outlet />
          </main>
          
          <Footer ref={footerRef} />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
