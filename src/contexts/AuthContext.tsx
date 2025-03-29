
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
};

type SignUpDetails = {
  email: string;
  password: string;
  fullName: string;
  role?: string;
  organization?: string;
  isCreatingOrg?: boolean;
};

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
          
          // Also update the profile in the database if MFA status changes
          if (hasVerifiedTotpFactor) {
            const { error: updateError } = await supabase
              .from('profiles')
              .update({ is_mfa_enabled: hasVerifiedTotpFactor })
              .eq('id', user.id);
              
            if (updateError) {
              console.error("Error updating MFA status in profile:", updateError);
            }
          }
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
        console.log("Auth state changed:", event, session?.user?.id);
        setUser(session?.user || null);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session check:", session?.user?.id);
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
      
      // Create a profile for the new user
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            full_name: details.fullName,
            updated_at: new Date().toISOString()
          });
          
        if (profileError) {
          console.error("Error creating profile:", profileError);
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
      
      // Ensure that a profile exists for this user
      if (data.user) {
        const { data: profileData, error: fetchError } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', data.user.id)
          .single();
          
        if (fetchError && fetchError.code === 'PGRST116') { // No rows found
          // Create a profile if it doesn't exist
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              full_name: data.user.user_metadata?.full_name || data.user.email,
              updated_at: new Date().toISOString()
            });
            
          if (insertError) {
            console.error("Error creating profile:", insertError);
          }
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

  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
      console.log("Starting Google OAuth flow");
      
      // Get the current URL for redirection
      const currentUrl = window.location.origin;
      const redirectTo = `${currentUrl}/auth/callback`;
      console.log("Redirect URL:", redirectTo);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectTo,
          queryParams: {
            prompt: 'select_account', // Forces Google to show account selector
          }
        },
      });

      if (error) {
        console.error("Error initiating Google sign in:", error);
        throw error;
      }

      console.log("Google sign in response:", data);
      
      // No need to return to dashboard, as the callback will handle redirection
      return data;
    } catch (error: any) {
      console.error("Error signing in with Google:", error);
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
      // Get the current URL for redirection
      const currentUrl = window.location.origin;
      const redirectTo = `${currentUrl}/auth/callback`;
      
      const { data, error } = await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: redirectTo,
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
      console.log("Updating user metadata in auth:", details);
      const { data, error } = await supabase.auth.updateUser({
        data: {
          full_name: details.fullName,
          updated_at: new Date().toISOString(),
        }
      });

      if (error) {
        console.error("Error updating auth user metadata:", error);
        throw error;
      }
      
      console.log("Auth user metadata updated:", data);
      
      if (user) {
        console.log("Updating profile in profiles table for user:", user.id);
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            full_name: details.fullName,
            updated_at: new Date().toISOString()
          }, { 
            onConflict: 'id',
            ignoreDuplicates: false
          });
        
        if (profileError) {
          console.warn('Profile table update failed, but auth metadata was updated:', profileError);
        } else {
          console.log("Profile updated successfully in profiles table");
        }
      }
      
      return data;
    } catch (error: any) {
      console.error("Error in updateProfile:", error);
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
      
      // Update profile with MFA status
      if (user) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ is_mfa_enabled: true })
          .eq('id', user.id);
          
        if (updateError) {
          console.error("Error updating MFA status in profile:", updateError);
        }
      }
      
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
    ]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
