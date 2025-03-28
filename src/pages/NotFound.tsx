
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import ZenithLogo from "@/components/common/ZenithLogo";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <ZenithLogo width={80} height={80} className="mb-6" />
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <h2 className="text-2xl font-semibold mt-4 mb-6">Page Not Found</h2>
      <p className="text-muted-foreground max-w-md mb-8">
        The page you're looking for doesn't exist or has been moved. Let's get you back on track.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          onClick={() => navigate(-1)} 
          variant="outline"
        >
          Go Back
        </Button>
        <Button 
          onClick={() => navigate("/")}
        >
          Return Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
