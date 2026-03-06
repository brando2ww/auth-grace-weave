

## Plano: Adicionar subopções "Marketplaces" e "Comerciais" ao menu Integrações

No `src/pages/Frame760.tsx`, atualizar o array `children` do item "Integrações" para incluir as novas subopções "Marketplaces" e "Comerciais", mantendo as existentes ("Conectadas", "Marketplace", "Configurações").

### Alteração

**`src/pages/Frame760.tsx`** (linhas 239-243) — Adicionar `{ label: "Marketplaces" }` e `{ label: "Comerciais" }` ao array `children` do item Integrações.

