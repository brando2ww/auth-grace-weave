import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Info, RefreshCw, Download } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const receitaDespesaData = [
  { month: "Out", receita: 480000, despesas: 390000 },
  { month: "Nov", receita: 620000, despesas: 450000 },
  { month: "Dez", receita: 540000, despesas: 420000 },
  { month: "Jan", receita: 710000, despesas: 510000 },
  { month: "Fev", receita: 580000, despesas: 440000 },
  { month: "Mar", receita: 850000, despesas: 520000 },
];

const lucroLiquidoData = [
  { month: "Out", valor: 90000 },
  { month: "Nov", valor: 170000 },
  { month: "Dez", valor: 120000 },
  { month: "Jan", valor: 200000 },
  { month: "Fev", valor: 140000 },
  { month: "Mar", valor: 330000 },
];

const margemTipoData = [
  { tipo: "Carros", margem: 9.2 },
  { tipo: "Motos", margem: 12.5 },
  { tipo: "Caminhões", margem: 6.8 },
  { tipo: "Utilitários", margem: 7.4 },
];

const receitaConfig: ChartConfig = {
  receita: { label: "Receita", color: "hsl(142 71% 45%)" },
  despesas: { label: "Despesas", color: "hsl(0 84% 60%)" },
};

const lucroConfig: ChartConfig = {
  valor: { label: "Lucro Líquido", color: "hsl(142 71% 45%)" },
};

const margemConfig: ChartConfig = {
  margem: { label: "Margem %", color: "hsl(var(--primary))" },
};

const charts = [
  { label: "Receita vs Despesas", total: "", type: "stacked" as const },
  { label: "Lucro Líquido mensal", total: "R$ 128k", type: "lucro" as const },
  { label: "Margem por tipo de veículo", total: "8,5%", type: "margem" as const },
];

const DashboardFinanceiroCharts = () => (
  <div className="grid grid-cols-3 gap-4">
    {charts.map((chart, idx) => (
      <Card key={idx} className="overflow-hidden">
        <CardHeader className="pb-0 px-6 pt-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground">{chart.label}</span>
            <div className="flex items-center gap-2">
              {chart.total && <span className="text-xl font-semibold text-primary">{chart.total}</span>}
              <Info className="h-4 w-4 text-muted-foreground/60" />
            </div>
          </div>
          <div className="flex items-center justify-end gap-2">
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <RefreshCw className="h-4 w-4" />
            </button>
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <Download className="h-4 w-4" />
            </button>
          </div>
        </CardHeader>
        <CardContent className="px-2 pb-4 pt-0">
          {chart.type === "stacked" && (
            <ChartContainer config={receitaConfig} className="h-64 w-full aspect-auto">
              <BarChart data={receitaDespesaData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="receita" stackId="a" fill="var(--color-receita)" radius={[0, 0, 0, 0]} />
                <Bar dataKey="despesas" stackId="a" fill="var(--color-despesas)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          )}
          {chart.type === "lucro" && (
            <ChartContainer config={lucroConfig} className="h-64 w-full aspect-auto">
              <AreaChart data={lucroLiquidoData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="valor" stroke="var(--color-valor)" fill="var(--color-valor)" fillOpacity={0.15} strokeWidth={2} />
              </AreaChart>
            </ChartContainer>
          )}
          {chart.type === "margem" && (
            <ChartContainer config={margemConfig} className="h-64 w-full aspect-auto">
              <BarChart data={margemTipoData} layout="vertical" margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                <XAxis type="number" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                <YAxis type="category" dataKey="tipo" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} width={80} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="margem" fill="var(--color-margem)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>
    ))}
  </div>
);

export default DashboardFinanceiroCharts;
