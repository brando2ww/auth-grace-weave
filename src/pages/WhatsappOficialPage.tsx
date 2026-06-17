import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.115.554 4.1 1.523 5.824L.057 23.57a.75.75 0 0 0 .914.914l5.747-1.467A11.952 11.952 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.9a9.9 9.9 0 0 1-5.031-1.373l-.361-.214-3.741.955.972-3.643-.234-.374A9.86 9.86 0 0 1 2.1 12C2.1 6.525 6.525 2.1 12 2.1S21.9 6.525 21.9 12 17.475 21.9 12 21.9z" />
  </svg>
);

const WhatsappOficialPage = () => {
  return (
    <DashboardLayout>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>WhatsApp Oficial</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <WhatsAppIcon className="h-7 w-7 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">WhatsApp Oficial</h1>
        </div>
        <p className="text-sm text-muted-foreground">Gerencie seus números do WhatsApp Business API</p>
      </div>

      <p className="text-sm text-muted-foreground">
        Em uso <span className="font-semibold text-foreground">0</span> de <span className="font-semibold text-foreground">5</span> números.{" "}
        <button className="text-primary hover:underline font-medium">Aumentar meu limite</button>
      </p>

      <div className="border-2 border-dashed border-border rounded-lg p-12 flex flex-col items-center justify-center text-center space-y-4">
        <WhatsAppIcon className="h-16 w-16 text-muted-foreground/50" />
        <h2 className="text-lg font-semibold text-foreground">Nenhum número</h2>
        <p className="text-sm text-muted-foreground max-w-md">
          Você ainda não possui nenhum número do WhatsApp Business API conectado. Adicione um novo número para começar.
        </p>
        <Button className="bg-cyan-500 hover:bg-cyan-600 text-white">
          <Plus className="h-4 w-4" />
          Adicionar número
        </Button>
      </div>
    </DashboardLayout>
  );
};

export default WhatsappOficialPage;
