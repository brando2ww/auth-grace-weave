import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CountryCodeSelector } from "@/components/CountryCodeSelector";
import { maskPhone, maskCpfCnpj } from "@/lib/masks";

interface Props {
  nome: string; setNome: (v: string) => void;
  email: string; setEmail: (v: string) => void;
  telefone: string; setTelefone: (v: string) => void;
  codigoPais: string; setCodigoPais: (v: string) => void;
  telefoneSecundario: string; setTelefoneSecundario: (v: string) => void;
  dataNascimento: string; setDataNascimento: (v: string) => void;
  cpfCnpj: string; setCpfCnpj: (v: string) => void;
  empresa: string; setEmpresa: (v: string) => void;
  cargo: string; setCargo: (v: string) => void;
}

export default function ContatoFormBasico(props: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="nome">Nome completo *</Label>
        <Input id="nome" placeholder="Digite o nome completo" value={props.nome} onChange={(e) => props.setNome(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="Digite o email" value={props.email} onChange={(e) => props.setEmail(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="telefone">Telefone (WhatsApp)</Label>
        <div className="flex gap-2">
          <CountryCodeSelector value={props.codigoPais} onChange={props.setCodigoPais} />
          <Input id="telefone" placeholder="(00) 00000-0000" className="flex-1" maxLength={15} value={props.telefone} onChange={(e) => props.setTelefone(maskPhone(e.target.value))} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="telefone2">Telefone secundário</Label>
        <Input id="telefone2" placeholder="(00) 00000-0000" maxLength={15} value={props.telefoneSecundario} onChange={(e) => props.setTelefoneSecundario(maskPhone(e.target.value))} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="nascimento">Data de nascimento</Label>
        <Input id="nascimento" type="date" value={props.dataNascimento} onChange={(e) => props.setDataNascimento(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="cpf_cnpj">CPF ou CNPJ</Label>
        <Input id="cpf_cnpj" placeholder="000.000.000-00" maxLength={18} value={props.cpfCnpj} onChange={(e) => props.setCpfCnpj(maskCpfCnpj(e.target.value))} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="empresa">Empresa</Label>
        <Input id="empresa" placeholder="Nome da empresa" value={props.empresa} onChange={(e) => props.setEmpresa(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="cargo">Cargo</Label>
        <Input id="cargo" placeholder="Cargo ou função" value={props.cargo} onChange={(e) => props.setCargo(e.target.value)} />
      </div>
    </div>
  );
}
