import React, { useState, useEffect, useCallback } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";

interface HorarioDia {
  dia: string;
  ativo: boolean;
  inicio: string;
  intervaloInicio: string;
  intervaloFim: string;
  fim: string;
}

const defaultHorarios: HorarioDia[] = [
  { dia: "Domingo", ativo: false, inicio: "08:00", intervaloInicio: "12:00", intervaloFim: "13:00", fim: "18:00" },
  { dia: "Segunda", ativo: true, inicio: "08:00", intervaloInicio: "12:00", intervaloFim: "13:00", fim: "18:00" },
  { dia: "Terça", ativo: true, inicio: "08:00", intervaloInicio: "12:00", intervaloFim: "13:00", fim: "18:00" },
  { dia: "Quarta", ativo: true, inicio: "08:00", intervaloInicio: "12:00", intervaloFim: "13:00", fim: "18:00" },
  { dia: "Quinta", ativo: true, inicio: "08:00", intervaloInicio: "12:00", intervaloFim: "13:00", fim: "18:00" },
  { dia: "Sexta", ativo: true, inicio: "08:00", intervaloInicio: "12:00", intervaloFim: "13:00", fim: "18:00" },
  { dia: "Sábado", ativo: false, inicio: "08:00", intervaloInicio: "12:00", intervaloFim: "13:00", fim: "18:00" },
];

const ConfiguracoesPage = () => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [configId, setConfigId] = useState<string | null>(null);

  // State
  const [mensagemFeedback, setMensagemFeedback] = useState("");
  const [mensagemFinalizacao, setMensagemFinalizacao] = useState("");
  const [enviarProtocolo, setEnviarProtocolo] = useState(true);
  const [enviarNotificacaoTransferencia, setEnviarNotificacaoTransferencia] = useState(true);
  const [assinarFila, setAssinarFila] = useState(true);
  const [assinarFilaMinutos, setAssinarFilaMinutos] = useState(5);
  const [avaliacaoAtendimento, setAvaliacaoAtendimento] = useState(true);
  const [exibirNomeAtendente, setExibirNomeAtendente] = useState(true);
  const [ativarHorarioAtendimento, setAtivarHorarioAtendimento] = useState(true);
  const [esconderGruposWhatsapp, setEsconderGruposWhatsapp] = useState(true);
  const [exibirConversasRobo, setExibirConversasRobo] = useState(true);
  const [coletarMensagensCelular, setColetarMensagensCelular] = useState(false);
  const [habilitarTranscricaoIA, setHabilitarTranscricaoIA] = useState(true);
  const [permitirOptout, setPermitirOptout] = useState(true);
  const [mensagemOptout, setMensagemOptout] = useState("");
  const [ativarRodizio, setAtivarRodizio] = useState(true);
  const [incluirAdminsRodizio, setIncluirAdminsRodizio] = useState(false);
  const [selecionarAtendentesRodizio, setSelecionarAtendentesRodizio] = useState(false);
  const [modoRodizio, setModoRodizio] = useState("sequencial");
  const [horarios, setHorarios] = useState<HorarioDia[]>(defaultHorarios);
  const [enviarForaHorario, setEnviarForaHorario] = useState(true);
  const [foraHorarioMinutos, setForaHorarioMinutos] = useState(0);
  const [mensagemForaHorario, setMensagemForaHorario] = useState("");

  const loadConfig = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data: rawData } = await supabase
      .from("configuracoes" as any)
      .select("*")
      .eq("user_id", session.user.id)
      .maybeSingle();

    const data = rawData as any;
    if (data) {
      const d = data as any;
      setConfigId(data.id);
      setMensagemFeedback(data.mensagem_feedback || "");
      setMensagemFinalizacao(data.mensagem_finalizacao || "");
      setEnviarProtocolo(data.enviar_protocolo ?? true);
      setEnviarNotificacaoTransferencia(data.enviar_notificacao_transferencia ?? true);
      setAssinarFila(data.assinar_fila ?? true);
      setAssinarFilaMinutos(data.assinar_fila_minutos ?? 5);
      setAvaliacaoAtendimento(data.avaliacao_atendimento ?? true);
      setExibirNomeAtendente(data.exibir_nome_atendente ?? true);
      setAtivarHorarioAtendimento(data.ativar_horario_atendimento ?? true);
      setEsconderGruposWhatsapp(data.esconder_grupos_whatsapp ?? true);
      setExibirConversasRobo(data.exibir_conversas_robo ?? true);
      setColetarMensagensCelular(data.coletar_mensagens_celular ?? false);
      setHabilitarTranscricaoIA(data.habilitar_transcricao_ia ?? true);
      setPermitirOptout(data.permitir_optout ?? true);
      setMensagemOptout(data.mensagem_optout || "");
      setAtivarRodizio(data.ativar_rodizio ?? true);
      setIncluirAdminsRodizio(data.incluir_admins_rodizio ?? false);
      setSelecionarAtendentesRodizio(data.selecionar_atendentes_rodizio ?? false);
      setModoRodizio(data.modo_rodizio || "sequencial");
      if (Array.isArray(data.horarios) && data.horarios.length > 0) {
        setHorarios(data.horarios as unknown as HorarioDia[]);
      }
      setEnviarForaHorario(data.enviar_fora_horario ?? true);
      setForaHorarioMinutos(data.fora_horario_minutos ?? 0);
      setMensagemForaHorario(data.mensagem_fora_horario || "");
    }
  }, []);

  useEffect(() => { loadConfig(); }, [loadConfig]);

  const handleSave = async () => {
    setSaving(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { setSaving(false); return; }

    const payload = {
      user_id: session.user.id,
      mensagem_feedback: mensagemFeedback,
      mensagem_finalizacao: mensagemFinalizacao,
      enviar_protocolo: enviarProtocolo,
      enviar_notificacao_transferencia: enviarNotificacaoTransferencia,
      assinar_fila: assinarFila,
      assinar_fila_minutos: assinarFilaMinutos,
      avaliacao_atendimento: avaliacaoAtendimento,
      exibir_nome_atendente: exibirNomeAtendente,
      ativar_horario_atendimento: ativarHorarioAtendimento,
      esconder_grupos_whatsapp: esconderGruposWhatsapp,
      exibir_conversas_robo: exibirConversasRobo,
      coletar_mensagens_celular: coletarMensagensCelular,
      habilitar_transcricao_ia: habilitarTranscricaoIA,
      permitir_optout: permitirOptout,
      mensagem_optout: mensagemOptout,
      ativar_rodizio: ativarRodizio,
      incluir_admins_rodizio: incluirAdminsRodizio,
      selecionar_atendentes_rodizio: selecionarAtendentesRodizio,
      modo_rodizio: modoRodizio,
      horarios: JSON.parse(JSON.stringify(horarios)),
      enviar_fora_horario: enviarForaHorario,
      fora_horario_minutos: foraHorarioMinutos,
      mensagem_fora_horario: mensagemForaHorario,
    };

    let error;
    if (configId) {
      ({ error } = await supabase.from("configuracoes" as any).update(payload).eq("id", configId));
    } else {
      const res = await supabase.from("configuracoes" as any).insert(payload).select("id").single();
      error = res.error;
      if (res.data) setConfigId((res.data as any).id);
    }

    setSaving(false);
    if (error) {
      toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Configurações salvas com sucesso!" });
    }
  };

  const updateHorario = (idx: number, field: keyof HorarioDia, value: string | boolean) => {
    setHorarios(prev => prev.map((h, i) => i === idx ? { ...h, [field]: value } : h));
  };

  const ToggleRow = ({ label, checked, onCheckedChange, children }: {
    label: string; checked: boolean; onCheckedChange: (v: boolean) => void; children?: React.ReactNode;
  }) => (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3 flex-1">
        <span className="text-sm">{label}</span>
        {children}
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} className="data-[state=checked]:bg-cyan-500" />
    </div>
  );

  return (
    <DashboardLayout>
      <div className="w-full space-y-6 pb-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Configurações</h1>
          <Button onClick={handleSave} disabled={saving} className="bg-cyan-500 hover:bg-cyan-600 text-white">
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Salvando..." : "Salvar configurações"}
          </Button>
        </div>

        {/* Mensagem de feedback */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-cyan-600">Mensagem de feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={mensagemFeedback}
              onChange={e => setMensagemFeedback(e.target.value)}
              placeholder="Digite a mensagem de feedback enviada após a avaliação..."
              rows={3}
            />
          </CardContent>
        </Card>

        {/* Mensagem de finalização */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-cyan-600">Mensagem de finalização</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={mensagemFinalizacao}
              onChange={e => setMensagemFinalizacao(e.target.value)}
              placeholder="Digite a mensagem enviada ao finalizar o atendimento..."
              rows={3}
            />
          </CardContent>
        </Card>

        {/* Grid de toggles */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-cyan-600">Opções gerais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
              <div className="divide-y">
                <ToggleRow label="Enviar protocolo ao cliente" checked={enviarProtocolo} onCheckedChange={setEnviarProtocolo} />
                <ToggleRow label="Notificação de transferência" checked={enviarNotificacaoTransferencia} onCheckedChange={setEnviarNotificacaoTransferencia} />
                <ToggleRow label="Fila de atendimento" checked={assinarFila} onCheckedChange={setAssinarFila}>
                  <Input
                    type="number"
                    className="w-20 h-8 text-sm ml-2"
                    value={assinarFilaMinutos}
                    onChange={e => setAssinarFilaMinutos(Number(e.target.value))}
                    min={1}
                  />
                  <span className="text-xs text-muted-foreground ml-1">min</span>
                </ToggleRow>
                <ToggleRow label="Avaliação de atendimento" checked={avaliacaoAtendimento} onCheckedChange={setAvaliacaoAtendimento} />
                <ToggleRow label="Exibir nome do atendente" checked={exibirNomeAtendente} onCheckedChange={setExibirNomeAtendente} />
              </div>
              <div className="divide-y">
                <ToggleRow label="Horário de atendimento" checked={ativarHorarioAtendimento} onCheckedChange={setAtivarHorarioAtendimento} />
                <ToggleRow label="Esconder grupos WhatsApp" checked={esconderGruposWhatsapp} onCheckedChange={setEsconderGruposWhatsapp} />
                <ToggleRow label="Exibir conversas no robô" checked={exibirConversasRobo} onCheckedChange={setExibirConversasRobo} />
                <ToggleRow label="Coletar mensagens do celular" checked={coletarMensagensCelular} onCheckedChange={setColetarMensagensCelular} />
                <ToggleRow label="Transcrição de áudio via IA" checked={habilitarTranscricaoIA} onCheckedChange={setHabilitarTranscricaoIA} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Opt-out */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-cyan-600">Opt-out de campanha</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ToggleRow label="Permitir opt-out de campanhas" checked={permitirOptout} onCheckedChange={setPermitirOptout} />
            {permitirOptout && (
              <Textarea
                value={mensagemOptout}
                onChange={e => setMensagemOptout(e.target.value)}
                placeholder="Mensagem enviada ao cliente que solicitar opt-out..."
                rows={3}
              />
            )}
          </CardContent>
        </Card>

        {/* Rodízio automático */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-cyan-600">Rodízio automático</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ToggleRow label="Ativar rodízio automático" checked={ativarRodizio} onCheckedChange={setAtivarRodizio} />
            {ativarRodizio && (
              <div className="space-y-3 pl-4 border-l-2 border-cyan-200">
                <ToggleRow label="Incluir administradores no rodízio" checked={incluirAdminsRodizio} onCheckedChange={setIncluirAdminsRodizio} />
                <ToggleRow label="Selecionar atendentes para rodízio" checked={selecionarAtendentesRodizio} onCheckedChange={setSelecionarAtendentesRodizio} />
                <div className="flex items-center gap-4 py-2">
                  <Label className="text-sm">Modo:</Label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="radio" name="modo_rodizio" value="sequencial" checked={modoRodizio === "sequencial"} onChange={() => setModoRodizio("sequencial")} className="accent-cyan-500" />
                    Sequencial
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="radio" name="modo_rodizio" value="aleatorio" checked={modoRodizio === "aleatorio"} onChange={() => setModoRodizio("aleatorio")} className="accent-cyan-500" />
                    Aleatório
                  </label>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Horário de atendimento */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-cyan-600">Horário de atendimento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 pr-4 font-medium">Dia</th>
                    <th className="text-center py-2 px-2 font-medium">Ativo</th>
                    <th className="text-center py-2 px-2 font-medium">Início</th>
                    <th className="text-center py-2 px-2 font-medium">Int. Início</th>
                    <th className="text-center py-2 px-2 font-medium">Int. Fim</th>
                    <th className="text-center py-2 px-2 font-medium">Fim</th>
                  </tr>
                </thead>
                <tbody>
                  {horarios.map((h, idx) => (
                    <tr key={h.dia} className="border-b last:border-0">
                      <td className="py-2 pr-4 font-medium">{h.dia}</td>
                      <td className="text-center py-2 px-2">
                        <Checkbox
                          checked={h.ativo}
                          onCheckedChange={(v) => updateHorario(idx, "ativo", !!v)}
                          className="data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500"
                        />
                      </td>
                      <td className="py-2 px-2">
                        <Input type="time" value={h.inicio} onChange={e => updateHorario(idx, "inicio", e.target.value)} className="h-8 text-sm w-28" disabled={!h.ativo} />
                      </td>
                      <td className="py-2 px-2">
                        <Input type="time" value={h.intervaloInicio} onChange={e => updateHorario(idx, "intervaloInicio", e.target.value)} className="h-8 text-sm w-28" disabled={!h.ativo} />
                      </td>
                      <td className="py-2 px-2">
                        <Input type="time" value={h.intervaloFim} onChange={e => updateHorario(idx, "intervaloFim", e.target.value)} className="h-8 text-sm w-28" disabled={!h.ativo} />
                      </td>
                      <td className="py-2 px-2">
                        <Input type="time" value={h.fim} onChange={e => updateHorario(idx, "fim", e.target.value)} className="h-8 text-sm w-28" disabled={!h.ativo} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Mensagem fora do horário */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-cyan-600">Mensagem fora do horário</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ToggleRow label="Enviar mensagem fora do horário" checked={enviarForaHorario} onCheckedChange={setEnviarForaHorario} />
            {enviarForaHorario && (
              <>
                <div className="flex items-center gap-3">
                  <Label className="text-sm whitespace-nowrap">Enviar a cada</Label>
                  <Input
                    type="number"
                    className="w-20 h-8 text-sm"
                    value={foraHorarioMinutos}
                    onChange={e => setForaHorarioMinutos(Number(e.target.value))}
                    min={0}
                  />
                  <span className="text-sm text-muted-foreground">minutos (0 = sempre)</span>
                </div>
                <Textarea
                  value={mensagemForaHorario}
                  onChange={e => setMensagemForaHorario(e.target.value)}
                  placeholder="Mensagem enviada fora do horário de atendimento..."
                  rows={3}
                />
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ConfiguracoesPage;
