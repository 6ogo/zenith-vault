
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import Index from "./pages/Index";
import Sales from "./pages/Sales";
import Customers from "./pages/Customers";
import Service from "./pages/Service";
import Marketing from "./pages/Marketing";
import Analytics from "./pages/Analytics";
import Website from "./pages/Website";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Index />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/service" element={<Service />} />
            <Route path="/marketing" element={<Marketing />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/website" element={<Website />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
