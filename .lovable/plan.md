

## Plano: Redesign da página Estoque no formato da imagem de referência

Redesenhar a página `src/pages/Estoque.tsx` para seguir o layout da imagem de referência, com estilo mais limpo e organizado tipo "gestão de arquivos".

### Alteracoes visuais principais:

1. **Tabs**: Trocar o estilo shadcn (botoes preenchidos) por tabs com underline - texto simples com borda inferior no tab ativo, sem background. Estilo mais clean como na imagem.

2. **Filtros em linha com labels**: Em vez de apenas inputs soltos, usar o formato `Label + Input | Label + Select | Search | Export`. Filtros lado a lado com labels visíveis ("Modelo", "Marca") antes de cada campo, como "Work Name" e "Course Name" na referência.

3. **Botoes Search e Export**: "Buscar" com fundo azul outline, "Exportar" com icone de download e fundo azul preenchido, alinhados à direita da linha de filtros.

4. **Tabela**: Header com fundo cinza claro (`bg-gray-50`), linhas com mais espaçamento vertical, sem borda arredondada no container.

5. **Botoes de ação**: Trocar os icon buttons por botões de texto com borda (outline), ex: "Detalhes", "Editar", "Remover" - como os botões "Notice", "Reply", "Cancel" da imagem.

6. **Paginacao**: Estilo numérico com quadradinhos, setas `<` e `>`, página ativa com fundo azul. Centralizado, sem o texto "Mostrando X de Y".

### Arquivo alterado:
- `src/pages/Estoque.tsx` -- Reescrita do layout completo mantendo a mesma lógica de dados e filtros.

