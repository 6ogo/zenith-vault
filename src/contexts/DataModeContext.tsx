
import React, { createContext, useContext, useState, useEffect } from 'react';

interface DataModeContextType {
  isRealData: boolean;
  setIsRealData: (value: boolean) => void;
  isAllowedToToggle: (page: string) => boolean;
}

const DataModeContext = createContext<DataModeContextType | undefined>(undefined);

// Pages where data mode toggle shouldn't be shown (always "real" data)
const ALWAYS_REAL_PAGES = ['integrations', 'organization', 'settings'];

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

  // Check if current page should allow toggling demo/real data
  const isAllowedToToggle = (page: string): boolean => {
    return !ALWAYS_REAL_PAGES.includes(page.toLowerCase());
  };

  return (
    <DataModeContext.Provider value={{ isRealData, setIsRealData, isAllowedToToggle }}>
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
