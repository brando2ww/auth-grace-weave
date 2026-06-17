import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import AppSidebar from "@/components/AppSidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Bell, ChevronDown, LogOut, HelpCircle, User, CreditCard } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import heroLogo from "@/assets/hero-logo.png";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DEMO_ESTOQUE_ROUTES = ["/dashboard", "/estoque", "/estoque/entrada", "/anuncios", "/marketplaces"];

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userName, role, loading, userId } = useAuth();

  useEffect(() => {
    if (!loading && !userId) {
      navigate("/");
    }
  }, [loading, userId, navigate]);

  // Protect routes for demo_estoque role
  useEffect(() => {
    if (!loading && role === "demo_estoque" && !DEMO_ESTOQUE_ROUTES.some(route => location.pathname === route || location.pathname.startsWith(route + "/"))) {
      navigate("/dashboard");
    }
  }, [loading, role, location.pathname, navigate]);

  // Listen for auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) navigate("/");
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      <AppSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 shrink-0 flex items-center justify-between px-6 bg-sidebar border-b border-sidebar-border sticky top-0 z-30">
          <img src={heroLogo} alt="Logo" className="h-8 w-auto" />
          <div className="flex items-center gap-4">
            <button className="relative outline-none">
              <Bell className="h-5 w-5 text-muted-foreground" />
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 outline-none cursor-pointer">
                  <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-semibold text-sm">
                    {userName ? userName.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div className="flex flex-col leading-tight text-left">
                    <span className="text-sm font-semibold text-foreground">{role === "demo_estoque" ? "Demonstração" : (userName || "Usuário")}</span>
                    <span className="text-xs text-muted-foreground">{role === "demo_estoque" ? "Demonstração" : role}</span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Minha conta
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Faturamento
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.open("https://support.example.com", "_blank")}>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Ajuda
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-500" onClick={async () => { await supabase.auth.signOut(); navigate("/"); }}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-muted/40 p-6 space-y-6">
          {loading ? (
            <div className="space-y-6">
              <Skeleton className="h-8 w-48" />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Skeleton className="h-24" />
                <Skeleton className="h-24" />
                <Skeleton className="h-24" />
                <Skeleton className="h-24" />
              </div>
              <Skeleton className="h-64" />
            </div>
          ) : children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
