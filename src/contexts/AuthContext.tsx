
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  isMfaEnabled: boolean;
  isVerifying2FA: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any | null; mfaRequired?: boolean }>;
  signInWithGoogle: () => Promise<{ error: any | null }>;
  signInWithLinkedIn: () => Promise<{ error: any | null }>;
  signUp: (
    email: string, 
    password: string, 
    fullName: string, 
    role: string, 
    organization?: string,
    isCreatingOrg?: boolean
  ) => Promise<{ error: any | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any | null }>;
  enableMfa: () => Promise<{ error: any | null; factorId?: string; qr?: string }>;
  verifyMfa: (factorId: string, code: string) => Promise<{ error: any | null }>;
  verify2FADuringLogin: (code: string) => Promise<{ error: any | null }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMfaEnabled, setIsMfaEnabled] = useState(false);
  const [isVerifying2FA, setIsVerifying2FA] = useState(false);
  const [pendingFactorId, setPendingFactorId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (event === 'SIGNED_IN') {
          navigate('/dashboard');
        } else if (event === 'SIGNED_OUT') {
          navigate('/');
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      // Check if MFA is enabled for the user
      if (currentSession?.user) {
        checkMfaStatus(currentSession.user.id);
      }
      
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const checkMfaStatus = async (userId: string) => {
    try {
      const { data, error } = await supabase.auth.mfa.listFactors();
      
      if (error) {
        console.error('Error checking MFA status:', error);
        return;
      }
      
      // Check if there are any verified TOTP factors
      const hasVerifiedTotpFactor = data.totp.some(factor => factor.status === 'verified');
      setIsMfaEnabled(hasVerifiedTotpFactor);
    } catch (error) {
      console.error('Error in MFA status check:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password
      });
      
      if (error) {
        toast.error(error.message);
        return { error };
      }
      
      // Check if MFA is required
      if (data.session && data.user) {
        const { data: mfaData } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
        
        // If MFA is required but not completed
        if (mfaData.currentLevel === 'aal1' && mfaData.nextLevel === 'aal2') {
          setIsVerifying2FA(true);
          return { error: null, mfaRequired: true };
        }
      }
      
      return { error: null };
    } catch (error) {
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  const verify2FADuringLogin = async (code: string) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.mfa.challengeAndVerify({ 
        factorId: 'totp', // For TOTP (Time-based One-Time Password)
        code 
      });
      
      if (error) {
        toast.error('Invalid verification code. Please try again.');
        return { error };
      }
      
      setIsVerifying2FA(false);
      navigate('/dashboard');
      return { error: null };
    } catch (error) {
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  const enableMfa = async () => {
    try {
      setIsLoading(true);
      
      // Enroll a new TOTP factor
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp'
      });
      
      if (error) {
        toast.error('Failed to enable 2FA: ' + error.message);
        return { error };
      }
      
      setPendingFactorId(data.id);
      return { 
        error: null, 
        factorId: data.id,
        qr: data.totp.qr_code 
      };
    } catch (error) {
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  const verifyMfa = async (factorId: string, code: string) => {
    try {
      setIsLoading(true);
      
      // Verify the TOTP factor
      const { error } = await supabase.auth.mfa.challengeAndVerify({
        factorId,
        code
      });
      
      if (error) {
        toast.error('Invalid verification code. Please try again.');
        return { error };
      }
      
      // Update MFA status
      setIsMfaEnabled(true);
      setPendingFactorId(null);
      toast.success('Two-factor authentication enabled successfully');
      
      return { error: null };
    } catch (error) {
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        }
      });
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signInWithLinkedIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'linkedin_oidc',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        }
      });
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signUp = async (
    email: string, 
    password: string, 
    fullName: string, 
    role: string, 
    organization?: string,
    isCreatingOrg?: boolean
  ) => {
    try {
      const userData = {
        full_name: fullName,
        role: role || null,
        organization: organization || null,
        organization_status: organization ? (isCreatingOrg ? 'owner' : 'pending') : null,
        is_organization_creator: isCreatingOrg || false,
      };
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      });
      
      // If creating an organization and signup was successful, create the organization in DB
      if (!error && isCreatingOrg && organization) {
        // This will be handled by a database trigger upon user creation
        console.log("Organization being created:", organization);
      }
      
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      return { error };
    } catch (error) {
      return { error };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        isLoading,
        isMfaEnabled,
        isVerifying2FA,
        signIn,
        signInWithGoogle,
        signInWithLinkedIn,
        signUp,
        signOut,
        resetPassword,
        enableMfa,
        verifyMfa,
        verify2FADuringLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
