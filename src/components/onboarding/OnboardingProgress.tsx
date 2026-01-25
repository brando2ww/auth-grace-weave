import { Check, Building2, Users, Share2, Target, Rocket } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
}

const steps = [
  { number: 1, label: 'Empresa', icon: Building2 },
  { number: 2, label: 'Operação', icon: Users },
  { number: 3, label: 'Canais', icon: Share2 },
  { number: 4, label: 'Objetivo', icon: Target },
  { number: 5, label: 'Pronto', icon: Rocket },
];

export function OnboardingProgress({ currentStep, totalSteps }: OnboardingProgressProps) {
  return (
    <div className="w-full py-4 px-4 sm:px-6 border-b bg-background/95 backdrop-blur sticky top-0 z-10">
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = step.number < currentStep;
          const isCurrent = step.number === currentStep;
          const isPending = step.number > currentStep;
          
          return (
            <div key={step.number} className="flex items-center">
              {/* Step indicator */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300',
                    isCompleted && 'bg-primary text-primary-foreground',
                    isCurrent && 'bg-primary text-primary-foreground ring-4 ring-primary/20',
                    isPending && 'bg-muted text-muted-foreground'
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
                <span
                  className={cn(
                    'mt-2 text-xs font-medium hidden sm:block',
                    isCurrent && 'text-primary',
                    isPending && 'text-muted-foreground',
                    isCompleted && 'text-foreground'
                  )}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'w-8 sm:w-12 lg:w-16 h-0.5 mx-1 sm:mx-2 transition-colors duration-300',
                    step.number < currentStep ? 'bg-primary' : 'bg-muted'
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Progress text for mobile */}
      <div className="sm:hidden text-center mt-3">
        <span className="text-sm font-medium text-foreground">
          {steps[currentStep - 1]?.label}
        </span>
        <span className="text-sm text-muted-foreground ml-2">
          ({currentStep}/{totalSteps})
        </span>
      </div>
    </div>
  );
}
