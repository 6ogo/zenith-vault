
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { TwoFactorVerification } from '@/components/auth/TwoFactorVerification';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

export default function Login() {
  const { signIn, signInWithGoogle, signInWithLinkedIn, isLoading, isVerifying2FA, isAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [socialAuthError, setSocialAuthError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (values: z.infer<typeof loginSchema>) => {
    if (isLoading) return;

    try {
      console.log("Attempting to sign in with email/password");
      await signIn(values.email, values.password);
      // If MFA is not required, this will navigate to dashboard
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleGoogleSignIn = async () => {
    setSocialAuthError(null);
    try {
      console.log("Attempting to sign in with Google");
      await signInWithGoogle();
      // No navigation here - will be handled by callback
    } catch (error: any) {
      console.error("Google login error:", error);
      setSocialAuthError("Google login failed: " + error.message);
      toast({
        title: "Google login failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleLinkedInSignIn = async () => {
    setSocialAuthError(null);
    try {
      console.log("Attempting to sign in with LinkedIn");
      await signInWithLinkedIn();
      // No navigation here - will be handled by callback
    } catch (error: any) {
      console.error("LinkedIn login error:", error);
      setSocialAuthError("LinkedIn login failed: " + error.message);
      toast({
        title: "LinkedIn login failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // If 2FA verification is required, show the verification screen
  if (isVerifying2FA) {
    return <TwoFactorVerification />;
  }

  return (
    <div className="grid h-screen place-items-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Enter your email and password to login
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...form.register("email")}
              />
              {form.formState.errors.email && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  {...form.register("password")}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {form.formState.errors.password && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>
            
            <Button 
              disabled={isLoading} 
              type="submit"
              className="mt-2"
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
          
          {socialAuthError && (
            <div className="p-3 rounded bg-red-50 border border-red-200 text-red-600 text-sm flex items-start gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>{socialAuthError}</span>
            </div>
          )}
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={handleGoogleSignIn} variant="outline" type="button" disabled={isLoading}>Google</Button>
            <Button onClick={handleLinkedInSignIn} variant="outline" type="button" disabled={isLoading}>LinkedIn</Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Link to="/auth/forgot-password" className="text-sm text-muted-foreground">
            Forgot Password?
          </Link>
          <Link to="/auth/register" className="text-sm text-muted-foreground">
            Don't have an account? Register
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
