

## Plano: Implementar o Dashboard Exato do Código Fornecido

Vou pegar o código fornecido e adaptá-lo minimamente para funcionar no projeto (sem `@carbon/icons-react`, sem `"use client"`), substituindo os ícones Carbon por Lucide e corrigindo caracteres corrompidos nos SVG paths.

### Arquivos a Criar

**`src/pages/Frame760.tsx`** — O componente completo do dashboard, traduzido do código fornecido:
- Remover `"use client"` e imports de `@carbon/icons-react`
- Substituir cada ícone Carbon pelo equivalente Lucide
- Manter toda a estrutura: `IconNavigation`, `DetailSidebar`, `SearchContainer`, `MenuSection`, `MenuItem`, `SubMenuItem`, `SectionTitle`, `BrandBadge`, `AvatarCircle`, `InterfacesLogoSquare`, `getSidebarContent`, `TwoLevelSidebar`, `Frame760`
- Manter todos os SVG paths inline, estilos inline, e lógica de estado
- Corrigir os caracteres Cyrillic corrompidos nos SVG paths (`В` → `V`)
- Tudo em um único arquivo como no original

### Arquivos a Modificar

**`src/pages/Dashboard.tsx`** — Importar e renderizar o `Frame760` como conteúdo principal, mantendo guard de autenticação e loading state

**`src/App.tsx`** — Nenhuma alteração necessária (rota `/dashboard` já existe)

### Resultado
Dashboard idêntico ao design fornecido, com sidebar de dois níveis, navegação por ícones, menus expansíveis, busca e avatar.

