import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export type IntegracaoTipo = "chatgpt" | "elevenlabs" | "calcom" | "webhooks" | "api" | "facebook_leads";

interface IntegracaoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tipo: IntegracaoTipo;
  titulo: string;
  config: Record<string, string>;
  ativo: boolean;
  onSaved: () => void;
}

const IntegracaoDialog: React.FC<IntegracaoDialogProps> = ({
  open,
  onOpenChange,
  tipo,
  titulo,
  config: initialConfig,
  ativo: initialAtivo,
  onSaved,
}) => {
  const [config, setConfig] = useState<Record<string, string>>({});
  const [ativo, setAtivo] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setConfig(initialConfig || {});
      setAtivo(initialAtivo);
      setTestResult(null);
    }
  }, [open, initialConfig, initialAtivo]);

  const updateField = (key: string, value: string) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const { data, error } = await supabase.functions.invoke("test-integration", {
        body: { tipo, config },
      });
      if (error) throw error;
      setTestResult(data as { success: boolean; message: string });
    } catch (e: unknown) {
      setTestResult({ success: false, message: (e as Error).message || "Erro ao testar" });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { error } = await supabase
        .from("integracoes" as any)
        .upsert(
          { user_id: user.id, tipo, config, ativo } as any,
          { onConflict: "user_id,tipo" }
        );
      if (error) throw error;

      toast({ title: "Integração salva com sucesso!" });
      onSaved();
      onOpenChange(false);
    } catch (e: unknown) {
      toast({ title: "Erro ao salvar", description: (e as Error).message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const renderFields = () => {
    switch (tipo) {
      case "chatgpt":
        return (
          <div className="space-y-2">
            <Label>API Key</Label>
            <Input
              type="password"
              placeholder="sk-..."
              value={config.api_key || ""}
              onChange={(e) => updateField("api_key", e.target.value)}
            />
          </div>
        );

      case "elevenlabs":
        return (
          <>
            <div className="space-y-2">
              <Label>API Key</Label>
              <Input
                type="password"
                placeholder="Sua API key da ElevenLabs"
                value={config.api_key || ""}
                onChange={(e) => updateField("api_key", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Voice ID (opcional)</Label>
              <Input
                placeholder="ID da voz desejada"
                value={config.voice_id || ""}
                onChange={(e) => updateField("voice_id", e.target.value)}
              />
            </div>
          </>
        );

      case "calcom":
        return (
          <>
            <div className="space-y-2">
              <Label>API Key</Label>
              <Input
                type="password"
                placeholder="Sua API key do Cal.com"
                value={config.api_key || ""}
                onChange={(e) => updateField("api_key", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>URL da agenda (opcional)</Label>
              <Input
                placeholder="https://cal.com/seu-usuario"
                value={config.calendar_url || ""}
                onChange={(e) => updateField("calendar_url", e.target.value)}
              />
            </div>
          </>
        );

      case "webhooks":
        return (
          <>
            <div className="space-y-2">
              <Label>URL do Webhook</Label>
              <Input
                placeholder="https://seu-servidor.com/webhook"
                value={config.webhook_url || ""}
                onChange={(e) => updateField("webhook_url", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Método</Label>
              <Select
                value={config.metodo || "POST"}
                onValueChange={(v) => updateField("metodo", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="GET">GET</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Headers customizados (JSON, opcional)</Label>
              <Textarea
                placeholder='{"Authorization": "Bearer token"}'
                value={config.headers_custom || ""}
                onChange={(e) => updateField("headers_custom", e.target.value)}
                rows={3}
              />
            </div>
          </>
        );

      case "api":
        return (
          <>
            <div className="space-y-2">
              <Label>URL Base</Label>
              <Input
                placeholder="https://api.exemplo.com/v1"
                value={config.url_base || ""}
                onChange={(e) => updateField("url_base", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>API Key (opcional)</Label>
              <Input
                type="password"
                placeholder="Sua API key"
                value={config.api_key || ""}
                onChange={(e) => updateField("api_key", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Headers customizados (JSON, opcional)</Label>
              <Textarea
                placeholder='{"X-Custom-Header": "valor"}'
                value={config.headers_custom || ""}
                onChange={(e) => updateField("headers_custom", e.target.value)}
                rows={3}
              />
            </div>
          </>
        );

      case "facebook_leads":
        return (
          <>
            <div className="space-y-2">
              <Label>Access Token</Label>
              <Input
                type="password"
                placeholder="Token de acesso do Facebook"
                value={config.access_token || ""}
                onChange={(e) => updateField("access_token", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Page ID</Label>
              <Input
                placeholder="ID da página do Facebook"
                value={config.page_id || ""}
                onChange={(e) => updateField("page_id", e.target.value)}
              />
            </div>
          </>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Configurar {titulo}</DialogTitle>
          <DialogDescription>
            Preencha os dados abaixo para configurar a integração.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="flex items-center justify-between">
            <Label>Ativar integração</Label>
            <Switch
              checked={ativo}
              onCheckedChange={setAtivo}
              className="data-[state=checked]:bg-cyan-500"
            />
          </div>

          {renderFields()}

          {testResult && (
            <div
              className={`flex items-center gap-2 rounded-md p-3 text-sm ${
                testResult.success
                  ? "bg-green-500/10 text-green-600"
                  : "bg-destructive/10 text-destructive"
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="h-4 w-4 shrink-0" />
              ) : (
                <XCircle className="h-4 w-4 shrink-0" />
              )}
              <span>{testResult.message}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2 justify-end">
          <Button
            variant="outline"
            onClick={handleTest}
            disabled={testing}
          >
            {testing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Testar conexão
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-cyan-500 hover:bg-cyan-600 text-white"
          >
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Salvar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IntegracaoDialog;
