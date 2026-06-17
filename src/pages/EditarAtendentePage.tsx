import { useState, useEffect, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { CountryCodeSelector } from "@/components/CountryCodeSelector";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Settings, X, Camera } from "lucide-react";

const getInitials = (nome: string) =>
  nome
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

const EditarAtendentePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [codigoPais, setCodigoPais] = useState("+55");
  const [isAdmin, setIsAdmin] = useState(false);
  const [senha, setSenha] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [mensagemFinalizacao, setMensagemFinalizacao] = useState("");
  const [descricao, setDescricao] = useState("");
  const [departamentosSelecionados, setDepartamentosSelecionados] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const { data: atendente, isLoading } = useQuery({
    queryKey: ["atendentes", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("atendentes" as any)
        .select("*")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: atendenteDepIds = [] } = useQuery({
    queryKey: ["atendente_departamentos", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("atendente_departamentos" as any)
        .select("departamento_id")
        .eq("atendente_id", id!);
      if (error) throw error;
      return (data as any[]).map((d) => d.departamento_id);
    },
    enabled: !!id,
  });

  const { data: departamentos = [] } = useQuery({
    queryKey: ["departamentos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("departamentos" as any)
        .select("*")
        .eq("ativo", true)
        .order("nome");
      if (error) throw error;
      return data as any[];
    },
  });

  useEffect(() => {
    if (atendente) {
      setNome((atendente as any).nome);
      setEmail((atendente as any).email);
      setTelefone((atendente as any).telefone || "");
      setCodigoPais((atendente as any).codigo_pais || "+55");
      setIsAdmin((atendente as any).is_admin || false);
      setAvatarUrl((atendente as any).avatar_url || null);
      setMensagemFinalizacao((atendente as any).mensagem_finalizacao || "");
      setDescricao((atendente as any).descricao || "");
    }
  }, [atendente]);

  useEffect(() => {
    if (atendenteDepIds.length > 0) {
      setDepartamentosSelecionados(atendenteDepIds);
    }
  }, [atendenteDepIds]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `${id}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: publicUrl } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const url = `${publicUrl.publicUrl}?t=${Date.now()}`;
      setAvatarUrl(url);

      await supabase
        .from("atendentes" as any)
        .update({ avatar_url: url } as any)
        .eq("id", id!);

      toast({ title: "Foto atualizada com sucesso" });
    } catch {
      toast({ title: "Erro ao enviar foto", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const updateMutation = useMutation({
    mutationFn: async () => {
      const updateData: any = { nome, email, telefone, codigo_pais: codigoPais, is_admin: isAdmin, mensagem_finalizacao: mensagemFinalizacao, descricao };
      if (avatarUrl) updateData.avatar_url = avatarUrl;

      const { error } = await supabase
        .from("atendentes" as any)
        .update(updateData)
        .eq("id", id!);
      if (error) throw error;

      // Sync departments
      await supabase
        .from("atendente_departamentos" as any)
        .delete()
        .eq("atendente_id", id!);

      if (departamentosSelecionados.length > 0) {
        const { error: relError } = await supabase
          .from("atendente_departamentos" as any)
          .insert(
            departamentosSelecionados.map((depId) => ({
              atendente_id: id!,
              departamento_id: depId,
            }))
          );
        if (relError) throw relError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["atendentes"] });
      queryClient.invalidateQueries({ queryKey: ["atendente_departamentos"] });
      toast({ title: "Atendente atualizado com sucesso" });
      navigate("/atendentes");
    },
    onError: () => {
      toast({ title: "Erro ao atualizar atendente", variant: "destructive" });
    },
  });

  const removeDepartamento = (depId: string) => {
    setDepartamentosSelecionados((prev) => prev.filter((i) => i !== depId));
  };

  const addDepartamento = (depId: string) => {
    if (!departamentosSelecionados.includes(depId)) {
      setDepartamentosSelecionados((prev) => [...prev, depId]);
    }
  };

  const availableDeps = departamentos.filter(
    (d) => !departamentosSelecionados.includes(d.id)
  );

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-[500px] rounded-lg" />
        </div>
      </DashboardLayout>
    );
  }

  if (!atendente) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          <p className="text-muted-foreground">Atendente não encontrado.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/atendentes">Atendentes</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <span className="text-muted-foreground">Editar</span>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Page header */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-500/10">
            <Settings className="h-5 w-5 text-cyan-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Editar atendente</h1>
            <p className="text-sm text-muted-foreground">Edite os dados do seu atendente</p>
          </div>
        </div>

        <Card className="overflow-hidden">
          {/* Avatar header */}
          <div className="flex items-center gap-4 p-6 border-b">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <Avatar className="h-16 w-16">
                <AvatarImage src={avatarUrl || undefined} />
                <AvatarFallback className="bg-cyan-500 text-white text-lg font-semibold">
                  {getInitials(nome || "U")}
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="h-5 w-5 text-white" />
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
                disabled={uploading}
              />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground uppercase">{nome}</h2>
              <p className="text-sm text-muted-foreground">{email}</p>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="perfil" className="w-full">
            <div className="border-b px-6">
              <TabsList className="bg-transparent h-auto p-0 gap-6">
                <TabsTrigger
                  value="perfil"
                  className="rounded-none border-b-2 border-transparent px-0 pb-3 pt-4 text-sm font-medium data-[state=active]:border-cyan-500 data-[state=active]:text-cyan-500 data-[state=active]:shadow-none data-[state=active]:bg-transparent"
                >
                  Perfil
                </TabsTrigger>
                <TabsTrigger
                  value="complemento"
                  className="rounded-none border-b-2 border-transparent px-0 pb-3 pt-4 text-sm font-medium data-[state=active]:border-cyan-500 data-[state=active]:text-cyan-500 data-[state=active]:shadow-none data-[state=active]:bg-transparent"
                >
                  Complemento
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="perfil" className="mt-0 p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left column */}
                <div className="space-y-5">
                  {/* Admin checkbox */}
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="is_admin"
                      checked={isAdmin}
                      onCheckedChange={(v) => setIsAdmin(v === true)}
                      className="mt-0.5 data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500"
                    />
                    <div>
                      <Label htmlFor="is_admin" className="font-medium cursor-pointer">
                        Administrador
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Poderá ver as conversas de todos os atendentes
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome completo</Label>
                    <Input
                      id="nome"
                      placeholder="Nome do atendente"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@exemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="senha">Alterar senha</Label>
                    <Input
                      id="senha"
                      type="password"
                      placeholder="Nova senha (opcional)"
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                    />
                  </div>
                </div>

                {/* Right column */}
                <div className="space-y-5">
                  {/* Departamentos multi-select */}
                  <div className="space-y-2">
                    <Label>Departamentos</Label>
                    <div className="flex flex-wrap gap-2 min-h-[40px] p-2 border rounded-md bg-background">
                      {departamentosSelecionados.map((depId) => {
                        const dep = departamentos.find((d) => d.id === depId);
                        return (
                          <Badge
                            key={depId}
                            variant="secondary"
                            className="gap-1 pl-2 pr-1 py-1 bg-cyan-500/10 text-cyan-700 hover:bg-cyan-500/20 border-0"
                          >
                            {dep?.nome || depId}
                            <button
                              type="button"
                              onClick={() => removeDepartamento(depId)}
                              className="ml-1 rounded-full hover:bg-cyan-500/20 p-0.5"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        );
                      })}
                    </div>
                    {availableDeps.length > 0 && (
                      <select
                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value=""
                        onChange={(e) => {
                          if (e.target.value) addDepartamento(e.target.value);
                        }}
                      >
                        <option value="">Adicionar departamento...</option>
                        {availableDeps.map((dep) => (
                          <option key={dep.id} value={dep.id}>
                            {dep.nome}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone (opcional)</Label>
                    <div className="flex rounded-md border border-input overflow-hidden focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 ring-offset-background">
                      <CountryCodeSelector value={codigoPais} onChange={setCodigoPais} variant="default" />
                      <Input
                        id="telefone"
                        placeholder="(00) 00000-0000"
                        value={telefone}
                        onChange={(e) => setTelefone(e.target.value)}
                        className="border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="complemento" className="mt-0 p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="mensagem_finalizacao">Mensagem de finalização (opcional)</Label>
                <Textarea
                  id="mensagem_finalizacao"
                  placeholder="Mensagem a ser enviada após este atendente finalizar uma conversa."
                  value={mensagemFinalizacao}
                  onChange={(e) => setMensagemFinalizacao(e.target.value)}
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="descricao_atendente">Descrição (opcional)</Label>
                <Textarea
                  id="descricao_atendente"
                  placeholder="Ex. Este atendente é responsável por emitir cobranças."
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">A descrição é utilizada para treinar o Agente IA</p>
              </div>
            </TabsContent>
          </Tabs>

          {/* Footer buttons */}
          <div className="flex justify-end gap-3 p-6 border-t">
            <Button variant="outline" onClick={() => navigate("/atendentes")}>
              Voltar
            </Button>
            <Button
              className="bg-cyan-500 hover:bg-cyan-600 text-white"
              disabled={!nome.trim() || !email.trim() || updateMutation.isPending || uploading}
              onClick={() => updateMutation.mutate()}
            >
              {updateMutation.isPending ? "Salvando..." : "Salvar atendente"}
            </Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default EditarAtendentePage;
