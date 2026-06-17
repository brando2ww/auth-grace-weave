import { Card } from "@/components/ui/card";
import { CheckCircle, Percent, Clock, ArrowRightLeft, Star, MessageSquare } from "lucide-react";

const serviceStats = [
  {
    icon: CheckCircle,
    title: "Conversas finalizadas",
    description: "Quantidade de conversas encerradas no período.",
    value: "27",
  },
  {
    icon: Percent,
    title: "Taxa de resolução",
    description: "Percentual de conversas resolvidas sem reabrir.",
    value: "82%",
  },
  {
    icon: Clock,
    title: "Tempo em espera",
    description: "Tempo médio que o cliente aguarda na fila.",
    value: "00h : 03m : 42s",
  },
  {
    icon: ArrowRightLeft,
    title: "Conversas transferidas",
    description: "Quantidade de conversas transferidas entre atendentes.",
    value: "5",
  },
  {
    icon: Star,
    title: "Satisfação do cliente",
    description: "Nota média de avaliação dos atendimentos.",
    value: "4.6",
  },
  {
    icon: MessageSquare,
    title: "Mensagens por conversa",
    description: "Média de mensagens trocadas por atendimento.",
    value: "8",
  },
];

const DashboardServiceStats = () => (
  <div className="grid grid-cols-3 gap-4">
    {serviceStats.map((item) => (
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

export default DashboardServiceStats;
