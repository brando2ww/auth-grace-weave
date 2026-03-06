

## Plano: Badge "EM BREVE" em maiúsculas

Alterar o texto das badges de `"em breve"` para `"EM BREVE"` nos itens do `sidebarMenuItems` em `src/pages/Frame760.tsx` (Leads, Anúncios, Automação, Inteligência, Integrações, Financeiro, Equipe).

Alternativa mais robusta: adicionar `uppercase` na classe do `<span>` da badge, assim qualquer texto futuro também será maiúsculo. Linha do MenuItem onde a badge é renderizada:

```tsx
<span className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-medium text-white uppercase" style={{ backgroundColor: '#1f6ae1' }}>
```

