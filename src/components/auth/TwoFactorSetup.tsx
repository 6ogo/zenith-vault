
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { OTPForm } from '@/components/ui/input-otp-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export const TwoFactorSetup = () => {
  const { isMfaEnabled, enableMfa, verifyMfa } = useAuth();
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [factorId, setFactorId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEnableMfa = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { error, qr, factorId: newFactorId } = await enableMfa();
      
      if (error) {
        toast.error('Failed to start 2FA setup: ' + error.message);
        setError('Failed to start 2FA setup: ' + error.message);
        return;
      }
      
      if (qr && newFactorId) {
        setQrCode(qr);
        setFactorId(newFactorId);
        setIsSettingUp(true);
      }
    } catch (err: any) {
      toast.error('An unexpected error occurred');
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyMfa = async (values: { otp: string }) => {
    if (!factorId) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await verifyMfa(factorId, values.otp);
      
      if (error) {
        toast.error('Failed to verify code: ' + error.message);
        setError('Failed to verify code: ' + error.message);
        return;
      }
      
      toast.success('Two-factor authentication enabled successfully!');
      setIsSettingUp(false);
      setQrCode(null);
      setFactorId(null);
    } catch (err: any) {
      toast.error('An unexpected error occurred');
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Two-Factor Authentication</CardTitle>
          {isMfaEnabled ? (
            <Badge variant="success">Enabled</Badge>
          ) : (
            <Badge variant="outline">Disabled</Badge>
          )}
        </div>
        <CardDescription>
          Add an extra layer of security to your account by requiring both your password and an 
          authentication code from your mobile phone.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isSettingUp && qrCode ? (
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center space-y-4">
              <p className="text-sm text-muted-foreground">
                Scan this QR code with your authenticator app (like Google Authenticator or Authy)
              </p>
              <div className="border border-input p-2 rounded-md bg-white">
                <img src={qrCode} alt="QR Code for 2FA" className="w-48 h-48" />
              </div>
            </div>
            <OTPForm onSubmit={handleVerifyMfa} isLoading={isLoading} error={error || undefined} />
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              {isMfaEnabled 
                ? "Two-factor authentication is enabled on your account." 
                : "Protect your account with two-factor authentication."}
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {!isSettingUp && !isMfaEnabled && (
          <Button onClick={handleEnableMfa} disabled={isLoading} className="w-full">
            {isLoading ? "Setting up..." : "Enable 2FA"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
