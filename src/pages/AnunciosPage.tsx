import { useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ShoppingBag, Plus, Trash2, Check } from "lucide-react";
import { toast } from "sonner";
import { veiculosMock, type Veiculo } from "@/data/veiculos";

interface Anuncio {
  id: string;
  veiculoId: string;
  titulo: string;
  preco: number;
  marketplaces: string[];
  criadoEm: string;
  imagem?: string;
}

const MARKETPLACES = ["Webmotors", "OLX", "iCarros", "Mobiauto"];

const MARKETPLACE_COMBOS = [
  ["Webmotors", "OLX", "iCarros"],
  ["OLX", "Mobiauto"],
  ["Webmotors", "OLX", "iCarros", "Mobiauto"],
  ["Webmotors", "Mobiauto"],
  ["OLX", "iCarros"],
  ["Webmotors", "OLX"],
];

const anunciosDemo: Anuncio[] = veiculosMock.map((v, i) => ({
  id: `demo-${v.id}`,
  veiculoId: v.id,
  titulo: v.nome,
  preco: v.preco,
  marketplaces: MARKETPLACE_COMBOS[i % MARKETPLACE_COMBOS.length],
  criadoEm: new Date(Date.now() - i * 86400000 * 2).toISOString(),
  imagem: v.imagem,
}));

const formatCurrency = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 });

const AnunciosPage = () => {
  const [anuncios, setAnuncios] = useState<Anuncio[]>(() => {
    const saved = localStorage.getItem("anuncios_criados");
    return saved ? JSON.parse(saved) : anunciosDemo;
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [veiculoSelecionado, setVeiculoSelecionado] = useState<Veiculo | null>(null);
  const [titulo, setTitulo] = useState("");
  const [preco, setPreco] = useState("");
  const [marketplacesSelecionados, setMarketplacesSelecionados] = useState<string[]>([]);
  const [anuncioParaExcluir, setAnuncioParaExcluir] = useState<Anuncio | null>(null);

  const salvar = (lista: Anuncio[]) => {
    setAnuncios(lista);
    localStorage.setItem("anuncios_criados", JSON.stringify(lista));
  };

  const handleSelecionarVeiculo = (v: Veiculo) => {
    setVeiculoSelecionado(v);
    setTitulo(v.nome);
    setPreco(v.preco.toString());
    setMarketplacesSelecionados([]);
  };

  const handlePublicar = () => {
    if (!veiculoSelecionado) return;
    if (marketplacesSelecionados.length === 0) {
      toast.error("Selecione pelo menos um marketplace.");
      return;
    }
    const novo: Anuncio = {
      id: crypto.randomUUID(),
      veiculoId: veiculoSelecionado.id,
      titulo,
      preco: Number(preco) || veiculoSelecionado.preco,
      marketplaces: marketplacesSelecionados,
      criadoEm: new Date().toISOString(),
      imagem: veiculoSelecionado.imagem,
    };
    salvar([...anuncios, novo]);
    setDialogOpen(false);
    setVeiculoSelecionado(null);
    toast.success("Anúncio publicado com sucesso!");
  };

  const handleExcluir = (a: Anuncio) => {
    salvar(anuncios.filter((x) => x.id !== a.id));
    setAnuncioParaExcluir(null);
    toast.success("Anúncio excluído.");
  };

  const toggleMarketplace = (mp: string) => {
    setMarketplacesSelecionados((prev) =>
      prev.includes(mp) ? prev.filter((x) => x !== mp) : [...prev, mp]
    );
  };

  return (
    <DashboardLayout>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Anúncios</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <ShoppingBag className="h-7 w-7 text-foreground" />
            <h1 className="text-2xl font-bold text-foreground">Anúncios</h1>
          </div>
          <p className="text-sm text-muted-foreground">Gerencie seus anúncios de veículos.</p>
        </div>
        {anuncios.length > 0 && (
          <Button className="bg-cyan-500 hover:bg-cyan-600 text-white" onClick={() => { setVeiculoSelecionado(null); setDialogOpen(true); }}>
            <Plus className="h-4 w-4" /> Criar novo
          </Button>
        )}
      </div>

      {anuncios.length === 0 ? (
        <div className="border-2 border-dashed border-border rounded-lg p-12 flex flex-col items-center justify-center text-center space-y-4">
          <ShoppingBag className="h-16 w-16 text-muted-foreground/50" />
          <h2 className="text-lg font-semibold text-foreground">Nenhum anúncio</h2>
          <p className="text-sm text-muted-foreground">Crie o seu primeiro anúncio!</p>
          <Button className="bg-cyan-500 hover:bg-cyan-600 text-white" onClick={() => { setVeiculoSelecionado(null); setDialogOpen(true); }}>
            <Plus className="h-4 w-4" /> Criar novo
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {anuncios.map((a) => (
            <div key={a.id} className="bg-card border border-border rounded-xl overflow-hidden flex flex-col">
              <div className="h-44 bg-muted flex items-center justify-center overflow-hidden">
                {a.imagem ? (
                  <img src={a.imagem} alt={a.titulo} className="w-full h-full object-cover" />
                ) : (
                  <ShoppingBag className="h-12 w-12 text-muted-foreground/30" />
                )}
              </div>
              <div className="p-4 flex flex-col gap-2 flex-1">
                <div className="flex items-start justify-between">
                  <h3 className="text-sm font-semibold text-foreground">{a.titulo}</h3>
                  <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/20 text-[11px]">Ativo</Badge>
                </div>
                <span className="text-base font-bold text-primary">{formatCurrency(a.preco)}</span>
                <div className="flex flex-wrap gap-1.5">
                  {a.marketplaces.map((mp) => (
                    <Badge key={mp} variant="secondary" className="text-[11px]">{mp}</Badge>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Criado em {new Date(a.criadoEm).toLocaleDateString("pt-BR")}
                </p>
                <div className="mt-auto pt-3">
                  <Button variant="outline" size="sm" className="w-full text-destructive hover:text-destructive" onClick={() => setAnuncioParaExcluir(a)}>
                    <Trash2 className="h-4 w-4" /> Excluir anúncio
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dialog criar anúncio */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Criar Anúncio</DialogTitle>
            <DialogDescription>Selecione um veículo do estoque e configure o anúncio.</DialogDescription>
          </DialogHeader>

          {!veiculoSelecionado ? (
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              <Label className="text-sm font-medium">Selecione o veículo</Label>
              {veiculosMock.map((v) => (
                <button
                  key={v.id}
                  onClick={() => handleSelecionarVeiculo(v)}
                  className="w-full flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-accent transition-colors text-left"
                >
                  <div className="h-14 w-20 rounded-md bg-muted overflow-hidden flex-shrink-0">
                    {v.imagem && <img src={v.imagem} alt={v.nome} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{v.nome}</p>
                    <p className="text-xs text-muted-foreground">{v.ano} • {v.placa} • {formatCurrency(v.preco)}</p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="h-12 w-16 rounded-md bg-muted overflow-hidden flex-shrink-0">
                  {veiculoSelecionado.imagem && <img src={veiculoSelecionado.imagem} alt={veiculoSelecionado.nome} className="w-full h-full object-cover" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{veiculoSelecionado.nome}</p>
                  <p className="text-xs text-muted-foreground">{veiculoSelecionado.ano} • {veiculoSelecionado.placa}</p>
                </div>
                <Button variant="ghost" size="sm" className="ml-auto text-xs" onClick={() => setVeiculoSelecionado(null)}>Trocar</Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="titulo">Título do anúncio</Label>
                <Input id="titulo" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="preco">Preço (R$)</Label>
                <Input id="preco" type="number" value={preco} onChange={(e) => setPreco(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>Publicar em</Label>
                <div className="grid grid-cols-2 gap-2">
                  {MARKETPLACES.map((mp) => (
                    <label key={mp} className="flex items-center gap-2 p-2 border border-border rounded-lg cursor-pointer hover:bg-accent transition-colors">
                      <Checkbox
                        checked={marketplacesSelecionados.includes(mp)}
                        onCheckedChange={() => toggleMarketplace(mp)}
                      />
                      <span className="text-sm">{mp}</span>
                    </label>
                  ))}
                </div>
              </div>

              <Button className="w-full bg-cyan-500 hover:bg-cyan-600 text-white" onClick={handlePublicar}>
                <Check className="h-4 w-4" /> Publicar Anúncio
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirm delete */}
      <AlertDialog open={!!anuncioParaExcluir} onOpenChange={(open) => !open && setAnuncioParaExcluir(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir anúncio?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o anúncio <strong>{anuncioParaExcluir?.titulo}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => anuncioParaExcluir && handleExcluir(anuncioParaExcluir)}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default AnunciosPage;
