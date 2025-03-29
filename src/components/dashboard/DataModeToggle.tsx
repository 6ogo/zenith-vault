
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export interface DataModeToggleProps {
  isRealData?: boolean;
  onToggle: (value: boolean) => void;
}

const DataModeToggle = ({ isRealData = false, onToggle }: DataModeToggleProps) => {
  return (
    <div className="flex items-center space-x-4 bg-muted p-3 rounded-lg">
      <div className="flex flex-col space-y-1 flex-1">
        <Label htmlFor="data-mode" className="font-medium">
          Data Mode
        </Label>
        <p className="text-xs text-muted-foreground">
          {isRealData 
            ? "Using real organization data"
            : "Using sample demonstration data"
          }
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <Label htmlFor="data-mode" className={isRealData ? "font-medium" : "text-muted-foreground"}>
          {isRealData ? "REAL" : "DEMO"}
        </Label>
        <Switch
          id="data-mode"
          checked={isRealData}
          onCheckedChange={onToggle}
        />
      </div>
    </div>
  );
};

export default DataModeToggle;
