import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Callback = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // If we have a user, redirect to dashboard
    // Otherwise, redirect to login
    if (user) {
      navigate("/dashboard");
    } else {
      // Small delay to allow auth state to update
      const timer = setTimeout(() => {
        navigate("/auth/login");
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [user, navigate]);

  return (
    <div className="h-screen flex items-center justify-center bg-muted/30">
      <div className="text-center">
        <div className="mb-4 text-primary">
          <svg className="animate-spin h-12 w-12 mx-auto" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
        <h3 className="text-lg font-medium">Authenticating...</h3>
        <p className="text-muted-foreground mt-2">You will be redirected shortly.</p>
      </div>
    </div>
  );
};

export default Callback;
