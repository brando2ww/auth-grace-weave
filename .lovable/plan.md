

## Plano: Mover logo WA para junto das opções no sidebar colapsado

Mover o bloco do `waIcon` de fora do container `flex-1` (linha 634-638) para dentro dele (linha 647-663), posicionando-o logo acima do `SectionTitle` (flechinha). Assim ficará junto aos ícones de navegação, centralizado verticalmente com eles.

**Alterações em `src/pages/Frame760.tsx`:**

1. **Remover** o bloco das linhas 634-638 (o `waIcon` solto no topo).

2. **Inserir** o logo dentro do container `flex-1` colapsado (linha 649), antes do `SectionTitle`:
```tsx
<img src={waIcon} alt="WA" className="h-8 w-8 mb-2" />
```

Resultado: no estado colapsado, a ordem será: logo WA → flechinha (SectionTitle) → busca → itens de menu, todos centralizados verticalmente.

