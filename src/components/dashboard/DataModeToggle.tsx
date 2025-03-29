
import React from "react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface DataModeToggleProps {
  isRealData: boolean;
  onToggle: (enabled: boolean) => void;
}

const DataModeToggle = ({ isRealData, onToggle }: DataModeToggleProps) => {
  const { toast } = useToast();
  
  const handleToggle = (checked: boolean) => {
    onToggle(checked);
    
    toast({
      title: checked ? "Real data mode activated" : "Demo data mode activated",
      description: checked 
        ? "Dashboard now shows real data from your connected systems." 
        : "Dashboard now shows demo data for demonstration purposes.",
      duration: 3000,
    });
  };
  
  return (
    <Card className="flex items-center justify-between px-4 py-2 mb-4">
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
