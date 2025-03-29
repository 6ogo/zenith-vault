
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import Index from "./pages/Index";
import Sales from "./pages/Sales";
import Customers from "./pages/Customers";
import Service from "./pages/Service";
import Marketing from "./pages/Marketing";
import Analytics from "./pages/Analytics";
import Website from "./pages/Website";
import Settings from "./pages/Settings";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Callback from "./pages/auth/Callback";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
// Feature pages
import SalesManagement from "./pages/features/SalesManagement";
import CustomerService from "./pages/features/CustomerService";
import MarketingAutomation from "./pages/features/MarketingAutomation";
import WebsiteDevelopment from "./pages/features/WebsiteDevelopment";
// New pages
import Integrations from "./pages/Integrations";
import Organization from "./pages/Organization";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }
  
  return <>{children}</>;
};

// Component with Auth Provider
const AppWithAuth = () => {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/signup" element={<SignUp />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        <Route path="/auth/callback" element={<Callback />} />
        
        {/* Feature Pages */}
        <Route path="/features/sales-management" element={<SalesManagement />} />
        <Route path="/features/customer-service" element={<CustomerService />} />
        <Route path="/features/marketing-automation" element={<MarketingAutomation />} />
        <Route path="/features/website-development" element={<WebsiteDevelopment />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/service" element={<Service />} />
          <Route path="/marketing" element={<Marketing />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/website" element={<Website />} />
          <Route path="/integrations" element={<Integrations />} />
          <Route path="/organization" element={<Organization />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppWithAuth />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
