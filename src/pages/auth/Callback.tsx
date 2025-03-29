
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // This is a stub for authentication callback handling
    // In a real implementation, this would process the auth callback
    // and redirect to the appropriate page
    
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md p-6 space-y-4 text-center">
        <h1 className="text-2xl font-bold">Processing Authentication</h1>
        <p className="text-muted-foreground">Please wait while we verify your credentials...</p>
        <div className="space-y-2 mt-4">
          <Skeleton className="h-4 w-full mx-auto" />
          <Skeleton className="h-4 w-5/6 mx-auto" />
          <Skeleton className="h-4 w-4/6 mx-auto" />
        </div>
      </div>
    </div>
  );
};

export default Callback;
