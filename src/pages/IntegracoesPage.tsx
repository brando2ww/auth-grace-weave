import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plug, Code, Webhook } from "lucide-react";
import IntegracaoDialog, { type IntegracaoTipo } from "@/components/integracoes/IntegracaoDialog";
import { supabase } from "@/integrations/supabase/client";

/* ── Official SVG logos ── */

const ChatGPTLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" />
  </svg>
);

const ElevenLabsLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <rect x="7" y="3" width="3" height="18" rx="1.5" />
    <rect x="14" y="3" width="3" height="18" rx="1.5" />
  </svg>
);

const CalComLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19 4h-1V3a1 1 0 0 0-2 0v1H8V3a1 1 0 0 0-2 0v1H5a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zm1 15a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-9h16v9zm0-11H4V7a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v1z" />
    <circle cx="8" cy="15" r="1.5" />
    <circle cx="12" cy="15" r="1.5" />
    <circle cx="16" cy="15" r="1.5" />
  </svg>
);

const FacebookLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

/* ── Integration definitions ── */

interface IntegracaoDef {
  tipo: IntegracaoTipo;
  nome: string;
  descricao: string;
  icon: React.FC<{ className?: string }>;
  iconBg: string;
}

const integracoes: IntegracaoDef[] = [
  {
    tipo: "api",
    nome: "Integração API",
    descricao: "Conecte com qualquer API REST externa",
    icon: Code,
    iconBg: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  },
  {
    tipo: "chatgpt",
    nome: "ChatGPT",
    descricao: "Inteligência artificial para atendimento",
    icon: ChatGPTLogo,
    iconBg: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
  },
  {
    tipo: "elevenlabs",
    nome: "ElevenLabs",
    descricao: "Geração de voz com IA",
    icon: ElevenLabsLogo,
    iconBg: "bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300",
  },
  {
    tipo: "calcom",
    nome: "Cal.com",
    descricao: "Agendamento de reuniões",
    icon: CalComLogo,
    iconBg: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
  },
  {
    tipo: "webhooks",
    nome: "WebHooks",
    descricao: "Receba e envie eventos em tempo real",
    icon: Webhook,
    iconBg: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  },
  {
    tipo: "facebook_leads",
    nome: "Facebook Leads",
    descricao: "Capture leads do Facebook automaticamente",
    icon: FacebookLogo,
    iconBg: "bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300",
  },
];

const IntegracoesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selected, setSelected] = useState<IntegracaoDef | null>(null);
  const [savedData, setSavedData] = useState<Record<string, { config: Record<string, string>; ativo: boolean }>>({});

  const loadData = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from("integracoes" as any)
      .select("tipo, config, ativo")
      .eq("user_id", user.id);
    if (data) {
      const map: typeof savedData = {};
      (data as any[]).forEach((row: any) => {
        map[row.tipo] = { config: row.config || {}, ativo: row.ativo };
      });
      setSavedData(map);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Auto-open dialog from query param
  useEffect(() => {
    const openTipo = searchParams.get("open") as IntegracaoTipo | null;
    if (openTipo) {
      const def = integracoes.find((i) => i.tipo === openTipo);
      if (def) {
        setSelected(def);
        setDialogOpen(true);
      }
      searchParams.delete("open");
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const openDialog = (def: IntegracaoDef) => {
    setSelected(def);
    setDialogOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10">
            <Plug className="h-5 w-5 text-cyan-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Integrações</h1>
            <p className="text-sm text-muted-foreground">
              Configure aqui suas integrações
            </p>
          </div>
        </div>

        {/* Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {integracoes.map((item) => {
            const saved = savedData[item.tipo];
            const isAtivo = saved?.ativo ?? false;

            return (
              <Card
                key={item.tipo}
                className="cursor-pointer transition-shadow hover:shadow-md"
                onClick={() => openDialog(item)}
              >
                <CardContent className="flex items-center gap-4 p-5">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${item.iconBg}`}
                  >
                    <item.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold truncate">{item.nome}</p>
                      <Badge
                        variant={isAtivo ? "default" : "secondary"}
                        className={
                          isAtivo
                            ? "bg-cyan-500 hover:bg-cyan-600 text-white text-[10px] px-1.5 py-0"
                            : "text-[10px] px-1.5 py-0"
                        }
                      >
                        {isAtivo ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">
                      {item.descricao}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Dialog */}
      {selected && (
        <IntegracaoDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          tipo={selected.tipo}
          titulo={selected.nome}
          config={savedData[selected.tipo]?.config || {}}
          ativo={savedData[selected.tipo]?.ativo || false}
          onSaved={loadData}
        />
      )}
    </DashboardLayout>
  );
};

export default IntegracoesPage;
