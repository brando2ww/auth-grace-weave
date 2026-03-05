

## Plano: Substituir logos do header pela logo da Wise Auto

Substituir os componentes `InterfacesLogoSquare` e `BrandBadge` no header do sidebar (linha 253-264) pela imagem `wiseauto-logo.png` que já existe em `src/assets/`.

### Alteração em `src/pages/Frame760.tsx`:

1. **Linha 253-264** - Substituir o header atual por uma `<img>` com o logo da Wise Auto:
   - Importar `wiseautoLogo from "@/assets/wiseauto-logo.png"`
   - Quando expandido: mostrar logo completo com tamanho adequado
   - Quando colapsado: mostrar logo menor ou ícone reduzido
   - Manter padding e alinhamento existentes

