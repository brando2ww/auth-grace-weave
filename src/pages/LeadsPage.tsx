import { useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  FileText,
  FileDown,
  Upload,
  Search,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  Trash2,
} from "lucide-react";

const columns = [
  "Nome",
  "E-mail",
  "Telefone",
  "Origem",
  "chatId",
  "Dt. inclusão",
  "id",
];

const LeadsPage = () => {
  const [search, setSearch] = useState("");

  return (
    <DashboardLayout>
      {/* Page title */}
      <h1 className="text-2xl font-semibold text-foreground">Leads</h1>

      <Card className="p-6 space-y-6">
        {/* Action bar */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => {
              const link = document.createElement("a");
              link.href = "/exemplo_leads.csv";
              link.download = "exemplo_leads.csv";
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
          >
            <FileText className="h-4 w-4" />
            Exemplo
          </Button>
          <Button variant="outline" size="sm" className="gap-2 text-cyan-600 border-cyan-600 hover:bg-cyan-50">
            <FileDown className="h-4 w-4" />
            Exportar
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Upload className="h-4 w-4" />
            Importar
          </Button>
        </div>

        {/* Sub-header with search */}
        <div className="flex items-center justify-between">
          <span className="text-base font-semibold text-foreground">Leads</span>
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Procurar Conta"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Table */}
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <Checkbox />
                </TableHead>
                {columns.map((col) => (
                  <TableHead key={col} className="text-xs font-medium">
                    {col}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="text-center text-sm text-muted-foreground py-12">
                  No rows
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-end gap-4 text-sm text-muted-foreground">
          <span>0-0 of 0</span>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" disabled>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" disabled>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Bottom actions */}
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" className="gap-2 text-cyan-600 border-cyan-600 hover:bg-cyan-50">
          <UserPlus className="h-4 w-4" />
          Salvar como contato
        </Button>
        <Button variant="outline" size="sm" className="gap-2 text-destructive border-destructive hover:bg-destructive/10">
          <Trash2 className="h-4 w-4" />
          Excluir
        </Button>
      </div>
    </DashboardLayout>
  );
};

export default LeadsPage;
