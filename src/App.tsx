import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import SignInDemo from "./pages/SignInDemo";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import DashboardPage from "./pages/DashboardPage";
import LeadsPage from "./pages/LeadsPage";
import DepartamentosPage from "./pages/DepartamentosPage";
import EditarDepartamentoPage from "./pages/EditarDepartamentoPage";
import CriarDepartamentoPage from "./pages/CriarDepartamentoPage";
import AtendentesPage from "./pages/AtendentesPage";
import CriarAtendentePage from "./pages/CriarAtendentePage";
import EditarAtendentePage from "./pages/EditarAtendentePage";
import IntegracoesPage from "./pages/IntegracoesPage";
import AvaliacoesPage from "./pages/AvaliacoesPage";
import ContatosPage from "./pages/ContatosPage";
import CampanhasPage from "./pages/CampanhasPage";
import ConfiguracoesPage from "./pages/ConfiguracoesPage";
import WhatsappQrcodePage from "./pages/WhatsappQrcodePage";
import WhatsappOficialPage from "./pages/WhatsappOficialPage";
import InstagramPage from "./pages/InstagramPage";
import MessengerPage from "./pages/MessengerPage";
import RobosPage from "./pages/RobosPage";
import PerfilPage from "./pages/PerfilPage";
import FaturamentoPage from "./pages/FaturamentoPage";
import ChatPage from "./pages/ChatPage";
import AgendaPage from "./pages/AgendaPage";
import AniversariosPage from "./pages/AniversariosPage";
import EstoquePage from "./pages/EstoquePage";
import EntradaVeiculoPage from "./pages/EntradaVeiculoPage";
import AnunciosPage from "./pages/AnunciosPage";
import MarketplacesPage from "./pages/MarketplacesPage";
const queryClient = new QueryClient();
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignInDemo />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/leads" element={<LeadsPage />} />
          <Route path="/departamentos" element={<DepartamentosPage />} />
          <Route path="/departamentos/:id/editar" element={<EditarDepartamentoPage />} />
          <Route path="/departamentos/criar" element={<CriarDepartamentoPage />} />
          <Route path="/atendentes" element={<AtendentesPage />} />
          <Route path="/atendentes/criar" element={<CriarAtendentePage />} />
          <Route path="/atendentes/:id/editar" element={<EditarAtendentePage />} />
          <Route path="/integracoes" element={<IntegracoesPage />} />
          <Route path="/avaliacoes" element={<AvaliacoesPage />} />
          <Route path="/contatos" element={<ContatosPage />} />
          <Route path="/campanhas" element={<CampanhasPage />} />
          <Route path="/configuracoes" element={<ConfiguracoesPage />} />
          <Route path="/whatsapp-qrcode" element={<WhatsappQrcodePage />} />
          <Route path="/whatsapp-oficial" element={<WhatsappOficialPage />} />
          <Route path="/instagram" element={<InstagramPage />} />
          <Route path="/messenger" element={<MessengerPage />} />
          <Route path="/robos" element={<RobosPage />} />
          <Route path="/perfil" element={<PerfilPage />} />
          <Route path="/faturamento" element={<FaturamentoPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/agenda" element={<AgendaPage />} />
          <Route path="/aniversarios" element={<AniversariosPage />} />
          <Route path="/estoque" element={<EstoquePage />} />
          <Route path="/estoque/entrada" element={<EntradaVeiculoPage />} />
          <Route path="/estoque/entrada/:id" element={<EntradaVeiculoPage />} />
          <Route path="/anuncios" element={<AnunciosPage />} />
          <Route path="/marketplaces" element={<MarketplacesPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
