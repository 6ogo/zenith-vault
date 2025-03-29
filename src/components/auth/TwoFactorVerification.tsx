
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { OTPForm } from '@/components/ui/input-otp-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TwoFactorVerification = () => {
  const { verify2FADuringLogin, isLoading, cancelMfaVerification } = useAuth();

  const handleVerify = async (values: { otp: string }) => {
    await verify2FADuringLogin(values.otp);
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-8 border-border shadow-md">
      <CardHeader className="space-y-2">
        <div className="flex items-center gap-2 text-primary">
          <Shield className="h-6 w-6" />
          <CardTitle>Two-Factor Verification</CardTitle>
        </div>
        <CardDescription className="text-muted-foreground">
          Enter the verification code from your authenticator app to continue.
          This adds an extra layer of security to your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <OTPForm onSubmit={handleVerify} isLoading={isLoading} />
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <div className="text-xs text-muted-foreground text-center w-full">
          If you're having trouble, contact support or try signing in on a different device.
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-muted-foreground"
          onClick={cancelMfaVerification}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to login
        </Button>
      </CardFooter>
    </Card>
  );
};
