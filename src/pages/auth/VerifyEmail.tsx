
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, AlertTriangle } from 'lucide-react';
import ZenithLogo from '@/components/common/ZenithLogo';
import { supabase } from '@/integrations/supabase/client';

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email...');
  
  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Get the token from the URL
        const hash = location.hash;
        const hashParams = new URLSearchParams(hash.substring(1));
        
        // Check for type=recovery for password reset
        const type = hashParams.get('type');
        if (type === 'recovery') {
          // Handle password reset verification
          navigate('/auth/reset-password', { replace: true });
          return;
        }
        
        // Otherwise, handle standard verification
        const token = hashParams.get('access_token');
        if (!token) {
          setStatus('error');
          setMessage('No verification token found in the URL.');
          return;
        }
        
        // Update session with the token
        const { error } = await supabase.auth.getUser(token);
        
        if (error) {
          setStatus('error');
          setMessage(error.message || 'Failed to verify email. Please try again.');
        } else {
          setStatus('success');
          setMessage('Your email has been verified successfully!');
          
          // Redirect after a delay
          setTimeout(() => {
            navigate('/auth/login', { replace: true });
          }, 3000);
        }
      } catch (error: any) {
        setStatus('error');
        setMessage(error.message || 'An unexpected error occurred.');
      }
    };
    
    verifyEmail();
  }, [location, navigate]);
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <ZenithLogo className="h-12 w-auto" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Email Verification</CardTitle>
          <CardDescription className="text-center">
            {status === 'loading' ? 'Verifying your email address' : 
             status === 'success' ? 'Email verification successful' : 
             'Email verification failed'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant={status === 'error' ? 'destructive' : 'default'} className="text-center">
            <div className="flex justify-center mb-2">
              {status === 'loading' ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
              ) : status === 'success' ? (
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              ) : (
                <AlertTriangle className="h-6 w-6" />
              )}
            </div>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild variant="ghost">
            <Link to="/auth/login">Go to Login</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default VerifyEmail;
