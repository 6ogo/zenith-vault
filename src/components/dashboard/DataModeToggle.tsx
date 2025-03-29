
import React from "react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useDataMode } from "@/contexts/DataModeContext";

const DataModeToggle = () => {
  const { isRealData, setIsRealData } = useDataMode();
  const { toast } = useToast();
  
  const handleToggle = (checked: boolean) => {
    setIsRealData(checked);
    toast({
      title: checked ? "Real data mode activated" : "Demo data mode activated",
      description: checked ? "Dashboard now shows real data from your connected systems." : "Dashboard now shows demo data for demonstration purposes.",
      duration: 3000
    });
  };
  
  return (
    <Card className="p-4 flex items-center justify-between bg-card">
      <div className="flex flex-col">
        <h3 className="font-medium text-sm">Data Mode</h3>
        <p className="text-xs text-muted-foreground">
          {isRealData ? "Showing real data" : "Showing demo data"}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Label htmlFor="data-mode" className="text-sm">
          {isRealData ? "Real" : "Demo"}
        </Label>
        <Switch
          id="data-mode"
          checked={isRealData}
          onCheckedChange={handleToggle}
        />
      </div>
    </Card>
  );
};

export default DataModeToggle;
