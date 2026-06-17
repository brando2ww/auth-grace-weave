import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Eye, EyeOff, ChevronDown } from 'lucide-react';
import heroLogo from "@/assets/hero-logo.png";

// --- HELPER COMPONENTS (ICONS) ---

const GoogleIcon = () =>
<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s12-5.373 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-2.641-.21-5.236-.611-7.743z" />
        <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.022 35.026 44 30.038 44 24c0-2.641-.21-5.236-.611-7.743z" />
    </svg>;

const InstagramIcon = () =>
<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#FD5" />
        <stop offset="50%" stopColor="#FF543E" />
        <stop offset="100%" stopColor="#C837AB" />
      </linearGradient>
    </defs>
    <rect x="2" y="2" width="20" height="20" rx="5" stroke="url(#ig-grad)" strokeWidth="2" />
    <circle cx="12" cy="12" r="4.5" stroke="url(#ig-grad)" strokeWidth="2" />
    <circle cx="17.5" cy="6.5" r="1.25" fill="url(#ig-grad)" />
</svg>;

const FacebookIcon = () =>
<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="#1877F2">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
</svg>;


// --- TYPE DEFINITIONS ---

export type LangKey = 'pt' | 'en' | 'fr' | 'es';

interface TranslationStrings {
  // Sign In
  title: string;
  description: string;
  emailLabel: string;
  emailPlaceholder: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  keepSignedIn: string;
  resetPassword: string;
  signIn: string;
  orContinueWith: string;
  continueWithGoogle: string;
  newToPlatform: string;
  createAccount: string;
  // Sign Up
  signUpTitle: string;
  signUpDescription: string;
  nameLabel: string;
  namePlaceholder: string;
  corporateEmailLabel: string;
  corporateEmailPlaceholder: string;
  phoneLabel: string;
  phonePlaceholder: string;
  taxIdLabel: string;
  taxIdPlaceholder: string;
  createPasswordLabel: string;
  createPasswordPlaceholder: string;
  companySizeLabel: string;
  companySizePlaceholder: string;
  companySizeOptions: string[];
  termsText: string;
  termsLink: string;
  createAccountButton: string;
  alreadyHaveAccount: string;
  signInLink: string;
  heroLabel: string;
  heroTitle: string;
  resetTitle: string;
  resetDescription: string;
  resetSubmitButton: string;
  backToSignIn: string;
}

const translations: Record<LangKey, TranslationStrings> = {
  pt: {
    title: 'Bem-vindo',
    description: 'Acesse sua conta e continue sua jornada conosco',
    emailLabel: 'Endereço de E-mail',
    emailPlaceholder: 'Digite seu endereço de e-mail',
    passwordLabel: 'Senha',
    passwordPlaceholder: 'Digite sua senha',
    keepSignedIn: 'Manter-me conectado',
    resetPassword: 'Redefinir senha',
    signIn: 'Entrar',
    orContinueWith: 'Ou continue com',
    continueWithGoogle: 'Continuar com o Google',
    newToPlatform: 'Novo em nossa plataforma?',
    createAccount: 'Criar Conta',
    signUpTitle: 'Crie uma conta para começar',
    signUpDescription: 'Transforme seu atendimento, agilidade e eficiência',
    nameLabel: 'Nome',
    namePlaceholder: 'Seu Nome',
    corporateEmailLabel: 'Email corporativo',
    corporateEmailPlaceholder: 'exemplo@empresa.com',
    phoneLabel: 'Telefone (WhatsApp)',
    phonePlaceholder: '(00) 00000-0000',
    taxIdLabel: 'CPF / CNPJ',
    taxIdPlaceholder: '123.456.789-10',
    createPasswordLabel: 'Crie uma senha',
    createPasswordPlaceholder: 'Crie uma senha segura',
    companySizeLabel: 'Tamanho da empresa',
    companySizePlaceholder: 'Selecione uma opção',
    companySizeOptions: ['1 colaborador', '2 a 5 colaboradores', '6 a 10 colaboradores', '11 a 50 colaboradores', '51 a 100 colaboradores', '101 a 250 colaboradores', '251 a 499 colaboradores', 'Acima de 500 colaboradores'],
    termsText: 'Eu concordo que li e aceito os ',
    termsLink: 'Termos de Uso e Política de Privacidade',
    createAccountButton: 'Criar conta',
    alreadyHaveAccount: 'Já tem uma conta?',
    signInLink: 'Faça o login',
    heroLabel: 'A TRANSFORMAÇÃO DO MERCADO',
    heroTitle: 'Transformamos atendimento em máquina previsível de vendas.',
    resetTitle: 'Recuperar senha',
    resetDescription: 'Insira seu e-mail e enviaremos um link para redefinir sua senha',
    resetSubmitButton: 'Enviar link de recuperação',
    backToSignIn: 'Voltar ao login'
  },
  en: {
    title: 'Welcome',
    description: 'Access your account and continue your journey with us',
    emailLabel: 'Email Address',
    emailPlaceholder: 'Enter your email address',
    passwordLabel: 'Password',
    passwordPlaceholder: 'Enter your password',
    keepSignedIn: 'Keep me signed in',
    resetPassword: 'Reset password',
    signIn: 'Sign In',
    orContinueWith: 'Or continue with',
    continueWithGoogle: 'Continue with Google',
    newToPlatform: 'New to our platform?',
    createAccount: 'Create Account',
    signUpTitle: 'Create an account to get started',
    signUpDescription: 'Transform your service, agility and efficiency',
    nameLabel: 'Name',
    namePlaceholder: 'Your Name',
    corporateEmailLabel: 'Corporate email',
    corporateEmailPlaceholder: 'example@company.com',
    phoneLabel: 'Phone (WhatsApp)',
    phonePlaceholder: '(000) 000-0000',
    taxIdLabel: 'Tax ID',
    taxIdPlaceholder: '00-0000000',
    createPasswordLabel: 'Create a password',
    createPasswordPlaceholder: 'Create a secure password',
    companySizeLabel: 'Company size',
    companySizePlaceholder: 'Select an option',
    companySizeOptions: ['1 employee', '2 to 5 employees', '6 to 10 employees', '11 to 50 employees', '51 to 100 employees', '101 to 250 employees', '251 to 499 employees', 'Over 500 employees'],
    termsText: 'I agree that I have read and accept the ',
    termsLink: 'Terms of Use and Privacy Policy',
    createAccountButton: 'Create account',
    alreadyHaveAccount: 'Already have an account?',
    signInLink: 'Sign in',
    heroLabel: 'THE MARKET TRANSFORMATION',
    heroTitle: 'We transform service into a predictable sales machine.',
    resetTitle: 'Recover password',
    resetDescription: "Enter your email and we'll send a reset link",
    resetSubmitButton: 'Send recovery link',
    backToSignIn: 'Back to sign in'
  },
  fr: {
    title: 'Bienvenue',
    description: 'Accédez à votre compte et continuez votre parcours avec nous',
    emailLabel: 'Adresse e-mail',
    emailPlaceholder: 'Entrez votre adresse e-mail',
    passwordLabel: 'Mot de passe',
    passwordPlaceholder: 'Entrez votre mot de passe',
    keepSignedIn: 'Rester connecté',
    resetPassword: 'Réinitialiser le mot de passe',
    signIn: 'Se connecter',
    orContinueWith: 'Ou continuer avec',
    continueWithGoogle: 'Continuer avec Google',
    newToPlatform: 'Nouveau sur notre plateforme ?',
    createAccount: 'Créer un compte',
    signUpTitle: 'Créez un compte pour commencer',
    signUpDescription: 'Transformez votre service, agilité et efficacité',
    nameLabel: 'Nom',
    namePlaceholder: 'Votre nom',
    corporateEmailLabel: 'E-mail professionnel',
    corporateEmailPlaceholder: 'exemple@entreprise.com',
    phoneLabel: 'Téléphone (WhatsApp)',
    phonePlaceholder: '00 00 00 00 00',
    taxIdLabel: 'Numéro fiscal',
    taxIdPlaceholder: '00 000 000 000',
    createPasswordLabel: 'Créez un mot de passe',
    createPasswordPlaceholder: 'Créez un mot de passe sécurisé',
    companySizeLabel: "Taille de l'entreprise",
    companySizePlaceholder: 'Sélectionnez une option',
    companySizeOptions: ['1 employé', '2 à 5 employés', '6 à 10 employés', '11 à 50 employés', '51 à 100 employés', '101 à 250 employés', '251 à 499 employés', 'Plus de 500 employés'],
    termsText: "J'accepte avoir lu et accepté les ",
    termsLink: "Conditions d'utilisation et Politique de confidentialité",
    createAccountButton: 'Créer un compte',
    alreadyHaveAccount: 'Vous avez déjà un compte ?',
    signInLink: 'Se connecter',
    heroLabel: 'LA TRANSFORMATION DU MARCHÉ',
    heroTitle: 'Nous transformons le service en une machine de vente prévisible.',
    resetTitle: 'Récupérer le mot de passe',
    resetDescription: 'Entrez votre e-mail et nous vous enverrons un lien',
    resetSubmitButton: 'Envoyer le lien',
    backToSignIn: 'Retour à la connexion'
  },
  es: {
    title: 'Bienvenido',
    description: 'Accede a tu cuenta y continúa tu viaje con nosotros',
    emailLabel: 'Correo electrónico',
    emailPlaceholder: 'Ingresa tu correo electrónico',
    passwordLabel: 'Contraseña',
    passwordPlaceholder: 'Ingresa tu contraseña',
    keepSignedIn: 'Mantenerme conectado',
    resetPassword: 'Restablecer contraseña',
    signIn: 'Iniciar sesión',
    orContinueWith: 'O continuar con',
    continueWithGoogle: 'Continuar con Google',
    newToPlatform: '¿Nuevo en nuestra plataforma?',
    createAccount: 'Crear cuenta',
    signUpTitle: 'Crea una cuenta para empezar',
    signUpDescription: 'Transforma tu atención, agilidad y eficiencia',
    nameLabel: 'Nombre',
    namePlaceholder: 'Tu nombre',
    corporateEmailLabel: 'Correo corporativo',
    corporateEmailPlaceholder: 'ejemplo@empresa.com',
    phoneLabel: 'Teléfono (WhatsApp)',
    phonePlaceholder: '(000) 000-0000',
    taxIdLabel: 'RFC / NIF',
    taxIdPlaceholder: '000000000',
    createPasswordLabel: 'Crea una contraseña',
    createPasswordPlaceholder: 'Crea una contraseña segura',
    companySizeLabel: 'Tamaño de la empresa',
    companySizePlaceholder: 'Selecciona una opción',
    companySizeOptions: ['1 colaborador', '2 a 5 colaboradores', '6 a 10 colaboradores', '11 a 50 colaboradores', '51 a 100 colaboradores', '101 a 250 colaboradores', '251 a 499 colaboradores', 'Más de 500 colaboradores'],
    termsText: 'Acepto haber leído y aceptado los ',
    termsLink: 'Términos de Uso y Política de Privacidad',
    createAccountButton: 'Crear cuenta',
    alreadyHaveAccount: '¿Ya tienes una cuenta?',
    signInLink: 'Inicia sesión',
    heroLabel: 'LA TRANSFORMACIÓN DEL MERCADO',
    heroTitle: 'Transformamos la atención en una máquina de ventas predecible.',
    resetTitle: 'Recuperar contraseña',
    resetDescription: 'Ingresa tu correo y te enviaremos un enlace',
    resetSubmitButton: 'Enviar enlace',
    backToSignIn: 'Volver al inicio de sesión'
  }
};

const languages: {key: LangKey;flag: string;label: string;}[] = [
{ key: 'pt', flag: '🇧🇷', label: 'Português' },
{ key: 'en', flag: '🇬🇧', label: 'English' },
{ key: 'fr', flag: '🇫🇷', label: 'Français' },
{ key: 'es', flag: '🇪🇸', label: 'Español' }];

// Country codes imported from shared component
import { countryCodes, CountryCodeSelector as SharedCountryCodeSelector } from '@/components/CountryCodeSelector';



export interface Testimonial {
  avatarSrc: string;
  name: string;
  handle: string;
  text: Partial<Record<LangKey, string>> | string;
}

interface SignInPageProps {
  logoSrc?: string;
  heroImageSrc?: string;
  testimonials?: Testimonial[];
  onSignIn?: (event: React.FormEvent<HTMLFormElement>, lang: LangKey) => void;
  onGoogleSignIn?: (lang: LangKey) => void;
  onResetPassword?: (event: React.FormEvent<HTMLFormElement>, lang: LangKey) => void;
  onCreateAccount?: () => void;
  onSignUp?: (event: React.FormEvent<HTMLFormElement>, lang: LangKey) => void;
  onInstagramSignIn?: (lang: LangKey) => void;
  onFacebookSignIn?: (lang: LangKey) => void;
}

// --- SUB-COMPONENTS ---

const GlassInputWrapper = ({ children }: {children: React.ReactNode;}) =>
<div className="rounded-2xl border border-border bg-foreground/5 backdrop-blur-sm transition-colors focus-within:border-violet-400/70 focus-within:bg-violet-500/10">
    {children}
  </div>;


const TestimonialCard = ({ testimonial, delay, lang }: {testimonial: Testimonial;delay: string;lang: LangKey;}) => {
  const text = typeof testimonial.text === 'string' ?
  testimonial.text :
  testimonial.text[lang] ?? testimonial.text['en'] ?? '';
  return (
    <div className={`animate-testimonial ${delay} flex items-start gap-3 rounded-3xl bg-card/40 dark:bg-zinc-800/40 backdrop-blur-xl border border-white/10 p-5 w-64`}>
      <img src={testimonial.avatarSrc} className="h-10 w-10 object-cover rounded-2xl" alt="avatar" />
      <div className="text-sm leading-snug">
        <p className="flex items-center gap-1 font-medium text-primary-foreground">{testimonial.name}</p>
        <p className="text-primary-foreground">{testimonial.handle}</p>
        <p className="mt-1 text-primary-foreground">{text}</p>
      </div>
    </div>);
};


// --- LANGUAGE SELECTOR ---

const LanguageSelector = ({ lang, setLang }: {lang: LangKey;setLang: (l: LangKey) => void;}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = languages.find((l) => l.key === lang)!;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-1.5 text-sm text-foreground hover:bg-secondary transition-colors">
        <span>{current.flag}</span>
        <span className="font-medium">{current.label}</span>
        <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open &&
      <div className="absolute right-0 top-full mt-1 z-50 min-w-[140px] rounded-xl border border-border bg-popover shadow-lg overflow-hidden">
          {languages.map((l) =>
        <button
          key={l.key}
          type="button"
          onClick={() => {setLang(l.key);setOpen(false);}}
          className={`flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground ${lang === l.key ? 'bg-accent/50 font-medium' : 'text-popover-foreground'}`}>
              <span>{l.flag}</span>
              <span>{l.label}</span>
            </button>
        )}
        </div>
      }
    </div>);
};

// --- COUNTRY CODE SELECTOR (shared) ---

const CountryCodeSelector = ({ value, onChange }: {value: string;onChange: (dial: string) => void;}) => {
  return <SharedCountryCodeSelector value={value} onChange={onChange} variant="glass" />;
};

// --- CUSTOM SELECT ---

const CustomSelect = ({ name, placeholder, options



}: {name: string;placeholder: string;options: string[];}) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState('');
  const [dropdownPos, setDropdownPos] = useState<{top: number;left: number;width: number;} | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const justOpenedRef = useRef(false);

  const handleToggle = () => {
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPos({ top: rect.bottom + 4, left: rect.left, width: rect.width });
      justOpenedRef.current = true;
    }
    setOpen((o) => !o);
  };

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (e: PointerEvent) => {
      if (justOpenedRef.current) {justOpenedRef.current = false;return;}
      const target = e.target as Node;
      if (!buttonRef.current?.contains(target) && !dropdownRef.current?.contains(target)) {
        setOpen(false);
      }
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [open]);

  const dropdownContent = open && dropdownPos ?
  ReactDOM.createPortal(
    <div
      ref={dropdownRef}
      style={{ position: 'fixed', top: dropdownPos.top, left: dropdownPos.left, width: dropdownPos.width, zIndex: 9999 }}
      className="rounded-xl border border-border bg-popover shadow-lg overflow-y-auto max-h-60">
          {options.map((opt) =>
      <button key={opt} type="button"
      onClick={() => {setSelected(opt);setOpen(false);}}
      className={`flex w-full items-center px-4 py-2.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground ${selected === opt ? 'bg-accent/50 font-medium' : 'text-popover-foreground'}`}>
              {opt}
            </button>
      )}
        </div>,
    document.body
  ) :
  null;

  return (
    <div className="relative">
      <input type="hidden" name={name} value={selected} />
      <button ref={buttonRef} type="button" onClick={handleToggle}
      className="flex w-full items-center justify-between p-4 text-sm rounded-2xl focus:outline-none bg-transparent">
        <span className={selected ? 'text-foreground' : 'text-muted-foreground'}>
          {selected || placeholder}
        </span>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {dropdownContent}
    </div>);

};

// --- MASK HELPERS ---

function maskPhone(value: string): string {
  const d = value.replace(/\D/g, '').slice(0, 11);
  if (d.length === 0) return '';
  if (d.length <= 2) return '(' + d;
  if (d.length <= 6) return '(' + d.slice(0, 2) + ') ' + d.slice(2);
  if (d.length <= 10) return '(' + d.slice(0, 2) + ') ' + d.slice(2, 6) + '-' + d.slice(6);
  return '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7);
}

function maskCpfCnpj(value: string): string {
  const d = value.replace(/\D/g, '').slice(0, 14);
  if (d.length <= 11) {
    let r = d;
    if (d.length > 9) r = d.slice(0, 3) + '.' + d.slice(3, 6) + '.' + d.slice(6, 9) + '-' + d.slice(9);else
    if (d.length > 6) r = d.slice(0, 3) + '.' + d.slice(3, 6) + '.' + d.slice(6);else
    if (d.length > 3) r = d.slice(0, 3) + '.' + d.slice(3);
    return r;
  }
  let r = d.slice(0, 2) + '.' + d.slice(2, 5) + '.' + d.slice(5, 8) + '/' + d.slice(8, 12);
  if (d.length > 12) r += '-' + d.slice(12);
  return r;
}

// --- SIGN UP FORM ---

const SignUpForm = ({
  t,
  onSignUp,
  onSwitchToSignIn,
  logoSrc,
  lang





}: {t: TranslationStrings;onSignUp?: (event: React.FormEvent<HTMLFormElement>, lang: LangKey) => void;onSwitchToSignIn: () => void;logoSrc?: string;lang: LangKey;}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [countryDial, setCountryDial] = useState('+55');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [phoneValue, setPhoneValue] = useState('');
  const [taxIdValue, setTaxIdValue] = useState('');

  return (
    <div className="w-full max-w-lg">
      <div className="flex flex-col gap-5">
        <div>
          {logoSrc &&
          <img
            src={logoSrc}
            alt="Logo"
            className="h-12 max-w-[180px] object-contain mb-4" />

          }
          <h1 className="text-2xl md:text-3xl font-semibold leading-tight text-foreground tracking-tight">
            {t.signUpTitle}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{t.signUpDescription}</p>
        </div>

        <form className="space-y-3" onSubmit={(e) => onSignUp?.(e, lang)}>
          {/* Nome */}
          <div>
            <label className="text-sm font-medium text-muted-foreground">{t.nameLabel} <span className="text-destructive">*</span></label>
            <GlassInputWrapper>
              <input name="name" type="text" placeholder={t.namePlaceholder} required className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none" />
            </GlassInputWrapper>
          </div>

          {/* Email corporativo */}
          <div>
            <label className="text-sm font-medium text-muted-foreground">{t.corporateEmailLabel} <span className="text-destructive">*</span></label>
            <GlassInputWrapper>
              <input name="email" type="email" placeholder={t.corporateEmailPlaceholder} required className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none" />
            </GlassInputWrapper>
          </div>

          {/* Telefone */}
          <div>
            <label className="text-sm font-medium text-muted-foreground">{t.phoneLabel} <span className="text-destructive">*</span></label>
            <GlassInputWrapper>
              <div className="flex items-stretch">
                <CountryCodeSelector value={countryDial} onChange={setCountryDial} />
                <input
                  name="phone"
                  type="tel"
                  placeholder={t.phonePlaceholder}
                  value={phoneValue}
                  onChange={(e) => setPhoneValue(maskPhone(e.target.value))}
                  maxLength={15}
                  className="flex-1 bg-transparent text-sm p-4 rounded-r-2xl focus:outline-none" />

              </div>
            </GlassInputWrapper>
          </div>

          {/* CPF/CNPJ */}
          <div>
            <label className="text-sm font-medium text-muted-foreground">{t.taxIdLabel} <span className="text-destructive">*</span></label>
            <GlassInputWrapper>
              <input
                name="taxId"
                type="text"
                placeholder={t.taxIdPlaceholder}
                value={taxIdValue}
                onChange={(e) => setTaxIdValue(maskCpfCnpj(e.target.value))}
                maxLength={18}
                className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none" />

            </GlassInputWrapper>
          </div>

          {/* Senha */}
          <div>
            <label className="text-sm font-medium text-muted-foreground">{t.createPasswordLabel} <span className="text-destructive">*</span></label>
            <GlassInputWrapper>
              <div className="relative">
                <input name="password" type={showPassword ? 'text' : 'password'} placeholder={t.createPasswordPlaceholder} required className="w-full bg-transparent text-sm p-4 pr-12 rounded-2xl focus:outline-none" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-3 flex items-center">
                  {showPassword ? <EyeOff className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" /> : <Eye className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />}
                </button>
              </div>
            </GlassInputWrapper>
          </div>

          {/* Tamanho da empresa */}
          <div>
            <label className="text-sm font-medium text-muted-foreground">{t.companySizeLabel} <span className="text-destructive">*</span></label>
            <GlassInputWrapper>
              <CustomSelect
                name="companySize"
                placeholder={t.companySizePlaceholder}
                options={t.companySizeOptions} />

            </GlassInputWrapper>
          </div>

          {/* Termos */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="terms"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-0.5 custom-checkbox flex-shrink-0" />

            <span className="text-sm text-muted-foreground leading-snug">
              {t.termsText}
              <a href="#" className="text-foreground hover:underline font-medium">{t.termsLink}</a>
            </span>
          </label>

          <button
            type="submit"
            className="w-full rounded-2xl bg-primary py-4 font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
            {t.createAccountButton}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          {t.alreadyHaveAccount}{' '}
          <a href="#" onClick={(e) => {e.preventDefault();onSwitchToSignIn();}} className="hover:underline transition-colors font-medium text-[#1c72e3]">
            {t.signInLink}
          </a>
        </p>
      </div>
    </div>);

};


// --- MAIN COMPONENT ---

export const SignInPage: React.FC<SignInPageProps> = ({
  logoSrc,
  heroImageSrc,
  testimonials = [],
  onSignIn,
  onGoogleSignIn,
  onResetPassword,
  onCreateAccount,
  onSignUp,
  onInstagramSignIn,
  onFacebookSignIn
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [lang, setLang] = useState<LangKey>('pt');
  const [mode, setMode] = useState<'signin' | 'signup' | 'reset'>('signin');
  const t = translations[lang];

  const handleCreateAccount = () => {
    onCreateAccount?.();
    setMode('signup');
  };

  return (
    <div className="h-[100dvh] flex flex-col md:flex-row-reverse font-geist w-full">
      {/* Left column: hero image + testimonials */}
      {heroImageSrc &&
      <section className="hidden md:flex flex-1 relative p-4">
          <div className="animate-slide-right animate-delay-300 absolute inset-4 rounded-3xl bg-cover bg-center" style={{ backgroundImage: `url(${heroImageSrc})` }}>
          </div>
        </section>
      }

      {/* Right column: form */}
      <section className="flex-1 flex items-center justify-center px-12 py-8 relative overflow-y-auto">
        {/* Language selector */}
        <div className="absolute top-4 left-4">
          <LanguageSelector lang={lang} setLang={setLang} />
        </div>

        {mode === 'signin' ?
        <div className="w-full max-w-lg">
            <div className="flex flex-col gap-6">
              {logoSrc &&
            <img src={logoSrc} alt="Logo" className="animate-element animate-delay-50 h-24 max-w-[300px] object-contain -ml-8" />
            }
              <h1 className="animate-element animate-delay-100 text-4xl md:text-5xl font-semibold leading-tight">
                <span className="font-light text-foreground tracking-tighter">{t.title}</span>
              </h1>
              <p className="animate-element animate-delay-200 text-muted-foreground">{t.description}</p>

              <form className="space-y-5 text-[#1c72e3]" onSubmit={(e) => onSignIn?.(e, lang)}>
                <div className="animate-element animate-delay-300">
                  <label className="text-sm font-medium text-muted-foreground">{t.emailLabel}</label>
                  <GlassInputWrapper>
                    <input name="email" type="email" placeholder={t.emailPlaceholder} className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none" />
                  </GlassInputWrapper>
                </div>

                <div className="animate-element animate-delay-400">
                  <label className="text-sm font-medium text-muted-foreground">{t.passwordLabel}</label>
                  <GlassInputWrapper>
                    <div className="relative">
                      <input name="password" type={showPassword ? 'text' : 'password'} placeholder={t.passwordPlaceholder} className="w-full bg-transparent text-sm p-4 pr-12 rounded-2xl focus:outline-none" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-3 flex items-center">
                        {showPassword ? <EyeOff className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" /> : <Eye className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />}
                      </button>
                    </div>
                  </GlassInputWrapper>
                </div>

                <div className="animate-element animate-delay-500 flex items-center justify-between text-sm">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" name="rememberMe" className="custom-checkbox" />
                    <span className="text-foreground/90">{t.keepSignedIn}</span>
                  </label>
                  <a href="#" onClick={(e) => {e.preventDefault();setMode('reset');}} className="hover:underline transition-colors text-foreground/80">{t.resetPassword}</a>
                </div>

                <button type="submit" className="animate-element animate-delay-600 w-full rounded-2xl bg-primary py-4 font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                  {t.signIn}
                </button>
              </form>

              <div className="animate-element animate-delay-700 relative flex items-center justify-center">
                <span className="w-full border-t border-border"></span>
                <span className="px-4 text-sm text-muted-foreground bg-background absolute">{t.orContinueWith}</span>
              </div>

              <button onClick={() => onGoogleSignIn?.(lang)} className="animate-element animate-delay-800 w-full flex items-center justify-center gap-3 border border-border rounded-2xl py-4 hover:bg-secondary transition-colors">
                  <GoogleIcon />
                  {t.continueWithGoogle}
              </button>

              <div className="animate-element animate-delay-800 flex gap-3 w-full">
                <button onClick={() => onInstagramSignIn?.(lang)} className="flex-1 flex items-center justify-center gap-3 border border-border rounded-2xl py-4 hover:bg-secondary transition-colors">
                  <InstagramIcon />
                  Instagram
                </button>
                <button onClick={() => onFacebookSignIn?.(lang)} className="flex-1 flex items-center justify-center gap-3 border border-border rounded-2xl py-4 hover:bg-secondary transition-colors">
                  <FacebookIcon />
                  Facebook
                </button>
              </div>

              {/* <p className="animate-element animate-delay-900 text-center text-sm text-muted-foreground">
                {t.newToPlatform}{' '}
                <a href="#" onClick={(e) => {e.preventDefault();handleCreateAccount();}} className="hover:underline transition-colors font-medium text-[#1c72e3]">
                  {t.createAccount}
                </a>
              </p> */}
            </div>
          </div> : mode === 'signup' ?

        <SignUpForm
          t={t}
          onSignUp={onSignUp}
          onSwitchToSignIn={() => setMode('signin')}
          logoSrc={logoSrc}
          lang={lang} /> :

        <div className="w-full max-w-lg">
          <div className="flex flex-col gap-6">
            {logoSrc && <img src={logoSrc} alt="Logo" className="h-16 max-w-[200px] object-contain" />}
            <div>
              <h1 className="text-4xl md:text-5xl font-semibold leading-tight">
                <span className="font-light text-foreground tracking-tighter">{t.resetTitle}</span>
              </h1>
              <p className="mt-2 text-muted-foreground">{t.resetDescription}</p>
            </div>

            <form className="space-y-5 text-[#1c72e3]" onSubmit={(e) => { e.preventDefault(); onResetPassword?.(e, lang); }}>
              <div>
                <label className="text-sm font-medium text-muted-foreground">{t.emailLabel}</label>
                <GlassInputWrapper>
                  <input name="email" type="email" placeholder={t.emailPlaceholder} required className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none" />
                </GlassInputWrapper>
              </div>

              <button type="submit" className="w-full rounded-2xl bg-primary py-4 font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                {t.resetSubmitButton}
              </button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
              <a href="#" onClick={(e) => { e.preventDefault(); setMode('signin'); }} className="hover:underline transition-colors text-foreground font-medium">
                {t.backToSignIn}
              </a>
            </p>
          </div>
        </div>

        }
      </section>
    </div>);
};