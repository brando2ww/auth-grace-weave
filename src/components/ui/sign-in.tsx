import React, { useState } from 'react';
import { Eye, EyeOff, ArrowLeft, Check } from 'lucide-react';

// --- HELPER COMPONENTS (ICONS) ---

const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s12-5.373 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-2.641-.21-5.236-.611-7.743z" />
        <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.022 35.026 44 30.038 44 24c0-2.641-.21-5.236-.611-7.743z" />
    </svg>
);

const AppleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="#1877F2">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);


// --- TYPE DEFINITIONS ---

export interface SignupData {
  name: string;
  email: string;
  password: string;
  document: string;
  documentType: 'cpf' | 'cnpj';
  plan: string;
}

interface SignInPageProps {
  logoSrc?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  heroImageSrc?: string;
  onSignIn?: (event: React.FormEvent<HTMLFormElement>) => void;
  onGoogleSignIn?: () => void;
  onAppleSignIn?: () => void;
  onFacebookSignIn?: () => void;
  onResetPassword?: () => void;
  onCreateAccount?: (data: SignupData) => void;
}

// --- SUB-COMPONENTS ---

const GlassInputWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-2xl border border-border bg-foreground/5 backdrop-blur-sm transition-colors focus-within:border-[#1f6ae1]/70 focus-within:bg-[#1f6ae1]/10">
    {children}
  </div>
);

const StepIndicator = ({ currentStep }: { currentStep: 1 | 2 | 3 }) => (
  <div className="flex items-center justify-center gap-2 mb-6">
    {[1, 2, 3].map((step) => (
      <React.Fragment key={step}>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300
          ${step === currentStep 
            ? 'bg-primary text-primary-foreground scale-110' 
            : step < currentStep 
              ? 'bg-primary/20 text-primary' 
              : 'bg-muted text-muted-foreground'}`}>
          {step < currentStep ? <Check className="w-4 h-4" /> : step}
        </div>
        {step < 3 && (
          <div className={`w-12 h-0.5 transition-colors duration-300 ${step < currentStep ? 'bg-primary' : 'bg-muted'}`} />
        )}
      </React.Fragment>
    ))}
  </div>
);

const PlanCard = ({ 
  name, 
  description, 
  price, 
  selected, 
  onSelect,
  popular
}: { 
  name: string; 
  description: string; 
  price: string;
  selected: boolean; 
  onSelect: () => void;
  popular?: boolean;
}) => (
  <div 
    onClick={onSelect}
    className={`relative border rounded-2xl p-4 cursor-pointer transition-all duration-200 
      ${selected 
        ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
        : 'border-border hover:border-primary/50 hover:bg-secondary/50'}`}
  >
    {popular && (
      <span className="absolute -top-2.5 left-4 bg-primary text-primary-foreground text-xs font-medium px-2 py-0.5 rounded-full">
        Popular
      </span>
    )}
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-foreground">{name}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="text-right flex-shrink-0 whitespace-nowrap">
        <span className="text-xl font-bold text-foreground">{price}</span>
        <span className="text-sm text-muted-foreground">/mês</span>
      </div>
    </div>
  </div>
);

// --- MAIN COMPONENT ---

export const SignInPage: React.FC<SignInPageProps> = ({
  logoSrc,
  title = <span className="font-light text-foreground tracking-tighter">Bem-vindo</span>,
  description = "Entre para gerenciar seus veículos e canais.",
  heroImageSrc,
  onSignIn,
  onGoogleSignIn,
  onAppleSignIn,
  onFacebookSignIn,
  onResetPassword,
  onCreateAccount,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [viewMode, setViewMode] = useState<'login' | 'signup'>('login');
  const [signupStep, setSignupStep] = useState<1 | 2 | 3>(1);
  const [signupData, setSignupData] = useState<SignupData>({
    name: '',
    email: '',
    password: '',
    document: '',
    documentType: 'cpf',
    plan: ''
  });

  const handleSignupInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupData(prev => ({ ...prev, [name]: value }));
  };

  const handleDocumentTypeChange = (type: 'cpf' | 'cnpj') => {
    setSignupData(prev => ({ ...prev, documentType: type, document: '' }));
  };

  const handlePlanSelect = (plan: string) => {
    setSignupData(prev => ({ ...prev, plan }));
  };

  const handleCreateAccountSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onCreateAccount?.(signupData);
  };

  const goToSignup = () => {
    setViewMode('signup');
    setSignupStep(1);
    setSignupData({
      name: '',
      email: '',
      password: '',
      document: '',
      documentType: 'cpf',
      plan: ''
    });
  };

  const goToLogin = () => {
    setViewMode('login');
  };

  // Format CPF: 000.000.000-00
  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '').slice(0, 11);
    return numbers
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2');
  };

  // Format CNPJ: 00.000.000/0000-00
  const formatCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, '').slice(0, 14);
    return numbers
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d{1,2})/, '$1-$2');
  };

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const formatted = signupData.documentType === 'cpf' ? formatCPF(value) : formatCNPJ(value);
    setSignupData(prev => ({ ...prev, document: formatted }));
  };

  return (
    <div className="h-[100dvh] flex flex-col md:flex-row font-geist w-[100dvw]">
      {/* Left column: sign-in/signup form */}
      <section className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="flex flex-col gap-6">
            {logoSrc && (
              <img 
                src={logoSrc} 
                alt="Logo" 
                className="animate-element animate-delay-50 h-24 w-auto object-contain self-start" 
              />
            )}

            {viewMode === 'login' ? (
              // ============ LOGIN VIEW ============
              <>
                <h1 className="animate-element animate-delay-100 text-4xl md:text-5xl font-semibold leading-tight">{title}</h1>
                <p className="animate-element animate-delay-200 text-muted-foreground">{description}</p>

                <form className="space-y-5" onSubmit={onSignIn}>
                  <div className="animate-element animate-delay-300">
                    <label className="text-sm font-medium text-muted-foreground">Endereço de E-mail</label>
                    <GlassInputWrapper>
                      <input name="email" type="email" placeholder="Digite seu endereço de e-mail" className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none" />
                    </GlassInputWrapper>
                  </div>

                  <div className="animate-element animate-delay-400">
                    <label className="text-sm font-medium text-muted-foreground">Senha</label>
                    <GlassInputWrapper>
                      <div className="relative">
                        <input name="password" type={showPassword ? 'text' : 'password'} placeholder="Digite sua senha" className="w-full bg-transparent text-sm p-4 pr-12 rounded-2xl focus:outline-none" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-3 flex items-center">
                          {showPassword ? <EyeOff className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" /> : <Eye className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />}
                        </button>
                      </div>
                    </GlassInputWrapper>
                  </div>

                  <div className="animate-element animate-delay-500 flex items-center justify-between text-sm">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" name="rememberMe" className="custom-checkbox" />
                      <span className="text-foreground/90">Manter-me conectado</span>
                    </label>
                    <a href="#" onClick={(e) => { e.preventDefault(); onResetPassword?.(); }} className="hover:underline text-[#1f6ae1] transition-colors">Redefinir senha</a>
                  </div>

                  <button type="submit" className="animate-element animate-delay-600 w-full rounded-2xl bg-primary py-4 font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                    Entrar
                  </button>
                </form>

                <div className="animate-element animate-delay-700 relative flex items-center justify-center">
                  <span className="w-full border-t border-border"></span>
                  <span className="px-4 text-sm text-muted-foreground bg-background absolute">Ou continue com</span>
                </div>

                <div className="flex flex-col gap-3">
                  <button onClick={onGoogleSignIn} className="animate-element animate-delay-800 w-full flex items-center justify-center gap-3 border border-border rounded-2xl py-4 hover:bg-secondary transition-colors">
                      <GoogleIcon />
                      Continuar com Google
                  </button>

                  <div className="flex flex-row gap-3">
                    <button onClick={onAppleSignIn} className="animate-element animate-delay-850 flex-1 flex items-center justify-center gap-3 border border-border rounded-2xl py-4 hover:bg-secondary transition-colors">
                        <AppleIcon />
                        Apple
                    </button>

                    <button onClick={onFacebookSignIn} className="animate-element animate-delay-875 flex-1 flex items-center justify-center gap-3 border border-border rounded-2xl py-4 hover:bg-secondary transition-colors">
                        <FacebookIcon />
                        Facebook
                    </button>
                  </div>
                </div>

                <p className="animate-element animate-delay-900 text-center text-sm text-muted-foreground">
                  Novo em nossa plataforma? <a href="#" onClick={(e) => { e.preventDefault(); goToSignup(); }} className="text-[#1f6ae1] hover:underline transition-colors">Criar Conta</a>
                </p>
              </>
            ) : (
              // ============ SIGNUP VIEW ============
              <>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={goToLogin}
                    className="animate-element animate-delay-50 p-2 rounded-xl hover:bg-secondary transition-colors"
                    aria-label="Voltar para login"
                  >
                    <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                  </button>
                  <div>
                    <h1 className="animate-element animate-delay-100 text-3xl md:text-4xl font-semibold leading-tight text-foreground">Criar Conta</h1>
                    <p className="animate-element animate-delay-150 text-sm text-muted-foreground">
                      {signupStep === 1 && "Preencha seus dados de acesso"}
                      {signupStep === 2 && "Informe seu documento"}
                      {signupStep === 3 && "Escolha seu plano"}
                    </p>
                  </div>
                </div>

                <StepIndicator currentStep={signupStep} />

                <form className="space-y-5" onSubmit={handleCreateAccountSubmit}>
                  {/* STEP 1: Account Info */}
                  {signupStep === 1 && (
                    <>
                      <div className="animate-element animate-delay-200">
                        <label className="text-sm font-medium text-muted-foreground">Nome Completo</label>
                        <GlassInputWrapper>
                          <input 
                            name="name" 
                            type="text" 
                            placeholder="Digite seu nome completo" 
                            value={signupData.name}
                            onChange={handleSignupInputChange}
                            className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none" 
                          />
                        </GlassInputWrapper>
                      </div>

                      <div className="animate-element animate-delay-300">
                        <label className="text-sm font-medium text-muted-foreground">Endereço de E-mail</label>
                        <GlassInputWrapper>
                          <input 
                            name="email" 
                            type="email" 
                            placeholder="Digite seu endereço de e-mail" 
                            value={signupData.email}
                            onChange={handleSignupInputChange}
                            className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none" 
                          />
                        </GlassInputWrapper>
                      </div>

                      <div className="animate-element animate-delay-400">
                        <label className="text-sm font-medium text-muted-foreground">Senha</label>
                        <GlassInputWrapper>
                          <div className="relative">
                            <input 
                              name="password" 
                              type={showPassword ? 'text' : 'password'} 
                              placeholder="Crie uma senha segura" 
                              value={signupData.password}
                              onChange={handleSignupInputChange}
                              className="w-full bg-transparent text-sm p-4 pr-12 rounded-2xl focus:outline-none" 
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-3 flex items-center">
                              {showPassword ? <EyeOff className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" /> : <Eye className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />}
                            </button>
                          </div>
                        </GlassInputWrapper>
                      </div>

                  <button 
                    type="button" 
                    onClick={() => setSignupStep(2)}
                    className="animate-element animate-delay-500 w-full rounded-2xl bg-primary py-4 font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    Continuar
                  </button>

                  {/* Social Login Divider */}
                  <div className="animate-element animate-delay-550 relative flex items-center justify-center py-2">
                    <span className="w-full border-t border-border"></span>
                    <span className="px-4 text-sm text-muted-foreground bg-background absolute whitespace-nowrap">Ou cadastre-se com</span>
                  </div>

                  {/* Social Login Buttons */}
                  <button 
                    type="button"
                    onClick={onGoogleSignIn} 
                    className="animate-element animate-delay-600 w-full flex items-center justify-center gap-3 border border-border rounded-2xl py-4 font-medium hover:bg-secondary transition-colors"
                  >
                    <GoogleIcon />
                    Continuar com Google
                  </button>

                  <div className="flex flex-row gap-3">
                    <button 
                      type="button"
                      onClick={onAppleSignIn} 
                      className="animate-element animate-delay-650 flex-1 flex items-center justify-center gap-3 border border-border rounded-2xl py-4 font-medium hover:bg-secondary transition-colors"
                    >
                      <AppleIcon />
                      Apple
                    </button>

                    <button 
                      type="button"
                      onClick={onFacebookSignIn} 
                      className="animate-element animate-delay-700 flex-1 flex items-center justify-center gap-3 border border-border rounded-2xl py-4 font-medium hover:bg-secondary transition-colors"
                    >
                      <FacebookIcon />
                      Facebook
                    </button>
                  </div>
                </>
              )}

              {/* STEP 2: Document */}
                  {signupStep === 2 && (
                    <>
                      <div className="animate-element animate-delay-200">
                        <label className="text-sm font-medium text-muted-foreground mb-3 block">Tipo de Documento</label>
                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => handleDocumentTypeChange('cpf')}
                            className={`flex-1 py-3 px-4 rounded-xl border transition-all duration-200 text-sm font-medium
                              ${signupData.documentType === 'cpf' 
                                ? 'border-primary bg-primary/10 text-primary' 
                                : 'border-border hover:border-primary/50 text-muted-foreground hover:text-foreground'}`}
                          >
                            CPF (Pessoa Física)
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDocumentTypeChange('cnpj')}
                            className={`flex-1 py-3 px-4 rounded-xl border transition-all duration-200 text-sm font-medium
                              ${signupData.documentType === 'cnpj' 
                                ? 'border-primary bg-primary/10 text-primary' 
                                : 'border-border hover:border-primary/50 text-muted-foreground hover:text-foreground'}`}
                          >
                            CNPJ (Empresa)
                          </button>
                        </div>
                      </div>

                      <div className="animate-element animate-delay-300">
                        <label className="text-sm font-medium text-muted-foreground">
                          {signupData.documentType === 'cpf' ? 'CPF' : 'CNPJ'}
                        </label>
                        <GlassInputWrapper>
                          <input 
                            name="document" 
                            type="text" 
                            placeholder={signupData.documentType === 'cpf' ? '000.000.000-00' : '00.000.000/0000-00'} 
                            value={signupData.document}
                            onChange={handleDocumentChange}
                            className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none" 
                          />
                        </GlassInputWrapper>
                      </div>

                      <div className="animate-element animate-delay-400 flex gap-3">
                        <button 
                          type="button" 
                          onClick={() => setSignupStep(1)}
                          className="flex-1 rounded-2xl border border-border py-4 font-medium text-foreground hover:bg-secondary transition-colors"
                        >
                          Voltar
                        </button>
                        <button 
                          type="button" 
                          onClick={() => setSignupStep(3)}
                          className="flex-1 rounded-2xl bg-primary py-4 font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                          Continuar
                        </button>
                      </div>
                    </>
                  )}

                  {/* STEP 3: Plan Selection */}
                  {signupStep === 3 && (
                    <>
                      <div className="animate-element animate-delay-200 space-y-3">
                        <label className="text-sm font-medium text-muted-foreground mb-1 block">Escolha como sua operação vai funcionar</label>
                        <p className="text-xs text-muted-foreground mb-3">Você pode mudar de plano quando quiser.</p>
                        
                        <PlanCard 
                          name="Básico"
                          description="Ideal para quem quer publicar veículos e ter presença online."
                          price="R$ 49"
                          selected={signupData.plan === 'basic'}
                          onSelect={() => handlePlanSelect('basic')}
                        />
                        
                        <PlanCard 
                          name="Profissional"
                          description="Para revendas que anunciam em vários canais e lidam com leads diariamente."
                          price="R$ 99"
                          selected={signupData.plan === 'pro'}
                          onSelect={() => handlePlanSelect('pro')}
                          popular
                        />
                        
                        <PlanCard 
                          name="Empresarial"
                          description="Para lojas e concessionárias que exigem controle, escala e integração."
                          price="R$ 199"
                          selected={signupData.plan === 'enterprise'}
                          onSelect={() => handlePlanSelect('enterprise')}
                        />
                      </div>

                      <div className="animate-element animate-delay-300 flex gap-3">
                        <button 
                          type="button" 
                          onClick={() => setSignupStep(2)}
                          className="flex-1 rounded-2xl border border-border py-4 font-medium text-foreground hover:bg-secondary transition-colors"
                        >
                          Voltar
                        </button>
                        <button 
                          type="submit"
                          disabled={!signupData.plan}
                          className="flex-1 rounded-2xl bg-primary py-4 font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Criar Conta
                        </button>
                      </div>
                    </>
                  )}
                </form>

                <p className="animate-element animate-delay-500 text-center text-sm text-muted-foreground">
                  Já tem uma conta? <a href="#" onClick={(e) => { e.preventDefault(); goToLogin(); }} className="text-[#1f6ae1] hover:underline transition-colors">Entrar</a>
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Right column: hero image */}
      {heroImageSrc && (
        <section className="hidden md:block flex-1 relative p-4">
          <div className="animate-slide-right animate-delay-300 absolute inset-4 rounded-3xl bg-cover bg-center" style={{ backgroundImage: `url(${heroImageSrc})` }}></div>
        </section>
      )}
    </div>
  );
};
