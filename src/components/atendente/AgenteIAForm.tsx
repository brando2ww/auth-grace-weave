import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bot, X, Plus, Link, Trash2, ArrowRightLeft, MessageSquare, RefreshCw, Globe, Tag, XCircle, UserCog, Clock, Keyboard, Image, SplitSquareVertical, BadgeCheck, Users, Layers } from "lucide-react";

interface Departamento {
  id: string;
  nome: string;
}

interface AgenteIAFormProps {
  nome: string;
  setNome: (v: string) => void;
  departamentos: Departamento[];
  departamentosSelecionados: string[];
  addDepartamento: (id: string) => void;
  removeDepartamento: (id: string) => void;
  mensagemFinalizacao: string;
  setMensagemFinalizacao: (v: string) => void;
  descricao: string;
  setDescricao: (v: string) => void;
  isPending: boolean;
  onSubmit: (configIA: Record<string, any>) => void;
  onBack: () => void;
  onConfigChange?: (configIA: Record<string, any>) => void;
}

const AgenteIAForm = ({
  nome,
  setNome,
  departamentos,
  departamentosSelecionados,
  addDepartamento,
  removeDepartamento,
  mensagemFinalizacao,
  setMensagemFinalizacao,
  descricao,
  setDescricao,
  isPending,
  onSubmit,
  onBack,
  onConfigChange,
}: AgenteIAFormProps) => {
  const [inteligencia, setInteligencia] = useState("equilibrista");
  const [tom, setTom] = useState("padrao");
  const [maxTokens, setMaxTokens] = useState("1000");
  const [enviarAudio, setEnviarAudio] = useState("nunca");
  const [instrucoes, setInstrucoes] = useState("");
  const [perguntasRespostas, setPerguntasRespostas] = useState("");
  const [linksConsulta, setLinksConsulta] = useState<string[]>([]);
  const [novoLink, setNovoLink] = useState("");
  const [subTabConhecimento, setSubTabConhecimento] = useState("instrucoes");
  const [subTabFerramentas, setSubTabFerramentas] = useState("integracoes");

  // Integrations toggles
  const [calcomAtivo, setCalcomAtivo] = useState(false);

  // Funções toggles
  const [transferirAtendentes, setTransferirAtendentes] = useState(false);
  const [transferirDepartamentos, setTransferirDepartamentos] = useState(false);
  const [perguntarAtendentes, setPerguntarAtendentes] = useState(false);
  const [followUp, setFollowUp] = useState(false);
  const [agruparMensagens, setAgruparMensagens] = useState(false);

  // Recursos adicionais toggles
  const [pesquisaWeb, setPesquisaWeb] = useState(false);
  const [etiquetasConversas, setEtiquetasConversas] = useState(true);
  const [encerrarConversas, setEncerrarConversas] = useState(true);
  const [editarContato, setEditarContato] = useState(true);
  const [agendarMensagens, setAgendarMensagens] = useState(true);
  const [digitandoGravando, setDigitandoGravando] = useState(true);
  const [lerImagens, setLerImagens] = useState(false);
  const [separarMensagens, setSepararMensagens] = useState(false);
  const [enviarNomeAgente, setEnviarNomeAgente] = useState(false);

  // Notify parent of config changes for test panel
  useEffect(() => {
    if (onConfigChange) {
      onConfigChange({
        inteligencia,
        tom,
        max_tokens: parseInt(maxTokens) || 1000,
        enviar_audio: enviarAudio,
        instrucoes,
        perguntas_respostas: perguntasRespostas,
        links_consulta: linksConsulta,
      });
    }
  }, [inteligencia, tom, maxTokens, enviarAudio, instrucoes, perguntasRespostas, linksConsulta, onConfigChange]);

  const availableDeps = departamentos.filter(
    (d) => !departamentosSelecionados.includes(d.id)
  );

  const addLink = () => {
    if (novoLink.trim() && linksConsulta.length < 5) {
      setLinksConsulta((prev) => [...prev, novoLink.trim()]);
      setNovoLink("");
    }
  };

  const removeLink = (index: number) => {
    setLinksConsulta((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Card className="overflow-hidden">
      {/* Avatar header */}
      <div className="flex items-center gap-4 p-6 border-b">
        <Avatar className="h-16 w-16">
          <AvatarFallback className="bg-cyan-500/10 text-cyan-500">
            <Bot className="h-7 w-7" />
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-lg font-bold text-foreground uppercase">
            {nome || "Novo agente IA"}
          </h2>
          <p className="text-sm text-muted-foreground">Agente com inteligência artificial</p>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="personalidade" className="w-full">
        <div className="border-b px-6">
          <TabsList className="bg-transparent h-auto p-0 gap-6">
            <TabsTrigger
              value="personalidade"
              className="rounded-none border-b-2 border-transparent px-0 pb-3 pt-4 text-sm font-medium data-[state=active]:border-cyan-500 data-[state=active]:text-cyan-500 data-[state=active]:shadow-none data-[state=active]:bg-transparent"
            >
              Personalidade
            </TabsTrigger>
            <TabsTrigger
              value="base_conhecimento"
              className="rounded-none border-b-2 border-transparent px-0 pb-3 pt-4 text-sm font-medium data-[state=active]:border-cyan-500 data-[state=active]:text-cyan-500 data-[state=active]:shadow-none data-[state=active]:bg-transparent"
            >
              Base de conhecimento
            </TabsTrigger>
            <TabsTrigger
              value="ferramentas"
              className="rounded-none border-b-2 border-transparent px-0 pb-3 pt-4 text-sm font-medium data-[state=active]:border-cyan-500 data-[state=active]:text-cyan-500 data-[state=active]:shadow-none data-[state=active]:bg-transparent"
            >
              Ferramentas
            </TabsTrigger>
          </TabsList>
        </div>

        {/* ========== PERSONALIDADE ========== */}
        <TabsContent value="personalidade" className="mt-0 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column */}
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="nome_agente">Nome do agente</Label>
                <Input
                  id="nome_agente"
                  placeholder="Ex: Assistente de vendas"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              </div>

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
                <Label>Enviar áudio</Label>
                <Select value={enviarAudio} onValueChange={setEnviarAudio}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nunca">Nunca</SelectItem>
                    <SelectItem value="sempre">Sempre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="msg_finalizacao">Mensagem de finalização</Label>
                <Textarea
                  id="msg_finalizacao"
                  placeholder="Mensagem enviada ao finalizar o atendimento"
                  value={mensagemFinalizacao}
                  onChange={(e) => setMensagemFinalizacao(e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-5">
              <div className="space-y-2">
                <Label>Inteligência</Label>
                <Select value={inteligencia} onValueChange={setInteligencia}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="equilibrista">
                      Equilibrista (recomendado)
                    </SelectItem>
                    <SelectItem value="avancada">Avançada</SelectItem>
                    <SelectItem value="economica">Econômica</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {inteligencia === "equilibrista" && "gpt-4o-mini — Melhor custo-benefício"}
                  {inteligencia === "avancada" && "gpt-4o — Maior capacidade de raciocínio"}
                  {inteligencia === "economica" && "gpt-3.5-turbo — Menor custo"}
                </p>
              </div>

              <div className="space-y-2">
                <Label>Tom</Label>
                <Select value={tom} onValueChange={setTom}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="padrao">Padrão (recomendado)</SelectItem>
                    <SelectItem value="formal">Formal</SelectItem>
                    <SelectItem value="informal">Informal</SelectItem>
                    <SelectItem value="tecnico">Técnico</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="max_tokens">Máximo de tokens</Label>
                <Input
                  id="max_tokens"
                  type="number"
                  placeholder="1000"
                  value={maxTokens}
                  onChange={(e) => setMaxTokens(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao_agente">Descrição</Label>
                <Textarea
                  id="descricao_agente"
                  placeholder="Ex: Este agente é responsável por vendas e suporte."
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  A descrição é utilizada para treinar o Agente IA
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ========== BASE DE CONHECIMENTO ========== */}
        <TabsContent value="base_conhecimento" className="mt-0 p-6">
          <div className="space-y-4">
            {/* Sub-tabs */}
            <div className="flex gap-2 border-b pb-2">
              {[
                { key: "instrucoes", label: "Instruções" },
                { key: "perguntas", label: "Perguntas e respostas" },
                { key: "links", label: `Links de consulta (${linksConsulta.length}/5)` },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setSubTabConhecimento(tab.key)}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    subTabConhecimento === tab.key
                      ? "bg-cyan-500/10 text-cyan-600 font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {subTabConhecimento === "instrucoes" && (
              <div className="space-y-2">
                <Label htmlFor="instrucoes_agente">Instruções do agente</Label>
                <Textarea
                  id="instrucoes_agente"
                  placeholder="Escreva as instruções que o agente deve seguir durante os atendimentos..."
                  value={instrucoes}
                  onChange={(e) => setInstrucoes(e.target.value)}
                  rows={12}
                />
              </div>
            )}

            {subTabConhecimento === "perguntas" && (
              <div className="space-y-2">
                <Label htmlFor="perguntas_respostas">Perguntas e respostas</Label>
                <Textarea
                  id="perguntas_respostas"
                  placeholder={`Formato:\nP: Qual o horário de funcionamento?\nR: Funcionamos de segunda a sexta, das 9h às 18h.\n\nP: Como faço para cancelar?\nR: Envie um email para cancelamento@empresa.com`}
                  value={perguntasRespostas}
                  onChange={(e) => setPerguntasRespostas(e.target.value)}
                  rows={12}
                />
              </div>
            )}

            {subTabConhecimento === "links" && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Adicione links que o agente pode consultar para responder perguntas. Máximo de 5 links.
                </p>

                {linksConsulta.map((link, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="flex items-center gap-2 flex-1 p-2 border rounded-md bg-muted/50">
                      <Link className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="text-sm truncate">{link}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0 text-destructive hover:text-destructive"
                      onClick={() => removeLink(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                {linksConsulta.length < 5 && (
                  <div className="flex gap-2">
                    <Input
                      placeholder="https://exemplo.com/pagina"
                      value={novoLink}
                      onChange={(e) => setNovoLink(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addLink();
                        }
                      }}
                    />
                    <Button
                      variant="outline"
                      onClick={addLink}
                      disabled={!novoLink.trim()}
                      className="shrink-0"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Adicionar
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </TabsContent>

        {/* ========== FERRAMENTAS ========== */}
        <TabsContent value="ferramentas" className="mt-0 p-6">
          <div className="space-y-4">
            {/* Sub-tabs */}
            <div className="flex gap-2 border-b pb-2">
              {[
                { key: "integracoes", label: "Integrações" },
                { key: "funcoes", label: "Funções" },
                { key: "recursos", label: "Recursos adicionais" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setSubTabFerramentas(tab.key)}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    subTabFerramentas === tab.key
                      ? "bg-cyan-500/10 text-cyan-600 font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {subTabFerramentas === "integracoes" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-muted">
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Agendamentos Cal.com</p>
                      <p className="text-xs text-muted-foreground">
                        Permite que o agente agende compromissos via Cal.com
                      </p>
                    </div>
                  </div>
                  <Switch checked={calcomAtivo} onCheckedChange={setCalcomAtivo} />
                </div>
              </div>
            )}

            {subTabFerramentas === "funcoes" && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Configure todas as funções que o agente pode ter no chat. Essas funções permitem que o agente execute ações durante o atendimento.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { icon: ArrowRightLeft, label: "Transferir para outros atendentes", desc: "Permite que o agente transfira a conversa para um atendente humano.", checked: transferirAtendentes, onChange: setTransferirAtendentes },
                    { icon: Layers, label: "Transferir para outros departamentos", desc: "Permite que o agente transfira a conversa para outro departamento.", checked: transferirDepartamentos, onChange: setTransferirDepartamentos },
                    { icon: Users, label: "Perguntar para outros atendentes", desc: "Permite que o agente consulte atendentes humanos antes de responder.", checked: perguntarAtendentes, onChange: setPerguntarAtendentes },
                    { icon: RefreshCw, label: "Follow-up", desc: "Permite que o agente envie mensagens de acompanhamento automaticamente.", checked: followUp, onChange: setFollowUp },
                    { icon: MessageSquare, label: "Agrupar mensagens recebidas", desc: "Agrupa mensagens recebidas em sequência antes de processar.", checked: agruparMensagens, onChange: setAgruparMensagens },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg h-fit">
                          <item.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div className="pr-2">
                          <p className="font-medium text-sm">{item.label}</p>
                          <p className="text-xs text-muted-foreground">{item.desc}</p>
                        </div>
                      </div>
                      <Switch checked={item.checked} onCheckedChange={item.onChange} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {subTabFerramentas === "recursos" && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Configure os recursos que o agente poderá utilizar durante os atendimentos.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { icon: Globe, label: "Pesquisa na Web", desc: "Permite que o agente busque informações em tempo real na internet.", checked: pesquisaWeb, onChange: setPesquisaWeb },
                    { icon: Tag, label: "Adicionar/remover etiquetas", desc: "Permite que o agente gerencie etiquetas das conversas.", checked: etiquetasConversas, onChange: setEtiquetasConversas },
                    { icon: XCircle, label: "Encerrar conversas", desc: "Permite que o agente encerre conversas automaticamente.", checked: encerrarConversas, onChange: setEncerrarConversas },
                    { icon: UserCog, label: "Editar contato", desc: "Permite que o agente edite informações do contato.", checked: editarContato, onChange: setEditarContato },
                    { icon: Clock, label: "Agendar mensagens", desc: "Permite que o agente agende mensagens para envio futuro.", checked: agendarMensagens, onChange: setAgendarMensagens },
                    { icon: Keyboard, label: "Digitando e gravando", desc: "Mostra indicadores de digitando e gravando durante o atendimento.", checked: digitandoGravando, onChange: setDigitandoGravando },
                    { icon: Image, label: "Ler imagens recebidas", desc: "Permite que o agente interprete imagens enviadas pelo cliente.", checked: lerImagens, onChange: setLerImagens },
                    { icon: SplitSquareVertical, label: "Separar mensagens por quebra de linha", desc: "Envia cada linha como uma mensagem separada.", checked: separarMensagens, onChange: setSepararMensagens },
                    { icon: BadgeCheck, label: "Enviar o nome do agente", desc: "Inclui o nome do agente no início de cada mensagem.", checked: enviarNomeAgente, onChange: setEnviarNomeAgente },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg h-fit">
                          <item.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div className="pr-2">
                          <p className="font-medium text-sm">{item.label}</p>
                          <p className="text-xs text-muted-foreground">{item.desc}</p>
                        </div>
                      </div>
                      <Switch checked={item.checked} onCheckedChange={item.onChange} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <div className="flex justify-end gap-3 p-6 border-t">
        <Button variant="outline" onClick={onBack}>
          Voltar
        </Button>
        <Button
          className="bg-cyan-500 hover:bg-cyan-600 text-white"
          disabled={!nome.trim() || isPending}
          onClick={() => {
            const configIA = {
              inteligencia,
              tom,
              max_tokens: parseInt(maxTokens) || 1000,
              enviar_audio: enviarAudio,
              instrucoes,
              perguntas_respostas: perguntasRespostas,
              links_consulta: linksConsulta,
              calcom_ativo: calcomAtivo,
              transferir_atendentes: transferirAtendentes,
              transferir_departamentos: transferirDepartamentos,
              perguntar_atendentes: perguntarAtendentes,
              follow_up: followUp,
              agrupar_mensagens: agruparMensagens,
              pesquisa_web: pesquisaWeb,
              etiquetas_conversas: etiquetasConversas,
              encerrar_conversas: encerrarConversas,
              editar_contato: editarContato,
              agendar_mensagens: agendarMensagens,
              digitando_gravando: digitandoGravando,
              ler_imagens: lerImagens,
              separar_mensagens: separarMensagens,
              enviar_nome_agente: enviarNomeAgente,
            };
            onSubmit(configIA);
          }}
        >
          {isPending ? "Salvando..." : "Salvar e publicar"}
        </Button>
      </div>
    </Card>
  );
};

export default AgenteIAForm;
