import { useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Store, Check } from "lucide-react";
import { toast } from "@/components/ui/sonner";

const CONNECTED_MARKETPLACES = new Set(["Webmotors", "OLX Autos", "iCarros", "Mobiauto"]);

interface MarketplaceItem {
  name: string;
  logo: string;
  description: string;
  tags: string[];
  logoSmall?: boolean;
}

interface MarketplaceSection {
  title: string;
  subtitle: string;
  items: MarketplaceItem[];
}

const sections: MarketplaceSection[] = [
  {
    title: "Principais",
    subtitle: "Obrigatórios — concentram a maior parte dos anúncios do país",
    items: [
      {
        name: "Webmotors",
        logo: "/images/marketplaces/webmotors.png",
        description: "Maior portal automotivo do Brasil. Altíssimo tráfego, público qualificado e forte presença em revendas.",
        tags: ["Alto tráfego", "Público qualificado"],
      },
      {
        name: "OLX Autos",
        logo: "/images/marketplaces/olx.png",
        description: "Muito forte em volume de leads e tráfego orgânico. Ideal para veículos populares.",
        tags: ["Volume de leads", "Tráfego orgânico"],
      },
      {
        name: "iCarros",
        logo: "/images/marketplaces/icarros.png",
        description: "Pertence ao Itaú. Base grande de usuários, credibilidade e forte presença em concessionárias.",
        tags: ["Credibilidade", "Concessionárias"],
      },
      {
        name: "Mobiauto",
        logo: "/images/marketplaces/mobiauto.png",
        description: "Crescimento acelerado nos últimos anos. Integração com lojas, tráfego crescente e custo competitivo.",
        tags: ["Custo competitivo", "Crescimento"],
        logoSmall: true,
      },
    ],
  },
  {
    title: "Regionais / Complementares",
    subtitle: "Força regional ou tráfego complementar",
    items: [
      {
        name: "Carros na Serra",
        logo: "/images/marketplaces/carrosnaserra.png",
        description: "Muito forte na Serra Gaúcha. Boa integração para quem atua no Sul do Brasil.",
        tags: ["Regional", "Sul do Brasil"],
      },
      {
        name: "Mercado Livre Veículos",
        logo: "/images/marketplaces/mercadolivre.png",
        description: "Alto tráfego, porém menos especializado. Classificados gerais com seção de veículos.",
        tags: ["Alto tráfego", "Classificados"],
      },
      {
        name: "Facebook Marketplace",
        logo: "/images/marketplaces/facebook.png",
        description: "Muito usado informalmente. Pouca estrutura profissional, mas grande alcance orgânico.",
        tags: ["Alcance orgânico", "Informal"],
      },
    ],
  },
  {
    title: "Especializados / Nichados",
    subtitle: "Menores, mas podem agregar valor ao seu negócio",
    items: [
      {
        name: "Chaves na Mão",
        logo: "/images/marketplaces/chavesnamao.png",
        description: "Portal tradicional de classificados com presença consolidada no mercado brasileiro.",
        tags: ["Tradicional", "Classificados"],
      },
      {
        name: "UsadosBR",
        logo: "/images/marketplaces/usadosbr.png",
        description: "Voltado mais para concessionárias. Foco em veículos seminovos e usados.",
        tags: ["Concessionárias", "Seminovos"],
      },
      {
        name: "AutoAvaliar",
        logo: "/images/marketplaces/autoavaliar.png",
        description: "Focado em estoque e repasse entre concessionárias. Integração interessante para B2B.",
        tags: ["Estoque", "Repasse B2B"],
      },
    ],
  },
];

const MarketplaceCard = ({ item, conectado }: { item: MarketplaceItem; conectado: boolean }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className={`flex flex-col bg-card border rounded-xl p-6 hover:shadow-md transition-shadow ${conectado ? "border-emerald-500/40" : "border-border"}`}>
      {/* Logo area */}
      <div className="flex items-center justify-center bg-muted/50 rounded-lg h-20 mb-4 relative">
        {!imgError ? (
          <img
            src={item.logo}
            alt={item.name}
            className={`${item.logoSmall ? "h-7" : "h-14"} w-auto object-contain`}
            onError={() => setImgError(true)}
          />
        ) : (
          <Store className="h-8 w-8 text-muted-foreground" />
        )}
        {conectado && (
          <span className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/15 text-emerald-600 border border-emerald-500/20">
            <Check className="h-3 w-3" /> Conectado
          </span>
        )}
      </div>

      {/* Name */}
      <h3 className="text-xl font-semibold text-foreground mb-2">{item.name}</h3>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {item.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-primary/10 text-primary"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Description */}
      <p className="text-[13px] text-muted-foreground leading-relaxed flex-1 mb-4">
        {item.description}
      </p>

      {/* Connect button */}
      {conectado ? (
        <button
          disabled
          className="w-full py-2.5 rounded-lg text-[14px] font-medium bg-emerald-500/15 text-emerald-600 border border-emerald-500/20 cursor-default flex items-center justify-center gap-2"
        >
          <Check className="h-4 w-4" /> Conectado
        </button>
      ) : (
        <button
          onClick={() => toast.success(`Conectando com ${item.name}...`)}
          className="w-full py-2.5 rounded-lg text-[14px] font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Conectar
        </button>
      )}
    </div>
  );
};

const MarketplacesPage = () => (
  <DashboardLayout>
    {/* Header */}
    <div className="flex items-center gap-3 mb-1">
      <Store className="h-7 w-7 text-foreground" />
      <h1 className="text-[28px] font-bold text-foreground">Marketplaces</h1>
    </div>
    <p className="text-[15px] text-muted-foreground mb-8">
      Conecte sua loja aos principais portais automotivos do Brasil e amplie seu alcance.
    </p>

    {/* Sections */}
    <div className="space-y-10">
      {sections.map((section) => (
        <div key={section.title}>
          <h2 className="text-xl font-semibold text-foreground">{section.title}</h2>
          <p className="text-[13px] text-muted-foreground mb-4">{section.subtitle}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {section.items.map((item) => (
              <MarketplaceCard key={item.name} item={item} conectado={CONNECTED_MARKETPLACES.has(item.name)} />
            ))}
          </div>
        </div>
      ))}
    </div>
  </DashboardLayout>
);

export default MarketplacesPage;
