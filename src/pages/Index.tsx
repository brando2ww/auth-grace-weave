import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { SignInPage } from "@/components/ui/sign-in";
import { useAuthContext } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import wiseautoLogo from "@/assets/wiseauto-logo.png";

const SignInPageDemo = () => {
  const navigate = useNavigate();
  const { signIn, signUp, signInWithGoogle, resetPassword, loading, isAuthenticated, profile } = useAuthContext();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
      toast.error('Por favor, preencha todos os campos.');
      return;
    }

    const { error } = await signIn(email, password);
    
    if (error) {
      // Translate common Supabase errors
      if (error.message.includes('Invalid login credentials')) {
        toast.error('E-mail ou senha incorretos.');
      } else {
        toast.error(error.message);
      }
    }
    // Navigation is handled by useEffect when isAuthenticated changes
  };

  const handleGoogleSignIn = async () => {
    await signInWithGoogle();
  };

  const handleAppleSignIn = () => {
    toast.info('Login com Apple será implementado em breve.');
  };

  const handleFacebookSignIn = () => {
    toast.info('Login com Facebook será implementado em breve.');
  };
  
  const handleResetPassword = async () => {
    // This will be triggered with email from modal/form
    const email = prompt('Digite seu e-mail para redefinir a senha:');
    
    if (!email) return;

    const { error } = await resetPassword(email);
    
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('E-mail de recuperação enviado! Verifique sua caixa de entrada.');
    }
  };

  const handleCreateAccount = async (data: { 
    name: string; 
    email: string; 
    password: string; 
    document: string; 
    documentType: 'cpf' | 'cnpj'; 
    plan: string 
  }) => {
    const { error } = await signUp(data.email, data.password, {
      first_name: data.name,
      document: data.document,
      document_type: data.documentType,
      plan: data.plan,
    });

    if (error) {
      // Translate common Supabase errors
      if (error.message.includes('already registered')) {
        toast.error('Este e-mail já está cadastrado.');
      } else if (error.message.includes('Password should be at least')) {
        toast.error('A senha deve ter pelo menos 6 caracteres.');
      } else {
        toast.error(error.message);
      }
    } else {
      toast.success('Conta criada com sucesso!');
      // Navigation is handled by useEffect when isAuthenticated changes
    }
  };

  return (
    <div className="bg-background text-foreground">
      <SignInPage
        logoSrc={wiseautoLogo}
        title={<span className="font-light text-foreground tracking-tighter">Bem-vindo</span>}
        description="Entre para gerenciar seus veículos e canais."
        heroImageSrc="/images/WA.png"
        onSignIn={handleSignIn}
        onGoogleSignIn={handleGoogleSignIn}
        onAppleSignIn={handleAppleSignIn}
        onFacebookSignIn={handleFacebookSignIn}
        onResetPassword={handleResetPassword}
        onCreateAccount={handleCreateAccount}
        isLoading={loading}
      />
    </div>
  );
};

export default SignInPageDemo;
