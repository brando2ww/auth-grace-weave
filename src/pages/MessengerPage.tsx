import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const MessengerIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.2 5.42 3.15 7.2.16.15.26.36.27.58l.05 1.81c.02.56.6.93 1.11.7l2.02-.8c.17-.07.36-.08.54-.04.89.24 1.84.37 2.86.37 5.64 0 10-4.13 10-9.7S17.64 2 12 2zm5.95 7.57l-2.75 4.36a1.5 1.5 0 0 1-2.17.45l-2.19-1.64a.6.6 0 0 0-.72 0l-2.95 2.24c-.39.3-.9-.18-.64-.6l2.75-4.36a1.5 1.5 0 0 1 2.17-.45l2.19 1.64a.6.6 0 0 0 .72 0l2.95-2.24c.39-.3.9.18.64.6z" />
  </svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const MessengerPage = () => {
  return (
    <DashboardLayout>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Messenger</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center gap-3 mb-6">
        <MessengerIcon className="h-7 w-7 text-foreground" />
        <h1 className="text-2xl font-bold text-foreground">Messenger</h1>
      </div>

      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
            <MessengerIcon className="h-16 w-16 text-muted-foreground/50" />
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

export default MessengerPage;
