import React from "react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useDataMode } from "@/contexts/DataModeContext";
const DataModeToggle = () => {
  const {
    isRealData,
    setIsRealData
  } = useDataMode();
  const {
    toast
  } = useToast();
  const handleToggle = (checked: boolean) => {
    setIsRealData(checked);
    toast({
      title: checked ? "Real data mode activated" : "Demo data mode activated",
      description: checked ? "Dashboard now shows real data from your connected systems." : "Dashboard now shows demo data for demonstration purposes.",
      duration: 3000
    });
  };
  return;
};
export default DataModeToggle;