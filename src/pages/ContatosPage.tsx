import { useState, useMemo, useRef } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import {
  Contact, Plus, FileText, User, ArrowLeft, MoreHorizontal, Pencil, Trash2,
  Filter, Download, Upload, ChevronLeft, ChevronRight, Search, List, Columns3,
  Loader2,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import ContatosKanban from "@/components/contatos/ContatosKanban";
import { CountryCodeSelector } from "@/components/CountryCodeSelector";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

import ContatoFormBasico from "@/components/contatos/ContatoFormBasico";
import ContatoFormClassificacao from "@/components/contatos/ContatoFormClassificacao";
import ContatoFormComercial from "@/components/contatos/ContatoFormComercial";
import ContatoFormEndereco from "@/components/contatos/ContatoFormEndereco";
import ContatoFormDocumentos from "@/components/contatos/ContatoFormDocumentos";

function formatPhoneDisplay(phone: string): string {
  let p = phone.startsWith("0") ? phone.slice(1) : phone;
  if (p.length === 11 && p.startsWith("1")) {
    return `+1 (${p.slice(1, 4)}) ${p.slice(4, 7)}-${p.slice(7)}`;
  }
  if (p.startsWith("55") && p.length >= 12) {
    const local = p.slice(2);
    if (local.length === 11 && local.charAt(2) === "9") {
      return `+55 (${local.slice(0, 2)}) ${local.slice(2, 7)}-${local.slice(7)}`;
    }
    if (local.length === 10) {
      return `+55 (${local.slice(0, 2)}) ${local.slice(2, 6)}-${local.slice(6)}`;
    }
  }
  return `+${p}`;
}

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.115.554 4.1 1.523 5.824L.057 23.57a.75.75 0 0 0 .914.914l5.747-1.467A11.952 11.952 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.9a9.9 9.9 0 0 1-5.031-1.373l-.361-.214-3.741.955.972-3.643-.234-.374A9.86 9.86 0 0 1 2.1 12C2.1 6.525 6.525 2.1 12 2.1S21.9 6.525 21.9 12 17.475 21.9 12 21.9z" />
  </svg>
);

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  novo: { label: "Novo", className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  em_atendimento: { label: "Em atendimento", className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
  proposta_enviada: { label: "Proposta enviada", className: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
  negociacao: { label: "Negociação", className: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
  cliente: { label: "Cliente", className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  perdido: { label: "Perdido", className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
};

const TIPO_LABELS: Record<string, string> = {
  lead: "Lead",
  cliente: "Cliente",
  parceiro: "Parceiro",
  fornecedor: "Fornecedor",
};

const ContatosPage = () => {
  const [view, setView] = useState<"list" | "create">("list");
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingContatoId, setEditingContatoId] = useState<string | null>(null);
  const [editingProfilePictureUrl, setEditingProfilePictureUrl] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTipo, setFilterTipo] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [viewMode, setViewMode] = useState<"lista" | "kanban">("lista");

  // CSV import state
  const csvInputRef = useRef<HTMLInputElement>(null);
  const [csvPreviewData, setCsvPreviewData] = useState<any[]>([]);
  const [isCsvPreviewOpen, setIsCsvPreviewOpen] = useState(false);
  const [isImportingCsv, setIsImportingCsv] = useState(false);

  // Form state - Básico
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [codigoPais, setCodigoPais] = useState("+55");
  const [telefoneSecundario, setTelefoneSecundario] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [cargo, setCargo] = useState("");

  // Classificação
  const [tipoContato, setTipoContato] = useState("");
  const [origemContato, setOrigemContato] = useState("");
  const [statusFunil, setStatusFunil] = useState("novo");
  const [grupo, setGrupo] = useState("");
  const [etiquetas, setEtiquetas] = useState("");
  const [produtoServico, setProdutoServico] = useState("");

  // Comercial
  const [ultimaCompra, setUltimaCompra] = useState("");
  const [totalGasto, setTotalGasto] = useState("");
  const [numeroPedidos, setNumeroPedidos] = useState("");
  const [dataRenovacao, setDataRenovacao] = useState("");
  const [proximoFollowup, setProximoFollowup] = useState("");
  const [canalPreferido, setCanalPreferido] = useState("");

  // Endereço
  const [cep, setCep] = useState("");
  const [rua, setRua] = useState("");
  const [numeroEndereco, setNumeroEndereco] = useState("");
  const [complemento, setComplemento] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [pais, setPais] = useState("Brasil");

  // Documentos & Observações
  const [documentosAtivados, setDocumentosAtivados] = useState(false);
  const [observacoes, setObservacoes] = useState("");

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const resetForm = () => {
    setNome(""); setEmail(""); setTelefone(""); setCodigoPais("+55");
    setTelefoneSecundario(""); setDataNascimento(""); setCpfCnpj("");
    setEmpresa(""); setCargo(""); setTipoContato(""); setOrigemContato("");
    setStatusFunil("novo"); setGrupo(""); setEtiquetas(""); setProdutoServico("");
    setUltimaCompra(""); setTotalGasto(""); setNumeroPedidos("");
    setDataRenovacao(""); setProximoFollowup(""); setCanalPreferido("");
    setCep(""); setRua(""); setNumeroEndereco(""); setComplemento("");
    setBairro(""); setCidade(""); setEstado(""); setPais("Brasil");
    setDocumentosAtivados(false); setObservacoes("");
    setEditingContatoId(null);
    setEditingProfilePictureUrl(null);
  };

  const { data: contatos, isLoading } = useQuery({
    queryKey: ["contatos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contatos" as any)
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as any[];
    },
  });

  const filteredContatos = useMemo(() => {
    if (!contatos) return [];
    let result = contatos;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c: any) =>
          c.nome.toLowerCase().includes(q) ||
          (c.telefone && c.telefone.includes(q)) ||
          (c.email && c.email.toLowerCase().includes(q))
      );
    }
    if (filterTipo) result = result.filter((c: any) => c.tipo_contato === filterTipo);
    if (filterStatus) result = result.filter((c: any) => c.status_funil === filterStatus);
    return result;
  }, [contatos, searchQuery, filterTipo, filterStatus]);

  const totalPages = Math.max(1, Math.ceil(filteredContatos.length / itemsPerPage));
  const paginatedContatos = filteredContatos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearchChange = (value: string) => { setSearchQuery(value); setCurrentPage(1); };
  const handleItemsPerPageChange = (value: string) => { setItemsPerPage(Number(value)); setCurrentPage(1); };

  const buildPayload = () => ({
    nome,
    email: email || null,
    telefone: telefone || null,
    codigo_pais: codigoPais,
    telefone_secundario: telefoneSecundario || null,
    data_nascimento: dataNascimento || null,
    cpf_cnpj: cpfCnpj || null,
    empresa: empresa || null,
    cargo: cargo || null,
    tipo_contato: tipoContato || null,
    origem_contato: origemContato || null,
    status_funil: statusFunil || "novo",
    grupo: grupo || null,
    etiquetas: etiquetas ? etiquetas.split(",").map(e => e.trim()).filter(Boolean) : null,
    produto_servico: produtoServico || null,
    ultima_compra: ultimaCompra || null,
    total_gasto: totalGasto ? parseFloat(totalGasto) : 0,
    numero_pedidos: numeroPedidos ? parseInt(numeroPedidos) : 0,
    data_renovacao: dataRenovacao || null,
    proximo_followup: proximoFollowup || null,
    canal_preferido: canalPreferido || null,
    observacoes: observacoes || null,
    cep: cep || null,
    rua: rua || null,
    numero_endereco: numeroEndereco || null,
    complemento: complemento || null,
    bairro: bairro || null,
    cidade: cidade || null,
    estado: estado || null,
    pais: pais || "Brasil",
    documentos_ativados: documentosAtivados,
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Não autenticado");
      const { error } = await supabase.from("contatos" as any).insert({ ...buildPayload(), user_id: session.user.id } as any);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contatos"] });
      toast({ title: "Contato criado com sucesso!" });
      resetForm();
      setView("list");
    },
    onError: () => toast({ title: "Erro ao criar contato", variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!editingContatoId) return;
      const { error } = await supabase.from("contatos" as any).update(buildPayload() as any).eq("id", editingContatoId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contatos"] });
      toast({ title: "Contato atualizado com sucesso!" });
      resetForm();
      setView("list");
    },
    onError: () => toast({ title: "Erro ao atualizar contato", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("contatos" as any).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contatos"] });
      toast({ title: "Contato excluído com sucesso!" });
      setDeleteId(null);
    },
    onError: () => toast({ title: "Erro ao excluir contato", variant: "destructive" }),
  });

  const handleEdit = (contato: any) => {
    setEditingContatoId(contato.id);
    setNome(contato.nome || "");
    setEmail(contato.email || "");
    setTelefone(contato.telefone || "");
    setCodigoPais(contato.codigo_pais || "+55");
    setTelefoneSecundario(contato.telefone_secundario || "");
    setDataNascimento(contato.data_nascimento || "");
    setCpfCnpj(contato.cpf_cnpj || "");
    setEmpresa(contato.empresa || "");
    setCargo(contato.cargo || "");
    setTipoContato(contato.tipo_contato || "");
    setOrigemContato(contato.origem_contato || "");
    setStatusFunil(contato.status_funil || "novo");
    setGrupo(contato.grupo || "");
    setEtiquetas(contato.etiquetas?.join(", ") || "");
    setProdutoServico(contato.produto_servico || "");
    setUltimaCompra(contato.ultima_compra || "");
    setTotalGasto(contato.total_gasto?.toString() || "");
    setNumeroPedidos(contato.numero_pedidos?.toString() || "");
    setDataRenovacao(contato.data_renovacao || "");
    setProximoFollowup(contato.proximo_followup ? contato.proximo_followup.slice(0, 16) : "");
    setCanalPreferido(contato.canal_preferido || "");
    setObservacoes(contato.observacoes || "");
    setCep(contato.cep || "");
    setRua(contato.rua || "");
    setNumeroEndereco(contato.numero_endereco || "");
    setComplemento(contato.complemento || "");
    setBairro(contato.bairro || "");
    setCidade(contato.cidade || "");
    setEstado(contato.estado || "");
    setPais(contato.pais || "Brasil");
    setDocumentosAtivados(contato.documentos_ativados || false);
    setEditingProfilePictureUrl(contato.profile_picture_url || null);
    setView("create");
  };

  const handleSave = () => {
    if (editingContatoId) updateMutation.mutate();
    else createMutation.mutate();
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;
  const hasContatos = contatos && contatos.length > 0;

  // --- CSV parser & import handler ---
  function parseCsvLine(line: string): string[] {
    const fields: string[] = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (inQuotes) {
        if (ch === '"' && line[i + 1] === '"') { current += '"'; i++; }
        else if (ch === '"') inQuotes = false;
        else current += ch;
      } else {
        if (ch === '"') inQuotes = true;
        else if (ch === ',') { fields.push(current); current = ""; }
        else current += ch;
      }
    }
    fields.push(current);
    return fields;
  }

  const handleCsvFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const lines = text.split(/\r?\n/).filter(l => l.trim());
      if (lines.length < 2) {
        toast({ title: "Arquivo CSV vazio ou inválido", variant: "destructive" });
        return;
      }
      const headers = parseCsvLine(lines[0]);
      const rows = lines.slice(1).map(line => {
        const values = parseCsvLine(line);
        const row: Record<string, string> = {};
        headers.forEach((h, i) => { row[h.trim()] = (values[i] || "").trim(); });
        return row;
      }).filter(r => r["CNPJ"] || r["RAZÃO SOCIAL"] || r["nome_fantasia"]);

      const mapped = rows.map(r => ({
        nome: r["nome_fantasia"] || r["RAZÃO SOCIAL"] || "Sem nome",
        email: r["EMAIL"] || null,
        telefone: (r["TELEFONES"] || "").replace(/\D/g, "").replace(/^55/, "") || null,
        cpf_cnpj: r["CNPJ"] || null,
        empresa: r["RAZÃO SOCIAL"] || null,
        rua: [r["descricao_tipo_logradouro"], r["logradouro"]].filter(Boolean).join(" ") || null,
        numero_endereco: r["numero"] || null,
        complemento: r["complemento"] || null,
        bairro: r["bairro"] || null,
        estado: r["estado"] || null,
        cidade: r["municipio"] || null,
        cep: r["cep"] || null,
        produto_servico: r["atividades_principal"] || null,
        tipo_contato: "lead",
        status_funil: "novo",
        codigo_pais: "+55",
        pais: "Brasil",
      }));

      setCsvPreviewData(mapped);
      setIsImportOpen(false);
      setIsCsvPreviewOpen(true);
    };
    reader.readAsText(file, "UTF-8");
    e.target.value = "";
  };

  const handleCsvImport = async () => {
    setIsImportingCsv(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Não autenticado");
      const rows = csvPreviewData.map(r => ({ ...r, user_id: session.user.id }));
      const batchSize = 500;
      for (let i = 0; i < rows.length; i += batchSize) {
        const { error } = await supabase.from("contatos" as any).insert(rows.slice(i, i + batchSize) as any);
        if (error) throw error;
      }
      queryClient.invalidateQueries({ queryKey: ["contatos"] });
      toast({ title: `${csvPreviewData.length} contatos importados com sucesso!` });
      setIsCsvPreviewOpen(false);
      setCsvPreviewData([]);
    } catch (err: any) {
      toast({ title: "Erro ao importar", description: err.message, variant: "destructive" });
    } finally {
      setIsImportingCsv(false);
    }
  };

  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("ellipsis");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("ellipsis");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <DashboardLayout>
      {view === "list" ? (
        <>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-semibold text-foreground">Contatos</h1>
            {hasContatos && (
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground whitespace-nowrap">Mostrando</span>
                  <Select value={String(itemsPerPage)} onValueChange={handleItemsPerPageChange}>
                    <SelectTrigger className="w-[72px] h-9"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Filter className="h-4 w-4" />
                      Filtrar
                      {(filterTipo || filterStatus) && (
                        <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">
                          {[filterTipo, filterStatus].filter(Boolean).length}
                        </Badge>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80" align="end">
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-foreground">Filtrar contatos</p>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Buscar por nome, telefone ou email..." className="pl-9" value={searchQuery} onChange={(e) => handleSearchChange(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Tipo</Label>
                        <Select value={filterTipo} onValueChange={(v) => { setFilterTipo(v === "all" ? "" : v); setCurrentPage(1); }}>
                          <SelectTrigger className="h-9"><SelectValue placeholder="Todos" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todos</SelectItem>
                            <SelectItem value="lead">Lead</SelectItem>
                            <SelectItem value="cliente">Cliente</SelectItem>
                            <SelectItem value="parceiro">Parceiro</SelectItem>
                            <SelectItem value="fornecedor">Fornecedor</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Status</Label>
                        <Select value={filterStatus} onValueChange={(v) => { setFilterStatus(v === "all" ? "" : v); setCurrentPage(1); }}>
                          <SelectTrigger className="h-9"><SelectValue placeholder="Todos" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todos</SelectItem>
                            <SelectItem value="novo">Novo</SelectItem>
                            <SelectItem value="em_atendimento">Em atendimento</SelectItem>
                            <SelectItem value="proposta_enviada">Proposta enviada</SelectItem>
                            <SelectItem value="negociacao">Negociação</SelectItem>
                            <SelectItem value="cliente">Cliente</SelectItem>
                            <SelectItem value="perdido">Perdido</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                <ToggleGroup type="single" value={viewMode} onValueChange={(v) => v && setViewMode(v as "lista" | "kanban")} className="border border-border rounded-md">
                  <ToggleGroupItem value="lista" aria-label="Visualização em lista" className="h-9 px-2.5">
                    <List className="h-4 w-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="kanban" aria-label="Visualização em kanban" className="h-9 px-2.5">
                    <Columns3 className="h-4 w-4" />
                  </ToggleGroupItem>
                </ToggleGroup>

                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="h-4 w-4" /> Exportar
                </Button>
                <Button variant="outline" size="sm" className="gap-2" onClick={() => setIsImportOpen(true)}>
                  <Upload className="h-4 w-4" /> Importar
                </Button>
                <Button size="sm" className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => { resetForm(); setView("create"); }}>
                  <Plus className="h-4 w-4" /> Criar novo
                </Button>
              </div>
            )}
          </div>

          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : !hasContatos ? (
            <Card className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-border">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                  <Contact className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-semibold text-foreground">Nenhum contato</p>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Crie o seu primeiro ou então importe do WhatsApp ou planilha
                  </p>
                </div>
                <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => { resetForm(); setView("create"); }}>
                  <Plus className="h-4 w-4" /> Criar novo
                </Button>
                <button className="text-sm text-primary hover:underline" onClick={() => setIsImportOpen(true)}>
                  Importar
                </button>
              </div>
            </Card>
          ) : viewMode === "kanban" ? (
            <ContatosKanban contatos={filteredContatos} onEdit={handleEdit} />
          ) : (
            <Card className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Etiquetas</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedContatos.map((contato: any) => {
                    const status = STATUS_LABELS[contato.status_funil];
                    return (
                      <TableRow key={contato.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            {contato.profile_picture_url ? (
                              <>
                                <img src={contato.profile_picture_url} alt={contato.nome} className="w-8 h-8 rounded-full object-cover shrink-0" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden'); }} />
                                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0 hidden">
                                  <User className="h-4 w-4 text-muted-foreground" />
                                </div>
                              </>
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                                <User className="h-4 w-4 text-muted-foreground" />
                              </div>
                            )}
                            {contato.nome}
                          </div>
                        </TableCell>
                        <TableCell>{contato.email || "—"}</TableCell>
                        <TableCell>
                          {contato.telefone ? formatPhoneDisplay(`${(contato.codigo_pais || "+55").replace("+", "")}${contato.telefone}`) : "—"}
                        </TableCell>
                        <TableCell>
                          {contato.tipo_contato ? (
                            <Badge variant="outline" className="text-xs">{TIPO_LABELS[contato.tipo_contato] || contato.tipo_contato}</Badge>
                          ) : "—"}
                        </TableCell>
                        <TableCell>
                          {contato.tipo_contato !== "parceiro" && status ? (
                            <Badge className={`text-xs border-0 ${status.className}`}>{status.label}</Badge>
                          ) : "—"}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1 flex-wrap">
                            {contato.etiquetas?.map((tag: string) => (
                              <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEdit(contato)}>
                                <Pencil className="h-4 w-4 mr-2" /> Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive" onClick={() => setDeleteId(contato.id)}>
                                <Trash2 className="h-4 w-4 mr-2" /> Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {filteredContatos.length > 0 && (
                <div className="flex items-center justify-between border-t border-border px-4 py-3">
                  <p className="text-sm text-muted-foreground">
                    {filteredContatos.length} contato{filteredContatos.length !== 1 ? "s" : ""}
                    {searchQuery && ` encontrado${filteredContatos.length !== 1 ? "s" : ""}`}
                  </p>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" className="gap-1" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>
                      <ChevronLeft className="h-4 w-4" /> Anterior
                    </Button>
                    {getPageNumbers().map((page, idx) =>
                      page === "ellipsis" ? (
                        <span key={`e-${idx}`} className="px-2 text-muted-foreground text-sm">…</span>
                      ) : (
                        <Button key={page} variant={currentPage === page ? "default" : "ghost"} size="sm" className={currentPage === page ? "bg-primary hover:bg-primary/90 text-primary-foreground min-w-[36px]" : "min-w-[36px]"} onClick={() => setCurrentPage(page)}>
                          {String(page).padStart(2, "0")}
                        </Button>
                      )
                    )}
                    <Button variant="ghost" size="sm" className="gap-1" disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}>
                      Próximo <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          )}

          {/* Hidden CSV input */}
          <input type="file" accept=".csv" ref={csvInputRef} className="hidden" onChange={handleCsvFileSelected} />

          {/* Import dialog */}
          <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader><DialogTitle>Importar contatos</DialogTitle></DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <button className="flex flex-col items-center gap-3 p-6 rounded-lg border border-border hover:border-primary hover:bg-muted/50 transition-colors">
                  <WhatsAppIcon className="h-10 w-10 text-green-500" />
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">WhatsApp</p>
                    <p className="text-xs text-muted-foreground">Importe seus contatos do WhatsApp</p>
                  </div>
                </button>
                <button
                  className="flex flex-col items-center gap-3 p-6 rounded-lg border border-border hover:border-primary hover:bg-muted/50 transition-colors"
                  onClick={() => csvInputRef.current?.click()}
                >
                  <FileText className="h-10 w-10 text-muted-foreground" />
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">Arquivo CSV</p>
                    <p className="text-xs text-muted-foreground">Importe a partir de uma planilha</p>
                  </div>
                </button>
              </div>
            </DialogContent>
          </Dialog>

          {/* CSV Preview dialog */}
          <Dialog open={isCsvPreviewOpen} onOpenChange={(open) => { if (!open) { setIsCsvPreviewOpen(false); setCsvPreviewData([]); } }}>
            <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col">
              <DialogHeader>
                <DialogTitle>Prévia da importação — {csvPreviewData.length} contato{csvPreviewData.length !== 1 ? "s" : ""}</DialogTitle>
              </DialogHeader>
              <ScrollArea className="flex-1 max-h-[50vh] border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Nome</TableHead>
                      <TableHead className="text-xs">Telefone</TableHead>
                      <TableHead className="text-xs">Email</TableHead>
                      <TableHead className="text-xs">CNPJ</TableHead>
                      <TableHead className="text-xs">Cidade/UF</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {csvPreviewData.map((row, i) => (
                      <TableRow key={i}>
                        <TableCell className="text-xs font-medium">{row.nome}</TableCell>
                        <TableCell className="text-xs">{row.telefone || "—"}</TableCell>
                        <TableCell className="text-xs">{row.email || "—"}</TableCell>
                        <TableCell className="text-xs">{row.cpf_cnpj || "—"}</TableCell>
                        <TableCell className="text-xs">{[row.cidade, row.estado].filter(Boolean).join("/") || "—"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
              <div className="flex items-center justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => { setIsCsvPreviewOpen(false); setCsvPreviewData([]); }}>
                  Cancelar
                </Button>
                <Button
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={isImportingCsv || csvPreviewData.length === 0}
                  onClick={handleCsvImport}
                >
                  {isImportingCsv && <Loader2 className="h-4 w-4 animate-spin mr-1" />}
                  Importar {csvPreviewData.length} contato{csvPreviewData.length !== 1 ? "s" : ""}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Delete confirmation */}
          <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir contato</AlertDialogTitle>
                <AlertDialogDescription>Tem certeza que deseja excluir este contato? Esta ação não pode ser desfeita.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => deleteId && deleteMutation.mutate(deleteId)}>
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      ) : (
        <>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <button className="hover:text-foreground transition-colors" onClick={() => { resetForm(); setView("list"); }}>
              Contatos
            </button>
            <span>/</span>
            <span className="text-foreground font-medium">
              {editingContatoId ? "Editar contato" : "Criar contato"}
            </span>
          </div>

          <Card className="p-6 space-y-6">
            {/* Avatar */}
            <div className="flex justify-center">
              <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                {editingProfilePictureUrl ? (
                  <img
                    src={editingProfilePictureUrl}
                    alt={nome}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <User className={`h-10 w-10 text-muted-foreground ${editingProfilePictureUrl ? 'hidden' : ''}`} />
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="basico" className="w-full">
              <TabsList className="w-full grid grid-cols-5">
                <TabsTrigger value="basico">Básico</TabsTrigger>
                <TabsTrigger value="classificacao">Classificação</TabsTrigger>
                <TabsTrigger value="comercial">Comercial</TabsTrigger>
                <TabsTrigger value="endereco">Endereço</TabsTrigger>
                <TabsTrigger value="documentos">Documentos</TabsTrigger>
              </TabsList>

              <TabsContent value="basico" className="mt-6">
                <ContatoFormBasico
                  nome={nome} setNome={setNome}
                  email={email} setEmail={setEmail}
                  telefone={telefone} setTelefone={setTelefone}
                  codigoPais={codigoPais} setCodigoPais={setCodigoPais}
                  telefoneSecundario={telefoneSecundario} setTelefoneSecundario={setTelefoneSecundario}
                  dataNascimento={dataNascimento} setDataNascimento={setDataNascimento}
                  cpfCnpj={cpfCnpj} setCpfCnpj={setCpfCnpj}
                  empresa={empresa} setEmpresa={setEmpresa}
                  cargo={cargo} setCargo={setCargo}
                />
              </TabsContent>

              <TabsContent value="classificacao" className="mt-6">
                <ContatoFormClassificacao
                  tipoContato={tipoContato} setTipoContato={setTipoContato}
                  origemContato={origemContato} setOrigemContato={setOrigemContato}
                  statusFunil={statusFunil} setStatusFunil={setStatusFunil}
                  grupo={grupo} setGrupo={setGrupo}
                  etiquetas={etiquetas} setEtiquetas={setEtiquetas}
                  produtoServico={produtoServico} setProdutoServico={setProdutoServico}
                />
              </TabsContent>

              <TabsContent value="comercial" className="mt-6">
                <ContatoFormComercial
                  ultimaCompra={ultimaCompra} setUltimaCompra={setUltimaCompra}
                  totalGasto={totalGasto} setTotalGasto={setTotalGasto}
                  numeroPedidos={numeroPedidos} setNumeroPedidos={setNumeroPedidos}
                  dataRenovacao={dataRenovacao} setDataRenovacao={setDataRenovacao}
                  proximoFollowup={proximoFollowup} setProximoFollowup={setProximoFollowup}
                  canalPreferido={canalPreferido} setCanalPreferido={setCanalPreferido}
                />
              </TabsContent>

              <TabsContent value="endereco" className="mt-6">
                <ContatoFormEndereco
                  cep={cep} setCep={setCep}
                  rua={rua} setRua={setRua}
                  numeroEndereco={numeroEndereco} setNumeroEndereco={setNumeroEndereco}
                  complemento={complemento} setComplemento={setComplemento}
                  bairro={bairro} setBairro={setBairro}
                  cidade={cidade} setCidade={setCidade}
                  estado={estado} setEstado={setEstado}
                  pais={pais} setPais={setPais}
                />
              </TabsContent>

              <TabsContent value="documentos" className="mt-6">
                <ContatoFormDocumentos
                  contatoId={editingContatoId}
                  documentosAtivados={documentosAtivados}
                  setDocumentosAtivados={setDocumentosAtivados}
                />
              </TabsContent>
            </Tabs>

            {/* Observações - always visible */}
            <div className="space-y-2 pt-4 border-t border-border">
              <Label htmlFor="observacoes">Observações internas</Label>
              <Textarea
                id="observacoes"
                placeholder="Anotações sobre este contato..."
                rows={3}
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
              <Button variant="outline" className="gap-2" onClick={() => { resetForm(); setView("list"); }}>
                <ArrowLeft className="h-4 w-4" /> Voltar
              </Button>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" disabled={!nome || isSaving} onClick={handleSave}>
                {editingContatoId ? "Salvar alterações" : "Salvar contato"}
              </Button>
            </div>
          </Card>
        </>
      )}
    </DashboardLayout>
  );
};

export default ContatosPage;
