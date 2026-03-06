

## Plano: Remover badge "em breve" do item Integrações

No arquivo `src/pages/Frame760.tsx`, no array `sidebarMenuItems`, o item "Integrações" possui `badge: "em breve"`. Basta remover essa propriedade.

### Alteração

**`src/pages/Frame760.tsx`** — remover a linha `badge: "em breve"` do objeto com `label: "Integrações"` no array `sidebarMenuItems`.

