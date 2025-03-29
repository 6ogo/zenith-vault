
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Dashboard from './pages/Dashboard';
import Sales from './pages/Sales';
import Marketing from './pages/Marketing';
import Service from './pages/Service';
import Integrations from './pages/Integrations';
import Settings from './pages/Settings';
import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import VerifyEmail from './pages/auth/VerifyEmail';
import Profile from './pages/Profile';
import CustomerService from './pages/features/CustomerService';
import SalesManagement from './pages/features/SalesManagement';
import MarketingAutomation from './pages/features/MarketingAutomation';
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/ThemeProvider"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from './contexts/AuthContext';
import { DataModeProvider } from './contexts/DataModeContext';
import Callback from './pages/auth/Callback';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import NotFound from './pages/NotFound';
import MainLayout from './components/layout/MainLayout';
import Index from './pages/Index';
import Customers from './pages/Customers';

const App = () => {
  const [loading, setLoading] = useState(true);
  const [queryClient] = useState(() => new QueryClient());
  
  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark" storageKey="theme">
          <Toaster />
          <DataModeProvider>
            <Routes>
              {/* Auth routes */}
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/signup" element={<SignUp />} />
              <Route path="/auth/forgot-password" element={<ForgotPassword />} />
              <Route path="/auth/reset-password" element={<ResetPassword />} />
              <Route path="/auth/verify-email" element={<VerifyEmail />} />
              <Route path="/auth/callback" element={<Callback />} />
              
              {/* Landing page */}
              <Route path="/" element={<Index />} />
              
              {/* Public pages */}
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              
              {/* Main application routes with layout */}
              <Route element={<MainLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/sales" element={<Sales />} />
                <Route path="/marketing" element={<Marketing />} />
                <Route path="/service" element={<Service />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/integrations" element={<Integrations />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/features/customer-service" element={<CustomerService />} />
                <Route path="/features/sales-management" element={<SalesManagement />} />
                <Route path="/features/marketing-automation" element={<MarketingAutomation />} />
              </Route>
              
              {/* Fallback route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </DataModeProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
};

export default App;
