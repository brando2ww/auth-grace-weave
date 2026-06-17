import { useState } from "react";
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

const DepartamentosPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("ativos");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: departamentos = [], isLoading } = useQuery({
    queryKey: ["departamentos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("departamentos" as any)
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []) as any[];
    },
  });

  const { data: atendentesPorDep = [] } = useQuery({
    queryKey: ["atendente_departamentos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("atendente_departamentos" as any)
        .select("departamento_id, atendentes(id, nome, avatar_url)");
      if (error) throw error;
      return (data || []) as any[];
    },
  });

  const getAtendentes = (depId: string) => {
    return atendentesPorDep
      .filter((ad) => ad.departamento_id === depId)
      .map((ad) => ad.atendentes)
      .filter(Boolean) as { id: string; nome: string; avatar_url: string | null }[];
  };

  const getInitials = (nome: string) => nome.substring(0, 2).toUpperCase();

  const toggleAtivoMutation = useMutation({
    mutationFn: async ({ id, ativo }: { id: string; ativo: boolean }) => {
      const { error } = await supabase
        .from("departamentos" as any)
        .update({ ativo } as any)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departamentos"] });
      toast({ title: "Departamento atualizado com sucesso" });
    },
    onError: () => {
      toast({ title: "Erro ao atualizar departamento", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("departamentos" as any)
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departamentos"] });
      toast({ title: "Departamento excluído com sucesso" });
      setDeleteId(null);
    },
    onError: () => {
      toast({ title: "Erro ao excluir departamento", variant: "destructive" });
    },
  });

  const departamentosFiltrados = departamentos.filter((dep) => {
    const matchBusca = dep.nome.toLowerCase().includes(busca.toLowerCase());
    const matchStatus =
      filtroStatus === "todos" ? true : filtroStatus === "ativos" ? dep.ativo : !dep.ativo;
    return matchBusca && matchStatus;
  });

  return (
    <DashboardLayout>
      {/* Filtros + Botão criar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar departamento..."
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
          {filtroStatus !== "ativos" && (
            <button
              onClick={() => setFiltroStatus("ativos")}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="ml-auto">
          <Button
            className="bg-cyan-500 hover:bg-cyan-600 text-white gap-2"
            onClick={() => navigate("/departamentos/criar")}
          >
            <Plus className="h-4 w-4" />
            Criar departamento
          </Button>
        </div>
      </div>

      {/* Grid de cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <>
            <Skeleton className="h-[180px] rounded-2xl" />
            <Skeleton className="h-[180px] rounded-2xl" />
            <Skeleton className="h-[180px] rounded-2xl" />
          </>
        ) : (
          <>
            {departamentosFiltrados.map((dep) => (
              <div key={dep.id} className="bg-gray-100 border border-gray-200 rounded-2xl overflow-hidden flex flex-col">
                {/* Nome + Badges na mesma linha */}
                <div className="px-4 pt-4 pb-2">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full shrink-0 ${dep.ativo ? "bg-emerald-500" : "bg-yellow-500"}`} />
                    <h3 className="text-sm font-semibold text-gray-900 truncate">{dep.nome}</h3>
                    <div className="flex items-center gap-1 ml-auto shrink-0">
                      {dep.is_default && (
                        <Badge className="bg-cyan-500/15 text-cyan-600 border-cyan-500/20 text-[11px]">PADRÃO</Badge>
                      )}
                      {dep.ativo ? (
                        <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/20 text-[11px]">Ativo</Badge>
                      ) : (
                        <Badge className="bg-yellow-500/15 text-yellow-400 border-yellow-500/20 text-[11px]">Inativo</Badge>
                      )}
                    </div>
                  </div>
                  {dep.descricao && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{dep.descricao}</p>
                  )}
                </div>

                {/* Atendentes vinculados */}
                {(() => {
                  const atendentes = getAtendentes(dep.id);
                  if (atendentes.length === 0) return null;
                  const maxShow = 3;
                  const visible = atendentes.slice(0, maxShow);
                  const extra = atendentes.length - maxShow;
                  return (
                    <div className="flex flex-wrap items-center gap-1.5 px-4 pb-2">
                      {visible.map((at) => (
                        <div key={at.id} className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-2 py-1">
                          <Avatar className="h-5 w-5">
                            {at.avatar_url && <AvatarImage src={at.avatar_url} alt={at.nome} />}
                            <AvatarFallback className="bg-cyan-500 text-white text-[8px] font-semibold">
                              {getInitials(at.nome)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-gray-700 truncate max-w-[80px]">{at.nome}</span>
                        </div>
                      ))}
                      {extra > 0 && (
                        <div className="flex items-center bg-gray-100 border border-gray-200 rounded-full px-2.5 py-1">
                          <span className="text-xs text-gray-500 font-medium">+{extra}</span>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Footer */}
                <div className="flex flex-col gap-2 px-4 pb-4 mt-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-cyan-500 text-cyan-600 hover:bg-cyan-50 hover:text-cyan-700"
                    onClick={() => navigate(`/departamentos/${dep.id}/editar`)}
                  >
                    <Pencil className="h-3 w-3 mr-1" /> Editar
                  </Button>
                  {!dep.is_default && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-cyan-500 text-cyan-600 hover:bg-cyan-50 hover:text-cyan-700"
                        onClick={() => toggleAtivoMutation.mutate({ id: dep.id, ativo: !dep.ativo })}
                      >
                        <Power className="h-3 w-3 mr-1" /> {dep.ativo ? "Desativar" : "Ativar"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-destructive text-destructive hover:bg-destructive/10"
                        onClick={() => setDeleteId(dep.id)}
                      >
                        <Trash2 className="h-3 w-3 mr-1" /> Excluir
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Card adicionar */}
            <button
              onClick={() => navigate("/departamentos/criar")}
              className="border-2 border-dashed border-cyan-400 rounded-2xl p-5 flex flex-col items-center justify-center gap-2 text-cyan-500 hover:bg-cyan-50 dark:hover:bg-cyan-950/20 transition-colors min-h-[180px] cursor-pointer"
            >
              <Plus className="h-8 w-8" />
              <span className="text-sm font-medium">Adicionar departamento</span>
            </button>
          </>
        )}
      </div>

      {/* Dialog de confirmação de exclusão */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir departamento</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este departamento? Esta ação não pode ser desfeita.
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

export default DepartamentosPage;
