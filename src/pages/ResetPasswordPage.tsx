import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [validSession, setValidSession] = useState(false);

  useEffect(() => {
    // Supabase sets the session from the recovery token in the URL hash
    supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setValidSession(true);
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("As senhas não coincidem.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Senha redefinida com sucesso!");
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-lg flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-semibold text-foreground tracking-tight">Redefinir senha</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {validSession
                ? "Escolha uma nova senha para a sua conta."
                : "Aguardando verificação do link de recuperação..."}
            </p>
          </div>

          {validSession && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-muted-foreground">Nova senha</label>
                <div className="rounded-2xl border border-border bg-foreground/5 backdrop-blur-sm transition-colors focus-within:border-primary/60 focus-within:bg-primary/5">
                  <input
                    type="password"
                    placeholder="••••••••"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-muted-foreground">Confirmar nova senha</label>
                <div className="rounded-2xl border border-border bg-foreground/5 backdrop-blur-sm transition-colors focus-within:border-primary/60 focus-within:bg-primary/5">
                  <input
                    type="password"
                    placeholder="••••••••"
                    required
                    minLength={6}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-primary py-4 font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {loading ? "Salvando..." : "Salvar nova senha"}
              </button>
            </form>
          )}

          <p className="text-center text-sm text-muted-foreground">
            <a
              href="/"
              className="hover:underline transition-colors text-foreground font-medium"
            >
              Voltar ao login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
