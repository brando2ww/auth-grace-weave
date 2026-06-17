import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Info, RefreshCw, Download } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts";

const dates = ["24 Fev", "25 Fev", "26 Fev", "27 Fev", "28 Fev", "Mar '26"];

const iniciadasData = dates.map((date, i) => ({ date, value: [8, 12, 6, 10, 7, 4][i] }));
const abertasData = dates.map((date, i) => ({ date, value: [5, 8, 4, 7, 6, 3][i] }));
const encerradasData = dates.map((date, i) => ({ date, value: [3, 7, 5, 6, 4, 2][i] }));

const chartConfig: ChartConfig = {
  value: {
    label: "Conversas",
    color: "#1c72e3",
  },
};

const charts = [
  { label: "Conversas iniciadas", data: iniciadasData, total: 47 },
  { label: "Conversas abertas", data: abertasData, total: 33 },
  { label: "Conversas encerradas", data: encerradasData, total: 27 },
];

const DashboardCharts = () => (
  <div className="grid grid-cols-3 gap-4">
    {charts.map((chart, idx) => (
      <Card key={idx} className="overflow-hidden">
        <CardHeader className="pb-0 px-6 pt-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground">{chart.label}</span>
            <div className="flex items-center gap-2">
              <span className="text-xl font-semibold text-[#1c72e3]">{chart.total}</span>
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
          <ChartContainer config={chartConfig} className="h-64 w-full aspect-auto">
            <AreaChart data={chart.data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11 }}
                stroke="hsl(var(--muted-foreground))"
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 11 }}
                stroke="hsl(var(--muted-foreground))"
                tickLine={false}
                axisLine={false}
                 domain={[0, 14]}
                 ticks={[0, 2, 4, 6, 8, 10, 12, 14]}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="var(--color-value)"
                fill="var(--color-value)"
                fillOpacity={0.1}
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    ))}
  </div>
);

export default DashboardCharts;
