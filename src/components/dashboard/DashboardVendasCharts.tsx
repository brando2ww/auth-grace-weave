import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Info, RefreshCw, Download } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const weeks = ["Sem 1", "Sem 2", "Sem 3", "Sem 4", "Sem 5", "Sem 6"];

const vendasSemanaData = weeks.map((w, i) => ({ week: w, value: [1, 2, 1, 3, 2, 1][i] }));

const leadsConversaoData = weeks.map((w, i) => ({
  week: w,
  leads: [8, 10, 6, 9, 7, 5][i],
  conversoes: [1, 2, 1, 2, 1, 1][i],
}));

const faturamentoData = ["Out", "Nov", "Dez", "Jan", "Fev", "Mar"].map((m, i) => ({
  month: m,
  value: [320000, 410000, 285000, 390000, 520000, 180000][i],
}));

const areaConfig: ChartConfig = {
  value: { label: "Vendas", color: "hsl(var(--primary))" },
};

const barConfig: ChartConfig = {
  leads: { label: "Leads", color: "hsl(var(--primary))" },
  conversoes: { label: "Conversões", color: "hsl(var(--accent))" },
};

const fatConfig: ChartConfig = {
  value: { label: "Faturamento", color: "hsl(var(--primary))" },
};

const charts = [
  { label: "Vendas por semana", total: "10", type: "area" as const },
  { label: "Leads vs Conversões", total: "", type: "bar" as const },
  { label: "Faturamento mensal", total: "R$ 2.1M", type: "fatArea" as const },
];

const DashboardVendasCharts = () => (
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
          {chart.type === "area" && (
            <ChartContainer config={areaConfig} className="h-64 w-full aspect-auto">
              <AreaChart data={vendasSemanaData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="week" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="value" stroke="var(--color-value)" fill="var(--color-value)" fillOpacity={0.1} strokeWidth={2} />
              </AreaChart>
            </ChartContainer>
          )}
          {chart.type === "bar" && (
            <ChartContainer config={barConfig} className="h-64 w-full aspect-auto">
              <BarChart data={leadsConversaoData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="week" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="leads" fill="var(--color-leads)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="conversoes" fill="var(--color-conversoes)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          )}
          {chart.type === "fatArea" && (
            <ChartContainer config={fatConfig} className="h-64 w-full aspect-auto">
              <AreaChart data={faturamentoData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
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

export default DashboardVendasCharts;
