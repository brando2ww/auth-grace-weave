import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Loader2, Target, Layers, Users, Settings, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepObjectiveProps {
  initialData: string | null;
  onSubmit: (objective: string) => Promise<boolean>;
  onBack: () => void;
  isSubmitting: boolean;
}

const objectiveOptions = [
  {
    value: 'multichannel',
    label: 'Publicar em vários marketplaces sem retrabalho',
    description: 'Anuncie uma vez e apareça em todos os portais',
    icon: Layers,
  },
  {
    value: 'leads',
    label: 'Organizar leads',
    description: 'Centralize e não perca nenhuma oportunidade',
    icon: Users,
  },
  {
    value: 'operation',
    label: 'Padronizar operação',
    description: 'Processos claros e equipe alinhada',
    icon: Settings,
  },
  {
    value: 'reports',
    label: 'Ter relatórios confiáveis',
    description: 'Dados reais para tomar decisões melhores',
    icon: BarChart3,
  },
];

export function StepObjective({ initialData, onSubmit, onBack, isSubmitting }: StepObjectiveProps) {
  const [objective, setObjective] = useState(initialData || '');

  const handleSubmit = async () => {
    await onSubmit(objective);
  };

  const isFormValid = objective.length > 0;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 animate-element">
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          Qual o principal objetivo com a WiseAuto?
        </h1>
        <p className="text-muted-foreground">
          Isso nos ajuda a personalizar sua experiência.
        </p>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Seu Objetivo Principal
          </CardTitle>
          <CardDescription>
            Escolha o que mais importa para você agora.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={objective}
            onValueChange={setObjective}
            className="space-y-3"
          >
            {objectiveOptions.map((option, index) => {
              const Icon = option.icon;
              const isSelected = objective === option.value;

              return (
                <Label
                  key={option.value}
                  htmlFor={`objective-${option.value}`}
                  className={cn(
                    'flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all animate-element',
                    isSelected
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50',
                    `animate-delay-${index * 100}`
                  )}
                >
                  <RadioGroupItem
                    value={option.value}
                    id={`objective-${option.value}`}
                    className="sr-only"
                  />
                  <div className={cn(
                    'w-12 h-12 rounded-full flex items-center justify-center',
                    isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  )}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <span className="font-medium text-lg">{option.label}</span>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </div>
                </Label>
              );
            })}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={isSubmitting}
          className="flex-1"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!isFormValid || isSubmitting}
          className="flex-[2] h-12"
          size="lg"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Salvando...
            </>
          ) : (
            'Continuar'
          )}
        </Button>
      </div>
    </div>
  );
}
