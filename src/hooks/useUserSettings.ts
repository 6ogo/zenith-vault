
import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface NotificationPreferences {
  emailNotifications: boolean;
  salesAlerts: boolean;
  marketingUpdates: boolean;
  customerServiceAlerts: boolean;
}

export interface InterfacePreferences {
  darkMode: boolean;
  reducedMotion: boolean;
}

export interface UserSettings {
  id: string;
  user_id: string;
  notification_preferences: NotificationPreferences;
  interface_preferences: InterfacePreferences;
  created_at: string;
  updated_at: string;
}

export function useUserSettings() {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchUserSettings = useCallback(async () => {
    if (!user) return null;
    
    try {
      setLoading(true);
      
      // Check if user settings exist
      const { data, error } = await supabase.rpc('get_user_settings', {
        p_user_id: user.id
      });
      
      if (error) {
        console.error('Error fetching user settings:', error);
        
        // Try creating default settings if they don't exist
        const { data: newSettings, error: createError } = await supabase
          .from('user_settings')
          .insert({
            user_id: user.id
          })
          .select()
          .single();
          
        if (createError) {
          console.error('Error creating default settings:', createError);
          return null;
        }
        
        setSettings(newSettings as UserSettings);
        return newSettings as UserSettings;
      }
      
      if (data) {
        setSettings(data as UserSettings);
        return data as UserSettings;
      }
      
      return null;
    } catch (error) {
      console.error('Error in fetchUserSettings:', error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);
  
  const updateNotificationPreferences = useCallback(async (preferences: Partial<NotificationPreferences>) => {
    if (!user || !settings) return false;
    
    try {
      setLoading(true);
      
      // Update notification preferences via RPC
      const { data, error } = await supabase.rpc('update_user_notification_preferences', {
        p_user_id: user.id,
        p_preferences: {
          ...settings.notification_preferences,
          ...preferences
        }
      });
      
      if (error) {
        console.error('Error updating notification preferences:', error);
        toast({
          title: 'Error',
          description: 'Failed to update notification preferences',
          variant: 'destructive'
        });
        return false;
      }
      
      // Update local state
      setSettings(prev => {
        if (!prev) return null;
        return {
          ...prev,
          notification_preferences: {
            ...prev.notification_preferences,
            ...preferences
          }
        };
      });
      
      toast({
        title: 'Preferences Updated',
        description: 'Your notification preferences have been updated'
      });
      
      return true;
    } catch (error) {
      console.error('Error in updateNotificationPreferences:', error);
      toast({
        title: 'Error',
        description: 'Failed to update notification preferences',
        variant: 'destructive'
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, settings, toast]);
  
  const updateInterfacePreferences = useCallback(async (preferences: Partial<InterfacePreferences>) => {
    if (!user || !settings) return false;
    
    try {
      setLoading(true);
      
      // Update interface preferences via RPC
      const { data, error } = await supabase.rpc('update_user_interface_preferences', {
        p_user_id: user.id,
        p_preferences: {
          ...settings.interface_preferences,
          ...preferences
        }
      });
      
      if (error) {
        console.error('Error updating interface preferences:', error);
        toast({
          title: 'Error',
          description: 'Failed to update interface preferences',
          variant: 'destructive'
        });
        return false;
      }
      
      // Update local state
      setSettings(prev => {
        if (!prev) return null;
        return {
          ...prev,
          interface_preferences: {
            ...prev.interface_preferences,
            ...preferences
          }
        };
      });
      
      toast({
        title: 'Preferences Updated',
        description: 'Your interface preferences have been updated'
      });
      
      return true;
    } catch (error) {
      console.error('Error in updateInterfacePreferences:', error);
      toast({
        title: 'Error',
        description: 'Failed to update interface preferences',
        variant: 'destructive'
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, settings, toast]);
  
  // Load settings when user changes
  useEffect(() => {
    if (user) {
      fetchUserSettings();
    }
  }, [user, fetchUserSettings]);
  
  return {
    settings,
    loading,
    fetchUserSettings,
    updateNotificationPreferences,
    updateInterfacePreferences
  };
}
