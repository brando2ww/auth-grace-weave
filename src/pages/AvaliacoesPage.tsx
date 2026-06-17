import { useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { FileDown, ChevronLeft, ChevronRight } from "lucide-react";

const columns = [
  "chatId",
  "Avaliação",
  "Atendente",
  "Origem Atendimento",
  "Tipo Avaliação",
  "Dt. inclusão",
];

const AvaliacoesPage = () => {
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-semibold text-foreground">Avaliações</h1>

      <Card className="p-6 space-y-6">
        {/* Action bar */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2 text-cyan-600 border-cyan-600 hover:bg-cyan-50"
          >
            <FileDown className="h-4 w-4" />
            Exportar
          </Button>
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
                <TableCell
                  colSpan={columns.length + 1}
                  className="text-center text-sm text-muted-foreground py-12"
                >
                  Nenhuma linha
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-end gap-4 text-sm text-muted-foreground">
          <span>0-0 de 0</span>
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
    </DashboardLayout>
  );
};

export default AvaliacoesPage;
