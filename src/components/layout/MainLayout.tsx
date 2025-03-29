import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { supabase } from '@/integrations/supabase/client';
import ChatbotButton from "@/components/chat/ChatbotButton";
import BoundedStickySidebar from './BoundedStickySidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);
    };

    fetchUser();

    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
        navigate('/auth/login');
      } else if (session) {
        setUser(session.user);
      }
    });
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate('/auth/login');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onLogout={handleLogout} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col md:flex-row">
        {isMobile ? (
          // Mobile sidebar (only shown when open)
          <div className={`fixed inset-0 z-40 ${sidebarOpen ? 'block' : 'hidden'}`}>
            <div className="absolute inset-0 bg-black opacity-50" onClick={toggleSidebar}></div>
            <div className="absolute left-0 top-0 h-full w-64 bg-background border-r">
              <Sidebar className="w-full" />
            </div>
          </div>
        ) : (
          // Desktop sidebar with bounded stickiness
          <BoundedStickySidebar 
            headerSelector="header" 
            footerSelector="footer"
            className="w-64 border-r"
            offsetTop={0}
            offsetBottom={0}
          >
            <Sidebar className="w-full" />
          </BoundedStickySidebar>
        )}
        <main className="flex-1 overflow-auto bg-background">
          <div className="container mx-auto p-4 md:p-8">
            {children}
          </div>
        </main>
      </div>
      
      {/* Add chatbot button to the bottom right */}
      <ChatbotButton className="fixed bottom-4 right-4 z-50" />
    </div>
  );
};

export default MainLayout;