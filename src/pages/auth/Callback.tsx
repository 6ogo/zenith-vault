
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export default function Callback() {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log("Processing auth callback");
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error in auth callback:", error);
          setError(error.message);
          return;
        }

        if (data?.session) {
          console.log("Session found, redirecting to dashboard");
          navigate('/dashboard');
        } else {
          console.log("No session found, redirecting to login");
          navigate('/auth/login');
        }
      } catch (err: any) {
        console.error("Unexpected error in auth callback:", err);
        setError(err.message || 'An unexpected error occurred');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-lg shadow-md dark:bg-gray-800">
          <h1 className="text-xl font-bold text-center">Authentication Error</h1>
          <p className="text-center text-red-500">{error}</p>
          <div className="flex justify-center">
            <button 
              onClick={() => navigate('/auth/login')}
              className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              Return to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <h1 className="text-xl font-bold text-center">Processing Login</h1>
        <p className="text-center">Please wait while we complete your authentication...</p>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      </div>
    </div>
  );
}
