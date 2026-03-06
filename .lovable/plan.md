

## Plano: Redesign do Estoque para layout de Cards com fotos

Substituir a tabela atual por um grid de cards no estilo da imagem de referência (similar ao layout do "micor/Units").

### Alteracoes em `src/pages/Estoque.tsx`:

1. **Adicionar campo `imagem` e `tipo` aos dados mock**: Cada veículo terá uma URL de imagem placeholder (usando `/placeholder.svg` ou URLs de placeholder externas) e um tipo (Sedan, SUV, Hatchback, etc.).

2. **Filtros**: Manter header + simplificar filtros para uma barra de busca + selects de "Tipo" e "Status" inline (como na referência com "Car Type" e "Status").

3. **Substituir tabela por grid de cards**: Layout `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3` com cards contendo:
   - Imagem do veículo (área cinza clara com a foto, ~160px de altura)
   - Nome do modelo (bold) + preço alinhado à direita
   - Tipo do veículo (Sedan, SUV, etc.) em texto menor
   - Badge de status (Disponível/Reservado/Vendido) com cores
   - Linha de specs: Câmbio, Assentos, Combustível (com ícones pequenos)
   - Botão "Selecionar Veículo" (primary, full-width) + botão "..." (menu)

4. **Remover paginação numérica**: Substituir por scroll ou manter paginação simplificada abaixo do grid.

### Arquivo alterado:
- `src/pages/Estoque.tsx` -- Reescrita completa do layout de tabela para cards

