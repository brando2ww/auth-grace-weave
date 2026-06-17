import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Pencil, Power, Plus, Search, Trash2, X } from "lucide-react";

interface Atendente {
  id: string;
  nome: string;
  email: string;
  ativo: boolean;
  avatar_url?: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}

interface AtendenteDepartamento {
  departamento_id: string;
  departamentos: {
    id: string;
    nome: string;
  };
}

const getInitials = (nome: string) => {
  return nome
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
};

const AtendentesPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setCurrentUserId(data.session?.user?.id ?? null);
    });
  }, []);

  const { data: atendentes = [], isLoading } = useQuery({
    queryKey: ["atendentes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("atendentes" as any)
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []) as unknown as Atendente[];
    },
  });

  const { data: atendenteDepartamentos = [] } = useQuery({
    queryKey: ["atendente_departamentos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("atendente_departamentos" as any)
        .select("atendente_id, departamento_id, departamentos(id, nome)");
      if (error) throw error;
      return (data || []) as unknown as (AtendenteDepartamento & { atendente_id: string })[];
    },
  });

  const toggleAtivoMutation = useMutation({
    mutationFn: async ({ id, ativo }: { id: string; ativo: boolean }) => {
      const { error } = await supabase
        .from("atendentes" as any)
        .update({ ativo } as any)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["atendentes"] });
      toast({ title: "Atendente atualizado com sucesso" });
    },
    onError: () => {
      toast({ title: "Erro ao atualizar atendente", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("atendentes" as any)
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["atendentes"] });
      queryClient.invalidateQueries({ queryKey: ["atendente_departamentos"] });
      toast({ title: "Atendente excluído com sucesso" });
      setDeleteId(null);
    },
    onError: () => {
      toast({ title: "Erro ao excluir atendente", variant: "destructive" });
    },
  });

  const getDepartamentosDoAtendente = (atendenteId: string) => {
    return atendenteDepartamentos
      .filter((ad) => ad.atendente_id === atendenteId)
      .map((ad) => ad.departamentos);
  };

  const atendentesFiltrados = atendentes.filter((at) => {
    const matchBusca =
      at.nome.toLowerCase().includes(busca.toLowerCase()) ||
      at.email.toLowerCase().includes(busca.toLowerCase());
    const matchStatus =
      filtroStatus === "todos" ? true : filtroStatus === "ativos" ? at.ativo : !at.ativo;
    return matchBusca && matchStatus;
  });

  return (
    <DashboardLayout>
      {/* Filtros */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar atendente..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={filtroStatus} onValueChange={setFiltroStatus}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ativos">Ativos</SelectItem>
              <SelectItem value="inativos">Inativos</SelectItem>
              <SelectItem value="todos">Todos</SelectItem>
            </SelectContent>
          </Select>
          {filtroStatus !== "todos" && (
            <button
              onClick={() => setFiltroStatus("todos")}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button
          className="bg-cyan-500 hover:bg-cyan-600 text-white gap-2 ml-auto"
          onClick={() => navigate("/atendentes/criar")}
        >
          <Plus className="h-4 w-4" />
          Criar atendente
        </Button>
      </div>

      {/* Grid de cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {isLoading ? (
          <>
            <Skeleton className="h-[220px] rounded-2xl" />
            <Skeleton className="h-[220px] rounded-2xl" />
            <Skeleton className="h-[220px] rounded-2xl" />
            <Skeleton className="h-[220px] rounded-2xl" />
          </>
        ) : (
          <>
            {atendentesFiltrados.map((at) => {
              const deps = getDepartamentosDoAtendente(at.id);
              const isOwner = at.user_id === currentUserId;
              return (
                <div
                  key={at.id}
                  className="bg-gray-100 border border-gray-200 rounded-2xl overflow-hidden flex flex-col"
                >
                  {/* Header */}
                  <div className="flex items-center gap-3 px-4 pt-4 pb-2">
                    <Avatar className="h-10 w-10 border-2 border-cyan-500 shrink-0">
                      {at.avatar_url && <AvatarImage src={at.avatar_url} alt={at.nome} />}
                      <AvatarFallback className="bg-emerald-500 text-white text-sm font-semibold">
                        {getInitials(at.nome)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full shrink-0 ${at.ativo ? "bg-emerald-500" : "bg-yellow-500"}`} />
                        <h3 className="text-sm font-semibold text-gray-900 truncate uppercase">{at.nome}</h3>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">{at.email}</p>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex items-center gap-2 px-4 pb-2">
                    {isOwner && (
                      <Badge className="bg-cyan-500/15 text-cyan-600 border-cyan-500/20 text-[11px]">
                        ADMIN
                      </Badge>
                    )}
                    {at.ativo ? (
                      <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/20 text-[11px]">
                        Ativo
                      </Badge>
                    ) : (
                      <Badge className="bg-yellow-500/15 text-yellow-400 border-yellow-500/20 text-[11px]">
                        Inativo
                      </Badge>
                    )}
                  </div>

                  {/* Departamentos */}
                  {deps.length > 0 && (
                    <div className="px-4 pb-2">
                      <p className="text-[11px] font-semibold text-gray-400 mb-1">Departamentos</p>
                      <div className="flex flex-wrap gap-1">
                        {deps.map((dep) => (
                          <Badge
                            key={dep.id}
                            variant="outline"
                            className="text-xs font-normal"
                          >
                            {dep.nome}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex flex-col gap-2 px-4 pb-4 pt-2 mt-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-cyan-500 text-cyan-600 hover:bg-cyan-50 hover:text-cyan-700"
                      onClick={() => navigate(`/atendentes/${at.id}/editar`)}
                    >
                      <Pencil className="h-3 w-3 mr-1" /> Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-cyan-500 text-cyan-600 hover:bg-cyan-50 hover:text-cyan-700"
                      onClick={() => toggleAtivoMutation.mutate({ id: at.id, ativo: !at.ativo })}
                    >
                      <Power className="h-3 w-3 mr-1" /> {at.ativo ? "Desativar" : "Ativar"}
                    </Button>
                    {!isOwner && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-destructive text-destructive hover:bg-destructive/10"
                        onClick={() => setDeleteId(at.id)}
                      >
                        <Trash2 className="h-3 w-3 mr-1" /> Excluir
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Card adicionar */}
            <button
              onClick={() => navigate("/atendentes/criar")}
              className="border-2 border-dashed border-cyan-400 rounded-2xl p-5 flex flex-col items-center justify-center gap-2 text-cyan-500 hover:bg-cyan-50 dark:hover:bg-cyan-950/20 transition-colors min-h-[220px] cursor-pointer"
            >
              <Plus className="h-8 w-8" />
              <span className="text-sm font-medium">Adicionar atendente</span>
            </button>
          </>
        )}
      </div>

      {/* Dialog de confirmação de exclusão */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir atendente</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este atendente? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default AtendentesPage;
