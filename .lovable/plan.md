

## Plano: Mover busca e seta para dentro do bloco centralizado

Atualmente, o `SectionTitle` (com a seta) e o `SearchContainer` ficam no topo da sidebar colapsada, separados dos icones do menu que estao centralizados via `justify-center`. A solucao e mover esses dois elementos para dentro do container centralizado quando colapsado.

### Alteracao em `src/pages/Frame760.tsx` - `DetailSidebar`

Quando `isCollapsed`:
- Remover `SectionTitle` e `SearchContainer` de fora do container centralizado
- Colocar a seta (toggle) e o icone de busca **dentro** do `div flex-1 justify-center`, junto com os icones do menu
- Assim todos os icones (seta, busca, menu items) ficam juntos no centro vertical da sidebar

Estrutura colapsada ficara:
```text
┌──────────┐
│          │
│          │
│   ↑ seta │
│   🔍 busca│
│   📊 icon │
│   📋 icon │
│   ...    │
│          │
│          │
└──────────┘
```

