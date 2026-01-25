import { useState } from 'react';
import { Mail, RefreshCw, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import wiseautoLogo from '@/assets/wiseauto-logo.png';

const ConfirmEmail = () => {
  const [isResending, setIsResending] = useState(false);

  const handleResendEmail = async () => {
    setIsResending(true);
    
    // Get email from session storage (saved during signup)
    const pendingEmail = sessionStorage.getItem('pendingEmailConfirmation');
    
    if (!pendingEmail) {
      toast.error('Não foi possível reenviar. Por favor, faça o cadastro novamente.');
      setIsResending(false);
      return;
    }

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: pendingEmail,
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success('E-mail reenviado com sucesso!');
      }
    } catch (err) {
      toast.error('Erro ao reenviar e-mail.');
    }

    setIsResending(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Logo */}
        <div className="flex justify-center">
          <img 
            src={wiseautoLogo} 
            alt="WiseAuto" 
            className="h-16 object-contain"
          />
        </div>

        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <Mail className="w-10 h-10 text-primary" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h1 className="text-2xl font-semibold text-foreground">
            Verifique seu e-mail
          </h1>
          <p className="text-muted-foreground">
            Enviamos um link de confirmação para o seu e-mail. 
            Clique no link para ativar sua conta e continuar.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <Button
            onClick={handleResendEmail}
            disabled={isResending}
            variant="outline"
            className="w-full"
          >
            {isResending ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Reenviando...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Reenviar e-mail
              </>
            )}
          </Button>

          <Link to="/">
            <Button variant="ghost" className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para login
            </Button>
          </Link>
        </div>

        {/* Help text */}
        <p className="text-sm text-muted-foreground">
          Não recebeu o e-mail? Verifique sua pasta de spam ou lixo eletrônico.
        </p>
      </div>
    </div>
  );
};

export default ConfirmEmail;
