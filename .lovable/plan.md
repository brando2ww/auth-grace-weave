

## Plano: Centralizar verticalmente logo, flechinha e opções no sidebar colapsado

**Problema:** No estado colapsado, o logo WA fica no topo, a flechinha e busca ficam logo abaixo, e os itens de menu ficam centralizados no `flex-1` — mas o conjunto todo não está centralizado verticalmente como um bloco único.

**Solução:** Quando colapsado, envolver o logo, flechinha, busca e itens de menu em um único container com `flex-1 flex flex-col items-center justify-center`, para que todo o conteúdo fique centralizado verticalmente no sidebar.

### Alterações em `src/pages/Frame760.tsx` (linhas 628-659):

Reestruturar o layout colapsado para que o logo, SectionTitle, SearchContainer e menu items fiquem dentro de um único container centralizado:

```tsx
{/* Logo expandido - fora do container centralizado */}
<div className={`px-3 pt-4 pb-2 transition-all duration-300 ease-in-out ${
  isCollapsed ? "opacity-0 h-0 overflow-hidden" : "opacity-100"
}`}>
  <BrandBadge />
</div>

{/* Container principal - centralizado verticalmente quando colapsado */}
<div className={`flex-1 overflow-y-auto ${
  isCollapsed 
    ? "flex flex-col items-center justify-center px-0" 
    : "px-2"
}`}>
  {/* Logo WA colapsado */}
  <div className={`flex justify-center transition-all duration-300 ease-in-out ${
    isCollapsed ? "opacity-100 pb-2" : "opacity-0 h-0 overflow-hidden"
  }`}>
    <img src={waIcon} alt="WA" className="h-8 w-8" />
  </div>

  <SectionTitle ... />
  <SearchContainer ... />

  {content.sections.map(...)}
</div>
```

Isso move o logo WA, a flechinha e a busca para dentro do mesmo `flex-1 justify-center` que já centraliza os itens de menu, fazendo tudo ficar como um bloco centralizado verticalmente.

