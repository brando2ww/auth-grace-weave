

## Plano: Criar página de Marketplaces com cards dos marketplaces integráveis

### Resumo

Criar um componente `Marketplaces.tsx` com cards para cada marketplace, seguindo a hierarquia tipográfica da imagem de referência (Headline 24px, Subheadline 16px, Body 14px, Button 16px). Os cards terão logo oficial, nome, descrição e botão de ação. Organizar em 3 seções: Principais, Regionais/Complementares e Especializados/Nichados.

### Alterações

**1. `src/pages/Marketplaces.tsx`** (novo arquivo)
- Cards com: logo (imagem externa dos logos oficiais), nome do marketplace (24px headline), categoria/subtítulo (16px), descrição curta (14px body), e botão "Conectar" (16px)
- 3 seções com título: "Principais", "Regionais / Complementares", "Especializados / Nichados"
- Grid responsivo (3 colunas desktop, 2 tablet, 1 mobile)
- Marketplaces:
  - **Principais**: Webmotors, OLX Autos, iCarros, Mobiauto
  - **Regionais**: Carros na Serra, Mercado Livre Veículos, Facebook Marketplace
  - **Especializados**: Chaves na Mão, UsadosBR, AutoAvaliar
- Logos: usar URLs dos logos oficiais de cada marketplace (buscar via web e incluir como URLs externas ou salvar no public/images)

**2. `src/pages/Frame760.tsx`**
- Importar `Marketplaces`
- Adicionar `sectionKey` ao child "Marketplaces" no menu Integrações para que o clique navegue para a seção
- Modificar o `SubMenuItem` `onItemClick` para propagar `onSectionChange` com o sectionKey do child
- Adicionar renderização condicional: `{activeSection === "marketplaces" && <Marketplaces />}`
- Ajustar children do item Integrações para incluir `sectionKey: "marketplaces"` no child correspondente

### Detalhes técnicos

- Children de menu atualmente não têm `sectionKey` nem propagam `onSectionChange`. Será necessário adicionar `sectionKey` à interface `MenuItemT` dos children e passar `onSectionChange` para o `SubMenuItem` no `DetailSidebar`.
- Logos serão buscados como URLs externas dos sites oficiais dos marketplaces para evitar problemas de copyright com assets embarcados. Alternativa: usar placeholder com o nome se a URL não carregar.
- Hierarquia tipográfica dos cards seguindo a referência: headline 24px (font-semibold), subheadline 16px, body 14px, botão 16px.

