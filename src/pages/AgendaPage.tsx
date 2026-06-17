import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Calendar } from "lucide-react";

const AgendaPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Calendar className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Agenda</h1>
        </div>
        <div className="rounded-lg border border-border bg-card p-8 text-center text-muted-foreground">
          Em breve: gerencie seus agendamentos aqui.
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AgendaPage;
