import React, { useState } from "react";
import { Search, Download, Fuel, Users, Settings2, MoreHorizontal, Plus } from "lucide-react";
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
type VehicleType = "Agrícolas" | "Antigos" | "Bicicleta Elétrica" | "Camionetes" | "Carros" | "Empilhadeira" | "Kart" | "Motos" | "Náuticos" | "Off-Roads" | "Outros" | "Patinete Elétrico" | "Quadriciclos" | "Reboques" | "Scooter Elétrico" | "Trailer" | "Triciclos" | "Utilitários" | "Van";

const vehicleTypes: VehicleType[] = [
  "Agrícolas", "Antigos", "Bicicleta Elétrica", "Camionetes", "Carros",
  "Empilhadeira", "Kart", "Motos", "Náuticos", "Off-Roads", "Outros",
  "Patinete Elétrico", "Quadriciclos", "Reboques", "Scooter Elétrico",
  "Trailer", "Triciclos", "Utilitários", "Van",
];

interface Vehicle {
  id: string;
  modelo: string;
  marca: string;
  ano: number;
  placa: string;
  preco: number;
  status: VehicleStatus;
  tipo: VehicleType;
  cambio: string;
  assentos: number;
  combustivel: string;
  imagem: string;
}

const mockVehicles: Vehicle[] = [
  { id: "1", modelo: "Civic Touring", marca: "Honda", ano: 2024, placa: "ABC-1D23", preco: 165000, status: "disponivel", tipo: "Carros", cambio: "Automático", assentos: 5, combustivel: "Flex", imagem: "/placeholder.svg" },
  { id: "2", modelo: "Corolla XEi", marca: "Toyota", ano: 2023, placa: "DEF-4G56", preco: 142000, status: "disponivel", tipo: "Carros", cambio: "Automático", assentos: 5, combustivel: "Flex", imagem: "/placeholder.svg" },
  { id: "3", modelo: "HB20 Sense", marca: "Hyundai", ano: 2024, placa: "GHI-7H89", preco: 82000, status: "reservado", tipo: "Carros", cambio: "Manual", assentos: 5, combustivel: "Flex", imagem: "/placeholder.svg" },
  { id: "4", modelo: "Onix LTZ", marca: "Chevrolet", ano: 2023, placa: "JKL-0I12", preco: 89000, status: "vendido", tipo: "Carros", cambio: "Automático", assentos: 5, combustivel: "Flex", imagem: "/placeholder.svg" },
  { id: "5", modelo: "Compass Limited", marca: "Jeep", ano: 2024, placa: "MNO-3J45", preco: 198000, status: "disponivel", tipo: "Utilitários", cambio: "Automático", assentos: 5, combustivel: "Diesel", imagem: "/placeholder.svg" },
  { id: "6", modelo: "T-Cross Highline", marca: "Volkswagen", ano: 2023, placa: "PQR-6K78", preco: 145000, status: "reservado", tipo: "Utilitários", cambio: "Automático", assentos: 5, combustivel: "Flex", imagem: "/placeholder.svg" },
  { id: "7", modelo: "Tracker Premier", marca: "Chevrolet", ano: 2024, placa: "STU-9L01", preco: 155000, status: "disponivel", tipo: "Utilitários", cambio: "Automático", assentos: 5, combustivel: "Flex", imagem: "/placeholder.svg" },
  { id: "8", modelo: "Creta Ultimate", marca: "Hyundai", ano: 2024, placa: "VWX-2M34", preco: 168000, status: "vendido", tipo: "Utilitários", cambio: "Automático", assentos: 5, combustivel: "Flex", imagem: "/placeholder.svg" },
  { id: "9", modelo: "Saveiro Robust", marca: "Volkswagen", ano: 2024, placa: "YZA-5N67", preco: 98000, status: "disponivel", tipo: "Camionetes", cambio: "Manual", assentos: 2, combustivel: "Flex", imagem: "/placeholder.svg" },
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
  const [search, setSearch] = useState("");
  const [tipoFilter, setTipoFilter] = useState("todos");
  const [statusFilter, setStatusFilter] = useState("disponivel");

  const filtered = mockVehicles.filter((v) => {
    const matchSearch =
      !search ||
      v.modelo.toLowerCase().includes(search.toLowerCase()) ||
      v.marca.toLowerCase().includes(search.toLowerCase()) ||
      v.placa.toLowerCase().includes(search.toLowerCase());
    const matchTipo = tipoFilter === "todos" || v.tipo === tipoFilter;
    const matchStatus = statusFilter === "todos" || v.status === statusFilter;
    return matchSearch && matchTipo && matchStatus;
  });




  return (
    <div className="flex-1 p-8 overflow-y-auto bg-background">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Gestão de Estoque</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Gerencie o estoque de veículos da sua garagem.
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-end gap-3 mb-6 flex-wrap">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">Buscar</label>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Modelo, marca ou placa..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-[220px] pl-8"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">Tipo</label>
          <Select value={tipoFilter} onValueChange={setTipoFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Todos os Tipos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os Tipos</SelectItem>
              {vehicleTypes.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">Status</label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="disponivel">Disponível</SelectItem>
              <SelectItem value="reservado">Reservado</SelectItem>
              <SelectItem value="vendido">Vendido</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
          <Button variant="default" size="sm">
            <Plus className="h-4 w-4" />
            Entrada de Veículo
          </Button>
        </div>
      </div>

      {/* Vehicle Cards Grid */}
      {filtered.length === 0 ? (
        <div className="text-center text-muted-foreground py-16">
          Nenhum veículo encontrado.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((v) => {
            const st = statusConfig[v.status];
            return (
              <div
                key={v.id}
                className="border border-border rounded-lg overflow-hidden bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Image */}
                <div className="relative h-40 bg-muted flex items-center justify-center">
                  <img
                    src={v.imagem}
                    alt={`${v.marca} ${v.modelo}`}
                    className="h-full w-full object-cover"
                  />
                  <span
                    className={`absolute top-2.5 right-2.5 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${st.className}`}
                  >
                    {st.label}
                  </span>
                </div>

                {/* Info */}
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-foreground leading-tight">
                        {v.marca} {v.modelo}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {v.tipo} · {v.ano} · {v.placa}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-primary whitespace-nowrap">
                      {formatCurrency(v.preco)}
                    </p>
                  </div>

                  {/* Specs */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Settings2 className="h-3.5 w-3.5" />
                      {v.cambio}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {v.assentos} lugares
                    </span>
                    <span className="flex items-center gap-1">
                      <Fuel className="h-3.5 w-3.5" />
                      {v.combustivel}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-1">
                    <Button variant="default" size="sm" className="flex-1 h-8 text-xs">
                      Selecionar Veículo
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8 shrink-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
