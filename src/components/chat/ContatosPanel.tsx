import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Search, UserPlus, Users, RefreshCw, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";

interface EvolutionContact {
  id: string;
  name: string;
  phone: string;
  profilePictureUrl: string | null;
  sessionName: string;
  saved: boolean;
  
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || "")
    .join("");
}

function formatPhone(phone: string): string {
  let p = phone.startsWith("0") ? phone.slice(1) : phone;

  if (p.length === 11 && p.startsWith("1")) {
    return `+1 (${p.slice(1, 4)}) ${p.slice(4, 7)}-${p.slice(7)}`;
  }

  if (p.startsWith("55") && p.length >= 12) {
    const local = p.slice(2);
    if (local.startsWith("800")) {
      return `0800 ${local.slice(3, 6)} ${local.slice(6)}`;
    }
    if (/^[3459]00/.test(local) && local.length === 10) {
      return `0${local.slice(0, 3)} ${local.slice(3, 6)} ${local.slice(6)}`;
    }
    if (local.length === 11 && local.charAt(2) === "9") {
      return `+55 (${local.slice(0, 2)}) ${local.slice(2, 7)}-${local.slice(7)}`;
    }
    if (local.length === 10) {
      return `+55 (${local.slice(0, 2)}) ${local.slice(2, 6)}-${local.slice(6)}`;
    }
  }

  return `+${p}`;
}

function ContactItem({ contact }: { contact: EvolutionContact }) {
  return (
    <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-accent/50 cursor-pointer transition-colors">
      {contact.profilePictureUrl ? (
        <img
          src={contact.profilePictureUrl}
          alt={contact.name}
          className="w-9 h-9 rounded-full object-cover shrink-0"
        />
      ) : (
        <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center shrink-0">
          <span className="text-[11px] font-medium text-muted-foreground">
            {getInitials(contact.name)}
          </span>
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-foreground truncate">
          {contact.name}
        </p>
        <p className="text-[11px] text-muted-foreground truncate">
          {formatPhone(contact.phone)}
        </p>
      </div>
    </div>
  );
}

export default function ContatosPanel() {
  const [search, setSearch] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);
  const queryClient = useQueryClient();

  const { data: contacts = [], isLoading } = useQuery({
    queryKey: ["evolution-contacts"],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("evolution-contacts");
      if (error) throw error;
      return (data?.contacts || []) as EvolutionContact[];
    },
  });

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const { data, error } = await supabase.functions.invoke("evolution-contacts", {
        body: { sync: true },
      });
      if (error) throw error;
      const count = data?.synced || 0;
      toast({
        title: "Sincronização concluída",
        description: count > 0
          ? `${count} contato${count > 1 ? "s" : ""} sincronizado${count > 1 ? "s" : ""}.`
          : "Nenhum contato novo para sincronizar.",
      });
      queryClient.invalidateQueries({ queryKey: ["evolution-contacts"] });
      queryClient.invalidateQueries({ queryKey: ["contatos"] });
    } catch (err) {
      toast({
        title: "Erro ao sincronizar",
        description: "Não foi possível sincronizar os contatos.",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const filtered = contacts.filter((c) => {
    const q = search.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.phone.includes(q);
  });

  const unsaved = filtered.filter((c) => !c.saved);
  const saved = filtered.filter((c) => c.saved);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Contatos
        </h2>
        <div className="flex items-center gap-1">
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="p-1 hover:bg-accent rounded-md transition-colors disabled:opacity-50"
            title="Sincronizar contatos"
          >
            {isSyncing ? (
              <Loader2 size={16} className="text-muted-foreground animate-spin" />
            ) : (
              <RefreshCw size={16} className="text-muted-foreground" />
            )}
          </button>
          <button className="p-1 hover:bg-accent rounded-md transition-colors">
            <UserPlus size={16} className="text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 pb-3">
        <div className="flex items-center gap-2 h-9 rounded-lg bg-muted border border-border px-2.5">
          <Search size={14} className="text-muted-foreground shrink-0" />
          <input
            type="text"
            placeholder="Pesquise por nome ou número..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent border-none outline-none text-[13px] text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-3 space-y-0.5">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-2 py-2">
              <Skeleton className="w-9 h-9 rounded-full shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-28" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ))
        ) : filtered.length === 0 ? (
          <div className="mt-4 mx-1 rounded-xl bg-accent/50 border border-border p-4 flex flex-col items-center gap-2 text-center">
            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
              <Users size={20} className="text-muted-foreground" />
            </div>
            <p className="text-[13px] text-muted-foreground leading-relaxed">
              {search
                ? "Nenhum contato encontrado para esta busca."
                : "Nenhum contato disponível no momento."}
            </p>
          </div>
        ) : (
          <>
            {unsaved.length > 0 && (
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-2 py-2">
                  Não sincronizados ({unsaved.length})
                </p>
                {unsaved.map((contact) => (
                  <ContactItem key={contact.id} contact={contact} />
                ))}
              </div>
            )}

            {unsaved.length > 0 && saved.length > 0 && (
              <Separator className="my-2" />
            )}

            {saved.length > 0 && (
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-2 py-2">
                  Sincronizados ({saved.length})
                </p>
                {saved.map((contact) => (
                  <ContactItem key={contact.id} contact={contact} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
