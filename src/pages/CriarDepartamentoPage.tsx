import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Briefcase } from "lucide-react";

const CriarDepartamentoPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");

  const createMutation = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { error } = await supabase
        .from("departamentos" as any)
        .insert({ nome, descricao, user_id: user.id });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departamentos"] });
      toast({ title: "Departamento criado com sucesso" });
      navigate("/departamentos");
    },
    onError: () => {
      toast({ title: "Erro ao criar departamento", variant: "destructive" });
    },
  });

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
            <BreadcrumbPage>Criar</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Briefcase className="h-6 w-6 text-foreground" />
          <h1 className="text-2xl font-semibold text-foreground">Criar departamento</h1>
        </div>
        <p className="text-sm text-muted-foreground">Preencha os dados do novo departamento</p>
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
              onClick={() => createMutation.mutate()}
              disabled={createMutation.isPending || !nome.trim()}
            >
              {createMutation.isPending ? "Criando..." : "Criar departamento"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default CriarDepartamentoPage;
