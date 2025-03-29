
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
  const [isRealData, setIsRealDataState] = useState(false);
  // Simulate user and organization IDs for filtering data
  const [userId] = useState('demo-user-001');
  const [organizationId] = useState('demo-org-001');

  // Load preference from localStorage on mount
  useEffect(() => {
    const storedPreference = localStorage.getItem('zenithDataMode');
    if (storedPreference) {
      setIsRealDataState(storedPreference === 'real');
    }
  }, []);

  // Custom setter that ensures the state is updated and persisted
  const setIsRealData = (value: boolean) => {
    setIsRealDataState(value);
    localStorage.setItem('zenithDataMode', value ? 'real' : 'demo');
    
    // Force a reload of the page to ensure all components pick up the new data mode
    window.location.reload();
  };

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
