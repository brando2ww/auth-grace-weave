import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Info, RefreshCw, Download } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const rankingData = [
  { vendedor: "Carlos S.", vendas: 12 },
  { vendedor: "Ana M.", vendas: 10 },
  { vendedor: "Pedro L.", vendas: 8 },
  { vendedor: "Julia R.", vendas: 6 },
  { vendedor: "Lucas F.", vendas: 4 },
];

const pipelineData = [
  { etapa: "Novo", quantidade: 45 },
  { etapa: "Qualificado", quantidade: 32 },
  { etapa: "Proposta", quantidade: 18 },
  { etapa: "Negociação", quantidade: 12 },
  { etapa: "Fechado", quantidade: 8 },
];

const comissoesData = [
  { mes: "Out", valor: 4200 },
  { mes: "Nov", valor: 5800 },
  { mes: "Dez", valor: 3900 },
  { mes: "Jan", valor: 6100 },
  { mes: "Fev", valor: 7200 },
  { mes: "Mar", valor: 5400 },
];

const rankingConfig: ChartConfig = {
  vendas: { label: "Vendas", color: "hsl(var(--primary))" },
};

const pipelineConfig: ChartConfig = {
  quantidade: { label: "Quantidade", color: "hsl(var(--accent))" },
};

const comissoesConfig: ChartConfig = {
  valor: { label: "Comissão", color: "hsl(142 71% 45%)" },
};

const charts = [
  { label: "Ranking de vendedores", total: "Top 5", type: "ranking" as const },
  { label: "Pipeline por etapa", total: "115", type: "pipeline" as const },
  { label: "Comissões acumuladas", total: "R$ 32.6k", type: "comissoes" as const },
];

const DashboardVendedorRankingCharts = () => (
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
          {chart.type === "ranking" && (
            <ChartContainer config={rankingConfig} className="h-64 w-full aspect-auto">
              <BarChart data={rankingData} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                <XAxis type="number" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="vendedor" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} width={70} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="vendas" fill="var(--color-vendas)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ChartContainer>
          )}
          {chart.type === "pipeline" && (
            <ChartContainer config={pipelineConfig} className="h-64 w-full aspect-auto">
              <BarChart data={pipelineData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="etapa" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="quantidade" fill="var(--color-quantidade)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          )}
          {chart.type === "comissoes" && (
            <ChartContainer config={comissoesConfig} className="h-64 w-full aspect-auto">
              <AreaChart data={comissoesData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="mes" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="valor" stroke="var(--color-valor)" fill="var(--color-valor)" fillOpacity={0.1} strokeWidth={2} />
              </AreaChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>
    ))}
  </div>
);

export default DashboardVendedorRankingCharts;
