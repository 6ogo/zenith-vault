import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo,
} from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

type AuthContextType = {
  user: any | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isMfaEnabled: boolean;
  isMfaRequired: boolean;
  isVerifying2FA: boolean;
  signUp: (details: SignUpDetails) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<any>;
  updateProfile: (details: any) => Promise<any>;
  enableMfa: () => Promise<any>;
  verifyMfa: (factorId: string, code: string) => Promise<any>;
  verify2FADuringLogin: (otp: string) => Promise<any>;
  cancelMfaVerification: () => void;
  signInWithGoogle: () => Promise<any>;
  signInWithLinkedIn: () => Promise<any>;
};

type SignUpDetails = {
  email: string;
  password: string;
  fullName: string;
  role?: string;
  organization?: string;
  isCreatingOrg?: boolean;
};

// Create a context for authentication
const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isMfaEnabled, setIsMfaEnabled] = useState(false);
  const [isMfaRequired, setIsMfaRequired] = useState(false);
  const [isVerifying2FA, setIsVerifying2FA] = useState(false); 
  const [user, setUser] = useState<any | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkMfaStatus = async () => {
      if (user) {
        try {
          const { data, error } = await supabase.auth.mfa.listFactors();
          
          if (error) {
            console.error("Error fetching MFA factors:", error);
            return;
          }
          
          const hasVerifiedTotpFactor = data.totp.some(factor => 
            factor.status === 'verified'
          );
          
          setIsMfaEnabled(hasVerifiedTotpFactor);
        } catch (error) {
          console.error("Unexpected error fetching MFA status:", error);
        }
      }
    };

    checkMfaStatus();
  }, [user]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const isAuthenticated = !!user;

  const signUp = async (details: SignUpDetails) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: details.email,
        password: details.password,
        options: {
          data: {
            full_name: details.fullName,
            role: details.role || "user",
            organization: details.organization,
            is_organization_creator: details.isCreatingOrg
          },
        },
      });

      if (error) {
        console.log(error);
        throw error;
      }
      return data;
    } catch (error: any) {
      console.log(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.log(error);
        if (error.message === "MFA required") {
          setIsMfaRequired(true);
          setIsVerifying2FA(true);
        }
        throw error;
      }
      return data;
    } catch (error: any) {
      console.log(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });

      if (error) {
        throw error;
      }

      return data;
    } catch (error: any) {
      console.error("Error signing in with Google:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithLinkedIn = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'linkedin_oidc',
      });

      if (error) {
        throw error;
      }

      return data;
    } catch (error: any) {
      console.error("Error signing in with LinkedIn:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      navigate("/auth/login");
    } catch (error: any) {
      console.log(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: `${window.location.origin}/auth/callback`,
        }
      );
      if (error) {
        throw error;
      }
      return data;
    } catch (error: any) {
      console.log(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (details: any) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: {
          full_name: details.fullName,
          updated_at: new Date().toISOString(),
        }
      });

      if (error) {
        throw error;
      }
      
      if (user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            full_name: details.fullName,
            updated_at: new Date().toISOString()
          });
        
        if (profileError) {
          console.warn('Profile table update failed, but auth metadata was updated:', profileError);
        }
      }
      
      return data;
    } catch (error: any) {
      console.log(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const enableMfa = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp'
      });

      if (error) {
        console.error("Error enabling MFA:", error);
        return { error };
      }

      return { 
        qr: data.totp.qr_code, 
        factorId: data.id,
        error: null
      };
    } catch (error: any) {
      console.error("Error enabling MFA:", error);
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  const verifyMfa = async (factorId: string, code: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.mfa.challengeAndVerify({
        factorId,
        code
      });

      if (error) {
        console.error("Error verifying MFA:", error);
        return { error };
      }
      
      setIsMfaEnabled(true);
      
      return { error: null };
    } catch (error: any) {
      console.error("Error verifying MFA:", error);
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  const verify2FADuringLogin = async (otp: string) => {
    setIsLoading(true);
    try {
      const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
        factorId: 'totp'
      });
      
      if (challengeError) {
        console.error("Error creating MFA challenge:", challengeError);
        throw challengeError;
      }
      
      const { data, error } = await supabase.auth.mfa.verify({
        factorId: 'totp',
        challengeId: challengeData.id,
        code: otp
      });
      
      if (error) {
        console.error("Error verifying MFA code:", error);
        throw error;
      }
      
      setIsVerifying2FA(false);
      navigate("/dashboard");
      
      return { success: true };
    } catch (error: any) {
      console.error("Error during 2FA verification:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const cancelMfaVerification = useCallback(() => {
    setIsMfaRequired(false);
    setIsVerifying2FA(false);
    navigate('/auth/login');
  }, [navigate]);

  const contextValue = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated,
      signUp,
      signIn,
      signOut,
      resetPassword,
      updateProfile,
      enableMfa,
      verifyMfa,
      isMfaEnabled,
      isMfaRequired,
      isVerifying2FA,
      verify2FADuringLogin,
      cancelMfaVerification,
      signInWithGoogle,
      signInWithLinkedIn,
    }),
    [
      user,
      isLoading,
      isAuthenticated,
      signUp,
      signIn,
      signOut,
      resetPassword,
      updateProfile,
      enableMfa,
      verifyMfa,
      isMfaEnabled,
      isMfaRequired,
      isVerifying2FA,
      verify2FADuringLogin,
      cancelMfaVerification,
      signInWithGoogle,
      signInWithLinkedIn,
    ]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
