import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import { useOnboarding } from '@/hooks/useOnboarding';
import { Loader2, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OnboardingProgress } from '@/components/onboarding/OnboardingProgress';
import { StepCompany } from '@/components/onboarding/StepCompany';
import { StepOperation } from '@/components/onboarding/StepOperation';
import { StepChannels } from '@/components/onboarding/StepChannels';
import { StepObjective } from '@/components/onboarding/StepObjective';
import { StepComplete } from '@/components/onboarding/StepComplete';

const Onboarding = () => {
  const navigate = useNavigate();
  const { profile, signOut, loading: authLoading, isAuthenticated } = useAuthContext();
  
  const {
    currentStep,
    totalSteps,
    isSubmitting,
    isLoading,
    companyData,
    operationData,
    channels,
    mainObjective,
    saveCompanyData,
    saveOperationData,
    saveChannelsData,
    saveObjectiveData,
    completeOnboarding,
    goBack,
  } = useOnboarding();

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/');
    }
  }, [authLoading, isAuthenticated, navigate]);

  // Redirect if onboarding is already completed
  useEffect(() => {
    if (profile?.onboarding_completed) {
      navigate('/dashboard');
    }
  }, [profile, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepCompany
            initialData={companyData}
            onSubmit={saveCompanyData}
            isSubmitting={isSubmitting}
          />
        );
      case 2:
        return (
          <StepOperation
            initialData={operationData}
            onSubmit={saveOperationData}
            onBack={goBack}
            isSubmitting={isSubmitting}
          />
        );
      case 3:
        return (
          <StepChannels
            initialData={channels}
            onSubmit={saveChannelsData}
            onBack={goBack}
            isSubmitting={isSubmitting}
          />
        );
      case 4:
        return (
          <StepObjective
            initialData={mainObjective}
            onSubmit={saveObjectiveData}
            onBack={goBack}
            isSubmitting={isSubmitting}
          />
        );
      case 5:
        return (
          <StepComplete
            onComplete={completeOnboarding}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header with progress */}
      <OnboardingProgress currentStep={currentStep} totalSteps={totalSteps} />

      {/* Main content */}
      <main className="flex-1 flex items-start justify-center p-4 sm:p-6 lg:p-8 pt-8">
        {renderStep()}
      </main>

      {/* Footer with sign out */}
      <footer className="py-4 px-6 border-t bg-background/95 backdrop-blur">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Olá, {profile?.first_name || 'usuário'}!
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default Onboarding;
