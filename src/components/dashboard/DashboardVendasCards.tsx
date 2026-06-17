import { Card } from "@/components/ui/card";
import { TrendingUp, FileText, ShoppingCart, Percent, DollarSign, Award } from "lucide-react";

const vendasItems = [
  {
    icon: TrendingUp,
    title: "Leads recebidos",
    description: "Total de leads recebidos no mês atual.",
    value: "42",
  },
  {
    icon: FileText,
    title: "Propostas enviadas",
    description: "Propostas comerciais enviadas no período.",
    value: "15",
  },
  {
    icon: ShoppingCart,
    title: "Vendas fechadas",
    description: "Vendas concluídas no mês atual.",
    value: "8",
  },
  {
    icon: Percent,
    title: "Taxa de conversão",
    description: "Percentual de leads convertidos em vendas.",
    value: "19%",
  },
  {
    icon: DollarSign,
    title: "Ticket médio",
    description: "Valor médio por venda realizada.",
    value: "R$ 89.500",
  },
  {
    icon: Award,
    title: "Comissão acumulada",
    description: "Total de comissão acumulada no mês.",
    value: "R$ 7.160",
  },
];

const DashboardVendasCards = () => (
  <div className="grid grid-cols-3 gap-4">
    {vendasItems.map((item) => (
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

export default DashboardVendasCards;
