import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props {
  tipoContato: string; setTipoContato: (v: string) => void;
  origemContato: string; setOrigemContato: (v: string) => void;
  statusFunil: string; setStatusFunil: (v: string) => void;
  grupo: string; setGrupo: (v: string) => void;
  etiquetas: string; setEtiquetas: (v: string) => void;
  produtoServico: string; setProdutoServico: (v: string) => void;
}

export default function ContatoFormClassificacao(props: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Tipo de contato</Label>
        <Select value={props.tipoContato} onValueChange={props.setTipoContato}>
          <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="lead">Lead</SelectItem>
            <SelectItem value="cliente">Cliente</SelectItem>
            <SelectItem value="parceiro">Parceiro</SelectItem>
            <SelectItem value="fornecedor">Fornecedor</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Origem do contato</Label>
        <Select value={props.origemContato} onValueChange={props.setOrigemContato}>
          <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="instagram">Instagram</SelectItem>
            <SelectItem value="google">Google</SelectItem>
            <SelectItem value="indicacao">Indicação</SelectItem>
            <SelectItem value="trafego_pago">Tráfego pago</SelectItem>
            <SelectItem value="site">Site</SelectItem>
            <SelectItem value="outro">Outro</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {props.tipoContato !== "parceiro" && (
        <div className="space-y-2">
          <Label>Status no funil</Label>
          <Select value={props.statusFunil} onValueChange={props.setStatusFunil}>
            <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="novo">Novo</SelectItem>
              <SelectItem value="em_atendimento">Em atendimento</SelectItem>
              <SelectItem value="proposta_enviada">Proposta enviada</SelectItem>
              <SelectItem value="negociacao">Negociação</SelectItem>
              <SelectItem value="cliente">Cliente</SelectItem>
              <SelectItem value="perdido">Perdido</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      <div className="space-y-2">
        <Label>Grupos</Label>
        <Select value={props.grupo} onValueChange={props.setGrupo}>
          <SelectTrigger><SelectValue placeholder="Selecione um grupo" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="geral">Geral</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="etiquetas">Etiquetas / Tags</Label>
        <Input id="etiquetas" placeholder="Separe por vírgula: VIP, Novo cliente, Recorrente" value={props.etiquetas} onChange={(e) => props.setEtiquetas(e.target.value)} />
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="produto">Produto ou serviço de interesse</Label>
        <Input id="produto" placeholder="Ex: Plano Premium, Consultoria" value={props.produtoServico} onChange={(e) => props.setProdutoServico(e.target.value)} />
      </div>
    </div>
  );
}
