
import React from "react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useDataMode } from "@/contexts/DataModeContext";
import { AlertTriangle } from "lucide-react";

const DataModeToggle = () => {
  const { isRealData, setIsRealData } = useDataMode();
  const { toast } = useToast();

  const handleToggle = (checked: boolean) => {
    toast({
      title: checked ? "Switching to real data mode" : "Switching to demo data mode",
      description: checked ? 
        "The dashboard will reload to show real data from your connected systems." : 
        "The dashboard will reload to show demo data for demonstration purposes.",
      duration: 3000
    });
    
    // Small delay to let the toast be visible before reload
    setTimeout(() => {
      setIsRealData(checked);
    }, 500);
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h4 className="font-medium flex items-center gap-2">
            Data Display Mode
            {isRealData && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
          </h4>
          <p className="text-sm text-muted-foreground">
            {isRealData 
              ? "Currently showing real data from connected systems" 
              : "Currently showing demo data for demonstration purposes"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="data-mode" className={isRealData ? "font-bold" : ""}>
            Real Data
          </Label>
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
