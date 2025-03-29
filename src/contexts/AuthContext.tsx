import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  Session,
  User,
  useSession,
  useSupabaseClient,
} from "@supabase/auth-helpers-react";
import { Database } from "@/types/supabase";

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signUp: (details: any) => Promise<any>;
  signIn: (details: any) => Promise<any>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<any>;
  updateProfile: (details: any) => Promise<any>;
  enableMfa: () => Promise<any>;
  verifyMfa: (otp: string) => Promise<any>;
  isMfaEnabled: boolean;
	isMfaRequired: boolean;
  verify2FADuringLogin: (otp: string) => Promise<any>;
  cancelMfaVerification: () => void;
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
  const [user, setUser] = useState<User | null>(null);
  const supabaseClient = useSupabaseClient<Database>();
  const session = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if MFA is enabled when the component mounts
    const checkMfaStatus = async () => {
      if (session?.user) {
        try {
          const { data: mfaData, error: mfaError } = await supabaseClient
            .from("profiles")
            .select("is_mfa_enabled")
            .eq("id", session.user.id)
            .single();

          if (mfaError) {
            console.error("Error fetching MFA status:", mfaError);
          } else {
            setIsMfaEnabled(mfaData?.is_mfa_enabled || false);
          }
        } catch (error) {
          console.error("Unexpected error fetching MFA status:", error);
        }
      }
    };

    checkMfaStatus();
  }, [session, supabaseClient]);

  useEffect(() => {
    setUser(session?.user || null);
  }, [session]);

  const isAuthenticated = !!user;

  const signUp = async (details: any) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabaseClient.auth.signUp({
        email: details.email,
        password: details.password,
        options: {
          data: {
            full_name: details.fullName,
            role: "user",
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

  const signIn = async (details: any) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: details.email,
        password: details.password,
      });

      if (error) {
        console.log(error);
				if (error.message === "MFA required") {
					setIsMfaRequired(true);
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

  const signOut = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabaseClient.auth.signOut();
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
      const { data, error } = await supabaseClient.auth.resetPasswordForEmail(
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
      const { data, error } = await supabaseClient
        .from("profiles")
        .update({
          full_name: details.fullName,
          updated_at: new Date(),
        })
        .eq("id", user?.id)
        .select()
        .single();

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

  const enableMfa = async () => {
    setIsLoading(true);
    try {
      // Placeholder: Simulate enabling MFA
      setIsMfaEnabled(true);

      // Update the user's profile in the database to reflect MFA is enabled
      const { data, error } = await supabaseClient
        .from("profiles")
        .update({ is_mfa_enabled: true })
        .eq("id", user?.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating MFA status in profile:", error);
        throw error;
      }

      return data;
    } catch (error: any) {
      console.error("Error enabling MFA:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyMfa = async (otp: string) => {
    setIsLoading(true);
    try {
      // Placeholder: Simulate verifying MFA
      console.log("OTP verified:", otp);

      // After successful verification, update the local state and database
      setIsMfaEnabled(true);

      // Update the user's profile in the database to reflect MFA is enabled
      const { data, error } = await supabaseClient
        .from("profiles")
        .update({ is_mfa_enabled: true })
        .eq("id", user?.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating MFA status in profile:", error);
        throw error;
      }

      return data;
    } catch (error: any) {
      console.error("Error verifying MFA:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verify2FADuringLogin = async (otp: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabaseClient.auth.verifyOtp({
        type: "magiclink",
        token: otp,
        email: user?.email || "",
      });

      if (error) {
        console.log("2FA Verification Error:", error);
        throw error;
      }

      console.log("2FA Verification Success:", data);
      navigate("/dashboard");
      return data;
    } catch (error: any) {
      console.error("Error during 2FA verification:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Add or update the cancelMfaVerification method
  const cancelMfaVerification = useCallback(() => {
    // Reset any MFA verification state
    setIsMfaRequired(false);
    // Navigate back to login if needed
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
      verify2FADuringLogin,
      cancelMfaVerification, // Add this to the context value
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
      verify2FADuringLogin,
      cancelMfaVerification, // Add this to the dependencies
    ]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
