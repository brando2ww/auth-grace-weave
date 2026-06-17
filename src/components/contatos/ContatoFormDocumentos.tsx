import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Upload, Trash2, FileText, Loader2 } from "lucide-react";

interface Props {
  contatoId: string | null;
  documentosAtivados: boolean;
  setDocumentosAtivados: (v: boolean) => void;
}

const TIPOS_DOCUMENTO = [
  { value: "rg", label: "RG" },
  { value: "cpf", label: "CPF" },
  { value: "cnh", label: "CNH" },
  { value: "comprovante_endereco", label: "Comprovante de endereço" },
  { value: "cnpj", label: "CNPJ" },
  { value: "contrato_social", label: "Contrato social" },
  { value: "inscricao_estadual", label: "Inscrição estadual" },
  { value: "contrato", label: "Contrato assinado" },
  { value: "proposta", label: "Proposta assinada" },
  { value: "termo", label: "Termo ou autorização" },
  { value: "outro", label: "Outro" },
];

export default function ContatoFormDocumentos({ contatoId, documentosAtivados, setDocumentosAtivados }: Props) {
  const [tipoDoc, setTipoDoc] = useState("");
  const [nomeArquivo, setNomeArquivo] = useState("");
  const [dataValidade, setDataValidade] = useState("");
  const [obsDoc, setObsDoc] = useState("");
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: documentos = [] } = useQuery({
    queryKey: ["contato-documentos", contatoId],
    enabled: !!contatoId && documentosAtivados,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contato_documentos" as any)
        .select("*")
        .eq("contato_id", contatoId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as any[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("contato_documentos" as any).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contato-documentos", contatoId] });
      toast({ title: "Documento removido" });
    },
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !contatoId || !tipoDoc) return;
    setUploading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Não autenticado");
      const path = `${session.user.id}/${contatoId}/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage.from("contato-documentos").upload(path, file);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from("contato-documentos").getPublicUrl(path);
      const { error } = await supabase.from("contato_documentos" as any).insert({
        contato_id: contatoId,
        user_id: session.user.id,
        tipo_documento: tipoDoc,
        nome_arquivo: nomeArquivo || file.name,
        arquivo_url: publicUrl,
        observacoes: obsDoc || null,
        data_validade: dataValidade || null,
      });
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ["contato-documentos", contatoId] });
      toast({ title: "Documento enviado com sucesso!" });
      setTipoDoc("");
      setNomeArquivo("");
      setDataValidade("");
      setObsDoc("");
    } catch {
      toast({ title: "Erro ao enviar documento", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  if (!contatoId) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        Salve o contato primeiro para gerenciar documentos.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Switch checked={documentosAtivados} onCheckedChange={setDocumentosAtivados} />
        <Label>Ativar armazenamento de documentos</Label>
      </div>

      {documentosAtivados && (
        <>
          {/* Upload form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg border border-border bg-muted/30">
            <div className="space-y-2">
              <Label>Tipo de documento *</Label>
              <Select value={tipoDoc} onValueChange={setTipoDoc}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {TIPOS_DOCUMENTO.map((t) => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="nome_arquivo">Nome do arquivo</Label>
              <Input id="nome_arquivo" placeholder="Nome descritivo" value={nomeArquivo} onChange={(e) => setNomeArquivo(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="data_validade">Data de validade</Label>
              <Input id="data_validade" type="date" value={dataValidade} onChange={(e) => setDataValidade(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="obs_doc">Observações</Label>
              <Input id="obs_doc" placeholder="Observações sobre o documento" value={obsDoc} onChange={(e) => setObsDoc(e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="file_upload" className="cursor-pointer">
                <div className="flex items-center justify-center gap-2 p-3 rounded-lg border-2 border-dashed border-border hover:border-primary/50 transition-colors">
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  <span className="text-sm">{uploading ? "Enviando..." : "Clique para anexar arquivo"}</span>
                </div>
              </Label>
              <input id="file_upload" type="file" className="hidden" onChange={handleUpload} disabled={!tipoDoc || uploading} />
            </div>
          </div>

          {/* Documents list */}
          {documentos.length > 0 && (
            <div className="space-y-2">
              <Label className="text-muted-foreground">Documentos anexados</Label>
              {documentos.map((doc: any) => (
                <div key={doc.id} className="flex items-center gap-3 p-3 rounded-lg border border-border">
                  <FileText className="h-5 w-5 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{doc.nome_arquivo}</p>
                    <p className="text-xs text-muted-foreground">
                      {TIPOS_DOCUMENTO.find((t) => t.value === doc.tipo_documento)?.label || doc.tipo_documento}
                      {doc.data_validade && ` · Validade: ${new Date(doc.data_validade).toLocaleDateString("pt-BR")}`}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteMutation.mutate(doc.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
