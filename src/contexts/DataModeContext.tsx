
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

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
  // Get the real user ID if available
  const { user } = useAuth();
  
  // Use real user ID or fallback to demo ID
  const [userId] = useState(() => user?.id || 'demo-user-001');
  const [organizationId] = useState('demo-org-001'); // This would come from user's organization in a real app

  // Load preference from localStorage on mount
  useEffect(() => {
    const storedPreference = localStorage.getItem('zenithDataMode');
    console.log('Stored data mode preference:', storedPreference);
    
    // Check if permanent real data is enabled
    const permanentRealData = localStorage.getItem('permanentRealData') === 'true';
    
    if (permanentRealData) {
      console.log('Permanent real data mode is enabled');
      setIsRealDataState(true);
    } else if (storedPreference) {
      setIsRealDataState(storedPreference === 'real');
    }
  }, []);

  // Custom setter that ensures the state is updated and persisted
  const setIsRealData = (value: boolean) => {
    console.log('Setting data mode to:', value ? 'real' : 'demo');
    setIsRealDataState(value);
    localStorage.setItem('zenithDataMode', value ? 'real' : 'demo');
    
    toast({
      title: value ? "Using real data" : "Using demo data",
      description: value ? 
        "The application is now showing real data from your connected systems." : 
        "The application is now showing demo data for demonstration purposes.",
      duration: 3000
    });
    
    // Force a reload of the page to ensure all components pick up the new data mode
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const contextValue = {
    isRealData,
    setIsRealData,
    userId: user?.id || userId,
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
