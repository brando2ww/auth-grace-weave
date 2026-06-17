import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { CalendarDays, RefreshCw } from "lucide-react";

interface DashboardFiltersProps {
  showEtiquetas?: boolean;
}

const DashboardFilters = ({ showEtiquetas = true }: DashboardFiltersProps) => (
  <div className="flex items-end gap-6 flex-wrap">
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-muted-foreground">Departamentos</label>
      <Select>
        <SelectTrigger className="w-48 h-9"><SelectValue placeholder="Selecione" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
        </SelectContent>
      </Select>
    </div>
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-muted-foreground">Atendentes</label>
      <Select>
        <SelectTrigger className="w-48 h-9"><SelectValue placeholder="Selecione" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
        </SelectContent>
      </Select>
    </div>
    {showEtiquetas && (
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted-foreground">Etiquetas</label>
        <Select>
          <SelectTrigger className="w-48 h-9"><SelectValue placeholder="Selecione" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
          </SelectContent>
        </Select>
      </div>
    )}
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-muted-foreground">Período</label>
      <div className="relative">
        <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          readOnly
          value="24/02/2026 – 02/03/2026"
          className="flex h-9 w-56 rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        />
      </div>
    </div>
    <button className="flex items-center gap-1.5 text-sm text-[#1c72e3] hover:text-[#1c72e3]/80 hover:underline whitespace-nowrap pb-2">
      <RefreshCw className="h-3.5 w-3.5" />
      Redefinir período
    </button>
  </div>
);

export default DashboardFilters;
