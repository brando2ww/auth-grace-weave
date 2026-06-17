import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Info, RefreshCw, Download } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const origemLeadsData = [
  { origem: "WhatsApp", value: 87 },
  { origem: "Instagram", value: 54 },
  { origem: "OLX", value: 42 },
  { origem: "iCarros", value: 31 },
  { origem: "Site", value: 23 },
  { origem: "Indicação", value: 18 },
];

const funilData = [
  { etapa: "Novo", value: 255 },
  { etapa: "Contato", value: 180 },
  { etapa: "Visita", value: 98 },
  { etapa: "Proposta", value: 45 },
  { etapa: "Venda", value: 18 },
];

const leadsDiaSemanaData = [
  { dia: "Seg", leads: 42 },
  { dia: "Ter", leads: 38 },
  { dia: "Qua", leads: 45 },
  { dia: "Qui", leads: 40 },
  { dia: "Sex", leads: 50 },
  { dia: "Sáb", leads: 32 },
  { dia: "Dom", leads: 8 },
];

const origemConfig: ChartConfig = {
  value: { label: "Leads", color: "hsl(var(--primary))" },
};

const funilConfig: ChartConfig = {
  value: { label: "Quantidade", color: "hsl(221 83% 53%)" },
};

const diaSemanaConfig: ChartConfig = {
  leads: { label: "Leads", color: "hsl(var(--primary))" },
};

const charts = [
  { label: "Origem dos leads", total: "255", type: "origem" as const },
  { label: "Funil de conversão", total: "7%", type: "funil" as const },
  { label: "Leads por dia da semana", total: "36/dia", type: "diaSemana" as const },
];

const DashboardLeadsCharts = () => (
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
          {chart.type === "origem" && (
            <ChartContainer config={origemConfig} className="h-64 w-full aspect-auto">
              <BarChart data={origemLeadsData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="origem" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" fill="var(--color-value)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          )}
          {chart.type === "funil" && (
            <ChartContainer config={funilConfig} className="h-64 w-full aspect-auto">
              <BarChart data={funilData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="etapa" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" fill="var(--color-value)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          )}
          {chart.type === "diaSemana" && (
            <ChartContainer config={diaSemanaConfig} className="h-64 w-full aspect-auto">
              <AreaChart data={leadsDiaSemanaData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="dia" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="leads" stroke="var(--color-leads)" fill="var(--color-leads)" fillOpacity={0.1} strokeWidth={2} />
              </AreaChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>
    ))}
  </div>
);

export default DashboardLeadsCharts;
