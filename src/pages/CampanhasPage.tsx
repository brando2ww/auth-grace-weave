import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Megaphone, Plus, ArrowLeft, ArrowRight, FileText, Image, FileAudio, Video, File, X, Calendar, Send, Trash2, Eye,
} from "lucide-react";
import { format } from "date-fns";

interface Conteudo {
  tipo: "texto" | "imagem" | "documento" | "audio" | "video";
  valor: string;
  nome?: string;
}

interface Campanha {
  id: string;
  user_id: string;
  nome: string;
  departamento_id: string | null;
  destinatarios_contatos: string[] | null;
  destinatarios_etiquetas: string[] | null;
  destinatarios_grupos: string[] | null;
  conteudos: Conteudo[];
  status: string;
  agendada_para: string | null;
  created_at: string;
  updated_at: string;
}

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  rascunho: { label: "Rascunho", variant: "secondary" },
  agendada: { label: "Agendada", variant: "outline" },
  enviada: { label: "Enviada", variant: "default" },
  cancelada: { label: "Cancelada", variant: "destructive" },
};

const CampanhasPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [view, setView] = useState<"list" | "create">("list");
  const [step, setStep] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form state
  const [nome, setNome] = useState("");
  const [departamentoId, setDepartamentoId] = useState("");
  const [selectedContatos, setSelectedContatos] = useState<string[]>([]);
  const [etiqueta, setEtiqueta] = useState("");
  const [grupo, setGrupo] = useState("");
  const [conteudos, setConteudos] = useState<Conteudo[]>([]);
  const [textoAtual, setTextoAtual] = useState("");
  const [agendarPara, setAgendarPara] = useState("");
  const [enviarAgora, setEnviarAgora] = useState(true);

  // Queries
  const { data: campanhas, isLoading: loadingCampanhas } = useQuery({
    queryKey: ["campanhas"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Não autenticado");
      const { data, error } = await supabase
        .from("campanhas" as any)
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []) as unknown as Campanha[];
    },
  });

  const { data: departamentos } = useQuery({
    queryKey: ["departamentos"],
    queryFn: async () => {
      const { data, error } = await supabase.from("departamentos" as any).select("*").order("nome");
      if (error) throw error;
      return (data || []) as any[];
    },
  });

  const { data: contatos } = useQuery({
    queryKey: ["contatos"],
    queryFn: async () => {
      const { data, error } = await supabase.from("contatos" as any).select("*").order("nome");
      if (error) throw error;
      return (data || []) as any[];
    },
  });

  const departamentosComWhatsapp = (departamentos || []).filter(
    (d: any) => d.whatsapp_numero && d.whatsapp_numero.trim() !== ""
  );

  // Unique etiquetas and grupos from contatos
  const etiquetasUnicas = Array.from(
    new Set((contatos || []).flatMap((c: any) => c.etiquetas || []).filter(Boolean))
  );
  const gruposUnicos = Array.from(
    new Set((contatos || []).map((c: any) => c.grupo).filter(Boolean))
  );

  // Auto-redirect to create if no campanhas
  useEffect(() => {
    if (!loadingCampanhas && campanhas && campanhas.length === 0 && view === "list") {
      setView("create");
    }
  }, [loadingCampanhas, campanhas, view]);

  const createMutation = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Não autenticado");
      const payload: any = {
        user_id: user.id,
        nome,
        departamento_id: departamentoId || null,
        destinatarios_contatos: selectedContatos.length > 0 ? selectedContatos : null,
        destinatarios_etiquetas: etiqueta ? [etiqueta] : null,
        destinatarios_grupos: grupo ? [grupo] : null,
        conteudos: conteudos as any,
        status: enviarAgora ? "enviada" : "agendada",
        agendada_para: !enviarAgora && agendarPara ? agendarPara : null,
      };
      const { error } = await supabase.from("campanhas" as any).insert(payload);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campanhas"] });
      toast({ title: "Campanha criada com sucesso!" });
      resetForm();
      setView("list");
    },
    onError: () => {
      toast({ title: "Erro ao criar campanha", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("campanhas" as any).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campanhas"] });
      toast({ title: "Campanha excluída!" });
      setDeleteId(null);
    },
    onError: () => {
      toast({ title: "Erro ao excluir campanha", variant: "destructive" });
    },
  });

  const resetForm = () => {
    setStep(1);
    setNome("");
    setDepartamentoId("");
    setSelectedContatos([]);
    setEtiqueta("");
    setGrupo("");
    setConteudos([]);
    setTextoAtual("");
    setAgendarPara("");
    setEnviarAgora(true);
  };

  const addTexto = () => {
    if (!textoAtual.trim()) return;
    setConteudos((prev) => [...prev, { tipo: "texto", valor: textoAtual }]);
    setTextoAtual("");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, tipo: Conteudo["tipo"]) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fileName = `campanhas/${Date.now()}_${file.name}`;
    const { error } = await supabase.storage.from("avatars").upload(fileName, file);
    if (error) {
      toast({ title: "Erro ao enviar arquivo", variant: "destructive" });
      return;
    }
    const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(fileName);
    setConteudos((prev) => [...prev, { tipo, valor: urlData.publicUrl, nome: file.name }]);
  };

  const removeConteudo = (index: number) => {
    setConteudos((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleContato = (id: string) => {
    setSelectedContatos((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const selectedDepartamento = (departamentos || []).find((d: any) => d.id === departamentoId);

  const conteudoIcon = (tipo: string) => {
    switch (tipo) {
      case "texto": return <FileText className="w-4 h-4" />;
      case "imagem": return <Image className="w-4 h-4" />;
      case "documento": return <File className="w-4 h-4" />;
      case "audio": return <FileAudio className="w-4 h-4" />;
      case "video": return <Video className="w-4 h-4" />;
      default: return <File className="w-4 h-4" />;
    }
  };

  // STEPPER
  const Stepper = () => (
    <div className="flex items-center justify-center mb-8">
      {[
        { n: 1, title: "Detalhes", sub: "Informações básicas" },
        { n: 2, title: "Conteúdo", sub: "Mensagens a serem enviadas" },
        { n: 3, title: "Finalização", sub: "Últimas configurações" },
      ].map((s, i) => (
        <React.Fragment key={s.n}>
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step >= s.n
                  ? "bg-cyan-500 text-white"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {s.n}
            </div>
            <div className="hidden sm:block">
              <p className={`text-sm font-medium ${step >= s.n ? "text-foreground" : "text-muted-foreground"}`}>{s.title}</p>
              <p className="text-xs text-muted-foreground">{s.sub}</p>
            </div>
          </div>
          {i < 2 && <div className={`flex-1 h-px mx-4 ${step > s.n ? "bg-cyan-500" : "bg-border"}`} />}
        </React.Fragment>
      ))}
    </div>
  );

  // LIST VIEW
  const renderList = () => (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Campanhas</h1>
          <p className="text-muted-foreground text-sm">Gerencie suas campanhas de disparo</p>
        </div>
        <Button className="bg-cyan-500 hover:bg-cyan-600 text-white" onClick={() => { resetForm(); setView("create"); }}>
          <Plus className="w-4 h-4 mr-2" /> Nova campanha
        </Button>
      </div>

      {loadingCampanhas ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 w-full" />)}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Departamento</TableHead>
                  <TableHead>Data de criação</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(campanhas || []).map((c) => {
                  const dep = (departamentos || []).find((d: any) => d.id === c.departamento_id);
                  const st = statusMap[c.status] || { label: c.status, variant: "secondary" as const };
                  return (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">{c.nome}</TableCell>
                      <TableCell>
                        <Badge variant={st.variant}>{st.label}</Badge>
                      </TableCell>
                      <TableCell>{dep?.nome || "—"}</TableCell>
                      <TableCell>{format(new Date(c.created_at), "dd/MM/yyyy HH:mm")}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => setDeleteId(c.id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </>
  );

  // STEP 1
  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-cyan-600 font-semibold">
        <Megaphone className="w-5 h-5" /> Detalhes
      </div>

      <div className="space-y-2">
        <Label>Nome da campanha *</Label>
        <Input placeholder="Disparo em massa" value={nome} onChange={(e) => setNome(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label>Departamento (com whatsapp) *</Label>
        <Select value={departamentoId} onValueChange={setDepartamentoId}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione um departamento" />
          </SelectTrigger>
          <SelectContent>
            {departamentosComWhatsapp.length === 0 ? (
              <div className="px-3 py-2 text-sm text-muted-foreground">Nenhum departamento com WhatsApp conectado</div>
            ) : (
              departamentosComWhatsapp.map((d: any) => (
                <SelectItem key={d.id} value={d.id}>{d.nome}</SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-cyan-600 font-semibold">
          <Users2Icon /> Destinatários
        </div>
        <p className="text-xs text-muted-foreground">É necessário preencher ao menos 1 tipo de destinatário.</p>

        <div className="space-y-2">
          <Label>Contatos</Label>
          <div className="border rounded-md p-3 max-h-40 overflow-y-auto space-y-1">
            {(contatos || []).length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum contato cadastrado</p>
            ) : (
              (contatos || []).map((c: any) => (
                <label key={c.id} className="flex items-center gap-2 cursor-pointer text-sm">
                  <Checkbox checked={selectedContatos.includes(c.id)} onCheckedChange={() => toggleContato(c.id)} />
                  {c.nome} {c.telefone ? `(${c.telefone})` : ""}
                </label>
              ))
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Etiquetas de conversas</Label>
          <Select value={etiqueta} onValueChange={setEtiqueta}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione as etiquetas de conversas" />
            </SelectTrigger>
            <SelectContent>
              {etiquetasUnicas.map((e) => (
                <SelectItem key={e} value={e}>{e}</SelectItem>
              ))}
              {etiquetasUnicas.length === 0 && (
                <div className="px-3 py-2 text-sm text-muted-foreground">Nenhuma etiqueta disponível</div>
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Grupos de contatos</Label>
          <Select value={grupo} onValueChange={setGrupo}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione os grupos de contatos" />
            </SelectTrigger>
            <SelectContent>
              {gruposUnicos.map((g) => (
                <SelectItem key={g} value={g}>{g}</SelectItem>
              ))}
              {gruposUnicos.length === 0 && (
                <div className="px-3 py-2 text-sm text-muted-foreground">Nenhum grupo disponível</div>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  // STEP 2
  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-cyan-600 font-semibold">
        <FileText className="w-5 h-5" /> Conteúdo
      </div>
      <p className="text-xs text-muted-foreground">Adicione os conteúdos que serão enviados. Pode combinar múltiplos tipos.</p>

      {/* Add text */}
      <div className="space-y-2">
        <Label>Texto</Label>
        <div className="flex gap-2">
          <Textarea placeholder="Digite o texto da mensagem..." value={textoAtual} onChange={(e) => setTextoAtual(e.target.value)} className="flex-1" />
          <Button type="button" size="sm" onClick={addTexto} disabled={!textoAtual.trim()} className="self-end bg-cyan-500 hover:bg-cyan-600 text-white">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Upload buttons */}
      <div className="flex flex-wrap gap-2">
        {([
          { tipo: "imagem" as const, label: "Imagem", icon: Image, accept: "image/*" },
          { tipo: "documento" as const, label: "Documento", icon: File, accept: ".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt" },
          { tipo: "audio" as const, label: "Áudio", icon: FileAudio, accept: "audio/*" },
          { tipo: "video" as const, label: "Vídeo", icon: Video, accept: "video/*" },
        ]).map((item) => (
          <label key={item.tipo} className="cursor-pointer">
            <Button type="button" variant="outline" size="sm" asChild>
              <span>
                <item.icon className="w-4 h-4 mr-1" /> {item.label}
              </span>
            </Button>
            <input type="file" accept={item.accept} className="hidden" onChange={(e) => handleFileUpload(e, item.tipo)} />
          </label>
        ))}
      </div>

      {/* List of added content */}
      {conteudos.length > 0 && (
        <div className="space-y-2">
          <Label>Conteúdos adicionados ({conteudos.length})</Label>
          <div className="space-y-2">
            {conteudos.map((c, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-md border bg-muted/30">
                {conteudoIcon(c.tipo)}
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-medium uppercase text-muted-foreground">{c.tipo}</span>
                  <p className="text-sm truncate">
                    {c.tipo === "texto" ? c.valor.slice(0, 80) + (c.valor.length > 80 ? "..." : "") : c.nome || c.valor}
                  </p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeConteudo(i)}>
                  <X className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // STEP 3
  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-cyan-600 font-semibold">
        <Eye className="w-5 h-5" /> Finalização
      </div>

      <div className="space-y-4">
        <div>
          <Label className="text-muted-foreground text-xs">Nome da campanha</Label>
          <p className="font-medium">{nome}</p>
        </div>
        <div>
          <Label className="text-muted-foreground text-xs">Departamento</Label>
          <p className="font-medium">{selectedDepartamento?.nome || "Não selecionado"}</p>
        </div>
        <div>
          <Label className="text-muted-foreground text-xs">Destinatários</Label>
          <p className="text-sm">
            {selectedContatos.length} contato(s)
            {etiqueta && `, Etiqueta: ${etiqueta}`}
            {grupo && `, Grupo: ${grupo}`}
          </p>
        </div>
        <div>
          <Label className="text-muted-foreground text-xs">Conteúdos</Label>
          <div className="flex flex-wrap gap-2 mt-1">
            {conteudos.map((c, i) => (
              <Badge key={i} variant="secondary" className="gap-1">
                {conteudoIcon(c.tipo)} {c.tipo}
              </Badge>
            ))}
          </div>
        </div>

        <div className="border-t pt-4 space-y-3">
          <Label className="font-semibold">Quando enviar?</Label>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" checked={enviarAgora} onChange={() => setEnviarAgora(true)} className="accent-cyan-500" />
              <Send className="w-4 h-4" /> Enviar agora
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" checked={!enviarAgora} onChange={() => setEnviarAgora(false)} className="accent-cyan-500" />
              <Calendar className="w-4 h-4" /> Agendar
            </label>
            {!enviarAgora && (
              <Input type="datetime-local" value={agendarPara} onChange={(e) => setAgendarPara(e.target.value)} className="max-w-xs" />
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // CREATE VIEW
  const renderCreate = () => {
    const canNext1 = nome.trim() && departamentoId && (selectedContatos.length > 0 || etiqueta || grupo);
    const canNext2 = conteudos.length > 0;
    const canCreate = canNext1 && canNext2 && (enviarAgora || agendarPara);

    return (
      <>
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink className="cursor-pointer" onClick={() => { if (campanhas && campanhas.length > 0) setView("list"); }}>
                Campanhas
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>Criar</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Criar campanha</h1>
          <p className="text-muted-foreground text-sm">Preencha as informações da sua campanha</p>
        </div>

        <Card>
          <CardContent className="p-6">
            <Stepper />

            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}

            <div className="flex justify-end gap-3 mt-8">
              <Button
                variant="outline"
                onClick={() => {
                  if (step === 1) {
                    if (campanhas && campanhas.length > 0) setView("list");
                    else resetForm();
                  } else {
                    setStep(step - 1);
                  }
                }}
              >
                Voltar
              </Button>
              {step < 3 ? (
                <Button
                  className="bg-cyan-500 hover:bg-cyan-600 text-white"
                  onClick={() => setStep(step + 1)}
                  disabled={step === 1 ? !canNext1 : !canNext2}
                >
                  Próximo <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Button className="bg-cyan-500 hover:bg-cyan-600 text-white" onClick={() => createMutation.mutate()} disabled={!canCreate || createMutation.isPending}>
                  {createMutation.isPending ? "Criando..." : "Criar campanha"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </>
    );
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-4xl mx-auto">
        {view === "list" ? renderList() : renderCreate()}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir campanha?</AlertDialogTitle>
            <AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteId && deleteMutation.mutate(deleteId)}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

// Small inline icon for Destinatários section
const Users2Icon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);

export default CampanhasPage;
