import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Info, RefreshCw, Download } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const canalData = [
  { canal: "WhatsApp", value: 145 },
  { canal: "Instagram", value: 62 },
  { canal: "Messenger", value: 38 },
  { canal: "Telefone", value: 27 },
];

const satisfacaoData = [
  { week: "Sem 1", nota: 4.2 },
  { week: "Sem 2", nota: 4.5 },
  { week: "Sem 3", nota: 4.1 },
  { week: "Sem 4", nota: 4.7 },
  { week: "Sem 5", nota: 4.6 },
  { week: "Sem 6", nota: 4.8 },
];

const tempoRespostaData = [
  { dia: "Seg", minutos: 3.2 },
  { dia: "Ter", minutos: 2.8 },
  { dia: "Qua", minutos: 4.1 },
  { dia: "Qui", minutos: 3.5 },
  { dia: "Sex", minutos: 2.9 },
  { dia: "Sáb", minutos: 5.2 },
  { dia: "Dom", minutos: 6.1 },
];

const canalConfig: ChartConfig = {
  value: { label: "Atendimentos", color: "hsl(var(--primary))" },
};

const satisfacaoConfig: ChartConfig = {
  nota: { label: "Nota média", color: "hsl(142 71% 45%)" },
};

const tempoConfig: ChartConfig = {
  minutos: { label: "Minutos", color: "hsl(var(--accent))" },
};

const charts = [
  { label: "Atendimentos por canal", total: "272", type: "bar" as const },
  { label: "Satisfação do cliente (CSAT)", total: "4.5", type: "satisfacao" as const },
  { label: "Tempo médio de resposta", total: "3.9 min", type: "tempo" as const },
];

const DashboardAtendimentoCharts = () => (
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
          {chart.type === "bar" && (
            <ChartContainer config={canalConfig} className="h-64 w-full aspect-auto">
              <BarChart data={canalData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="canal" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" fill="var(--color-value)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          )}
          {chart.type === "satisfacao" && (
            <ChartContainer config={satisfacaoConfig} className="h-64 w-full aspect-auto">
              <AreaChart data={satisfacaoData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="week" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                <YAxis domain={[3, 5]} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="nota" stroke="var(--color-nota)" fill="var(--color-nota)" fillOpacity={0.1} strokeWidth={2} />
              </AreaChart>
            </ChartContainer>
          )}
          {chart.type === "tempo" && (
            <ChartContainer config={tempoConfig} className="h-64 w-full aspect-auto">
              <AreaChart data={tempoRespostaData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="dia" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} tickFormatter={(v) => `${v}m`} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="minutos" stroke="var(--color-minutos)" fill="var(--color-minutos)" fillOpacity={0.1} strokeWidth={2} />
              </AreaChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>
    ))}
  </div>
);

export default DashboardAtendimentoCharts;
