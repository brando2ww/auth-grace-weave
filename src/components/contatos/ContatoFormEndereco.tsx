import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import { maskCep } from "@/lib/masks";

interface Props {
  cep: string; setCep: (v: string) => void;
  rua: string; setRua: (v: string) => void;
  numeroEndereco: string; setNumeroEndereco: (v: string) => void;
  complemento: string; setComplemento: (v: string) => void;
  bairro: string; setBairro: (v: string) => void;
  cidade: string; setCidade: (v: string) => void;
  estado: string; setEstado: (v: string) => void;
  pais: string; setPais: (v: string) => void;
}

export default function ContatoFormEndereco(props: Props) {
  const [buscando, setBuscando] = useState(false);

  const buscarCep = async () => {
    const cepLimpo = props.cep.replace(/\D/g, "");
    if (cepLimpo.length !== 8) return;
    setBuscando(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await res.json();
      if (!data.erro) {
        props.setRua(data.logradouro || "");
        props.setBairro(data.bairro || "");
        props.setCidade(data.localidade || "");
        props.setEstado(data.uf || "");
      }
    } catch {
      // silently fail
    } finally {
      setBuscando(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="cep">CEP</Label>
        <div className="flex gap-2">
          <Input id="cep" placeholder="00000-000" maxLength={9} value={props.cep} onChange={(e) => props.setCep(maskCep(e.target.value))} className="flex-1" />
          <Button type="button" variant="outline" size="icon" onClick={buscarCep} disabled={buscando}>
            {buscando ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="rua">Rua</Label>
        <Input id="rua" placeholder="Nome da rua" value={props.rua} onChange={(e) => props.setRua(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="numero_end">Número</Label>
        <Input id="numero_end" placeholder="Nº" value={props.numeroEndereco} onChange={(e) => props.setNumeroEndereco(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="complemento">Complemento</Label>
        <Input id="complemento" placeholder="Apto, bloco..." value={props.complemento} onChange={(e) => props.setComplemento(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="bairro">Bairro</Label>
        <Input id="bairro" placeholder="Bairro" value={props.bairro} onChange={(e) => props.setBairro(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="cidade">Cidade</Label>
        <Input id="cidade" placeholder="Cidade" value={props.cidade} onChange={(e) => props.setCidade(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="estado">Estado</Label>
        <Input id="estado" placeholder="UF" value={props.estado} onChange={(e) => props.setEstado(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="pais">País</Label>
        <Input id="pais" placeholder="País" value={props.pais} onChange={(e) => props.setPais(e.target.value)} />
      </div>
    </div>
  );
}
