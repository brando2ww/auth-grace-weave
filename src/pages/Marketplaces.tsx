import React from "react";
import { Integration } from "@carbon/icons-react";

interface MarketplaceItem {
  name: string;
  logo: string;
  description: string;
  tags: string[];
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

function MarketplaceCard({ item }: { item: MarketplaceItem }) {
  return (
    <div className="flex flex-col bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow">
      {/* Logo */}
      <div className="flex items-center justify-center w-full h-20 mb-4 rounded-lg bg-muted/50 overflow-hidden">
        <img
          src={item.logo}
          alt={item.name}
          className={`${item.name === "Mobiauto" ? "h-7" : "h-14"} w-auto object-contain`}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      </div>

      {/* Name */}
      <h3 className="text-[20px] font-semibold text-foreground mb-1">
        {item.name}
      </h3>

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
      <p className="text-[13px] text-muted-foreground leading-relaxed mb-5 flex-1">
        {item.description}
      </p>

      {/* Button */}
      <button className="w-full py-2.5 rounded-lg text-[14px] font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
        Conectar
      </button>
    </div>
  );
}

export default function Marketplaces() {
  return (
    <div className="flex-1 overflow-y-auto bg-background">
      <div className="max-w-6xl mx-auto px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Integration size={24} className="text-primary" />
            <h1 className="text-[28px] font-bold text-foreground">
              Marketplaces
            </h1>
          </div>
          <p className="text-[15px] text-muted-foreground">
            Conecte sua loja aos principais portais automotivos do Brasil e amplie seu alcance.
          </p>
        </div>

        {/* Sections */}
        {sections.map((section) => (
          <div key={section.title} className="mb-10">
            <div className="mb-5">
              <h2 className="text-[20px] font-semibold text-foreground">
                {section.title}
              </h2>
              <p className="text-[13px] text-muted-foreground mt-0.5">
                {section.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {section.items.map((item) => (
                <MarketplaceCard key={item.name} item={item} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
