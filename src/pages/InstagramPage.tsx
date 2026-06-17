import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Instagram } from "lucide-react";

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const InstagramPage = () => {
  return (
    <DashboardLayout>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Instagram</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center gap-3 mb-6">
        <Instagram className="h-7 w-7 text-foreground" />
        <h1 className="text-2xl font-bold text-foreground">Instagram</h1>
      </div>

      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
            <Instagram className="h-16 w-16 text-muted-foreground/50" />
            <h2 className="text-lg font-semibold text-foreground">Conecte sua conta</h2>
            <p className="text-sm text-muted-foreground">
              Para conectar suas páginas do Instagram e Messenger é necessário fazer login com o Facebook
            </p>
            <Button className="bg-cyan-500 hover:bg-cyan-600 text-white gap-2">
              <FacebookIcon className="h-5 w-5" />
              Entrar com Facebook
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default InstagramPage;
