import { SignInPage } from "@/components/ui/sign-in";
import wiseautoLogo from "@/assets/wiseauto-logo.png";

const SignInPageDemo = () => {
  const handleSignIn = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());
    console.log("Login enviado:", data);
    alert(`Login Enviado! Verifique o console do navegador para ver os dados do formulário.`);
  };

  const handleGoogleSignIn = () => {
    console.log("Continuar com Google clicado");
    alert("Continuar com Google clicado");
  };
  
  const handleResetPassword = () => {
    alert("Redefinir Senha clicado");
  }

  const handleCreateAccount = () => {
    alert("Criar Conta clicado");
  }

  return (
    <div className="bg-background text-foreground">
      <SignInPage
        logoSrc={wiseautoLogo}
        title={<span className="font-light text-foreground tracking-tighter">Bem-vindo</span>}
        description="Acesse sua conta e continue sua jornada conosco"
        heroImageSrc="/images/WA.png"
        onSignIn={handleSignIn}
        onGoogleSignIn={handleGoogleSignIn}
        onResetPassword={handleResetPassword}
        onCreateAccount={handleCreateAccount}
      />
    </div>
  );
};

export default SignInPageDemo;
