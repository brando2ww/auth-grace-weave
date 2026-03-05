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

const SidebarPage = ({ title }: { title: string }) => (
  <Frame760>
    <div className="flex items-center justify-center h-full">
      <h1 className="text-2xl font-semibold text-neutral-50">{title}</h1>
    </div>
  </Frame760>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/leads" element={<SidebarPage title="Leads" />} />
            <Route path="/crm" element={<SidebarPage title="CRM" />} />
            <Route path="/orcamentos" element={<SidebarPage title="Orçamentos" />} />
            <Route path="/atendimento" element={<SidebarPage title="Atendimento" />} />
            <Route path="/producao" element={<SidebarPage title="Produção" />} />
            <Route path="/representantes" element={<SidebarPage title="Representantes" />} />
            <Route path="/relatorios" element={<SidebarPage title="Relatórios" />} />
            <Route path="/pos-venda" element={<SidebarPage title="Pós-Venda" />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
