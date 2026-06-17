import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Info, RefreshCw, Download } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const weeks = ["Sem 1", "Sem 2", "Sem 3", "Sem 4", "Sem 5", "Sem 6"];

const entradasSaidasData = weeks.map((w, i) => ({
  week: w,
  entradas: [5, 8, 4, 7, 6, 3][i],
  saidas: [3, 5, 6, 4, 7, 2][i],
}));

const categoriaData = [
  { categoria: "Carros", value: 89 },
  { categoria: "Motos", value: 28 },
  { categoria: "Caminhões", value: 10 },
];

const tempoEstoqueData = ["Out", "Nov", "Dez", "Jan", "Fev", "Mar"].map((m, i) => ({
  month: m,
  value: [28, 25, 30, 22, 23, 21][i],
}));

const flowConfig: ChartConfig = {
  entradas: { label: "Entradas", color: "hsl(var(--primary))" },
  saidas: { label: "Saídas", color: "hsl(var(--accent))" },
};

const catConfig: ChartConfig = {
  value: { label: "Veículos", color: "hsl(var(--primary))" },
};

const tempoConfig: ChartConfig = {
  value: { label: "Dias", color: "hsl(var(--primary))" },
};

const charts = [
  { label: "Entradas vs Saídas", type: "bar" as const },
  { label: "Distribuição por categoria", type: "catBar" as const },
  { label: "Tempo médio em estoque", type: "area" as const },
];

const DashboardEstoqueCharts = () => (
  <div className="grid grid-cols-3 gap-4">
    {charts.map((chart, idx) => (
      <Card key={idx} className="overflow-hidden">
        <CardHeader className="pb-0 px-6 pt-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground">{chart.label}</span>
            <Info className="h-4 w-4 text-muted-foreground/60" />
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
          {chart.type === "bar" && (
            <ChartContainer config={flowConfig} className="h-64 w-full aspect-auto">
              <BarChart data={entradasSaidasData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="week" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="entradas" fill="var(--color-entradas)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="saidas" fill="var(--color-saidas)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          )}
          {chart.type === "catBar" && (
            <ChartContainer config={catConfig} className="h-64 w-full aspect-auto">
              <BarChart data={categoriaData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="categoria" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" fill="var(--color-value)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          )}
          {chart.type === "area" && (
            <ChartContainer config={tempoConfig} className="h-64 w-full aspect-auto">
              <AreaChart data={tempoEstoqueData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="value" stroke="var(--color-value)" fill="var(--color-value)" fillOpacity={0.1} strokeWidth={2} />
              </AreaChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>
    ))}
  </div>
);

export default DashboardEstoqueCharts;
