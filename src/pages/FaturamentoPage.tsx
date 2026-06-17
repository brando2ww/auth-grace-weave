import DashboardLayout from "@/components/layouts/DashboardLayout";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CreditCard,
  Zap,
  Download,
  AlertTriangle,
  FileText,
} from "lucide-react";

const faturas = [
  { data: "01/03/2026", descricao: "Plano Profissional - Mensal", status: "PAGO", valor: "R$ 197,00" },
  { data: "01/02/2026", descricao: "Plano Profissional - Mensal", status: "PAGO", valor: "R$ 197,00" },
  { data: "01/01/2026", descricao: "Plano Profissional - Mensal", status: "EXPIRED", valor: "R$ 197,00" },
  { data: "01/12/2025", descricao: "Plano Profissional - Mensal", status: "CANCELADO", valor: "R$ 197,00" },
];

const statusBadge = (status: string) => {
  switch (status) {
    case "PAGO":
      return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/10">PAGO</Badge>;
    case "EXPIRED":
      return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 hover:bg-yellow-500/10">EXPIRED</Badge>;
    case "CANCELADO":
      return <Badge className="bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/10">CANCELADO</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const FaturamentoPage = () => {
  return (
    <DashboardLayout>
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Faturamento</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <CreditCard className="h-6 w-6 text-cyan-500" />
          <h1 className="text-2xl font-bold text-foreground">Faturamento</h1>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Gerencie sua assinatura, adicionais e histórico de faturas
        </p>
      </div>

      {/* Assinatura Atual */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold">Assinatura Atual</CardTitle>
          <Badge variant="outline" className="text-cyan-500 border-cyan-500/30">Ativo</Badge>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Plano</p>
              <p className="text-lg font-semibold text-foreground">Profissional</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Valor total</p>
              <p className="text-2xl font-bold text-cyan-500">R$ 197,00<span className="text-sm font-normal text-muted-foreground">/mês</span></p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Próxima cobrança</p>
              <p className="font-medium text-foreground">01/04/2026</p>
            </div>
            <div>
              <p className="text-muted-foreground">Método de pagamento</p>
              <p className="font-medium text-foreground">Cartão •••• 4242</p>
            </div>
            <div>
              <p className="text-muted-foreground">Detalhamento</p>
              <p className="font-medium text-foreground">5 atendentes • 3 canais</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button variant="outline" className="border-cyan-500/30 text-cyan-500 hover:bg-cyan-500/10">
              Trocar Plano
            </Button>
            <Button variant="outline" className="border-cyan-500/30 text-cyan-500 hover:bg-cyan-500/10">
              Gerenciar Cartões
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Adicionais */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-cyan-500" />
            <CardTitle className="text-lg font-semibold">Adicionais</CardTitle>
          </div>
          <Button variant="outline" size="sm" className="border-cyan-500/30 text-cyan-500 hover:bg-cyan-500/10">
            Gerenciar Adicionais
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Zap className="h-10 w-10 text-muted-foreground/40 mb-3" />
            <p className="text-sm text-muted-foreground">Nenhum adicional contratado</p>
            <p className="text-xs text-muted-foreground mt-1">
              Adicione mais atendentes, canais ou recursos ao seu plano
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Histórico de Faturas */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold">Histórico de Faturas</CardTitle>
          <Button variant="outline" size="sm" className="border-cyan-500/30 text-cyan-500 hover:bg-cyan-500/10">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="uppercase text-xs">Data</TableHead>
                <TableHead className="uppercase text-xs">Descrição</TableHead>
                <TableHead className="uppercase text-xs">Status</TableHead>
                <TableHead className="uppercase text-xs">Valor</TableHead>
                <TableHead className="uppercase text-xs text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {faturas.map((f, i) => (
                <TableRow key={i}>
                  <TableCell className="text-sm">{f.data}</TableCell>
                  <TableCell className="text-sm">{f.descricao}</TableCell>
                  <TableCell>{statusBadge(f.status)}</TableCell>
                  <TableCell className="text-sm font-medium">{f.valor}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <FileText className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Cancelar Assinatura */}
      <Card className="border-destructive/30">
        <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-foreground">Cancelar Assinatura</p>
              <p className="text-sm text-muted-foreground">
                Ao cancelar, você perderá acesso a todos os recursos do plano ao final do período vigente.
              </p>
            </div>
          </div>
          <Button variant="destructive" className="shrink-0">
            Cancelar Assinatura
          </Button>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default FaturamentoPage;
