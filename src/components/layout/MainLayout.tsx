
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { supabase } from '@/integrations/supabase/client';
import ChatbotButton from "@/components/chat/ChatbotButton";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (currentUser) {
        setUser(currentUser);
        
        // Check if user exists in profiles table, if not create it
        const { data, error } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', currentUser.id)
          .single();
          
        if (error && error.code === 'PGRST116') { // No rows found error code
          // Insert new profile
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: currentUser.id,
              full_name: currentUser.user_metadata?.full_name || currentUser.email,
              updated_at: new Date().toISOString()
            });
            
          if (insertError) {
            console.error('Error creating profile:', insertError);
          }
        }
      } else {
        setUser(null);
      }
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header onLogout={handleLogout} />
      <div className="flex-1 flex flex-col md:flex-row">
        <Sidebar className="w-64 hidden md:block border-r" />
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
