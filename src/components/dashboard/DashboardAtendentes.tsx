import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Search, Download } from "lucide-react";
import DashboardFilters from "./DashboardFilters";

const DashboardAtendentes = () => (
  <div className="space-y-6">
    <DashboardFilters showEtiquetas={false} />

    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">Conversas por atendente</h3>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Pesquisar..." className="pl-8 h-9 w-52" />
          </div>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" />
            Exportar
          </Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>NOME</TableHead>
            <TableHead>TIPO</TableHead>
            <TableHead>CONVERSAS</TableHead>
            <TableHead>ABERTAS</TableHead>
            <TableHead>FINALIZADAS</TableHead>
            <TableHead>TEMPO MÉDIO PRIMEIRA</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
              Nenhum dado encontrado
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Card>
  </div>
);

export default DashboardAtendentes;
