
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
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h4 className="font-medium">Data Display Mode</h4>
          <p className="text-sm text-muted-foreground">
            Toggle between real data and demo data
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="data-mode">Real Data</Label>
          <Switch
            id="data-mode"
            checked={isRealData}
            onCheckedChange={handleToggle}
          />
        </div>
      </div>
    </Card>
  );
};

export default DataModeToggle;
