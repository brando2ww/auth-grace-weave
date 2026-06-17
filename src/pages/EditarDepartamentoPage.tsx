import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Briefcase } from "lucide-react";

const EditarDepartamentoPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: departamento, isLoading } = useQuery({
    queryKey: ["departamentos", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("departamentos" as any)
        .select("*")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");

  useEffect(() => {
    if (departamento) {
      setNome((departamento as any).nome);
      setDescricao((departamento as any).descricao || "");
    }
  }, [departamento]);

  const updateMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("departamentos" as any)
        .update({ nome, descricao })
        .eq("id", id!);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departamentos"] });
      toast({ title: "Departamento salvo com sucesso" });
      navigate("/departamentos");
    },
    onError: () => {
      toast({ title: "Erro ao salvar departamento", variant: "destructive" });
    },
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-[300px]" />
        </div>
      </DashboardLayout>
    );
  }

  if (!departamento) {
    return (
      <DashboardLayout>
        <p className="text-muted-foreground">Departamento não encontrado.</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/departamentos">Departamentos</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Editar</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Briefcase className="h-6 w-6 text-foreground" />
          <h1 className="text-2xl font-semibold text-foreground">Editar departamento</h1>
        </div>
        <p className="text-sm text-muted-foreground">Edite os dados do seu departamento</p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome</Label>
            <Input
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome do departamento"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição (opcional)</Label>
            <Textarea
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Uma breve descrição sobre o departamento..."
            />
            <p className="text-xs text-muted-foreground">
              A descrição é utilizada para treinar o Agente IA
            </p>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate("/departamentos")}>
              Voltar
            </Button>
            <Button
              className="bg-cyan-500 hover:bg-cyan-600 text-white"
              onClick={() => updateMutation.mutate()}
              disabled={updateMutation.isPending || !nome.trim()}
            >
              {updateMutation.isPending ? "Salvando..." : "Salvar departamento"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default EditarDepartamentoPage;
