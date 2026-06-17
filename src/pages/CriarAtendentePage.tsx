import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { CountryCodeSelector } from "@/components/CountryCodeSelector";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Settings, X, User, Bot, ChevronLeft } from "lucide-react";
import PermissoesTab from "@/components/atendente/PermissoesTab";
import AgenteIAForm from "@/components/atendente/AgenteIAForm";
import AgentTestPanel from "@/components/atendente/AgentTestPanel";

type TipoAtendente = null | "atendente" | "agente_ia";

const CriarAtendentePage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [tipoAtendente, setTipoAtendente] = useState<TipoAtendente>(null);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [codigoPais, setCodigoPais] = useState("+55");
  const [isAdmin, setIsAdmin] = useState(false);
  const [senha, setSenha] = useState("");
  const [mensagemFinalizacao, setMensagemFinalizacao] = useState("");
  const [descricao, setDescricao] = useState("");
  const [departamentosSelecionados, setDepartamentosSelecionados] = useState<string[]>([]);
  const [currentConfigIA, setCurrentConfigIA] = useState<Record<string, any>>({});

  const { data: departamentos = [] } = useQuery({
    queryKey: ["departamentos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("departamentos" as any)
        .select("*")
        .eq("ativo", true)
        .order("nome");
      if (error) throw error;
      return (data || []) as any[];
    },
  });



  const createMutation = useMutation({
    mutationFn: async (mutationConfigIA?: Record<string, any>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const insertData: any = {
        nome,
        email,
        telefone: telefone || null,
        codigo_pais: codigoPais,
        is_admin: isAdmin,
        mensagem_finalizacao: mensagemFinalizacao || null,
        descricao: descricao || null,
        user_id: user.id,
      };
      if (mutationConfigIA) {
        insertData.config_ia = mutationConfigIA;
      }

      const { data: atendente, error } = await supabase
        .from("atendentes" as any)
        .insert(insertData)
        .select()
        .single();
      if (error) throw error;

      if (departamentosSelecionados.length > 0) {
        const { error: relError } = await supabase
          .from("atendente_departamentos" as any)
          .insert(
            departamentosSelecionados.map((depId) => ({
              atendente_id: (atendente as any).id,
              departamento_id: depId,
            }))
          );
        if (relError) throw relError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["atendentes"] });
      queryClient.invalidateQueries({ queryKey: ["atendente_departamentos"] });
      toast({ title: "Atendente criado com sucesso" });
      navigate("/atendentes");
    },
    onError: () => {
      toast({ title: "Erro ao criar atendente", variant: "destructive" });
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

  return (
    <DashboardLayout>
      <div className={`mx-auto space-y-6 ${tipoAtendente === "agente_ia" ? "max-w-6xl" : "max-w-4xl"}`}>
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
              <span className="text-muted-foreground">Novo</span>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Page header */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-500/10">
            {tipoAtendente === "agente_ia" ? (
              <Bot className="h-5 w-5 text-cyan-500" />
            ) : (
              <Settings className="h-5 w-5 text-cyan-500" />
            )}
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">
              {tipoAtendente === "agente_ia" ? "Criar Agente IA" : "Criar atendente"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {tipoAtendente === "agente_ia"
                ? "Preencha os dados do seu agente"
                : "Preencha os dados do seu atendente"}
            </p>
          </div>
        </div>

        {/* Selection screen */}
        {!tipoAtendente && (
          <Card className="p-8">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="space-y-2">
                <h2 className="text-lg font-bold text-foreground">Escolha uma opção</h2>
                <p className="text-sm text-muted-foreground max-w-md">
                  Qual o tipo de atendente você deseja criar? Atendente humano ou Agente com inteligência artificial.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
                <Button
                  className="flex-1 h-14 gap-3 bg-cyan-500 hover:bg-cyan-600 text-white text-base"
                  onClick={() => setTipoAtendente("atendente")}
                >
                  <User className="h-5 w-5" />
                  Atendente
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 h-14 gap-3 text-base border-cyan-500/30 text-cyan-500 hover:bg-cyan-500/10"
                  onClick={async () => {
                    const { data: { user } } = await supabase.auth.getUser();
                    if (!user) return;
                    const { data } = await supabase
                      .from("integracoes" as any)
                      .select("config")
                      .eq("tipo", "chatgpt")
                      .eq("user_id", user.id)
                      .maybeSingle();
                    const config = (data as any)?.config as Record<string, string> | null;
                    if (!config?.api_key) {
                      toast({ title: "Configure a chave de API do ChatGPT antes de criar um Agente IA", variant: "destructive" });
                      navigate("/integracoes?open=chatgpt");
                      return;
                    }
                    setTipoAtendente("agente_ia");
                  }}
                >
                  <Bot className="h-5 w-5" />
                  Agente IA
                </Button>
              </div>

              <button
                onClick={() => navigate("/atendentes")}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                Voltar
              </button>
            </div>
          </Card>
        )}

        {/* Form (shown after selection) */}
        {tipoAtendente === "agente_ia" && (
          <div className="flex gap-6 items-start">
            <div className="flex-1 min-w-0">
              <AgenteIAForm
                nome={nome}
                setNome={setNome}
                departamentos={departamentos}
                departamentosSelecionados={departamentosSelecionados}
                addDepartamento={addDepartamento}
                removeDepartamento={removeDepartamento}
                mensagemFinalizacao={mensagemFinalizacao}
                setMensagemFinalizacao={setMensagemFinalizacao}
                descricao={descricao}
                setDescricao={setDescricao}
                isPending={createMutation.isPending}
                onSubmit={(config) => createMutation.mutate(config)}
                onBack={() => setTipoAtendente(null)}
                onConfigChange={setCurrentConfigIA}
              />
            </div>
            <div className="hidden lg:block sticky top-6">
              <AgentTestPanel agentName={nome || "Agente IA"} configIA={currentConfigIA} />
            </div>
          </div>
        )}

        {tipoAtendente === "atendente" && (
          <Card className="overflow-hidden">
            {/* Avatar header */}
            <div className="flex items-center gap-4 p-6 border-b">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-muted text-muted-foreground">
                  <User className="h-7 w-7" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-lg font-bold text-foreground uppercase">
                  {nome || "Novo atendente"}
                </h2>
                <p className="text-sm text-muted-foreground">{email || "email@exemplo.com"}</p>
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
                  <TabsTrigger
                    value="permissoes"
                    className="rounded-none border-b-2 border-transparent px-0 pb-3 pt-4 text-sm font-medium data-[state=active]:border-cyan-500 data-[state=active]:text-cyan-500 data-[state=active]:shadow-none data-[state=active]:bg-transparent"
                  >
                    Permissões avançadas
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
                      <Label htmlFor="senha">Senha</Label>
                      <Input
                        id="senha"
                        type="password"
                        placeholder="Senha do atendente"
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

              <TabsContent value="permissoes" className="mt-0 p-6">
                <PermissoesTab />
              </TabsContent>
            </Tabs>

            {/* Footer buttons */}
            <div className="flex justify-end gap-3 p-6 border-t">
              <Button variant="outline" onClick={() => setTipoAtendente(null)}>
                Voltar
              </Button>
              <Button
                className="bg-cyan-500 hover:bg-cyan-600 text-white"
                disabled={!nome.trim() || !email.trim() || createMutation.isPending}
                onClick={() => createMutation.mutate(undefined)}
              >
                {createMutation.isPending ? "Criando..." : "Criar atendente"}
              </Button>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CriarAtendentePage;
