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

  const handleAppleSignIn = () => {
    console.log("Continuar com Apple clicado");
    alert("Continuar com Apple clicado");
  };

  const handleFacebookSignIn = () => {
    console.log("Continuar com Facebook clicado");
    alert("Continuar com Facebook clicado");
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
        description="Entre para gerenciar seus veículos e canais."
        heroImageSrc="/images/WA.png"
        onSignIn={handleSignIn}
        onGoogleSignIn={handleGoogleSignIn}
        onAppleSignIn={handleAppleSignIn}
        onFacebookSignIn={handleFacebookSignIn}
        onResetPassword={handleResetPassword}
        onCreateAccount={handleCreateAccount}
      />
    </div>
  );
};

export default SignInPageDemo;
