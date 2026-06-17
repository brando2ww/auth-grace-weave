import { SignInPage, Testimonial } from "@/components/ui/sign-in";
import type { LangKey } from "@/components/ui/sign-in";
import heroBg from "@/assets/hero-bg.png";
import logo from "@/assets/logo.png";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { useNavigate } from "react-router-dom";

const toastMessages: Record<string, Record<LangKey, string>> = {
  loginSuccess: {
    pt: "Login realizado com sucesso!",
    en: "Signed in successfully!",
    fr: "Connexion réussie !",
    es: "¡Inicio de sesión exitoso!",
  },
  resetSent: {
    pt: "Link de recuperação enviado! Verifique seu e-mail.",
    en: "Recovery link sent! Check your email.",
    fr: "Lien de récupération envoyé ! Vérifiez votre e-mail.",
    es: "¡Enlace de recuperación enviado! Revisa tu correo.",
  },
  accountCreated: {
    pt: "Conta criada! Verifique seu e-mail para confirmar.",
    en: "Account created! Check your email to confirm.",
    fr: "Compte créé ! Vérifiez votre e-mail pour confirmer.",
    es: "¡Cuenta creada! Revisa tu correo para confirmar.",
  },
};

const sampleTestimonials: Testimonial[] = [
  {
    avatarSrc: "https://randomuser.me/api/portraits/women/57.jpg",
    name: "Sarah Chen",
    handle: "@sarahdigital",
    text: {
      pt: "Plataforma incrível! A experiência do usuário é fluida e os recursos são exatamente o que eu precisava.",
      en: "Amazing platform! The user experience is seamless and the features are exactly what I needed.",
      fr: "Plateforme incroyable ! L'expérience utilisateur est fluide et les fonctionnalités sont exactement ce dont j'avais besoin.",
      es: "¡Plataforma increíble! La experiencia de usuario es perfecta y las funcionalidades son exactamente lo que necesitaba.",
    }
  },
  {
    avatarSrc: "https://randomuser.me/api/portraits/men/64.jpg",
    name: "Marcus Johnson",
    handle: "@marcustech",
    text: {
      pt: "Este serviço transformou a forma como trabalho. Design limpo, recursos poderosos e suporte excelente.",
      en: "This service has transformed how I work. Clean design, powerful features, and excellent support.",
      fr: "Ce service a transformé ma façon de travailler. Design épuré, fonctionnalités puissantes et excellent support.",
      es: "Este servicio ha transformado mi forma de trabajar. Diseño limpio, funciones poderosas y excelente soporte.",
    }
  },
  {
    avatarSrc: "https://randomuser.me/api/portraits/men/32.jpg",
    name: "David Martinez",
    handle: "@davidcreates",
    text: {
      pt: "Já experimentei muitas plataformas, mas esta se destaca. Intuitiva, confiável e genuinamente útil para a produtividade.",
      en: "I've tried many platforms, but this one stands out. Intuitive, reliable, and genuinely helpful for productivity.",
      fr: "J'ai essayé de nombreuses plateformes, mais celle-ci se démarque. Intuitive, fiable et vraiment utile pour la productivité.",
      es: "He probado muchas plataformas, pero esta destaca. Intuitiva, confiable y genuinamente útil para la productividad.",
    }
  },
];

const SignInPageDemo = () => {
  const navigate = useNavigate();

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>, lang: LangKey) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(toastMessages.loginSuccess[lang]);
      navigate('/dashboard');
    }
  };

  const handleGoogleSignIn = async (_lang: LangKey) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    });
    if (error) toast.error(error.message);
  };

  const handleResetPassword = async (event: React.FormEvent<HTMLFormElement>, lang: LangKey) => {
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(toastMessages.resetSent[lang]);
    }
  };

  const handleCreateAccount = () => {
    // handled internally by sign-in.tsx state
  };

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>, lang: LangKey) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const taxId = formData.get('taxId') as string;
    const companySize = formData.get('companySize') as string;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, phone, taxId, companySize },
        emailRedirectTo: window.location.origin,
      }
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(toastMessages.accountCreated[lang]);
    }
  };

  return (
    <div className="h-screen overflow-hidden">
      <SignInPage
        logoSrc={logo}
        heroImageSrc={heroBg}
        testimonials={sampleTestimonials}
        onSignIn={handleSignIn}
        onGoogleSignIn={handleGoogleSignIn}
        onResetPassword={handleResetPassword}
        onCreateAccount={handleCreateAccount}
        onSignUp={handleSignUp}
      />
    </div>
  );
};

export default SignInPageDemo;
