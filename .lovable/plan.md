

## Plano: Adicionar badge "em breve" nos itens Leads até Equipe

**Objetivo:** Adicionar uma badge azul (#1f6ae1) com o texto "em breve" nos itens de menu: Leads, Anúncios, Automação, Inteligência, Integrações, Financeiro e Equipe.

### Alterações em `src/pages/Frame760.tsx`:

1. **Adicionar `badge` ao tipo `MenuItemT`** (linha 155) — campo opcional `badge?: string`

2. **Adicionar `badge: "em breve"` nos itens** de Leads até Equipe no array `sidebarMenuItems` (linhas 192-261)

3. **Renderizar a badge no `MenuItem`** (após o label, antes do chevron) — um `<span>` com fundo `#1f6ae1`, texto branco, arredondado, texto pequeno (~10px). Só aparece quando `!isCollapsed`.

```tsx
{item.badge && !isCollapsed && (
  <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-medium text-white" style={{ backgroundColor: '#1f6ae1' }}>
    {item.badge}
  </span>
)}
```

