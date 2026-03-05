import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import Frame760 from "./pages/Frame760";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Frame760 />} />
            <Route path="/leads" element={<Frame760 />} />
            <Route path="/crm" element={<Frame760 />} />
            <Route path="/orcamentos" element={<Frame760 />} />
            <Route path="/atendimento" element={<Frame760 />} />
            <Route path="/producao" element={<Frame760 />} />
            <Route path="/representantes" element={<Frame760 />} />
            <Route path="/relatorios" element={<Frame760 />} />
            <Route path="/pos-venda" element={<Frame760 />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
