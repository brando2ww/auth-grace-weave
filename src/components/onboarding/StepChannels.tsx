import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Loader2, Share2, Globe, MessageCircle, Instagram, Facebook, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepChannelsProps {
  initialData: string[];
  onSubmit: (channels: string[]) => Promise<boolean>;
  onBack: () => void;
  isSubmitting: boolean;
}

const channelOptions = [
  { id: 'site_proprio', label: 'Site próprio', icon: Globe, description: 'Seu website institucional' },
  { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, description: 'Atendimento direto' },
  { id: 'instagram', label: 'Instagram', icon: Instagram, description: 'Rede social visual' },
  { id: 'facebook', label: 'Facebook Marketplace', icon: Facebook, description: 'Marketplace do Facebook' },
  { id: 'olx', label: 'OLX', icon: ShoppingBag, description: 'Classificados online' },
  { id: 'webmotors', label: 'Webmotors', icon: ShoppingBag, description: 'Portal especializado' },
  { id: 'icarros', label: 'iCarros', icon: ShoppingBag, description: 'Portal especializado' },
  { id: 'mercadolivre', label: 'Mercado Livre', icon: ShoppingBag, description: 'E-commerce' },
  { id: 'outros', label: 'Outros', icon: Share2, description: 'Outros canais' },
];

export function StepChannels({ initialData, onSubmit, onBack, isSubmitting }: StepChannelsProps) {
  const [selectedChannels, setSelectedChannels] = useState<string[]>(initialData || []);

  const toggleChannel = (channelId: string) => {
    setSelectedChannels((prev) =>
      prev.includes(channelId)
        ? prev.filter((id) => id !== channelId)
        : [...prev, channelId]
    );
  };

  const handleSubmit = async () => {
    await onSubmit(selectedChannels);
  };

  const isFormValid = selectedChannels.length > 0;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 animate-element">
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          Onde você anuncia seus veículos hoje?
        </h1>
        <p className="text-muted-foreground">
          Selecione os canais que você utiliza atualmente. Integração vem depois!
        </p>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Share2 className="w-5 h-5 text-primary" />
            Canais de Venda
          </CardTitle>
          <CardDescription>
            Marque todos os canais que você usa para divulgar seus veículos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {channelOptions.map((channel, index) => {
              const Icon = channel.icon;
              const isSelected = selectedChannels.includes(channel.id);

              return (
                <Label
                  key={channel.id}
                  htmlFor={channel.id}
                  className={cn(
                    'flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all animate-element',
                    isSelected
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50',
                    `animate-delay-${(index % 5) * 100}`
                  )}
                >
                  <Checkbox
                    id={channel.id}
                    checked={isSelected}
                    onCheckedChange={() => toggleChannel(channel.id)}
                    disabled={isSubmitting}
                  />
                  <Icon className={cn(
                    'w-5 h-5',
                    isSelected ? 'text-primary' : 'text-muted-foreground'
                  )} />
                  <div className="flex-1">
                    <span className="font-medium">{channel.label}</span>
                    <p className="text-xs text-muted-foreground">{channel.description}</p>
                  </div>
                </Label>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Selected count */}
      {selectedChannels.length > 0 && (
        <p className="text-center text-sm text-muted-foreground">
          {selectedChannels.length} {selectedChannels.length === 1 ? 'canal selecionado' : 'canais selecionados'}
        </p>
      )}

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
