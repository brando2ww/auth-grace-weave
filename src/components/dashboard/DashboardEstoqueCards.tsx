import { Card } from "@/components/ui/card";
import { Car, Clock, AlertTriangle, RefreshCw, DollarSign, TrendingUp } from "lucide-react";

const estoqueItems = [
  {
    icon: Car,
    title: "Por categoria",
    description: "Distribuição atual do estoque por tipo de veículo.",
    value: "89 Carros · 28 Motos · 10 Caminhões",
    small: true,
  },
  {
    icon: Clock,
    title: "Tempo médio em estoque",
    description: "Dias médios que um veículo permanece no estoque.",
    value: "23 dias",
  },
  {
    icon: AlertTriangle,
    title: "Veículos > 60 dias",
    description: "Veículos parados há mais de 60 dias no estoque.",
    value: "12",
  },
  {
    icon: RefreshCw,
    title: "Giro de estoque",
    description: "Percentual de renovação do estoque no mês.",
    value: "14%",
  },
  {
    icon: DollarSign,
    title: "Valor total em estoque",
    description: "Soma do valor de todos os veículos em estoque.",
    value: "R$ 4.2M",
  },
  {
    icon: TrendingUp,
    title: "Margem média",
    description: "Margem de lucro média sobre os veículos vendidos.",
    value: "8,5%",
  },
];

const DashboardEstoqueCards = () => (
  <div className="grid grid-cols-3 gap-4">
    {estoqueItems.map((item) => (
      <Card key={item.title} className="p-6">
        <div className="flex items-center gap-3 mb-2">
          <item.icon className="h-5 w-5 text-muted-foreground" />
          <span className="text-base font-semibold text-foreground">{item.title}</span>
        </div>
        <p className="text-xs text-muted-foreground mb-4 leading-relaxed">{item.description}</p>
        <div className={`font-semibold text-foreground ${item.small ? "text-base" : "text-2xl"}`}>{item.value}</div>
      </Card>
    ))}
  </div>
);

export default DashboardEstoqueCards;
