import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from "./components/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";

import Index from './pages/Index';
import About from './pages/About';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';

import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import VerifyEmail from './pages/auth/VerifyEmail';
import Callback from './pages/auth/Callback';

import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Organization from './pages/Organization';
import Settings from './pages/Settings';
import Sales from './pages/Sales';
import Customers from './pages/Customers';
import Service from './pages/Service';
import Marketing from './pages/Marketing';
import Analytics from './pages/Analytics';
import Reports from './pages/Reports';
import Integrations from './pages/Integrations';
import IntegrationDocumentation from './pages/IntegrationDocumentation';
import DataFiles from './pages/DataFiles';
import Website from './pages/Website';
import NotFound from './pages/NotFound';
import ChatbotAdmin from './pages/ChatbotAdmin';
import MainLayout from './components/layout/MainLayout';
import RolesManagement from './pages/Organization/RolesManagement';

const App = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="zenith-vault-theme">
      <Toaster />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />
        
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/signup" element={<SignUp />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        <Route path="/auth/reset-password" element={<ResetPassword />} />
        <Route path="/auth/verify-email" element={<VerifyEmail />} />
        <Route path="/auth/callback" element={<Callback />} />
          
        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            <MainLayout>
              <Dashboard />
            </MainLayout>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <MainLayout>
              <Profile />
            </MainLayout>
          } 
        />
        <Route 
          path="/organization" 
          element={
            <MainLayout>
              <Organization />
            </MainLayout>
          } 
        />
        <Route 
          path="/organization/roles" 
          element={
            <MainLayout>
              <RolesManagement />
            </MainLayout>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <MainLayout>
              <Settings />
            </MainLayout>
          } 
        />
        <Route 
          path="/sales" 
          element={
            <MainLayout>
              <Sales />
            </MainLayout>
          } 
        />
        <Route 
          path="/customers" 
          element={
            <MainLayout>
              <Customers />
            </MainLayout>
          } 
        />
        <Route 
          path="/service" 
          element={
            <MainLayout>
              <Service />
            </MainLayout>
          } 
        />
        <Route 
          path="/marketing" 
          element={
            <MainLayout>
              <Marketing />
            </MainLayout>
          } 
        />
        <Route 
          path="/analytics" 
          element={
            <MainLayout>
              <Analytics />
            </MainLayout>
          } 
        />
        <Route 
          path="/reports" 
          element={
            <MainLayout>
              <Reports />
            </MainLayout>
          } 
        />
        <Route 
          path="/integrations" 
          element={
            <MainLayout>
              <Integrations />
            </MainLayout>
          } 
        />
        <Route 
          path="/integration-documentation" 
          element={
            <MainLayout>
              <IntegrationDocumentation />
            </MainLayout>
          } 
        />
        <Route 
          path="/data-files" 
          element={
            <MainLayout>
              <DataFiles />
            </MainLayout>
          } 
        />
        <Route 
          path="/website" 
          element={
            <MainLayout>
              <Website />
            </MainLayout>
          } 
        />
        <Route 
          path="/chatbot-admin" 
          element={
            <MainLayout>
              <ChatbotAdmin />
            </MainLayout>
          } 
        />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
