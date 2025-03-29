
import React, { createContext, useContext, useState, useEffect } from 'react';

interface DataModeContextType {
  isRealData: boolean;
  setIsRealData: (value: boolean) => void;
  // Add a userId for filtering demo data
  userId: string;
  organizationId: string;
}

const initialContext: DataModeContextType = {
  isRealData: false,
  setIsRealData: () => {},
  userId: 'demo-user-001',
  organizationId: 'demo-org-001'
};

const DataModeContext = createContext<DataModeContextType>(initialContext);

export const DataModeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isRealData, setIsRealData] = useState(false);
  // Simulate user and organization IDs for filtering data
  const [userId] = useState('demo-user-001');
  const [organizationId] = useState('demo-org-001');

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

  const contextValue = {
    isRealData,
    setIsRealData,
    userId,
    organizationId
  };

  return (
    <DataModeContext.Provider value={contextValue}>
      {children}
    </DataModeContext.Provider>
  );
};

export const useDataMode = () => {
  const context = useContext(DataModeContext);
  if (!context) {
    throw new Error('useDataMode must be used within a DataModeProvider');
  }
  return context;
};
