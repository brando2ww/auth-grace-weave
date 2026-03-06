import React, { useState } from "react";
import { Search, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

const tabs = [
  { key: "todos", label: "Todos os Veículos" },
  { key: "disponiveis", label: "Disponíveis" },
  { key: "reservados", label: "Reservados" },
  { key: "vendidos", label: "Vendidos" },
];

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

      {/* Underline Tabs */}
      <div className="flex items-center gap-6 border-b border-border mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setActiveTab(tab.key); setCurrentPage(1); }}
            className={`pb-3 text-sm font-medium transition-colors relative ${
              activeTab === tab.key
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
            {activeTab === tab.key && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Filters row with labels */}
      <div className="flex items-end gap-4 mb-6 flex-wrap">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">Modelo / Placa</label>
          <Input
            placeholder="Buscar..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-[200px]"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">Marca</label>
          <Select value={categoria} onValueChange={(v) => { setCategoria(v); setCurrentPage(1); }}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Todas as Marcas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as Marcas</SelectItem>
              {uniqueBrands.map((b) => (
                <SelectItem key={b} value={b}>{b}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <Button variant="outline" size="sm" onClick={() => {}}>
            <Search className="h-4 w-4" />
            Buscar
          </Button>
          <Button variant="default" size="sm" onClick={() => {}}>
            <Download className="h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Modelo</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Marca</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Ano</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Placa</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Preço</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
              <th className="text-right px-4 py-3 font-medium text-muted-foreground">Ações</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center text-muted-foreground py-10">
                  Nenhum veículo encontrado.
                </td>
              </tr>
            ) : (
              paginated.map((v) => {
                const st = statusConfig[v.status];
                return (
                  <tr key={v.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3.5 font-medium text-foreground">{v.modelo}</td>
                    <td className="px-4 py-3.5 text-muted-foreground">{v.marca}</td>
                    <td className="px-4 py-3.5 text-muted-foreground">{v.ano}</td>
                    <td className="px-4 py-3.5 text-muted-foreground font-mono text-xs">{v.placa}</td>
                    <td className="px-4 py-3.5 text-foreground font-medium">{formatCurrency(v.preco)}</td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${st.className}`}>
                        {st.label}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button variant="outline" size="sm" className="h-7 text-xs px-2.5">
                          Detalhes
                        </Button>
                        <Button variant="outline" size="sm" className="h-7 text-xs px-2.5">
                          Editar
                        </Button>
                        <Button variant="outline" size="sm" className="h-7 text-xs px-2.5 text-destructive hover:text-destructive">
                          Remover
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-1 py-4 border-t border-border">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="w-8 h-8 flex items-center justify-center rounded border border-border text-muted-foreground hover:bg-muted/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 flex items-center justify-center rounded text-sm font-medium transition-colors ${
                page === currentPage
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-muted-foreground hover:bg-muted/50"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="w-8 h-8 flex items-center justify-center rounded border border-border text-muted-foreground hover:bg-muted/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
