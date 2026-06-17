import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { QrCode, Plus, Wifi, WifiOff, RefreshCw, Loader2, Building2, Phone, LogOut, MessageCircle, Tag, Users, Trash2 } from "lucide-react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";

import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface WhatsappSession {
  id: string;
  user_id: string;
  connection_name: string;
  status: string;
  created_at: string;
  updated_at: string;
  departamento_id: string | null;
  profile_name: string | null;
  profile_picture_url: string | null;
  owner_phone: string | null;
  label_name: string | null;
  label_color: string | null;
}

interface Departamento {
  id: string;
  nome: string;
}

interface EvolutionResult {
  status: string;
  base64?: string;
  error?: string;
  profileName?: string;
  profilePictureUrl?: string;
  ownerPhone?: string;
}

const formatPhone = (phone: string | null) => {
  if (!phone) return "";
  // Format like +55 (11) 99999-9999
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 13) {
    return `+${cleaned.slice(0, 2)} (${cleaned.slice(2, 4)}) ${cleaned.slice(4, 9)}-${cleaned.slice(9)}`;
  }
  if (cleaned.length === 12) {
    return `+${cleaned.slice(0, 2)} (${cleaned.slice(2, 4)}) ${cleaned.slice(4, 8)}-${cleaned.slice(8)}`;
  }
  return `+${cleaned}`;
};

const getInitials = (name: string | null, connectionName: string) => {
  const source = name || connectionName;
  return source
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || "")
    .join("");
};

const LABEL_COLORS = [
  { name: "Verde", hex: "#22c55e" },
  { name: "Azul", hex: "#3b82f6" },
  { name: "Roxo", hex: "#8b5cf6" },
  { name: "Amarelo", hex: "#eab308" },
  { name: "Rosa", hex: "#ec4899" },
  { name: "Laranja", hex: "#f97316" },
  { name: "Vermelho", hex: "#ef4444" },
  { name: "Ciano", hex: "#06b6d4" },
];

const LabelBar = ({
  session,
  onSave,
}: {
  session: WhatsappSession;
  onSave: (id: string, name: string, color: string) => void;
}) => {
  const [editing, setEditing] = useState(false);
  const [labelName, setLabelName] = useState(session.label_name || "");
  const [labelColor, setLabelColor] = useState(session.label_color || "#22c55e");

  const handleSave = () => {
    onSave(session.id, labelName, labelColor);
    setEditing(false);
  };

  if (!session.label_name && !editing) {
    return (
      <Popover open={editing} onOpenChange={setEditing}>
        <PopoverTrigger asChild>
          <button className="w-full px-4 py-2 text-xs text-zinc-500 hover:text-zinc-300 flex items-center justify-center gap-1 border-t border-zinc-800 transition-colors">
            <Tag className="h-3 w-3" /> Adicionar etiqueta
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-3 space-y-3">
          <div className="space-y-1.5">
            <Input
              autoFocus
              value={labelName}
              onChange={(e) => setLabelName(e.target.value)}
              onBlur={handleSave}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              placeholder="Ex: VIP, Suporte..."
              className="h-8 text-xs"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Cor</Label>
            <div className="flex gap-1.5 flex-wrap">
              {LABEL_COLORS.map((c) => (
                <button
                  key={c.hex}
                  className={`h-6 w-6 rounded-full border-2 transition-all ${labelColor === c.hex ? "border-white scale-110" : "border-transparent"}`}
                  style={{ backgroundColor: c.hex }}
                  onClick={() => { setLabelColor(c.hex); onSave(session.id, labelName, c.hex); }}
                  title={c.name}
                />
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="w-full py-2 text-xs font-medium text-white rounded-b-2xl transition-all duration-300 ease-in-out cursor-pointer"
          style={{ backgroundColor: labelColor }}
        >
          {labelName || session.label_name}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3 space-y-3">
        <div className="space-y-1.5">
          <Input
            autoFocus
            value={labelName}
            onChange={(e) => setLabelName(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            placeholder="Ex: VIP, Suporte..."
            className="h-8 text-xs"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Cor</Label>
          <div className="flex gap-1.5 flex-wrap">
            {LABEL_COLORS.map((c) => (
              <button
                key={c.hex}
                className={`h-6 w-6 rounded-full border-2 transition-all ${labelColor === c.hex ? "border-white scale-110" : "border-transparent"}`}
                style={{ backgroundColor: c.hex }}
                onClick={() => { setLabelColor(c.hex); onSave(session.id, labelName, c.hex); }}
                title={c.name}
              />
            ))}
          </div>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="w-full h-7 text-xs"
          onClick={() => {
            onSave(session.id, "", "#22c55e");
            setLabelName("");
            setLabelColor("#22c55e");
          }}
        >
          Remover
        </Button>
      </PopoverContent>
    </Popover>
  );
};

const WhatsappQrcodePage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<WhatsappSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [connectionName, setConnectionName] = useState("");
  const [selectedDepartamento, setSelectedDepartamento] = useState("");
  const [saving, setSaving] = useState(false);
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);

  // QR code modal state
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [qrBase64, setQrBase64] = useState<string | null>(null);
  const [qrLoading, setQrLoading] = useState(false);
  const [qrSessionName, setQrSessionName] = useState("");
  const [qrSessionId, setQrSessionId] = useState<string | null>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [viewAtendentesSessionId, setViewAtendentesSessionId] = useState<string | null>(null);

  const fetchSessions = useCallback(async () => {
    const { data, error } = await supabase
      .from("whatsapp_sessions" as any)
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setSessions(data as unknown as WhatsappSession[]);
    }
    setLoading(false);
  }, []);

  const [atendentesPorDepartamento, setAtendentesPorDepartamento] = useState<Record<string, { id: string; nome: string; avatar_url: string | null; email: string; ativo: boolean; updated_at: string }[]>>({});

  const fetchAtendentesPorDepartamento = useCallback(async () => {
    const { data } = await supabase
      .from("atendente_departamentos" as any)
      .select("departamento_id, atendentes(id, nome, avatar_url, email, ativo, updated_at)");
    if (data) {
      const map: Record<string, { id: string; nome: string; avatar_url: string | null; email: string; ativo: boolean; updated_at: string }[]> = {};
      for (const row of data as any[]) {
        const depId = row.departamento_id;
        if (!map[depId]) map[depId] = [];
        if (row.atendentes) map[depId].push(row.atendentes);
      }
      setAtendentesPorDepartamento(map);
    }
  }, []);

  const fetchDepartamentos = useCallback(async () => {
    const { data } = await supabase
      .from("departamentos" as any)
      .select("id, nome")
      .eq("ativo", true)
      .order("nome");
    if (data) setDepartamentos(data as any);
  }, []);

  useEffect(() => {
    fetchSessions();
    fetchDepartamentos();
    fetchAtendentesPorDepartamento();
  }, [fetchSessions, fetchDepartamentos, fetchAtendentesPorDepartamento]);

  // Refresh profile data and re-register webhooks for connected sessions on page load
  useEffect(() => {
    if (sessions.length === 0) return;
    const connectedSessions = sessions.filter((s) => s.status === "connected");
    connectedSessions.forEach(async (session) => {
      // Always re-register webhook to ensure it's active
      registerWebhook(session.connection_name);
      try {
        const result = await callEvolutionQrcode(session.connection_name);
        if (result.status === "connected" && (result.profileName || result.ownerPhone)) {
          await supabase
            .from("whatsapp_sessions" as any)
            .update({
              profile_name: result.profileName || session.profile_name,
              profile_picture_url: result.profilePictureUrl || session.profile_picture_url,
              owner_phone: result.ownerPhone || session.owner_phone,
            } as any)
            .eq("id", session.id);
          // Update local state
          setSessions((prev) =>
            prev.map((s) =>
              s.id === session.id
                ? {
                    ...s,
                    profile_name: result.profileName || s.profile_name,
                    profile_picture_url: result.profilePictureUrl || s.profile_picture_url,
                    owner_phone: result.ownerPhone || s.owner_phone,
                  }
                : s
            )
          );
        } else if (result.status !== "connected" && session.status === "connected") {
          // Session disconnected externally
          await supabase
            .from("whatsapp_sessions" as any)
            .update({ status: "disconnected" } as any)
            .eq("id", session.id);
          setSessions((prev) =>
            prev.map((s) => (s.id === session.id ? { ...s, status: "disconnected" } : s))
          );
        }
      } catch {
        // Silently fail profile refresh
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  const availableDepartamentos = departamentos.filter(
    (d) => !sessions.some((s) => s.departamento_id === d.id)
  );
  const departamentoMap = new Map(departamentos.map((d) => [d.id, d.nome]));

  const callEvolutionQrcode = async (name: string): Promise<EvolutionResult> => {
    const { data, error } = await supabase.functions.invoke("evolution-qrcode", {
      body: { connectionName: name },
    });
    if (error) throw error;
    return data;
  };

  const registerWebhook = async (connectionName: string) => {
    try {
      await supabase.functions.invoke("evolution-register-webhook", {
        body: { connectionName },
      });
    } catch (err) {
      console.error("Failed to register webhook:", err);
    }
  };

  const saveProfileData = async (sessionId: string, result: EvolutionResult, connectionName?: string) => {
    const updates: any = { status: "connected" };
    if (result.profileName) updates.profile_name = result.profileName;
    if (result.profilePictureUrl) updates.profile_picture_url = result.profilePictureUrl;
    if (result.ownerPhone) updates.owner_phone = result.ownerPhone;
    await supabase.from("whatsapp_sessions" as any).update(updates).eq("id", sessionId);

    // Auto-register webhook for real-time message sync
    if (connectionName) {
      registerWebhook(connectionName);
    }
  };

  const startPolling = (name: string, sessionId: string) => {
    if (pollingRef.current) clearInterval(pollingRef.current);

    pollingRef.current = setInterval(async () => {
      try {
        const result = await callEvolutionQrcode(name);
        if (result.status === "connected") {
          if (pollingRef.current) clearInterval(pollingRef.current);
          pollingRef.current = null;
          setQrBase64(null);
          setQrDialogOpen(false);

          await saveProfileData(sessionId, result, name);
          toast({ title: "Conectado!", description: `Sessão "${name}" conectada com sucesso.` });
          fetchSessions();
        } else if (result.status === "qrcode" && result.base64) {
          setQrBase64(result.base64);
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 10000);
  };

  const handleConnect = async (name: string, sessionId: string) => {
    setQrSessionName(name);
    setQrSessionId(sessionId);
    setQrDialogOpen(true);
    setQrLoading(true);
    setQrBase64(null);

    try {
      const result = await callEvolutionQrcode(name);
      if (result.status === "connected") {
        setQrDialogOpen(false);
        await saveProfileData(sessionId, result, name);
        toast({ title: "Já conectado!", description: `Sessão "${name}" já está conectada.` });
        fetchSessions();
      } else if (result.status === "qrcode" && result.base64) {
        setQrBase64(result.base64);
        startPolling(name, sessionId);
      } else {
        toast({ title: "Erro", description: result.error || "Não foi possível obter o QR code.", variant: "destructive" });
        setQrDialogOpen(false);
      }
    } catch (err: any) {
      toast({ title: "Erro", description: err.message || "Erro ao conectar.", variant: "destructive" });
      setQrDialogOpen(false);
    } finally {
      setQrLoading(false);
    }
  };

  const handleAddSession = async () => {
    if (!connectionName.trim() || !selectedDepartamento) return;
    setSaving(true);

    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Não autenticado");

      const { data: inserted, error } = await supabase
        .from("whatsapp_sessions" as any)
        .insert({
          connection_name: connectionName.trim(),
          user_id: userData.user.id,
          departamento_id: selectedDepartamento,
        } as any)
        .select()
        .single();

      if (error) throw error;

      const session = inserted as unknown as WhatsappSession;
      setAddDialogOpen(false);
      setConnectionName("");
      setSelectedDepartamento("");
      fetchSessions();

      handleConnect(session.connection_name, session.id);
    } catch (err: any) {
      toast({ title: "Erro", description: err.message || "Erro ao criar sessão.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    await supabase.from("whatsapp_sessions" as any).delete().eq("id", id);
    fetchSessions();
    toast({ title: "Sessão removida" });
  };

  const handleCloseQrDialog = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
    setQrDialogOpen(false);
    setQrBase64(null);
  };

  const handleCloseAddDialog = () => {
    setAddDialogOpen(false);
    setConnectionName("");
    setSelectedDepartamento("");
  };

  const handleLogout = async (session: WhatsappSession) => {
    try {
      await supabase.functions.invoke("evolution-qrcode", {
        body: { connectionName: session.connection_name, action: "logout" },
      });
      await supabase
        .from("whatsapp_sessions" as any)
        .update({ status: "disconnected" } as any)
        .eq("id", session.id);
      setSessions((prev) =>
        prev.map((s) => (s.id === session.id ? { ...s, status: "disconnected" } : s))
      );
      toast({ title: "Sessão encerrada", description: `"${session.connection_name}" foi desconectada.` });
    } catch (err: any) {
      toast({ title: "Erro", description: err.message || "Erro ao encerrar sessão.", variant: "destructive" });
    }
  };

  const handleSaveLabel = async (sessionId: string, labelName: string, labelColor: string) => {
    await supabase
      .from("whatsapp_sessions" as any)
      .update({ label_name: labelName || null, label_color: labelColor } as any)
      .eq("id", sessionId);
    setSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId ? { ...s, label_name: labelName || null, label_color: labelColor } : s
      )
    );
  };

  const connectedCount = sessions.filter((s) => s.status === "connected").length;

  return (
    <DashboardLayout>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>WhatsApp QR Code</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <QrCode className="h-7 w-7 text-foreground" />
          <h1 className="text-2xl font-bold text-foreground">WhatsApp QR Code</h1>
        </div>
        <p className="text-sm text-muted-foreground">Gerencie seus números do WhatsApp QRCode</p>
      </div>

      <p className="text-sm text-muted-foreground">
        Em uso <span className="font-semibold text-foreground">{connectedCount}</span> de{" "}
        <span className="font-semibold text-foreground">10</span> números.{" "}
        <button className="text-primary hover:underline font-medium">Aumentar meu limite</button>
      </p>

      {loading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : sessions.length === 0 ? (
        <div className="border-2 border-dashed border-border rounded-lg p-12 flex flex-col items-center justify-center text-center space-y-4">
          <QrCode className="h-16 w-16 text-muted-foreground/50" />
          <h2 className="text-lg font-semibold text-foreground">Nenhuma sessão</h2>
          <p className="text-sm text-muted-foreground max-w-md">
            Você ainda não possui nenhuma sessão do WhatsApp QRCode conectada. Adicione uma nova sessão para começar.
          </p>
          <Button className="bg-cyan-500 hover:bg-cyan-600 text-white" onClick={() => setAddDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            Adicionar sessão
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button className="bg-cyan-500 hover:bg-cyan-600 text-white" onClick={() => setAddDialogOpen(true)}>
              <Plus className="h-4 w-4" />
              Adicionar sessão
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sessions.map((session) => {
              const isConnected = session.status === "connected";
              const displayName = session.profile_name || session.connection_name;
              const depName = session.departamento_id ? departamentoMap.get(session.departamento_id) : null;

              return (
                <div key={session.id} className="bg-gray-100 border border-gray-200 rounded-2xl overflow-hidden">
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 pt-4 pb-2">
                    {depName && (
                      <div className="flex items-center gap-1.5 text-xs text-cyan-600">
                        <Building2 className="h-3 w-3" />
                        <span>{depName}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 ml-auto">
                      {isConnected ? (
                        <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/20 text-[11px]">
                          <Wifi className="h-3 w-3 mr-1" /> Conectado
                        </Badge>
                      ) : (
                        <Badge className="bg-yellow-500/15 text-yellow-400 border-yellow-500/20 text-[11px]">
                          <WifiOff className="h-3 w-3 mr-1" /> Desconectado
                        </Badge>
                      )}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir sessão</AlertDialogTitle>
                            <AlertDialogDescription>
                              {session.status === "connected"
                                ? "Esta sessão será encerrada e a instância será excluída permanentemente."
                                : "A instância será excluída permanentemente do sistema."}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              onClick={async () => {
                                if (session.status === "connected") {
                                  await handleLogout(session);
                                }
                                await handleDelete(session.id);
                              }}
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>

                  {/* Body — horizontal layout */}
                  <div className="flex items-center gap-4 px-4 py-4">
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <Avatar className="h-14 w-14 border-2 border-cyan-500 shrink-0 cursor-pointer">
                          <AvatarImage src={session.profile_picture_url || undefined} alt={displayName} />
                          <AvatarFallback className="bg-gray-200 text-gray-600 text-base font-semibold">
                            {getInitials(session.profile_name, session.connection_name)}
                          </AvatarFallback>
                        </Avatar>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-96 p-5 rounded-2xl shadow-xl border-border" side="right" sideOffset={8}>
                        {/* Topo: Nome + Status */}
                        <div className="flex flex-col items-center text-center mb-4">
                          <h3 className="text-xl font-semibold text-foreground">{displayName}</h3>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className={`text-sm ${isConnected ? "text-emerald-500" : "text-yellow-500"}`}>✦</span>
                            <span className={`text-sm font-medium ${isConnected ? "text-emerald-500" : "text-yellow-500"}`}>
                              {isConnected ? "Conectado" : "Desconectado"}
                            </span>
                          </div>
                        </div>

                        {/* Centro: Foto retangular grande */}
                        <div className="flex justify-center mb-4">
                          {session.profile_picture_url ? (
                            <img
                              src={session.profile_picture_url}
                              alt={displayName}
                              className="w-[85%] aspect-square object-cover rounded-xl"
                            />
                          ) : (
                            <div className="w-[85%] aspect-square rounded-xl bg-muted flex items-center justify-center">
                              <span className="text-4xl font-semibold text-muted-foreground">
                                {getInitials(session.profile_name, session.connection_name)}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Rodapé: Telefone + botão vincular */}
                        <div className="flex items-center justify-between">
                          {session.owner_phone ? (
                            <span className="text-sm text-muted-foreground">{formatPhone(session.owner_phone)}</span>
                          ) : (
                            <span className="text-xs text-muted-foreground italic">Sem número</span>
                          )}
                          <button className="bg-gray-900 text-white rounded-full text-xs px-3 py-1.5 hover:bg-gray-800 transition-colors whitespace-nowrap shrink-0">
                            + Vincular atendente
                          </button>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full shrink-0 ${isConnected ? "bg-emerald-500" : "bg-yellow-500"}`} />
                        <h3 className="text-sm font-semibold text-gray-900 truncate">{displayName}</h3>
                      </div>
                      {session.owner_phone && (
                        <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-500">
                          <Phone className="h-3 w-3" />
                          <span>{formatPhone(session.owner_phone)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer — actions */}
                  <div className="flex items-center gap-2 px-4 pb-3">
                    {isConnected && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-cyan-500 text-cyan-600 hover:bg-cyan-50 hover:text-cyan-700"
                          >
                            <LogOut className="h-3 w-3 mr-1" /> Encerrar sessão
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Encerrar sessão</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja desconectar a sessão "{session.connection_name}"?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleLogout(session)}>Encerrar</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                    {!isConnected && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-cyan-500 text-cyan-600 hover:bg-cyan-50 hover:text-cyan-700"
                        onClick={() => handleConnect(session.connection_name, session.id)}
                      >
                        <RefreshCw className="h-3 w-3 mr-1" /> Reconectar
                      </Button>
                    )}
                    {isConnected && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-cyan-500 text-cyan-600 hover:bg-cyan-50 hover:text-cyan-700"
                        onClick={() => navigate("/chat")}
                      >
                        <MessageCircle className="h-3 w-3 mr-1" /> Ir ao Chat
                      </Button>
                    )}
                    {isConnected && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-cyan-500 text-cyan-600 hover:bg-cyan-50 hover:text-cyan-700"
                        onClick={() => setViewAtendentesSessionId(session.id)}
                      >
                        <Users className="h-3 w-3 mr-1" /> Ver atendentes
                      </Button>
                    )}
                    {isConnected && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-cyan-600"
                        title="Re-registrar webhook"
                        onClick={async () => {
                          try {
                            await registerWebhook(session.connection_name);
                            toast({ title: "Webhook registrado", description: `Webhook re-registrado para "${session.connection_name}".` });
                          } catch {
                            toast({ title: "Erro", description: "Falha ao re-registrar webhook.", variant: "destructive" });
                          }
                        }}
                      >
                        <RefreshCw className="h-3 w-3" />
                      </Button>
                    )}
                  </div>

                  {/* Label bar */}
                  <LabelBar session={session} onSave={handleSaveLabel} />

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add session dialog */}
      <Dialog open={addDialogOpen} onOpenChange={(open) => { if (!open) handleCloseAddDialog(); else setAddDialogOpen(true); }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Nova Sessão WhatsApp</DialogTitle>
            <DialogDescription>Vincule a sessão a um departamento e informe o nome da conexão.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Card className="border border-border">
              <CardContent className="pt-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="departamento">Departamento</Label>
                  <Select value={selectedDepartamento} onValueChange={setSelectedDepartamento}>
                    <SelectTrigger id="departamento">
                      <SelectValue placeholder="Selecione um departamento" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableDepartamentos.map((dep) => (
                        <SelectItem key={dep.id} value={dep.id}>
                          {dep.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {availableDepartamentos.length === 0 && (
                    <p className="text-xs text-muted-foreground">Todos os departamentos já possuem sessão vinculada.</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="connectionName">Nome da conexão</Label>
                  <Input
                    id="connectionName"
                    placeholder="Ex: Minha Conexão"
                    value={connectionName}
                    onChange={(e) => setConnectionName(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseAddDialog}>Voltar</Button>
            <Button
              className="bg-cyan-500 hover:bg-cyan-600 text-white"
              onClick={handleAddSession}
              disabled={saving || !connectionName.trim() || !selectedDepartamento}
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              Salvar e continuar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* QR Code dialog */}
      <Dialog open={qrDialogOpen} onOpenChange={(open) => { if (!open) handleCloseQrDialog(); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Escanear QR Code</DialogTitle>
            <DialogDescription>Escaneie o QR Code com o WhatsApp para conectar "{qrSessionName}".</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-4 min-h-[300px]">
            {qrLoading && !qrBase64 ? (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Gerando QR Code...</p>
              </div>
            ) : qrBase64 ? (
              <div className="flex flex-col items-center gap-3">
                <img
                  src={`data:image/png;base64,${qrBase64}`}
                  alt="QR Code WhatsApp"
                  className="w-64 h-64 rounded-lg border"
                />
                <p className="text-xs text-muted-foreground">Atualizando automaticamente a cada 10s...</p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Aguardando QR Code...</p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de atendentes vinculados */}
      <Dialog open={!!viewAtendentesSessionId} onOpenChange={(open) => !open && setViewAtendentesSessionId(null)}>
        <DialogContent className="sm:max-w-4xl">
          {(() => {
            const s = sessions.find(s => s.id === viewAtendentesSessionId);
            const atendentes = s?.departamento_id ? atendentesPorDepartamento[s.departamento_id] || [] : [];
            return (
              <>
                <DialogHeader>
                  <DialogTitle>Atendentes vinculados</DialogTitle>
                  <DialogDescription>
                    {atendentes.length} atendente{atendentes.length !== 1 ? "s" : ""} vinculado{atendentes.length !== 1 ? "s" : ""} — {s?.profile_name || s?.connection_name || ""}
                  </DialogDescription>
                </DialogHeader>
                {atendentes.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">Nenhum atendente vinculado a este departamento.</p>
                ) : (
                  <div className="max-h-[400px] overflow-y-auto rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome</TableHead>
                          <TableHead>E-mail</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Última atividade</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {atendentes.map(at => (
                          <TableRow key={at.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  {at.avatar_url && <AvatarImage src={at.avatar_url} alt={at.nome} />}
                                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                                    {at.nome.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="font-medium text-sm">{at.nome}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">{at.email}</TableCell>
                            <TableCell>
                              <Badge variant={at.ativo ? "default" : "secondary"} className={at.ativo ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/20" : "bg-muted text-muted-foreground"}>
                                <span className={`inline-block h-1.5 w-1.5 rounded-full mr-1.5 ${at.ativo ? "bg-emerald-500" : "bg-muted-foreground"}`} />
                                {at.ativo ? "Ativo" : "Inativo"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {formatDistanceToNow(new Date(at.updated_at), { addSuffix: true, locale: ptBR })}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
                <DialogFooter className="mt-4">
                  <Button
                    className="bg-black text-white hover:bg-black/90 flex items-center gap-2"
                    onClick={() => { setViewAtendentesSessionId(null); navigate("/atendentes"); }}
                  >
                    <Users className="h-4 w-4" />
                    Gerenciar atendentes
                  </Button>
                </DialogFooter>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default WhatsappQrcodePage;
