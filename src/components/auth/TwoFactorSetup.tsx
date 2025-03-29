
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { OTPForm } from '@/components/ui/input-otp-form';
import { Loader2, AlertTriangle, CheckCircle } from 'lucide-react';

interface TwoFactorSetupProps {
  onComplete: () => void;
}

export const TwoFactorSetup: React.FC<TwoFactorSetupProps> = ({ onComplete }) => {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const setupMFA = async () => {
      try {
        const { data, error } = await supabase.auth.mfa.enroll({
          factorType: 'totp',
        });

        if (error) throw error;

        if (data?.totp) {
          setQrCode(data.totp.qr_code);
          setSecret(data.totp.secret);
        }
      } catch (error: any) {
        console.error('Error setting up MFA:', error);
        setError(error.message || 'Failed to set up two-factor authentication');
        toast({
          title: 'Error',
          description: error.message || 'Failed to set up two-factor authentication',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    setupMFA();
  }, [toast]);

  const handleVerify = async (values: { otp: string }) => {
    setIsVerifying(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.mfa.challenge({
        factorId: 'totp',
      });

      if (error) throw error;

      const { data: verifyData, error: verifyError } = await supabase.auth.mfa.verify({
        factorId: 'totp',
        challengeId: data.id,
        code: values.otp,
      });

      if (verifyError) throw verifyError;

      setSuccess(true);
      toast({
        title: 'Two-factor authentication enabled',
        description: 'Your account is now more secure',
      });

      // Update profile in the database
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ is_mfa_enabled: true })
        .eq('id', (await supabase.auth.getUser()).data.user?.id);

      if (updateError) {
        console.error('Error updating profile:', updateError);
      }

      setTimeout(() => {
        onComplete();
      }, 2000);
    } catch (error: any) {
      console.error('Verification error:', error);
      setError(error.message || 'Failed to verify code. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-sm text-muted-foreground">Setting up two-factor authentication...</p>
      </div>
    );
  }

  if (success) {
    return (
      <Alert className="bg-green-50 border-green-200">
        <CheckCircle className="h-5 w-5 text-green-500" />
        <AlertDescription className="text-green-700">
          Two-factor authentication has been successfully enabled for your account.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {qrCode && (
        <div className="flex flex-col items-center space-y-4">
          <div className="p-4 bg-white rounded-lg">
            <img src={qrCode} alt="QR Code for authenticator app" className="w-48 h-48" />
          </div>
          
          {secret && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">
                If you can't scan the QR code, enter this code manually:
              </p>
              <code className="px-2 py-1 bg-muted rounded text-sm font-mono">
                {secret}
              </code>
            </div>
          )}
          
          <p className="text-sm text-center max-w-md">
            Scan this QR code with your authenticator app (like Google Authenticator, Authy, or Microsoft Authenticator)
          </p>
        </div>
      )}

      <OTPForm onSubmit={handleVerify} isLoading={isVerifying} error={error || undefined} />
    </div>
  );
};

export default TwoFactorSetup;
