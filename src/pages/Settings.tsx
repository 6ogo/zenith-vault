
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useUserSettings, NotificationPreferences, InterfacePreferences } from '@/hooks/useUserSettings';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { AlertCircle, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { 
    settings, 
    loading, 
    updateNotificationPreferences, 
    updateInterfacePreferences 
  } = useUserSettings();
  
  // Local state for notification preferences
  const [notifications, setNotifications] = useState<NotificationPreferences>({
    emailNotifications: true,
    salesAlerts: true,
    marketingUpdates: true,
    customerServiceAlerts: true
  });
  
  // Local state for interface preferences
  const [interfacePrefs, setInterfacePrefs] = useState<InterfacePreferences>({
    darkMode: true,
    reducedMotion: false
  });
  
  // Initialize state from settings when they load
  useEffect(() => {
    if (settings && settings.notification_preferences) {
      setNotifications(settings.notification_preferences);
    }
    
    if (settings && settings.interface_preferences) {
      setInterfacePrefs(settings.interface_preferences);
    }
  }, [settings]);
  
  const handleNotificationChange = (key: keyof NotificationPreferences) => {
    const updatedPreferences = {
      ...notifications,
      [key]: !notifications[key]
    };
    
    setNotifications(updatedPreferences);
    
    // Save to database immediately on toggle
    updateNotificationPreferences({ [key]: !notifications[key] });
  };
  
  const handleInterfaceChange = (key: keyof InterfacePreferences) => {
    const updatedPreferences = {
      ...interfacePrefs,
      [key]: !interfacePrefs[key]
    };
    
    setInterfacePrefs(updatedPreferences);
    
    // Save to database immediately on toggle
    updateInterfacePreferences({ [key]: !interfacePrefs[key] });
  };
  
  const saveNotificationSettings = async () => {
    const success = await updateNotificationPreferences(notifications);
    if (success) {
      toast({
        title: "Notification settings saved",
        description: "Your notification preferences have been updated."
      });
    }
  };
  
  const saveInterfaceSettings = async () => {
    const success = await updateInterfacePreferences(interfacePrefs);
    if (success) {
      toast({
        title: "Interface settings saved",
        description: "Your interface preferences have been updated."
      });
    }
  };
  
  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Authentication required</AlertTitle>
          <AlertDescription>
            Please log in to access your settings.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your application preferences and notifications
        </p>
      </div>
      
      {loading && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Loading settings</AlertTitle>
          <AlertDescription>
            Please wait while we load your preferences...
          </AlertDescription>
        </Alert>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>
            Control which notifications you receive from the platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="emailNotifications">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive important updates via email
              </p>
            </div>
            <Switch
              id="emailNotifications"
              checked={notifications.emailNotifications}
              onCheckedChange={() => handleNotificationChange('emailNotifications')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="salesAlerts">Sales Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Get notified about new sales and opportunities
              </p>
            </div>
            <Switch
              id="salesAlerts"
              checked={notifications.salesAlerts}
              onCheckedChange={() => handleNotificationChange('salesAlerts')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="marketingUpdates">Marketing Updates</Label>
              <p className="text-sm text-muted-foreground">
                Receive updates on marketing campaigns and analytics
              </p>
            </div>
            <Switch
              id="marketingUpdates"
              checked={notifications.marketingUpdates}
              onCheckedChange={() => handleNotificationChange('marketingUpdates')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="customerServiceAlerts">Customer Service Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Get notified about customer service tickets and inquiries
              </p>
            </div>
            <Switch
              id="customerServiceAlerts"
              checked={notifications.customerServiceAlerts}
              onCheckedChange={() => handleNotificationChange('customerServiceAlerts')}
            />
          </div>
          
          <Button onClick={saveNotificationSettings} disabled={loading}>
            Save Notification Preferences
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Interface Preferences</CardTitle>
          <CardDescription>
            Customize your experience with the application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="darkMode">Dark Mode</Label>
              <p className="text-sm text-muted-foreground">
                Use a darker color theme for the interface
              </p>
            </div>
            <Switch
              id="darkMode"
              checked={interfacePrefs.darkMode}
              onCheckedChange={() => handleInterfaceChange('darkMode')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="reducedMotion">Reduced Motion</Label>
              <p className="text-sm text-muted-foreground">
                Minimize animations throughout the interface
              </p>
            </div>
            <Switch
              id="reducedMotion"
              checked={interfacePrefs.reducedMotion}
              onCheckedChange={() => handleInterfaceChange('reducedMotion')}
            />
          </div>
          
          <Button onClick={saveInterfaceSettings} disabled={loading}>
            Save Interface Preferences
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
