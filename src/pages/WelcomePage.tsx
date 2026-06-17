import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import logo from "@/assets/logo.png";
import { LogOut, User, Mail, Shield } from "lucide-react";

const roleLabels: Record<string, string> = {
  super_admin: "Super Admin",
  admin: "Administrador",
  moderator: "Moderador",
  user: "Usuário",
};

const WelcomePage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        navigate("/");
        return;
      }

      const user = session.user;
      setName(user.user_metadata?.name || "Usuário");
      setEmail(user.email || "");

      const { data: roleData } = await supabase
        .from("user_roles" as any)
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle();

      setRole((roleData as any)?.role || "user");
      setLoading(false);
    };

    init();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Sessão encerrada.");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground text-sm">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-sm mx-auto px-6">
        {/* Card */}
        <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-md shadow-xl p-8 flex flex-col items-center gap-6">
          {/* Logo */}
          <img src={logo} alt="Izotope" className="h-8 w-auto opacity-90" />

          {/* Greeting */}
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-semibold text-foreground tracking-tight">
              Olá, {name}!
            </h1>
            <p className="text-sm text-muted-foreground">Bem-vindo de volta.</p>
          </div>

          {/* Divider */}
          <div className="w-full border-t border-border" />

          {/* User info */}
          <div className="w-full space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                <Mail className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Email</p>
                <p className="text-foreground font-medium break-all">{email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                <Shield className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Perfil</p>
                <p className="text-foreground font-medium">{roleLabels[role] ?? role}</p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full border-t border-border" />

          {/* Sign out button */}
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={handleSignOut}
          >
            <LogOut className="w-4 h-4" />
            Sair
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
