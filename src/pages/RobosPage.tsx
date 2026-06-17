import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Bot, Plus } from "lucide-react";

const RobosPage = () => {
  return (
    <DashboardLayout>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Robôs</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <Bot className="h-7 w-7 text-foreground" />
          <h1 className="text-2xl font-bold text-foreground">Robôs</h1>
        </div>
        <p className="text-sm text-muted-foreground">Gerencie seus robôs!</p>
      </div>

      <div className="border-2 border-dashed border-border rounded-lg p-12 flex flex-col items-center justify-center text-center space-y-4">
        <Bot className="h-16 w-16 text-muted-foreground/50" />
        <h2 className="text-lg font-semibold text-foreground">Nenhum robô</h2>
        <p className="text-sm text-muted-foreground">Crie o seu primeiro robô!</p>
        <Button className="bg-cyan-500 hover:bg-cyan-600 text-white">
          <Plus className="h-4 w-4" />
          Criar novo
        </Button>
        <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          Importar
        </button>
      </div>
    </DashboardLayout>
  );
};

export default RobosPage;
