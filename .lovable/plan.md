
## Plano: Remover o menu de navegacao esquerdo (IconNavigation)

O elemento selecionado e o `IconNavigation` - a coluna estreita de 60px com icones no lado esquerdo. O usuario quer remove-lo.

### Alteracoes em `src/pages/Frame760.tsx`

1. **`TwoLevelSidebar`** (linha 895-903): Remover a renderizacao de `<IconNavigation>` e o state `activeSection`/`setActiveSection`. Passar um valor fixo de `activeSection` para `DetailSidebar` (ex: `"dashboard"`).

2. **Componentes que podem ser removidos**: `IconNavigation`, `IconNavButton`, e `AvatarCircle` (se usados apenas ali). Manter `DetailSidebar` intacta.

3. **Layout**: O `TwoLevelSidebar` ficara apenas com `<DetailSidebar activeSection="dashboard" />`.
