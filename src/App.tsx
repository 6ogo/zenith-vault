
import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AuthProvider } from '@/contexts/AuthContext';
import { DataModeProvider } from '@/contexts/DataModeContext';
import LoadingScreen from '@/components/LoadingScreen';
import Index from '@/pages/Index';
import SignUp from '@/pages/SignUp';
import Login from '@/pages/Login';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import VerifyEmail from '@/pages/VerifyEmail';
import Callback from '@/pages/Callback';
import Dashboard from '@/pages/Dashboard';
import Sales from '@/pages/Sales';
import Customers from '@/pages/Customers';
import Service from '@/pages/Service';
import Marketing from '@/pages/Marketing';
import Analytics from '@/pages/Analytics';
import Reports from '@/pages/Reports';
import Website from '@/pages/Website';
import DataFiles from '@/pages/DataFiles';
import Integrations from '@/pages/Integrations';
import Organization from '@/pages/Organization';
import Settings from '@/pages/Settings';
import NotFound from '@/pages/NotFound';
import Protected from '@/components/Protected';
import MainLayout from '@/components/layout/MainLayout';
import Documentation from '@/pages/Documentation';

const App = () => {
  const queryClient = new QueryClient();
  
  return (
    <HelmetProvider>
      <ThemeProvider defaultTheme="light" storageKey="zenith-theme">
        <AuthProvider>
          <DataModeProvider>
            <QueryClientProvider client={queryClient}>
              <Suspense fallback={<LoadingScreen />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/verify-email" element={<VerifyEmail />} />
                  <Route path="/callback" element={<Callback />} />
                  
                  {/* Add Documentation route */}
                  <Route path="/documentation" element={
                    <Protected>
                      <MainLayout>
                        <Documentation />
                      </MainLayout>
                    </Protected>
                  } />
  
                  {/* Main app routes */}
                  <Route path="/dashboard" element={
                    <Protected>
                      <MainLayout>
                        <Dashboard />
                      </MainLayout>
                    </Protected>
                  } />
                  
                  <Route path="/sales" element={
                    <Protected>
                      <MainLayout>
                        <Sales />
                      </MainLayout>
                    </Protected>
                  } />
                  
                  <Route path="/customers" element={
                    <Protected>
                      <MainLayout>
                        <Customers />
                      </MainLayout>
                    </Protected>
                  } />
                  
                  <Route path="/service" element={
                    <Protected>
                      <MainLayout>
                        <Service />
                      </MainLayout>
                    </Protected>
                  } />
                  
                  <Route path="/marketing" element={
                    <Protected>
                      <MainLayout>
                        <Marketing />
                      </MainLayout>
                    </Protected>
                  } />
                  
                  <Route path="/analytics" element={
                    <Protected>
                      <MainLayout>
                        <Analytics />
                      </MainLayout>
                    </Protected>
                  } />
                  
                  <Route path="/reports" element={
                    <Protected>
                      <MainLayout>
                        <Reports />
                      </MainLayout>
                    </Protected>
                  } />
                  
                  <Route path="/website" element={
                    <Protected>
                      <MainLayout>
                        <Website />
                      </MainLayout>
                    </Protected>
                  } />
                  
                  <Route path="/data-files" element={
                    <Protected>
                      <MainLayout>
                        <DataFiles />
                      </MainLayout>
                    </Protected>
                  } />
                  
                  <Route path="/integrations" element={
                    <Protected>
                      <MainLayout>
                        <Integrations />
                      </MainLayout>
                    </Protected>
                  } />
                  
                  <Route path="/organization" element={
                    <Protected>
                      <MainLayout>
                        <Organization />
                      </MainLayout>
                    </Protected>
                  } />
                  
                  <Route path="/settings" element={
                    <Protected>
                      <MainLayout>
                        <Settings />
                      </MainLayout>
                    </Protected>
                  } />
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
              <Toaster />
            </QueryClientProvider>
          </DataModeProvider>
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
};

export default App;
