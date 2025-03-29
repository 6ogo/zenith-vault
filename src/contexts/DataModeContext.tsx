
import React, { createContext, useContext, useState, useEffect } from 'react';

interface DataModeContextType {
  isRealData: boolean;
  setIsRealData: (value: boolean) => void;
}

const DataModeContext = createContext<DataModeContextType | undefined>(undefined);

export const DataModeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isRealData, setIsRealData] = useState(false);

  // Load preference from localStorage on mount
  useEffect(() => {
    const storedPreference = localStorage.getItem('zenithDataMode');
    if (storedPreference) {
      setIsRealData(storedPreference === 'real');
    }
  }, []);

  // Save preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('zenithDataMode', isRealData ? 'real' : 'demo');
  }, [isRealData]);

  return (
    <DataModeContext.Provider value={{ isRealData, setIsRealData }}>
      {children}
    </DataModeContext.Provider>
  );
};

export const useDataMode = () => {
  const context = useContext(DataModeContext);
  if (context === undefined) {
    throw new Error('useDataMode must be used within a DataModeProvider');
  }
  return context;
};
