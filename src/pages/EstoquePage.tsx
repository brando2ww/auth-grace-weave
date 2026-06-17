import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Search, Plus, Download, MoreHorizontal, Fuel, Users, Settings2, Calendar, Pencil, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { type Veiculo, veiculosMock } from "@/data/veiculos";

const statusConfig = {
  disponivel: { label: "Disponível", className: "bg-emerald-500/15 text-emerald-600 border-emerald-500/20" },
  vendido: { label: "Vendido", className: "bg-red-500/15 text-red-600 border-red-500/20" },
  reservado: { label: "Reservado", className: "bg-yellow-500/15 text-yellow-600 border-yellow-500/20" },
};

const formatCurrency = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 });

const EstoquePage = () => {
  const navigate = useNavigate();
  const [excluidos, setExcluidos] = useState<string[]>([]);
  const [veiculos, setVeiculos] = useState<Veiculo[]>(() => {
    localStorage.removeItem("veiculos_excluidos");
    return [...veiculosMock];
  });
  const [veiculoParaExcluir, setVeiculoParaExcluir] = useState<Veiculo | null>(null);
  const [busca, setBusca] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [filtroStatus, setFiltroStatus] = useState("todos");

  const handleExcluir = (v: Veiculo) => {
    const novosExcluidos = [...excluidos, v.id];
    setExcluidos(novosExcluidos);
    localStorage.setItem("veiculos_excluidos", JSON.stringify(novosExcluidos));
    setVeiculos((prev) => prev.filter((x) => x.id !== v.id));
    setVeiculoParaExcluir(null);
    toast.success(`"${v.nome}" excluído com sucesso`);
  };

  const filtrados = veiculos.filter((v) => {
    const matchBusca =
      v.nome.toLowerCase().includes(busca.toLowerCase()) ||
      v.placa.toLowerCase().includes(busca.toLowerCase());
    const matchTipo = filtroTipo === "todos" || v.tipo === filtroTipo;
    const matchStatus = filtroStatus === "todos" || v.status === filtroStatus;
    return matchBusca && matchTipo && matchStatus;
  });

  return (
    <DashboardLayout>
      {/* Filtros */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Modelo, marca ou placa..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filtroTipo} onValueChange={setFiltroTipo}>
          <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os tipos</SelectItem>
            <SelectItem value="Carros">Carros</SelectItem>
            <SelectItem value="Utilitários">Utilitários</SelectItem>
            <SelectItem value="Camionetes">Camionetes</SelectItem>
            <SelectItem value="Motos">Motos</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filtroStatus} onValueChange={setFiltroStatus}>
          <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos status</SelectItem>
            <SelectItem value="disponivel">Disponível</SelectItem>
            <SelectItem value="vendido">Vendido</SelectItem>
            <SelectItem value="reservado">Reservado</SelectItem>
          </SelectContent>
        </Select>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" /> Exportar
          </Button>
          <Button className="bg-[#1c72e3] hover:bg-[#1c72e3]/90 text-white gap-2" onClick={() => navigate("/estoque/entrada")}>
            <Plus className="h-4 w-4" /> Entrada de Veículo
          </Button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtrados.map((v) => {
          const sc = statusConfig[v.status];
          return (
            <div key={v.id} className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col">
              {/* Imagem placeholder */}
              <div className="relative h-44 bg-muted flex items-center justify-center overflow-hidden">
                {v.imagem ? (
                  <img src={v.imagem} alt={v.nome} className="w-full h-full object-cover" />
                ) : (
                  <Settings2 className="h-12 w-12 text-muted-foreground/30" />
                )}
                <Badge className={`absolute top-3 left-3 ${sc.className} text-[11px]`}>
                  {sc.label}
                </Badge>
              </div>

              {/* Info */}
              <div className="p-4 flex flex-col gap-2 flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground leading-tight">{v.nome}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {v.tipo} • {v.ano} • {v.placa}
                    </p>
                  </div>
                  <span className="text-base font-bold text-[#1c72e3] whitespace-nowrap">
                    {formatCurrency(v.preco)}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                  <span className="flex items-center gap-1">
                    <Settings2 className="h-3.5 w-3.5" /> {v.cambio}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" /> {v.lugares} lugares
                  </span>
                  <span className="flex items-center gap-1">
                    <Fuel className="h-3.5 w-3.5" /> {v.combustivel}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  {v.km.toLocaleString("pt-BR")} km
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-auto pt-3">
                  <Button size="sm" className="flex-1 bg-[#1c72e3] hover:bg-[#1c72e3]/90 text-white text-xs">
                    Selecionar Veículo
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="px-2">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => navigate(`/estoque/entrada/${v.id}`)} className="gap-2">
                        <Pencil className="h-4 w-4" /> Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setVeiculoParaExcluir(v)} className="gap-2 text-destructive focus:text-destructive">
                        <Trash2 className="h-4 w-4" /> Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          );
        })}

        {/* Card adicionar */}
        <button className="border-2 border-dashed border-[#1c72e3]/40 rounded-2xl p-5 flex flex-col items-center justify-center gap-2 text-[#1c72e3] hover:bg-[#1c72e3]/5 transition-colors min-h-[320px] cursor-pointer">
          <Plus className="h-8 w-8" />
          <span className="text-sm font-medium">Adicionar veículo</span>
        </button>
      </div>

      <AlertDialog open={!!veiculoParaExcluir} onOpenChange={(open) => !open && setVeiculoParaExcluir(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir veículo?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir <strong>{veiculoParaExcluir?.nome}</strong>? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => veiculoParaExcluir && handleExcluir(veiculoParaExcluir)}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default EstoquePage;
