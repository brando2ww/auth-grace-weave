

## Plano: Tornar a troca de logos mais fluida no sidebar

**Problema:** Os logos (WiseAuto expandido / WA icon colapsado) usam `{!isCollapsed && ...}` e `{isCollapsed && ...}`, o que causa mount/unmount abrupto sem transição.

**Solução:** Renderizar ambos os logos sempre, usando `opacity` e `scale` com transição CSS para alternar suavemente:

**Alterações em `src/pages/Frame760.tsx` (linhas 628-648):**

1. **Substituir** os blocos condicionais `{!isCollapsed && <BrandBadge />}` e `{isCollapsed && <img waIcon />}` por um container que renderiza ambos com transições de opacidade:

```tsx
{/* Logo container - sempre renderizado, transição suave */}
<div className="relative">
  <div 
    className={`px-3 pt-4 pb-2 transition-all duration-300 ease-in-out ${
      isCollapsed ? "opacity-0 h-0 overflow-hidden" : "opacity-100"
    }`}
  >
    <BrandBadge />
  </div>
  <div 
    className={`flex justify-center pt-3 pb-1 transition-all duration-300 ease-in-out ${
      isCollapsed ? "opacity-100" : "opacity-0 h-0 overflow-hidden"
    }`}
  >
    <img src={waIcon} alt="WA" className="h-8 w-8" />
  </div>
</div>
```

2. **Mover** `SectionTitle` e `SearchContainer` para fora dos blocos condicionais, renderizando-os uma única vez com transição:

```tsx
<SectionTitle title={content.title} onToggleCollapse={toggleCollapse} isCollapsed={isCollapsed} />
<SearchContainer isCollapsed={isCollapsed} />
```

3. **Remover** o `<img waIcon>` duplicado de dentro do `flex-1` (linha 644).

A duração de 300ms com `ease-in-out` dará uma transição suave e rápida.

