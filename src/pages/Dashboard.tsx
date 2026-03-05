import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LogOut, Loader2 } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { profile, signOut, loading, isAuthenticated } = useAuthContext();

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/');
    }
  }, [loading, isAuthenticated, navigate]);


  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            Dashboard
          </CardTitle>
          <CardDescription>
            Olá, {profile?.first_name || 'usuário'}! Seu painel está em construção.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            Em breve você verá seus veículos, canais conectados e estatísticas aqui.
          </p>
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair da conta
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
