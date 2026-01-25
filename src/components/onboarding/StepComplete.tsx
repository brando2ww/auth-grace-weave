import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Car, Link2, Loader2, Rocket, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepCompleteProps {
  onComplete: () => Promise<boolean>;
  isSubmitting: boolean;
}

const checklistItems = [
  { label: 'Dados da empresa validados', icon: CheckCircle2 },
  { label: 'Operação configurada', icon: CheckCircle2 },
  { label: 'Canais mapeados', icon: CheckCircle2 },
  { label: 'Acesso liberado', icon: CheckCircle2 },
];

export function StepComplete({ onComplete, isSubmitting }: StepCompleteProps) {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 animate-element">
      {/* Success Icon */}
      <div className="flex justify-center">
        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center animate-element animate-delay-100">
          <Rocket className="w-12 h-12 text-primary" />
        </div>
      </div>

      {/* Title */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground animate-element animate-delay-200">
          Sua conta está pronta para operar!
        </h1>
        <p className="text-muted-foreground animate-element animate-delay-300">
          Tudo configurado. Agora é hora de começar a vender.
        </p>
      </div>

      {/* Checklist */}
      <Card className="animate-element animate-delay-400">
        <CardContent className="pt-6">
          <ul className="space-y-4">
            {checklistItems.map((item, index) => (
              <li
                key={item.label}
                className={cn(
                  'flex items-center gap-3 animate-element',
                  `animate-delay-${500 + index * 100}`
                )}
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="font-medium">{item.label}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* CTAs */}
      <div className="space-y-3 animate-element animate-delay-900">
        <Button
          onClick={onComplete}
          disabled={isSubmitting}
          className="w-full h-14 text-lg"
          size="lg"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Finalizando...
            </>
          ) : (
            <>
              <Car className="mr-2 h-5 w-5" />
              Cadastrar primeiro veículo
              <ArrowRight className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>

        <Button
          variant="outline"
          disabled={isSubmitting}
          className="w-full h-12"
          onClick={onComplete}
        >
          <Link2 className="mr-2 h-4 w-4" />
          Conectar marketplaces (depois)
        </Button>
      </div>

      {/* Motivational message */}
      <p className="text-center text-sm text-muted-foreground animate-element animate-delay-1000">
        🎉 Você está pronto para revolucionar suas vendas!
      </p>
    </div>
  );
}
