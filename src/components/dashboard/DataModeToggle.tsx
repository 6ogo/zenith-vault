
import React from "react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "react-router-dom";
import { useDataMode } from "@/contexts/DataModeContext";

interface DataModeToggleProps {
  className?: string;
  // Add these props to support both usage patterns
  isRealData?: boolean;
  onToggle?: (value: boolean) => void;
}

const DataModeToggle = ({ className = "", isRealData: externalIsRealData, onToggle }: DataModeToggleProps) => {
  const { toast } = useToast();
  const location = useLocation();
  const { isRealData: contextIsRealData, setIsRealData, isAllowedToToggle } = useDataMode();
  
  // Use either the prop or context value
  const isRealData = externalIsRealData !== undefined ? externalIsRealData : contextIsRealData;
  const currentPage = location.pathname.split('/')[1] || 'dashboard';
  
  // Don't render on pages that don't support toggling
  if (!isAllowedToToggle(currentPage)) {
    return null;
  }
  
  const handleToggle = (checked: boolean) => {
    // Call the prop handler if provided, otherwise use context
    if (onToggle) {
      onToggle(checked);
    } else {
      setIsRealData(checked);
    }
    
    toast({
      title: checked ? "Real data mode activated" : "Demo data mode activated",
      description: checked 
        ? "Showing real data from your connected systems." 
        : "Showing demo data for demonstration purposes.",
      duration: 3000,
    });
  };
  
  return (
    <Card className={`flex items-center justify-between px-4 py-2 mb-4 ${className}`}>
      <div className="flex items-center space-x-4">
        <Label htmlFor="data-mode" className="text-sm font-medium cursor-pointer">
          Data Mode:
        </Label>
        <div className="flex items-center justify-between w-32">
          <span className={`text-sm ${!isRealData ? 'font-bold text-primary' : 'text-muted-foreground'}`}>DEMO</span>
          <Switch 
            id="data-mode" 
            checked={isRealData}
            onCheckedChange={handleToggle}
          />
          <span className={`text-sm ${isRealData ? 'font-bold text-primary' : 'text-muted-foreground'}`}>REAL</span>
        </div>
      </div>
      {isRealData && (
        <div className="text-xs text-muted-foreground">
          Showing real data from your connected systems
        </div>
      )}
    </Card>
  );
};

export default DataModeToggle;
