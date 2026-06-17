import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props {
  ultimaCompra: string; setUltimaCompra: (v: string) => void;
  totalGasto: string; setTotalGasto: (v: string) => void;
  numeroPedidos: string; setNumeroPedidos: (v: string) => void;
  dataRenovacao: string; setDataRenovacao: (v: string) => void;
  proximoFollowup: string; setProximoFollowup: (v: string) => void;
  canalPreferido: string; setCanalPreferido: (v: string) => void;
}

export default function ContatoFormComercial(props: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="ultima_compra">Última compra</Label>
        <Input id="ultima_compra" type="date" value={props.ultimaCompra} onChange={(e) => props.setUltimaCompra(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="total_gasto">Total gasto (R$)</Label>
        <Input id="total_gasto" type="number" step="0.01" min="0" placeholder="0,00" value={props.totalGasto} onChange={(e) => props.setTotalGasto(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="num_pedidos">Número de pedidos</Label>
        <Input id="num_pedidos" type="number" min="0" placeholder="0" value={props.numeroPedidos} onChange={(e) => props.setNumeroPedidos(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="data_renovacao">Data de renovação</Label>
        <Input id="data_renovacao" type="date" value={props.dataRenovacao} onChange={(e) => props.setDataRenovacao(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="proximo_followup">Próximo follow-up</Label>
        <Input id="proximo_followup" type="datetime-local" value={props.proximoFollowup} onChange={(e) => props.setProximoFollowup(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label>Canal preferido</Label>
        <Select value={props.canalPreferido} onValueChange={props.setCanalPreferido}>
          <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="whatsapp">WhatsApp</SelectItem>
            <SelectItem value="instagram">Instagram</SelectItem>
            <SelectItem value="email">Email</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
