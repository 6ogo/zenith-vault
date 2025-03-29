
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { OTPForm } from '@/components/ui/input-otp-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const TwoFactorVerification = () => {
  const { verify2FADuringLogin, isLoading } = useAuth();

  const handleVerify = async (values: { otp: string }) => {
    await verify2FADuringLogin(values.otp);
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Two-Factor Verification</CardTitle>
        <CardDescription>
          Enter the verification code from your authenticator app to continue.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <OTPForm onSubmit={handleVerify} isLoading={isLoading} />
      </CardContent>
    </Card>
  );
};
