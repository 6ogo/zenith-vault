
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { supabase } from '@/integrations/supabase/client';
import ChatbotButton from "@/components/chat/ChatbotButton";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const setupUserProfile = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Check if user exists in profiles table, if not create it
        const { data, error } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', user.id)
          .single();
          
        if (error && error.code === 'PGRST116') { // No rows found error code
          // Insert new profile
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              full_name: user.user_metadata?.full_name || user.email,
              updated_at: new Date().toISOString()
            });
            
          if (insertError) {
            console.error('Error creating profile:', insertError);
          }
        }
        
        // Also check for user settings
        const { data: settingsData, error: settingsError } = await supabase
          .from('user_settings')
          .select('*')
          .eq('user_id', user.id)
          .single();
          
        if (settingsError && settingsError.code === 'PGRST116') {
          // Create default settings if they don't exist
          const defaultNotificationPreferences = {
            emailNotifications: true,
            salesAlerts: true,
            marketingUpdates: true,
            customerServiceAlerts: true
          };
          
          const defaultInterfacePreferences = {
            darkMode: true,
            reducedMotion: false
          };
          
          const { error: createSettingsError } = await supabase
            .from('user_settings')
            .insert({ 
              user_id: user.id,
              notification_preferences: defaultNotificationPreferences,
              interface_preferences: defaultInterfacePreferences
            });
            
          if (createSettingsError) {
            console.error('Error creating default settings:', createSettingsError);
          }
        }
      } catch (error) {
        console.error('Error in setupUserProfile:', error);
      } finally {
        setLoading(false);
      }
    };

    setupUserProfile();

    const authListener = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        navigate('/auth/login');
      } else if (event === 'SIGNED_IN' && session) {
        setupUserProfile();
      }
    });

    return () => {
      authListener.data.subscription.unsubscribe();
    };
  }, [user, navigate, updateProfile]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/auth/login');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: 'Error',
        description: 'Failed to sign out. Please try again.',
        variant: 'destructive'
      });
    }
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
