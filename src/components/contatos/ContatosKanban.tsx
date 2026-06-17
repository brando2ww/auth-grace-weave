import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User, Phone, Tag, Plus, MoreHorizontal, MessageCircle } from "lucide-react";

interface StatusConfig {
  id: string;
  label: string;
  badgeClass: string;
}

const STATUS_COLUMNS: StatusConfig[] = [
  { id: "novo", label: "Novo", badgeClass: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300" },
  { id: "em_atendimento", label: "Em atendimento", badgeClass: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300" },
  { id: "proposta_enviada", label: "Proposta enviada", badgeClass: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300" },
  { id: "negociacao", label: "Negociação", badgeClass: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300" },
  { id: "cliente", label: "Cliente", badgeClass: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" },
  { id: "perdido", label: "Perdido", badgeClass: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300" },
  { id: "_parceiro", label: "Parceiro", badgeClass: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300" },
  { id: "_fornecedor", label: "Fornecedor", badgeClass: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300" },
];

interface ContatosKanbanProps {
  contatos: any[];
  onEdit: (contato: any) => void;
}

const ContatosKanban = ({ contatos, onEdit }: ContatosKanbanProps) => {
  const navigate = useNavigate();
  const grouped = useMemo(() => {
    const map: Record<string, any[]> = {};
    STATUS_COLUMNS.forEach((s) => (map[s.id] = []));
    contatos.forEach((c) => {
      let key: string;
      if (c.tipo_contato === "parceiro") key = "_parceiro";
      else if (c.tipo_contato === "fornecedor") key = "_fornecedor";
      else if (!c.status_funil) key = "novo";
      else key = c.status_funil;
      if (map[key]) map[key].push(c);
      else map["novo"].push(c);
    });
    return map;
  }, [contatos]);

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hidden" style={{ minHeight: "calc(100vh - 220px)" }}>
      {STATUS_COLUMNS.map((col) => {
        const items = grouped[col.id] || [];
        const colConfig = STATUS_COLUMNS.find((s) => s.id === col.id)!;
        return (
          <div
            key={col.id}
            className="min-w-[300px] max-w-[320px] flex-shrink-0 flex flex-col rounded-xl bg-muted/40 dark:bg-muted/20"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-foreground">{col.label}</span>
                <span className="flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full bg-cyan-500 text-[11px] font-semibold text-white">
                  {items.length}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-1 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                  <Plus className="h-4 w-4" />
                </button>
                <button className="p-1 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Cards */}
            <ScrollArea className="flex-1 px-2 pb-2">
              <div className="space-y-2.5 px-1">
                {items.map((contato: any) => (
                  <div
                    key={contato.id}
                    className="bg-card rounded-xl p-3.5 cursor-pointer shadow-sm hover:shadow-md transition-all duration-200 border border-border/60 hover:border-cyan-500/30 group"
                    onClick={() => onEdit(contato)}
                  >
                    {/* Status Badge */}
                    <div className="mb-2.5">
                      <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold ${colConfig.badgeClass}`}>
                        {col.label}
                      </span>
                    </div>

                    {/* Name */}
                    <h4 className="text-sm font-semibold text-foreground mb-1 truncate group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                      {contato.nome}
                    </h4>

                    {/* Company */}
                    {contato.empresa && (
                      <p className="text-xs text-muted-foreground mb-3 truncate">
                        {contato.empresa}
                      </p>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/40">
                      <div className="flex items-center gap-3 text-muted-foreground">
                        {contato.telefone && (
                          <>
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                            </div>
                            <button
                              className="flex items-center gap-1 hover:text-cyan-500 transition-colors"
                              title="Abrir chat"
                              onClick={(e) => {
                                e.stopPropagation();
                                const params = new URLSearchParams({ phone: contato.telefone });
                                if (contato.nome) params.set("name", contato.nome);
                                if (contato.profile_picture_url) params.set("avatar", contato.profile_picture_url);
                                navigate(`/chat?${params.toString()}`);
                              }}
                            >
                              <MessageCircle className="h-3 w-3" />
                            </button>
                          </>
                        )}
                        {contato.etiquetas?.length > 0 && (
                          <div className="flex items-center gap-1">
                            <Tag className="h-3 w-3" />
                            <span className="text-[11px]">{contato.etiquetas.length}</span>
                          </div>
                        )}
                      </div>
                      {/* Avatar */}
                      <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center overflow-hidden shrink-0">
                        {contato.profile_picture_url ? (
                          <img
                            src={contato.profile_picture_url}
                            alt={contato.nome}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = "none";
                            }}
                          />
                        ) : (
                          <User className="h-3.5 w-3.5 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {items.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-10">Nenhum contato</p>
                )}
              </div>
            </ScrollArea>

            {/* Add New Button */}
            <button className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium text-muted-foreground hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors w-full border-t border-border/30">
              <Plus className="h-3.5 w-3.5" />
              Novo
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ContatosKanban;
