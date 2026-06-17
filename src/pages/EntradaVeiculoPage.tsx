import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { ArrowLeft, Save, Upload, X, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { veiculosMock } from "@/data/veiculos";

const tiposVeiculo = [
  "Agrícolas", "Antigos", "Bicicleta Elétrica", "Camionetes", "Carros", "Empilhadeira",
  "Kart", "Motos", "Náuticos", "Off-Roads", "Outros", "Patinete Elétrico",
  "Quadriciclos", "Reboques", "Scooter Elétrico", "Trailer", "Triciclos", "Utilitários", "Van",
];

const combustiveis = ["Flex", "Gasolina", "Etanol", "Diesel", "Elétrico", "Híbrido"];
const cambios = ["Manual", "Automático", "CVT", "Automatizado"];
const portas = ["2", "3", "4"];
const tracoes = ["Dianteira", "Traseira", "4x4", "AWD"];

const opcionaisLista = [
  "Air Bag", "Freio ABS", "Alarme", "Ar Condicionado", "Blindado",
  "Teto Solar", "Turbo", "Vidros Elétricos", "Travas Elétricas",
  "Desembaçador Traseiro", "Direção Hidráulica",
];

interface FotoItem {
  url: string;
  name: string;
}

const EntradaVeiculoPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  // Dados básicos
  const [tipo, setTipo] = useState("");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [versao, setVersao] = useState("");
  const [placa, setPlaca] = useState("");
  const [anoFab, setAnoFab] = useState("");
  const [anoModelo, setAnoModelo] = useState("");
  const [combustivel, setCombustivel] = useState("");
  const [cambio, setCambio] = useState("");
  const [portasSel, setPortasSel] = useState("");
  const [cor, setCor] = useState("");
  const [km, setKm] = useState("");
  const [tracao, setTracao] = useState("");
  const [carroceria, setCarroceria] = useState("");

  // Valores
  const [preco, setPreco] = useState("");
  const [valorTroca, setValorTroca] = useState("");
  const [valorPromocional, setValorPromocional] = useState("");
  const [valorEntrada, setValorEntrada] = useState("");
  const [valorParcela, setValorParcela] = useState("");

  // Opcionais
  const [opcionais, setOpcionais] = useState<Record<string, boolean>>(
    Object.fromEntries(opcionaisLista.map((o) => [o, false]))
  );

  // Adicionais
  const [tituloOferta, setTituloOferta] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [fotos, setFotos] = useState<FotoItem[]>([]);
  const [fotoPrincipal, setFotoPrincipal] = useState(0);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [fotoUrlInput, setFotoUrlInput] = useState("");
  const [equipamentos, setEquipamentos] = useState("");
  const [adicionais, setAdicionais] = useState("");
  const [observacao, setObservacao] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Carregar dados do veículo existente ao editar
  useEffect(() => {
    if (!id) return;
    const veiculo = veiculosMock.find((v) => v.id === id);
    if (!veiculo) return;

    // Parsear nome: primeira palavra = marca, restante = modelo
    const partes = veiculo.nome.split(" ");
    setMarca(partes[0] || "");
    setModelo(partes.slice(1).join(" ") || "");

    setTipo(veiculo.tipo);
    setPlaca(veiculo.placa);
    setAnoFab(String(veiculo.ano));
    setAnoModelo(String(veiculo.ano));
    setCombustivel(veiculo.combustivel);
    setCambio(veiculo.cambio);
    setKm(String(veiculo.km));
    setPreco(String(veiculo.preco));
    setTituloOferta(veiculo.nome);

    if (veiculo.imagem) {
      setFotos([{ url: veiculo.imagem, name: "Foto principal" }]);
    }
  }, [id]);

  const handleToggleOpcional = (key: string) => {
    setOpcionais((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const uploadFile = useCallback(async (file: File) => {
    const ext = file.name.split(".").pop();
    const filePath = `${crypto.randomUUID()}.${ext}`;
    setUploadProgress(0);

    const { error } = await supabase.storage
      .from("vehicle-photos")
      .upload(filePath, file, { upsert: false });

    if (error) {
      toast({ title: "Erro no upload", description: error.message, variant: "destructive" });
      setUploadProgress(null);
      return;
    }

    const { data: urlData } = supabase.storage.from("vehicle-photos").getPublicUrl(filePath);
    setFotos((prev) => [...prev, { url: urlData.publicUrl, name: file.name }]);
    setUploadProgress(100);
    setTimeout(() => setUploadProgress(null), 800);
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    for (const file of Array.from(files)) {
      await uploadFile(file);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      const files = e.dataTransfer.files;
      for (const file of Array.from(files)) {
        await uploadFile(file);
      }
    },
    [uploadFile]
  );

  const addFotoByUrl = () => {
    if (!fotoUrlInput.trim()) return;
    setFotos((prev) => [...prev, { url: fotoUrlInput.trim(), name: "URL" }]);
    setFotoUrlInput("");
  };

  const removeFoto = (idx: number) => {
    setFotos((prev) => prev.filter((_, i) => i !== idx));
    if (fotoPrincipal === idx) setFotoPrincipal(0);
    else if (fotoPrincipal > idx) setFotoPrincipal((p) => p - 1);
  };

  const handleSalvar = () => {
    toast({ title: "Veículo salvo", description: "O veículo foi cadastrado com sucesso." });
    navigate("/estoque");
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="outline" className="gap-2" onClick={() => navigate("/estoque")}>
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Button>
        <Button className="bg-[#1c72e3] hover:bg-[#1c72e3]/90 text-white gap-2" onClick={handleSalvar}>
          <Save className="h-4 w-4" /> Salvar
        </Button>
      </div>

      <div>
        <h1 className="text-xl font-bold text-foreground">{isEditing ? "Editar Veículo" : "Entrada de Veículo"}</h1>
        <p className="text-sm text-muted-foreground">{isEditing ? "Edite as informações do veículo." : "Cadastre um novo veículo no estoque."}</p>
      </div>

      {/* Seção 1 — Dados Básicos */}
      <section className="space-y-4 border-b border-border pb-6">
        <h2 className="text-base font-semibold text-foreground">Dados Básicos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label>Tipo</Label>
            <Select value={tipo} onValueChange={setTipo}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                {tiposVeiculo.map((t) => (<SelectItem key={t} value={t}>{t}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Marca</Label>
            <Input placeholder="Ex: Honda" value={marca} onChange={(e) => setMarca(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Modelo</Label>
            <Input placeholder="Ex: Civic" value={modelo} onChange={(e) => setModelo(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Versão</Label>
            <Input placeholder="Ex: Touring" value={versao} onChange={(e) => setVersao(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Placa</Label>
            <Input placeholder="ABC-1D23" value={placa} onChange={(e) => setPlaca(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Ano Fabricação</Label>
            <Input type="number" placeholder="2024" value={anoFab} onChange={(e) => setAnoFab(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Ano Modelo</Label>
            <Input type="number" placeholder="2025" value={anoModelo} onChange={(e) => setAnoModelo(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Combustível</Label>
            <Select value={combustivel} onValueChange={setCombustivel}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                {combustiveis.map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Câmbio</Label>
            <Select value={cambio} onValueChange={setCambio}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                {cambios.map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Portas</Label>
            <Select value={portasSel} onValueChange={setPortasSel}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                {portas.map((p) => (<SelectItem key={p} value={p}>{p}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Cor</Label>
            <Input placeholder="Ex: Preto" value={cor} onChange={(e) => setCor(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Quilometragem</Label>
            <Input type="number" placeholder="0" value={km} onChange={(e) => setKm(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Tração</Label>
            <Select value={tracao} onValueChange={setTracao}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                {tracoes.map((t) => (<SelectItem key={t} value={t}>{t}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Carroceria</Label>
            <Input placeholder="Ex: Sedan" value={carroceria} onChange={(e) => setCarroceria(e.target.value)} />
          </div>
        </div>
      </section>

      {/* Seção 2 — Valores */}
      <section className="space-y-4 border-b border-border pb-6">
        <h2 className="text-base font-semibold text-foreground">Valores</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { label: "Preço (R$)", val: preco, set: setPreco },
            { label: "Valor Troca (R$)", val: valorTroca, set: setValorTroca },
            { label: "Valor Promocional (R$)", val: valorPromocional, set: setValorPromocional },
            { label: "Valor Entrada (R$)", val: valorEntrada, set: setValorEntrada },
            { label: "Valor Parcela (R$)", val: valorParcela, set: setValorParcela },
          ].map((f) => (
            <div key={f.label} className="space-y-1.5">
              <Label>{f.label}</Label>
              <Input type="number" placeholder="0" value={f.val} onChange={(e) => f.set(e.target.value)} />
            </div>
          ))}
        </div>
      </section>

      {/* Seção 3 — Opcionais */}
      <section className="space-y-4 border-b border-border pb-6">
        <h2 className="text-base font-semibold text-foreground">Opcionais</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {opcionaisLista.map((op) => (
            <div
              key={op}
              className="flex items-center justify-between border border-border rounded-lg px-3 py-2.5"
            >
              <span className="text-sm text-foreground">{op}</span>
              <Switch checked={opcionais[op]} onCheckedChange={() => handleToggleOpcional(op)} />
            </div>
          ))}
        </div>
      </section>

      {/* Seção 4 — Informações Adicionais */}
      <section className="space-y-4 pb-6">
        <h2 className="text-base font-semibold text-foreground">Informações Adicionais</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Título da Oferta</Label>
            <Input placeholder="Ex: Honda Civic completo" value={tituloOferta} onChange={(e) => setTituloOferta(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Vídeo URL</Label>
            <Input placeholder="https://youtube.com/..." value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} />
          </div>
        </div>

        {/* Upload de Fotos */}
        <div className="space-y-3">
          <Label>Fotos</Label>
          <div
            className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted/40 transition-colors"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <Upload className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Arraste imagens aqui ou clique para selecionar</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {uploadProgress !== null && (
            <Progress value={uploadProgress} className="h-2" />
          )}

          {/* Upload por URL */}
          <div className="flex gap-2">
            <Input
              placeholder="Adicionar foto por URL"
              value={fotoUrlInput}
              onChange={(e) => setFotoUrlInput(e.target.value)}
              className="flex-1"
            />
            <Button variant="outline" onClick={addFotoByUrl}>Adicionar</Button>
          </div>

          {/* Grid de previews */}
          {fotos.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {fotos.map((foto, idx) => (
                <div
                  key={idx}
                  className={`relative group rounded-lg overflow-hidden border-2 ${
                    idx === fotoPrincipal ? "border-primary" : "border-border"
                  }`}
                >
                  <img
                    src={foto.url}
                    alt={foto.name}
                    className="w-full h-32 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.svg";
                    }}
                  />
                  {idx === fotoPrincipal && (
                    <span className="absolute top-1 left-1 bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded font-medium">
                      Principal
                    </span>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      className="bg-background/90 rounded-full p-1.5 hover:bg-background"
                      onClick={() => setFotoPrincipal(idx)}
                      title="Definir como principal"
                    >
                      <Star className="h-4 w-4 text-yellow-500" />
                    </button>
                    <button
                      className="bg-background/90 rounded-full p-1.5 hover:bg-background"
                      onClick={() => removeFoto(idx)}
                      title="Remover"
                    >
                      <X className="h-4 w-4 text-destructive" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Equipamentos</Label>
            <Textarea rows={3} placeholder="Liste os equipamentos..." value={equipamentos} onChange={(e) => setEquipamentos(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Adicionais</Label>
            <Textarea rows={3} placeholder="Liste os adicionais..." value={adicionais} onChange={(e) => setAdicionais(e.target.value)} />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Observação</Label>
          <Textarea rows={3} placeholder="Observações gerais..." value={observacao} onChange={(e) => setObservacao(e.target.value)} />
        </div>
      </section>

      {/* Rodapé */}
      <div className="flex justify-end pb-4">
        <Button className="bg-[#1c72e3] hover:bg-[#1c72e3]/90 text-white gap-2" onClick={handleSalvar}>
          <Save className="h-4 w-4" /> Salvar Veículo
        </Button>
      </div>
    </DashboardLayout>
  );
};

export default EntradaVeiculoPage;
