

## Plano: Corrigir a visualizacao colapsada da DetailSidebar

A imagem mostra que, quando colapsada, a detail sidebar deve virar uma "segunda coluna de icones" - mostrando apenas os icones de cada item do menu centralizado verticalmente, sem texto, titulos de secao, search bar completa, footer, ou brand badge. Apenas icones empilhados com um icone de search no topo.

### Alteracao em `src/pages/Frame760.tsx`

**DetailSidebar** - quando `isCollapsed`:
1. Esconder `BrandBadge`, `SectionTitle` (ja feito), footer (ja feito)
2. Esconder a `SearchContainer` completa e mostrar apenas o icone de search centralizado
3. Esconder os titulos das secoes (ja feito via `hidden`)
4. Na `MenuItem`, quando colapsado, mostrar **somente o icone centralizado** sem padding lateral, sem texto, sem chevron
5. Esconder sub-items quando colapsado (ja feito)
6. A largura colapsada de `60px` esta OK, mas os icones precisam ficar centralizados

### Detalhes tecnicos:

- `SearchContainer`: quando `isCollapsed`, renderizar apenas o icone `<SearchIcon>` centralizado em vez do input completo
- `MenuItem`: quando `isCollapsed`, renderizar o botao apenas com o icone centralizado (`justify-center`), sem margin left no icone, sem o div de texto
- `MenuSection`: quando `isCollapsed`, esconder o titulo da secao (ja feito) e ajustar padding
- Manter a animacao de transicao `softSpringEasing` com `duration 0.4s`

