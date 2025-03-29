
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { TwoFactorVerification } from '@/components/auth/TwoFactorVerification';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast"
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
import { Turnstile } from '@/components/auth/Turnstile';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

// If you're using Supabase's test environment, use this key
// For production, replace with your actual site key
const TURNSTILE_SITE_KEY = "1x00000000000000000000AA";

const loginSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

export default function Login() {
  const { signIn, signInWithGoogle, signInWithLinkedIn, isLoading, isVerifying2FA } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileError, setTurnstileError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

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

  const handleTurnstileVerify = (token: string) => {
    console.log("Turnstile token received:", token.substring(0, 10) + "...");
    setTurnstileToken(token);
    setTurnstileError(null);
  };

  const handleTurnstileError = (error: Error) => {
    console.error("Turnstile error:", error);
    setTurnstileError(error.message);
    setTurnstileToken(null);
  };

  const handleSubmit = async (values: z.infer<typeof loginSchema>) => {
    if (isLoading) return;

    if (!turnstileToken) {
      toast({
        title: "Captcha verification required",
        description: "Please complete the captcha verification",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log("Attempting to sign in with captcha token");
      await signIn(values.email, values.password, turnstileToken);
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
      
      // If there was an error with the captcha, reset the token
      if (error.message.includes("captcha")) {
        setTurnstileToken(null);
        // Force re-render of the Turnstile component by changing the key
        const turnstileContainer = document.querySelector('[data-testid="turnstile-container"]');
        if (turnstileContainer) {
          turnstileContainer.innerHTML = '';
        }
      }
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
            
            {turnstileError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Captcha error: {turnstileError}. Please try again.
                </AlertDescription>
              </Alert>
            )}
            
            {/* Turnstile Captcha Component */}
            <Turnstile 
              siteKey={TURNSTILE_SITE_KEY} 
              onVerify={handleTurnstileVerify}
              onError={handleTurnstileError}
            />
            
            <Button disabled={isLoading || !turnstileToken} type="submit">
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
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
            <Button onClick={() => signInWithGoogle()} variant="outline">Google</Button>
            <Button onClick={() => signInWithLinkedIn()} variant="outline">LinkedIn</Button>
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
