import { Fragment, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { subDays } from "date-fns";
import { DateRange } from "react-day-picker";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import DashboardVendasCards from "@/components/dashboard/DashboardVendasCards";
import DashboardVendasCharts from "@/components/dashboard/DashboardVendasCharts";
import DashboardEstoqueCards from "@/components/dashboard/DashboardEstoqueCards";
import DashboardEstoqueCharts from "@/components/dashboard/DashboardEstoqueCharts";
import DashboardAtendimentoCharts from "@/components/dashboard/DashboardAtendimentoCharts";
import DashboardVendedorRankingCharts from "@/components/dashboard/DashboardVendedorRankingCharts";
import DashboardOperacionalCards from "@/components/dashboard/DashboardOperacionalCards";
import DashboardFinanceiroCharts from "@/components/dashboard/DashboardFinanceiroCharts";
import DashboardLeadsCharts from "@/components/dashboard/DashboardLeadsCharts";
import DashboardDatePicker from "@/components/dashboard/DashboardDatePicker";
import { useAuth } from "@/hooks/useAuth";

const stats = [
  { value: "12", label: "Conversas em andamento" },
  { value: "5", label: "Conversas em espera" },
  { value: "3", label: "Conversas no robô" },
  { value: "3", label: "Atendentes online" },
];

const vehicleStats = [
  { value: "127", label: "Veículos em estoque" },
  { value: "18", label: "Vendidos (mês)" },
  { value: "8", label: "Veículos reservados" },
  { value: "34", label: "Novos cadastros (mês)" },
];

const financeiroStats = [
  { value: "R$ 1.6M", label: "Faturamento do mês" },
  { value: "R$ 128k", label: "Lucro líquido" },
  { value: "R$ 89.500", label: "Ticket médio" },
  { value: "8,5%", label: "Margem média" },
];

interface RoleVisibility {
  showAtendimentoStats: boolean;
  showVehicleStats: boolean;
  showFinanceiroStats: boolean;
  showVendasCards: boolean;
  showVendasCharts: boolean;
  showEstoqueCards: boolean;
  showEstoqueCharts: boolean;
  showAtendimentoCharts: boolean;
  showVendedorRankingCharts: boolean;
  showOperacionalCards: boolean;
  showFinanceiroCharts: boolean;
  showLeadsCharts: boolean;
}

const ROLE_VISIBILITY: Record<string, RoleVisibility> = {
  super_admin:   { showAtendimentoStats: true,  showVehicleStats: true,  showFinanceiroStats: true,  showVendasCards: true,  showVendasCharts: true,  showEstoqueCards: true,  showEstoqueCharts: true,  showAtendimentoCharts: true,  showVendedorRankingCharts: true,  showOperacionalCards: true,  showFinanceiroCharts: true,  showLeadsCharts: true  },
  owner:         { showAtendimentoStats: true,  showVehicleStats: true,  showFinanceiroStats: true,  showVendasCards: true,  showVendasCharts: true,  showEstoqueCards: true,  showEstoqueCharts: true,  showAtendimentoCharts: true,  showVendedorRankingCharts: true,  showOperacionalCards: false, showFinanceiroCharts: true,  showLeadsCharts: true  },
  admin:         { showAtendimentoStats: true,  showVehicleStats: true,  showFinanceiroStats: true,  showVendasCards: true,  showVendasCharts: true,  showEstoqueCards: true,  showEstoqueCharts: true,  showAtendimentoCharts: true,  showVendedorRankingCharts: true,  showOperacionalCards: false, showFinanceiroCharts: true,  showLeadsCharts: true  },
  operacional:   { showAtendimentoStats: true,  showVehicleStats: true,  showFinanceiroStats: false, showVendasCards: false, showVendasCharts: false, showEstoqueCards: true,  showEstoqueCharts: false, showAtendimentoCharts: true,  showVendedorRankingCharts: false, showOperacionalCards: true,  showFinanceiroCharts: false, showLeadsCharts: false },
  vendedor:      { showAtendimentoStats: false, showVehicleStats: true,  showFinanceiroStats: false, showVendasCards: true,  showVendasCharts: true,  showEstoqueCards: false, showEstoqueCharts: false, showAtendimentoCharts: false, showVendedorRankingCharts: true,  showOperacionalCards: false, showFinanceiroCharts: false, showLeadsCharts: true  },
  demo_estoque:  { showAtendimentoStats: false, showVehicleStats: true,  showFinanceiroStats: true,  showVendasCards: false, showVendasCharts: false, showEstoqueCards: true,  showEstoqueCharts: true,  showAtendimentoCharts: false, showVendedorRankingCharts: false, showOperacionalCards: false, showFinanceiroCharts: true,  showLeadsCharts: false },
};

const DEFAULT_VISIBILITY: RoleVisibility = {
  showAtendimentoStats: false, showVehicleStats: true, showFinanceiroStats: false,
  showVendasCards: false, showVendasCharts: false, showEstoqueCards: false, showEstoqueCharts: false,
  showAtendimentoCharts: false, showVendedorRankingCharts: false, showOperacionalCards: false,
  showFinanceiroCharts: false, showLeadsCharts: false,
};

const DashboardPage = () => {
  const { role } = useAuth();
  const vis = useMemo(() => ROLE_VISIBILITY[role] || DEFAULT_VISIBILITY, [role]);

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 6),
    to: new Date(),
  });

  return (
    <DashboardLayout>
      {/* Header with date picker */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <DashboardDatePicker dateRange={dateRange} onDateRangeChange={setDateRange} />
      </div>
      {/* Atendimento stats */}
      {vis.showAtendimentoStats && (
        <Card className="flex items-center py-6">
          {stats.map((s, idx) => (
            <Fragment key={s.label}>
              {idx > 0 && <Separator orientation="vertical" className="h-12" />}
              <div className="flex-1 text-center">
                <div className="text-3xl font-medium text-foreground">{s.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
              </div>
            </Fragment>
          ))}
        </Card>
      )}

      {/* Vehicle stats */}
      {vis.showVehicleStats && (
        <Card className="flex items-center py-6">
          {vehicleStats.map((s, idx) => (
            <Fragment key={s.label}>
              {idx > 0 && <Separator orientation="vertical" className="h-12" />}
              <div className="flex-1 text-center">
                <div className="text-3xl font-medium text-foreground">{s.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
              </div>
            </Fragment>
          ))}
        </Card>
      )}

      {/* Financeiro stats */}
      {vis.showFinanceiroStats && (
        <Card className="flex items-center py-6">
          {financeiroStats.map((s, idx) => (
            <Fragment key={s.label}>
              {idx > 0 && <Separator orientation="vertical" className="h-12" />}
              <div className="flex-1 text-center">
                <div className="text-3xl font-medium text-foreground">{s.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
              </div>
            </Fragment>
          ))}
        </Card>
      )}

      {/* Operacional Cards */}
      {vis.showOperacionalCards && <DashboardOperacionalCards />}

      {/* Atendimento Charts */}
      {vis.showAtendimentoCharts && <DashboardAtendimentoCharts />}

      {/* Leads Charts */}
      {vis.showLeadsCharts && <DashboardLeadsCharts />}

      {/* Vendas Cards */}
      {vis.showVendasCards && <DashboardVendasCards />}

      {/* Vendas Charts */}
      {vis.showVendasCharts && <DashboardVendasCharts />}

      {/* Vendedor Ranking Charts */}
      {vis.showVendedorRankingCharts && <DashboardVendedorRankingCharts />}

      {/* Financeiro Charts */}
      {vis.showFinanceiroCharts && <DashboardFinanceiroCharts />}

      {/* Estoque Cards */}
      {vis.showEstoqueCards && <DashboardEstoqueCards />}

      {/* Estoque Charts */}
      {vis.showEstoqueCharts && <DashboardEstoqueCharts />}

    </DashboardLayout>
  );
};

export default DashboardPage;
