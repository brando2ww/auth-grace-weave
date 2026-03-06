import React, { useState } from "react";
import { Search, Download, View, Edit, TrashCan } from "@carbon/icons-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type VehicleStatus = "disponivel" | "reservado" | "vendido";

interface Vehicle {
  id: string;
  modelo: string;
  marca: string;
  ano: number;
  placa: string;
  preco: number;
  status: VehicleStatus;
}

const mockVehicles: Vehicle[] = [
  { id: "1", modelo: "Civic Touring", marca: "Honda", ano: 2024, placa: "ABC-1D23", preco: 165000, status: "disponivel" },
  { id: "2", modelo: "Corolla XEi", marca: "Toyota", ano: 2023, placa: "DEF-4G56", preco: 142000, status: "disponivel" },
  { id: "3", modelo: "HB20 Sense", marca: "Hyundai", ano: 2024, placa: "GHI-7H89", preco: 82000, status: "reservado" },
  { id: "4", modelo: "Onix LTZ", marca: "Chevrolet", ano: 2023, placa: "JKL-0I12", preco: 89000, status: "vendido" },
  { id: "5", modelo: "Compass Limited", marca: "Jeep", ano: 2024, placa: "MNO-3J45", preco: 198000, status: "disponivel" },
  { id: "6", modelo: "T-Cross Highline", marca: "Volkswagen", ano: 2023, placa: "PQR-6K78", preco: 145000, status: "reservado" },
  { id: "7", modelo: "Tracker Premier", marca: "Chevrolet", ano: 2024, placa: "STU-9L01", preco: 155000, status: "disponivel" },
  { id: "8", modelo: "Creta Ultimate", marca: "Hyundai", ano: 2024, placa: "VWX-2M34", preco: 168000, status: "vendido" },
];

const statusConfig: Record<VehicleStatus, { label: string; className: string }> = {
  disponivel: { label: "Disponível", className: "bg-green-100 text-green-700 border-green-200" },
  reservado: { label: "Reservado", className: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  vendido: { label: "Vendido", className: "bg-neutral-100 text-neutral-500 border-neutral-200" },
};

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function Estoque() {
  const [activeTab, setActiveTab] = useState("todos");
  const [search, setSearch] = useState("");
  const [categoria, setCategoria] = useState("todas");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 6;

  const filtered = mockVehicles.filter((v) => {
    const matchTab =
      activeTab === "todos" ||
      (activeTab === "disponiveis" && v.status === "disponivel") ||
      (activeTab === "reservados" && v.status === "reservado") ||
      (activeTab === "vendidos" && v.status === "vendido");

    const matchSearch =
      !search ||
      v.modelo.toLowerCase().includes(search.toLowerCase()) ||
      v.placa.toLowerCase().includes(search.toLowerCase());

    const matchCategoria =
      categoria === "todas" || v.marca.toLowerCase() === categoria.toLowerCase();

    return matchTab && matchSearch && matchCategoria;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const uniqueBrands = [...new Set(mockVehicles.map((v) => v.marca))];

  return (
    <div className="flex-1 p-8 overflow-y-auto bg-background">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Gestão de Estoque</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Gerencie o estoque de veículos da sua garagem.
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); setCurrentPage(1); }} className="mb-6">
        <TabsList>
          <TabsTrigger value="todos">Todos os Veículos</TabsTrigger>
          <TabsTrigger value="disponiveis">Disponíveis</TabsTrigger>
          <TabsTrigger value="reservados">Reservados</TabsTrigger>
          <TabsTrigger value="vendidos">Vendidos</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-[320px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por modelo ou placa..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="pl-9"
          />
        </div>

        <Select value={categoria} onValueChange={(v) => { setCategoria(v); setCurrentPage(1); }}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas as Marcas</SelectItem>
            {uniqueBrands.map((b) => (
              <SelectItem key={b} value={b}>{b}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant="default" size="sm" onClick={() => {}}>
          <Search size={14} />
          Buscar
        </Button>

        <Button variant="outline" size="sm" onClick={() => {}}>
          <Download size={14} />
          Exportar
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Modelo</TableHead>
              <TableHead>Marca</TableHead>
              <TableHead>Ano</TableHead>
              <TableHead>Placa</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  Nenhum veículo encontrado.
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((v) => {
                const st = statusConfig[v.status];
                return (
                  <TableRow key={v.id}>
                    <TableCell className="font-medium text-foreground">{v.modelo}</TableCell>
                    <TableCell className="text-muted-foreground">{v.marca}</TableCell>
                    <TableCell className="text-muted-foreground">{v.ano}</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">{v.placa}</TableCell>
                    <TableCell className="text-foreground font-medium">{formatCurrency(v.preco)}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${st.className}`}>
                        {st.label}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="outline" size="icon" className="h-8 w-8" title="Detalhes">
                          <View size={14} />
                        </Button>
                        <Button variant="outline" size="icon" className="h-8 w-8" title="Editar">
                          <Edit size={14} />
                        </Button>
                        <Button variant="outline" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" title="Remover">
                          <TrashCan size={14} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <span className="text-sm text-muted-foreground">
            Mostrando {paginated.length} de {filtered.length} veículos
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Anterior
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                size="sm"
                className="w-8 h-8 p-0"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Próximo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
