
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Mail, User, Lock, EyeOff, Eye, Building } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";

const SignUp = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [organization, setOrganization] = useState("");
  const [role, setRole] = useState("");
  const [isCreatingOrg, setIsCreatingOrg] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { signUp, signInWithGoogle, user } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  // Reset role when organization is empty
  useEffect(() => {
    if (!organization) {
      setRole("");
    }
  }, [organization]);

  const validateForm = () => {
    if (!fullName || !email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return false;
    }
    
    if (organization && !role) {
      toast({
        title: "Error",
        description: "Role is required when an organization is specified",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const { error } = await signUp({
        email,
        password, 
        fullName,
        role,
        organization,
        isCreatingOrg
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Success",
        description: isCreatingOrg 
          ? "Account and organization created successfully! Please check your email for verification."
          : "Account created successfully! Please check your email for verification.",
      });
      
      // Redirect to login after successful signup
      setTimeout(() => {
        navigate("/auth/login");
      }, 1500);
      
    } catch (error: any) {
      console.error("Signup error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    // Validate organization/role combination first
    if (organization && !role) {
      toast({
        title: "Error",
        description: "Role is required when an organization is specified",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setGoogleLoading(true);
      console.log("Attempting to sign in with Google");
      const { data, error } = await signInWithGoogle();
      console.log("Google sign in response:", data, error);
      
      if (error) throw error;
    } catch (error: any) {
      console.error(`Google signup error:`, error);
      toast({
        title: "Error",
        description: error.message || `Failed to sign up with Google. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setGoogleLoading(false);
    }
  };

  const roles = [
    { value: "admin", label: "Administrator" },
    { value: "sales", label: "Sales Representative" },
    { value: "service", label: "Customer Service" },
    { value: "marketing", label: "Marketing Manager" },
    { value: "analyst", label: "Analyst" },
    { value: "other", label: "Other Role" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-primary">Create an Account</CardTitle>
          <CardDescription className="text-center">
            Enter your information to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="fullName"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-10 w-10 text-muted-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="organization">Organization</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="create-organization" 
                    checked={isCreatingOrg}
                    onCheckedChange={(checked) => {
                      setIsCreatingOrg(checked === true);
                      if (checked === true) {
                        setRole("admin");
                      }
                    }}
                  />
                  <label 
                    htmlFor="create-organization" 
                    className="text-sm text-muted-foreground cursor-pointer"
                  >
                    Create New Organization
                  </label>
                </div>
              </div>
              <div className="relative">
                <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="organization"
                  placeholder={isCreatingOrg ? "New Organization Name" : "Existing Organization Name"}
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>
              {isCreatingOrg && (
                <p className="text-xs text-muted-foreground">
                  You'll be the administrator of this new organization.
                </p>
              )}
            </div>
            
            {organization && (
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select 
                  value={role} 
                  onValueChange={setRole} 
                  disabled={isLoading || (isCreatingOrg && role === "admin")}
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {!isCreatingOrg && (
                  <p className="text-xs text-muted-foreground">
                    Your role will need to be approved by an organization administrator.
                  </p>
                )}
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90" 
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <div className="flex flex-col space-y-3">
            <Button 
              type="button" 
              variant="outline" 
              className="w-full" 
              onClick={handleGoogleSignUp}
              disabled={googleLoading}
            >
              {googleLoading ? "Connecting..." : "Sign up with Google"}
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link 
              to="/auth/login" 
              className="text-secondary font-medium hover:underline"
            >
              Sign in
            </Link>
          </div>
          <div className="text-center text-sm">
            <Link 
              to="/" 
              className="text-muted-foreground hover:underline"
            >
              Back to Home
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignUp;
