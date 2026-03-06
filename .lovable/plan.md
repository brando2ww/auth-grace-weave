

## Plano: Ocultar sub-opções "Conectadas" e "Comerciais"

Em `src/pages/Frame760.tsx`, remover os itens `{ label: "Conectadas" }` e `{ label: "Comerciais" }` do array `children` do item "Integrações", mantendo apenas `{ label: "Marketplaces", sectionKey: "marketplaces" }`.

