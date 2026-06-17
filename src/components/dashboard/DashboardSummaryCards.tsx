import { Card } from "@/components/ui/card";
import { Monitor, Timer } from "lucide-react";

const summaryItems = [
  {
    icon: Monitor,
    title: "Total de conversas",
    description: "Quantidade de conversas iniciadas no período.",
    value: "47",
  },
  {
    icon: Timer,
    title: "Tempo de atendimento",
    description: "Tempo médio para finalizar um atendimento.",
    value: "00h : 12m : 34s",
  },
  {
    icon: Timer,
    title: "Primeira resposta",
    description: "Tempo médio que uma conversa leva para receber uma primeira interação com um atendente.",
    value: "00h : 02m : 15s",
  },
];

const DashboardSummaryCards = () => (
  <div className="grid grid-cols-3 gap-4">
    {summaryItems.map((item) => (
      <Card key={item.title} className="p-6">
        <div className="flex items-center gap-3 mb-2">
          <item.icon className="h-5 w-5 text-muted-foreground" />
          <span className="text-base font-semibold text-foreground">{item.title}</span>
        </div>
        <p className="text-xs text-muted-foreground mb-4 leading-relaxed">{item.description}</p>
        <div className="text-2xl font-semibold text-foreground">{item.value}</div>
      </Card>
    ))}
  </div>
);

export default DashboardSummaryCards;
