import React, { useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import VehiclePhotoUpload from "@/components/VehiclePhotoUpload";

const vehicleTypes = [
  "Agrícolas", "Antigos", "Bicicleta Elétrica", "Camionetes", "Carros",
  "Empilhadeira", "Kart", "Motos", "Náuticos", "Off-Roads", "Outros",
  "Patinete Elétrico", "Quadriciclos", "Reboques", "Scooter Elétrico",
  "Trailer", "Triciclos", "Utilitários", "Van",
];

const combustivelOptions = ["Flex", "Gasolina", "Etanol", "Diesel", "Elétrico", "Híbrido"];
const cambioOptions = ["Manual", "Automático", "CVT", "Automatizado"];
const portasOptions = ["2", "3", "4"];
const tracaoOptions = ["Dianteira", "Traseira", "4x4", "AWD"];

interface EntradaVeiculoProps {
  onBack: () => void;
}

export default function EntradaVeiculo({ onBack }: EntradaVeiculoProps) {
  const [form, setForm] = useState({
    tipo: "",
    marca: "",
    modelo: "",
    versao: "",
    placa: "",
    anoFabr: "",
    anoModelo: "",
    combustivel: "",
    cambio: "",
    portas: "",
    cor: "",
    km: "",
    tracao: "",
    carroceria: "",
    preco: "",
    valorTroca: "",
    valorPromocional: "",
    valorEntrada: "",
    valorParcela: "",
    tituloOferta: "",
    equipamentos: "",
    adicionais: "",
    observacao: "",
    video: "",
  });

  const [photos, setPhotos] = useState<{ url: string; name: string }[]>([]);
  const [mainPhotoIndex, setMainPhotoIndex] = useState(0);

  const [toggles, setToggles] = useState({
    airBag: false,
    freioAbs: false,
    alarme: false,
    arCondicionado: false,
    blindado: false,
    tetoSolar: false,
    turbo: false,
    vidrosEletricos: false,
    travasEletricas: false,
    desembacadorTraseiro: false,
    direcaoHidraulica: false,
  });

  const updateField = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const toggleField = (field: string) =>
    setToggles((prev) => ({ ...prev, [field]: !prev[field as keyof typeof prev] }));

  const handleSave = () => {
    const foto1 = photos[mainPhotoIndex]?.url || "";
    const fotosUrls = photos.map((p) => p.url);
    console.log("Vehicle data:", { ...form, ...toggles, foto1, fotos: fotosUrls });
    onBack();
  };

  return (
    <div className="flex-1 p-8 overflow-y-auto bg-background">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Entrada de Veículo</h1>
            <p className="text-sm text-muted-foreground">Cadastre um novo veículo no estoque.</p>
          </div>
        </div>
        <Button onClick={handleSave} size="sm">
          <Save className="h-4 w-4 mr-1" />
          Salvar
        </Button>
      </div>

      {/* Dados Básicos */}
      <Section title="Dados Básicos">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Field label="Tipo">
            <Select value={form.tipo} onValueChange={(v) => updateField("tipo", v)}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                {vehicleTypes.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Marca">
            <Input value={form.marca} onChange={(e) => updateField("marca", e.target.value)} placeholder="Ex: Honda" />
          </Field>
          <Field label="Modelo">
            <Input value={form.modelo} onChange={(e) => updateField("modelo", e.target.value)} placeholder="Ex: Civic" />
          </Field>
          <Field label="Versão">
            <Input value={form.versao} onChange={(e) => updateField("versao", e.target.value)} placeholder="Ex: Touring" />
          </Field>
          <Field label="Placa">
            <Input value={form.placa} onChange={(e) => updateField("placa", e.target.value)} placeholder="ABC-1D23" />
          </Field>
          <Field label="Ano Fabricação">
            <Input type="number" value={form.anoFabr} onChange={(e) => updateField("anoFabr", e.target.value)} placeholder="2024" />
          </Field>
          <Field label="Ano Modelo">
            <Input type="number" value={form.anoModelo} onChange={(e) => updateField("anoModelo", e.target.value)} placeholder="2025" />
          </Field>
          <Field label="Combustível">
            <Select value={form.combustivel} onValueChange={(v) => updateField("combustivel", v)}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                {combustivelOptions.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Câmbio">
            <Select value={form.cambio} onValueChange={(v) => updateField("cambio", v)}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                {cambioOptions.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Portas">
            <Select value={form.portas} onValueChange={(v) => updateField("portas", v)}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                {portasOptions.map((p) => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Cor">
            <Input value={form.cor} onChange={(e) => updateField("cor", e.target.value)} placeholder="Ex: Preto" />
          </Field>
          <Field label="Quilometragem">
            <Input type="number" value={form.km} onChange={(e) => updateField("km", e.target.value)} placeholder="0" />
          </Field>
          <Field label="Tração">
            <Select value={form.tracao} onValueChange={(v) => updateField("tracao", v)}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                {tracaoOptions.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Carroceria">
            <Input value={form.carroceria} onChange={(e) => updateField("carroceria", e.target.value)} placeholder="Ex: Sedan" />
          </Field>
        </div>
      </Section>

      {/* Valores */}
      <Section title="Valores">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Field label="Preço (R$)">
            <Input type="number" value={form.preco} onChange={(e) => updateField("preco", e.target.value)} placeholder="0" />
          </Field>
          <Field label="Valor Troca (R$)">
            <Input type="number" value={form.valorTroca} onChange={(e) => updateField("valorTroca", e.target.value)} placeholder="0" />
          </Field>
          <Field label="Valor Promocional (R$)">
            <Input type="number" value={form.valorPromocional} onChange={(e) => updateField("valorPromocional", e.target.value)} placeholder="0" />
          </Field>
          <Field label="Valor Entrada (R$)">
            <Input type="number" value={form.valorEntrada} onChange={(e) => updateField("valorEntrada", e.target.value)} placeholder="0" />
          </Field>
          <Field label="Valor Parcela (R$)">
            <Input type="number" value={form.valorParcela} onChange={(e) => updateField("valorParcela", e.target.value)} placeholder="0" />
          </Field>
        </div>
      </Section>

      {/* Opcionais */}
      <Section title="Opcionais">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[
            { key: "airBag", label: "Air Bag" },
            { key: "freioAbs", label: "Freio ABS" },
            { key: "alarme", label: "Alarme" },
            { key: "arCondicionado", label: "Ar Condicionado" },
            { key: "blindado", label: "Blindado" },
            { key: "tetoSolar", label: "Teto Solar" },
            { key: "turbo", label: "Turbo" },
            { key: "vidrosEletricos", label: "Vidros Elétricos" },
            { key: "travasEletricas", label: "Travas Elétricas" },
            { key: "desembacadorTraseiro", label: "Desembaçador Traseiro" },
            { key: "direcaoHidraulica", label: "Direção Hidráulica" },
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between rounded-lg border border-border p-3 bg-card">
              <Label className="text-sm text-foreground cursor-pointer">{label}</Label>
              <Switch
                checked={toggles[key as keyof typeof toggles]}
                onCheckedChange={() => toggleField(key)}
              />
            </div>
          ))}
        </div>
      </Section>

      {/* Informações Adicionais */}
      <Section title="Informações Adicionais">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Título da Oferta">
            <Input value={form.tituloOferta} onChange={(e) => updateField("tituloOferta", e.target.value)} placeholder="Ex: Oportunidade única!" />
          </Field>
          <Field label="Vídeo (URL)">
            <Input value={form.video} onChange={(e) => updateField("video", e.target.value)} placeholder="https://..." />
          </Field>
          <Field label="Fotos (URL)">
            <Input value={form.fotos} onChange={(e) => updateField("fotos", e.target.value)} placeholder="https://..." />
          </Field>
          <Field label="Foto Principal (URL)">
            <Input value={form.foto1} onChange={(e) => updateField("foto1", e.target.value)} placeholder="https://..." />
          </Field>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Field label="Equipamentos">
            <Textarea value={form.equipamentos} onChange={(e) => updateField("equipamentos", e.target.value)} placeholder="Liste os equipamentos..." rows={3} />
          </Field>
          <Field label="Adicionais">
            <Textarea value={form.adicionais} onChange={(e) => updateField("adicionais", e.target.value)} placeholder="Informações adicionais..." rows={3} />
          </Field>
        </div>
        <div className="mt-4">
          <Field label="Observação">
            <Textarea value={form.observacao} onChange={(e) => updateField("observacao", e.target.value)} placeholder="Observações gerais..." rows={3} />
          </Field>
        </div>
      </Section>

      {/* Footer Save */}
      <div className="flex justify-end mt-8 pb-4">
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-1" />
          Salvar Veículo
        </Button>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
