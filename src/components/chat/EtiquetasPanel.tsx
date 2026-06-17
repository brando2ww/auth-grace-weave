import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tag, Plus, Pencil, Trash2, X, Check } from "lucide-react";
import { toast } from "sonner";

interface Etiqueta {
  id: string;
  user_id: string;
  nome: string;
  cor: string;
  created_at: string;
  updated_at: string;
}

const CORES = [
  "#6B7280", // cinza
  "#EF4444", // vermelho
  "#F97316", // laranja
  "#EAB308", // amarelo
  "#22C55E", // verde
  "#3B82F6", // azul
  "#8B5CF6", // roxo
  "#EC4899", // rosa
];

export default function EtiquetasPanel() {
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [nome, setNome] = useState("");
  const [cor, setCor] = useState(CORES[0]);

  const { data: etiquetas = [], isLoading } = useQuery({
    queryKey: ["etiquetas"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("etiquetas" as any)
        .select("*")
        .order("nome");
      if (error) throw error;
      return (data || []) as unknown as Etiqueta[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Não autenticado");
      const { error } = await supabase.from("etiquetas" as any).insert({ nome, cor, user_id: user.id } as any);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["etiquetas"] });
      toast.success("Etiqueta criada");
      resetForm();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const updateMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("etiquetas" as any).update({ nome, cor } as any).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["etiquetas"] });
      toast.success("Etiqueta atualizada");
      resetForm();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("etiquetas" as any).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["etiquetas"] });
      toast.success("Etiqueta excluída");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const resetForm = () => {
    setIsCreating(false);
    setEditingId(null);
    setNome("");
    setCor(CORES[0]);
  };

  const startEdit = (et: Etiqueta) => {
    setEditingId(et.id);
    setNome(et.nome);
    setCor(et.cor);
    setIsCreating(false);
  };

  const handleSave = () => {
    if (!nome.trim()) return;
    if (editingId) {
      updateMutation.mutate(editingId);
    } else {
      createMutation.mutate();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Etiquetas
        </h2>
        {!isCreating && !editingId && (
          <button
            onClick={() => { setIsCreating(true); setEditingId(null); setNome(""); setCor(CORES[0]); }}
            className="p-1 hover:bg-accent rounded-md transition-colors"
          >
            <Plus size={14} className="text-muted-foreground" />
          </button>
        )}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-3">
        {isLoading ? (
          <div className="px-2 py-4 text-xs text-muted-foreground">Carregando...</div>
        ) : etiquetas.length === 0 && !isCreating ? (
          <div className="px-2 py-4 text-xs text-muted-foreground text-center">
            Nenhuma etiqueta criada
          </div>
        ) : (
          etiquetas.map((et) =>
            editingId === et.id ? null : (
              <div
                key={et.id}
                className="group flex items-center gap-2 px-2 py-2 rounded-lg border hover:bg-accent/50 transition-colors mb-1.5"
                style={{ borderColor: `${et.cor}40`, backgroundColor: `${et.cor}15` }}
              >
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: et.cor }}
                />
                <span className="text-[13px] text-foreground truncate flex-1">{et.nome}</span>
                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => startEdit(et)}
                    className="p-1 hover:bg-accent rounded transition-colors"
                  >
                    <Pencil size={12} className="text-muted-foreground" />
                  </button>
                  <button
                    onClick={() => deleteMutation.mutate(et.id)}
                    className="p-1 hover:bg-destructive/10 rounded transition-colors"
                  >
                    <Trash2 size={12} className="text-destructive" />
                  </button>
                </div>
              </div>
            )
          )
        )}

        {/* Inline form */}
        {(isCreating || editingId) && (
          <div className="mt-2 p-3 rounded-lg border border-border bg-card">
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome da etiqueta"
              className="w-full text-sm bg-transparent border-b border-border pb-2 mb-3 outline-none focus:border-primary text-foreground placeholder:text-muted-foreground"
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
            />
            <div className="flex gap-1.5 mb-3">
              {CORES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCor(c)}
                  className="w-6 h-6 rounded-full border-2 transition-all"
                  style={{
                    backgroundColor: c,
                    borderColor: cor === c ? "hsl(var(--foreground))" : "transparent",
                    transform: cor === c ? "scale(1.15)" : "scale(1)",
                  }}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={resetForm}
                className="flex-1 flex items-center justify-center gap-1 text-xs py-1.5 rounded-md hover:bg-accent transition-colors text-muted-foreground"
              >
                <X size={12} /> Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={!nome.trim() || createMutation.isPending || updateMutation.isPending}
                className="flex-1 flex items-center justify-center gap-1 text-xs py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                <Check size={12} /> Salvar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
