
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Settings2, Save, RotateCcw } from 'lucide-react';

const models = [
  { id: 'llama3-8b-8192', name: 'Llama 3 8B', description: 'Fast & efficient, good for most tasks' },
  { id: 'llama3-70b-8192', name: 'Llama 3 70B', description: 'More powerful, best for complex analysis' },
  { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B', description: 'Great for detailed contextual understanding' }
];

const dataSourceOptions = [
  { id: 'sales_data', name: 'Sales Data', description: 'Customer purchases, leads, and deals' },
  { id: 'customer_data', name: 'Customer Data', description: 'Profiles, preferences, and history' },
  { id: 'marketing_data', name: 'Marketing Data', description: 'Campaigns, engagement, and analytics' },
  { id: 'service_data', name: 'Service Data', description: 'Support tickets and customer feedback' }
];

const functionOptions = [
  { id: 'lead_scoring', name: 'Lead Scoring', description: 'Prioritize potential customers' },
  { id: 'content_generation', name: 'Content Generation', description: 'Create marketing materials' },
  { id: 'sentiment_analysis', name: 'Sentiment Analysis', description: 'Analyze customer feedback tone' },
  { id: 'sales_forecasting', name: 'Sales Forecasting', description: 'Predict future sales trends' }
];

interface AISettings {
  model: string;
  temperature: number;
  maxTokens: number;
  dataSources: string[];
  enabledFunctions: string[];
}

const AISettingsPanel = () => {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<AISettings>({
    model: 'llama3-8b-8192',
    temperature: 0.7,
    maxTokens: 1024,
    dataSources: ['sales_data', 'customer_data'],
    enabledFunctions: ['lead_scoring', 'sentiment_analysis']
  });

  // Load current settings when component mounts
  useEffect(() => {
    const loadSettings = async () => {
      if (!user?.user_metadata?.organization_id) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('organization_settings')
          .select('settings_value')
          .eq('organization_id', user.user_metadata.organization_id)
          .eq('settings_type', 'ai_configuration')
          .single();
          
        if (error && error.code !== 'PGRST116') { // PGRST116 is "No rows returned" error code
          console.error('Error loading AI settings:', error);
          toast({
            variant: "destructive",
            title: "Failed to Load Settings",
            description: error.message
          });
          return;
        }
        
        if (data?.settings_value) {
          setSettings(data.settings_value as AISettings);
        }
      } catch (error) {
        console.error('Error in loadSettings:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSettings();
  }, [user]);

  const handleDataSourceToggle = (sourceId: string) => {
    setSettings(prev => {
      if (prev.dataSources.includes(sourceId)) {
        return { ...prev, dataSources: prev.dataSources.filter(id => id !== sourceId) };
      } else {
        return { ...prev, dataSources: [...prev.dataSources, sourceId] };
      }
    });
  };
  
  const handleFunctionToggle = (functionId: string) => {
    setSettings(prev => {
      if (prev.enabledFunctions.includes(functionId)) {
        return { ...prev, enabledFunctions: prev.enabledFunctions.filter(id => id !== functionId) };
      } else {
        return { ...prev, enabledFunctions: [...prev.enabledFunctions, functionId] };
      }
    });
  };

  const saveSettings = async () => {
    if (!user?.user_metadata?.organization_id) {
      toast({
        variant: "destructive",
        title: "Cannot Save Settings",
        description: "No organization ID found. Please refresh or contact support."
      });
      return;
    }
    
    setIsSaving(true);
    try {
      // Store settings in organization_settings table
      const { error } = await supabase
        .from('organization_settings')
        .upsert(
          { 
            organization_id: user.user_metadata.organization_id,
            settings_type: 'ai_configuration',
            settings_value: settings
          }, 
          { onConflict: 'organization_id,settings_type' }
        );

      if (error) throw error;
      
      toast({
        title: "AI Settings Saved",
        description: "Your AI configuration has been updated successfully."
      });
    } catch (error: any) {
      console.error('Error saving AI settings:', error);
      toast({
        variant: "destructive",
        title: "Failed to Save Settings",
        description: error instanceof Error ? error.message : "An unknown error occurred"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const resetDefaults = () => {
    setSettings({
      model: 'llama3-8b-8192',
      temperature: 0.7,
      maxTokens: 1024,
      dataSources: ['sales_data', 'customer_data'],
      enabledFunctions: ['lead_scoring', 'sentiment_analysis']
    });
    
    toast({
      title: "Default Settings Restored",
      description: "AI settings have been reset to default values."
    });
  };

  if (user?.user_metadata?.role !== 'admin') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>AI Settings</CardTitle>
          <CardDescription>
            Advanced AI configuration options
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            You need administrator privileges to access these settings.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings2 className="h-5 w-5" />
            Loading AI Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="text-sm text-muted-foreground">Loading your settings...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings2 className="h-5 w-5" />
          Advanced AI Configuration
        </CardTitle>
        <CardDescription>
          Customize how the AI interacts with your organization's data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Model Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">AI Model Selection</h3>
          <p className="text-sm text-muted-foreground">
            Choose which GROQ AI model to use for different tasks
          </p>
          
          <RadioGroup 
            value={settings.model} 
            onValueChange={(value) => setSettings(prev => ({ ...prev, model: value }))}
            className="grid gap-3"
          >
            {models.map(model => (
              <div key={model.id} className="flex items-center space-x-2 rounded-md border p-3">
                <RadioGroupItem value={model.id} id={model.id} />
                <Label htmlFor={model.id} className="flex flex-col cursor-pointer">
                  <span className="font-medium">{model.name}</span>
                  <span className="text-sm text-muted-foreground">{model.description}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <Separator />

        {/* Model Parameters */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Response Parameters</h3>
          <p className="text-sm text-muted-foreground">
            Fine-tune how the AI generates responses
          </p>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="temperature">Temperature: {settings.temperature.toFixed(1)}</Label>
                <span className="text-sm text-muted-foreground">
                  {settings.temperature < 0.4 ? "More focused" : 
                   settings.temperature > 0.8 ? "More creative" : "Balanced"}
                </span>
              </div>
              <Slider 
                id="temperature"
                min={0.1} 
                max={1.0} 
                step={0.1} 
                value={[settings.temperature]} 
                onValueChange={(value) => setSettings(prev => ({ ...prev, temperature: value[0] }))}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Lower values produce more consistent, focused responses. Higher values produce more creative, diverse outputs.
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="maxTokens">Max Response Length: {settings.maxTokens}</Label>
                <span className="text-sm text-muted-foreground">
                  {settings.maxTokens < 600 ? "Brief" : 
                   settings.maxTokens > 1500 ? "Detailed" : "Standard"}
                </span>
              </div>
              <Slider 
                id="maxTokens"
                min={256} 
                max={2048} 
                step={128} 
                value={[settings.maxTokens]} 
                onValueChange={(value) => setSettings(prev => ({ ...prev, maxTokens: value[0] }))}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Controls the maximum length of AI-generated responses.
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Data Sources */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Data Access</h3>
          <p className="text-sm text-muted-foreground">
            Control which data sources the AI can access
          </p>
          
          <div className="grid gap-3">
            {dataSourceOptions.map(source => (
              <div key={source.id} className="flex items-center justify-between rounded-md border p-3">
                <div className="space-y-0.5">
                  <Label className="text-base">{source.name}</Label>
                  <p className="text-sm text-muted-foreground">{source.description}</p>
                </div>
                <Switch 
                  checked={settings.dataSources.includes(source.id)}
                  onCheckedChange={() => handleDataSourceToggle(source.id)}
                />
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* AI Functions */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">AI Functions</h3>
          <p className="text-sm text-muted-foreground">
            Enable or disable specific AI capabilities
          </p>
          
          <div className="grid gap-3">
            {functionOptions.map(func => (
              <div key={func.id} className="flex items-center justify-between rounded-md border p-3">
                <div className="space-y-0.5">
                  <Label className="text-base">{func.name}</Label>
                  <p className="text-sm text-muted-foreground">{func.description}</p>
                </div>
                <Switch 
                  checked={settings.enabledFunctions.includes(func.id)}
                  onCheckedChange={() => handleFunctionToggle(func.id)}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between pt-4 mt-4 border-t">
          <Button 
            variant="outline" 
            onClick={resetDefaults}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset to Defaults
          </Button>
          
          <Button 
            onClick={saveSettings}
            disabled={isSaving}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AISettingsPanel;
