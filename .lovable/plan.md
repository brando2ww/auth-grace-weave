

## Plano: Adicionar botão "Entrada de Veículo"

Adicionar um botão "Entrada de Veículo" com ícone `Plus` na barra de filtros, ao lado do botão "Exportar".

### Alteracao em `src/pages/Estoque.tsx`:

- Importar `Plus` do lucide-react.
- Adicionar um `Button` com variante `default` antes do botão "Exportar" (ou como primeiro botão à direita com `ml-auto`), com ícone `Plus` e texto "Entrada de Veículo".
- O botão "Exportar" passará a ter variante `outline` para dar destaque visual ao novo botão principal.

Arquivo: `src/pages/Estoque.tsx` -- 2 linhas de import + ~4 linhas no JSX.

