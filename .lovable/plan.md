

## Plano: Substituir o BrandBadge pelo logo da WiseAuto

O componente `BrandBadge` (linha 93-118) atualmente exibe um SVG generico com o texto "Interfaces". Sera substituido pela imagem do logo da WiseAuto que ja existe no projeto em `src/assets/wiseauto-logo.png`.

### Alteracao em `src/pages/Frame760.tsx`

1. **Importar** a imagem: `import wiseautoLogo from "@/assets/wiseauto-logo.png"`

2. **Reescrever `BrandBadge`**: Substituir o SVG e o texto "Interfaces" por uma tag `<img>` usando o logo importado, com altura adequada (~30px) e `alt="Wise Auto"`.

3. **Sidebar colapsada**: Quando colapsada, mostrar uma versao menor do logo (ex: 24px) ou o icone `indux-x-icon.png` se existir um icone compacto. Verificar se o `BrandBadge` tambem e renderizado no estado colapsado — atualmente so aparece com `!isCollapsed` (linha 645-648), entao nenhuma mudanca extra e necessaria.

