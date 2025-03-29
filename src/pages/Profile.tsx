
import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { TwoFactorSetup } from '@/components/auth/TwoFactorSetup';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const profileFormSchema = z.object({
  fullName: z.string().min(1, { message: 'Name is required' }),
  email: z.string().email().optional(),
  jobTitle: z.string().optional(),
  department: z.string().optional(),
  phoneNumber: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// Define a type for the profile data that includes all the fields we need
type ProfileData = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  updated_at: string | null;
  is_mfa_enabled: boolean | null;
  job_title: string | null;
  department: string | null;
  phone_number: string | null;
};

const Profile = () => {
  const { user, updateProfile, isMfaEnabled } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showMfaSetup, setShowMfaSetup] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      jobTitle: '',
      department: '',
      phoneNumber: '',
    },
  });
  
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        console.log('Fetching profile for user:', user.id);
        // Fetch user profile data
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('Error fetching profile:', error);
          return;
        }
        
        console.log('Profile data fetched:', data);
        
        // Explicitly type the data with all our custom fields
        const typedData: ProfileData = {
          id: data.id,
          full_name: data.full_name,
          avatar_url: data.avatar_url,
          updated_at: data.updated_at,
          is_mfa_enabled: data.is_mfa_enabled,
          job_title: data.job_title || null,
          department: data.department || null,
          phone_number: data.phone_number || null,
        };
        
        setProfileData(typedData);
        
        form.reset({
          fullName: typedData.full_name || '',
          email: user.email || '',
          jobTitle: typedData.job_title || '',
          department: typedData.department || '',
          phoneNumber: typedData.phone_number || '',
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    
    fetchProfile();
  }, [user, form]);
  
  const onSubmit = async (values: ProfileFormValues) => {
    if (!user) return;
    
    setIsLoading(true);
    console.log('Updating profile with values:', values);
    
    try {
      // Update auth user metadata
      const authUpdateResult = await updateProfile({
        fullName: values.fullName,
      });
      
      console.log('Auth profile update result:', authUpdateResult);
      
      // Update profile in profiles table
      const { data, error } = await supabase
        .from('profiles')
        .update({
          full_name: values.fullName,
          job_title: values.jobTitle,
          department: values.department,
          phone_number: values.phoneNumber,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)
        .select();
        
      if (error) {
        console.error('Error updating profile in Supabase:', error);
        throw error;
      }
      
      console.log('Profile updated in Supabase:', data);
      
      // Update local state
      if (profileData) {
        setProfileData({
          ...profileData,
          full_name: values.fullName,
          job_title: values.jobTitle,
          department: values.department,
          phone_number: values.phoneNumber,
          updated_at: new Date().toISOString(),
        });
      }
      
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully',
      });
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast({
        title: 'Error updating profile',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!user) {
    return <div>Please log in to view your profile.</div>;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your account settings and set up two-factor authentication
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} disabled />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="jobTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Title</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Two-Factor Authentication</CardTitle>
            <CardDescription>
              Add an extra layer of security to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isMfaEnabled ? (
              <div>
                <p className="mb-4 text-green-600 font-medium">
                  Two-factor authentication is enabled.
                </p>
                <p className="text-sm text-muted-foreground">
                  You will need to enter a verification code from your authenticator app when logging in.
                </p>
              </div>
            ) : showMfaSetup ? (
              <TwoFactorSetup onComplete={() => setShowMfaSetup(false)} />
            ) : (
              <div>
                <p className="mb-4">
                  Two-factor authentication adds an extra layer of security to your account by requiring
                  a verification code in addition to your password.
                </p>
                <Button onClick={() => setShowMfaSetup(true)}>Enable Two-Factor Authentication</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
