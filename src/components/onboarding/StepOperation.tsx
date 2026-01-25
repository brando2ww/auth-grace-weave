import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Loader2, Package, Car, Users } from 'lucide-react';
import { OperationData } from '@/hooks/useOnboarding';
import { cn } from '@/lib/utils';

interface StepOperationProps {
  initialData: OperationData | null;
  onSubmit: (data: OperationData) => Promise<boolean>;
  onBack: () => void;
  isSubmitting: boolean;
}

const stockSizeOptions = [
  { value: '1-10', label: '1–10', description: 'Pequeno estoque' },
  { value: '11-30', label: '11–30', description: 'Médio porte' },
  { value: '31-80', label: '31–80', description: 'Grande estoque' },
  { value: '80+', label: '80+', description: 'Estoque extenso' },
];

const vehicleTypeOptions = [
  { value: 'novos', label: 'Novos', description: 'Apenas veículos 0km' },
  { value: 'usados', label: 'Usados', description: 'Apenas seminovos' },
  { value: 'ambos', label: 'Ambos', description: 'Novos e usados' },
];

const teamSizeOptions = [
  { value: 'solo', label: 'Só eu', description: 'Operação individual' },
  { value: '2-5', label: '2–5', description: 'Equipe pequena' },
  { value: '6-10', label: '6–10', description: 'Equipe média' },
  { value: '10+', label: '10+', description: 'Grande equipe' },
];

export function StepOperation({ initialData, onSubmit, onBack, isSubmitting }: StepOperationProps) {
  const [stockSize, setStockSize] = useState(initialData?.stock_size || '');
  const [vehicleTypes, setVehicleTypes] = useState(initialData?.vehicle_types || '');
  const [teamSize, setTeamSize] = useState(initialData?.team_size || '');

  const handleSubmit = async () => {
    await onSubmit({
      stock_size: stockSize,
      vehicle_types: vehicleTypes,
      team_size: teamSize,
    });
  };

  const isFormValid = stockSize && vehicleTypes && teamSize;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 animate-element">
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          Perfil da sua operação
        </h1>
        <p className="text-muted-foreground">
          Conte-nos um pouco sobre como sua revenda funciona.
        </p>
      </div>

      {/* Stock Size */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            Quantos veículos você costuma ter em estoque?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={stockSize}
            onValueChange={setStockSize}
            className="grid grid-cols-2 gap-3"
          >
            {stockSizeOptions.map((option) => (
              <Label
                key={option.value}
                htmlFor={`stock-${option.value}`}
                className={cn(
                  'flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all',
                  stockSize === option.value
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                )}
              >
                <RadioGroupItem
                  value={option.value}
                  id={`stock-${option.value}`}
                  className="sr-only"
                />
                <span className="text-lg font-semibold">{option.label}</span>
                <span className="text-xs text-muted-foreground">{option.description}</span>
              </Label>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Vehicle Types */}
      <Card className="animate-element animate-delay-100">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Car className="w-5 h-5 text-primary" />
            Que tipo de veículos você vende?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={vehicleTypes}
            onValueChange={setVehicleTypes}
            className="grid grid-cols-3 gap-3"
          >
            {vehicleTypeOptions.map((option) => (
              <Label
                key={option.value}
                htmlFor={`vehicle-${option.value}`}
                className={cn(
                  'flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all',
                  vehicleTypes === option.value
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                )}
              >
                <RadioGroupItem
                  value={option.value}
                  id={`vehicle-${option.value}`}
                  className="sr-only"
                />
                <span className="text-lg font-semibold">{option.label}</span>
                <span className="text-xs text-muted-foreground text-center">{option.description}</span>
              </Label>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Team Size */}
      <Card className="animate-element animate-delay-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Quantas pessoas vendem hoje?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={teamSize}
            onValueChange={setTeamSize}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3"
          >
            {teamSizeOptions.map((option) => (
              <Label
                key={option.value}
                htmlFor={`team-${option.value}`}
                className={cn(
                  'flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all',
                  teamSize === option.value
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                )}
              >
                <RadioGroupItem
                  value={option.value}
                  id={`team-${option.value}`}
                  className="sr-only"
                />
                <span className="text-lg font-semibold">{option.label}</span>
                <span className="text-xs text-muted-foreground text-center">{option.description}</span>
              </Label>
            ))}
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
