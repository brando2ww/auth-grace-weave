import { Card } from "@/components/ui/card";
import { Headphones, Clock, CheckCircle, ArrowRightLeft, Flag, Target } from "lucide-react";

const items = [
  { icon: Headphones, title: "Atendimentos hoje", value: "34", description: "Total de atendimentos iniciados hoje." },
  { icon: Clock, title: "Tempo médio na fila", value: "04m 12s", description: "Tempo médio de espera antes do atendimento." },
  { icon: CheckCircle, title: "SLA cumprido", value: "92%", description: "Percentual de atendimentos dentro do SLA." },
  { icon: ArrowRightLeft, title: "Transferências", value: "7", description: "Atendimentos transferidos entre departamentos." },
  { icon: Flag, title: "Finalizados", value: "28", description: "Atendimentos finalizados hoje." },
  { icon: Target, title: "Taxa de resolução", value: "87%", description: "Resolvidos na primeira interação." },
];

const DashboardOperacionalCards = () => (
  <div className="grid grid-cols-3 gap-4">
    {items.map((item) => (
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

export default DashboardOperacionalCards;
