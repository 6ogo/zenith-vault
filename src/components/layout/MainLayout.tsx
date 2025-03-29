
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const toggleSidebarCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };
  
  return (
    <div className="flex min-h-screen overflow-hidden bg-background flex-col">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar for mobile (absolutely positioned) */}
        <div
          className={`fixed inset-0 z-40 transform md:hidden ${
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
        
        {/* Sidebar for desktop (fixed) */}
        <div className={`hidden md:flex md:flex-shrink-0 transition-all duration-300 ${
          sidebarCollapsed ? "md:w-16" : "md:w-72"
        }`}>
          <div className="flex flex-col w-full">
            <Sidebar isCollapsed={sidebarCollapsed} onToggleCollapse={toggleSidebarCollapse} />
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header toggleSidebar={toggleSidebar} />
          
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default MainLayout;
