
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const LoadingScreen = () => {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-6 space-y-4">
        <Skeleton className="h-12 w-3/4 mx-auto" />
        <Skeleton className="h-72 w-full rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
