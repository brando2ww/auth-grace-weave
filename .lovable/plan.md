

## Plano: Criar página de Gestão de Estoque

**Objetivo:** Criar uma página de gestão de estoque de veículos no estilo da imagem de referência (tabela com filtros, tabs, busca, paginação) e integrá-la ao sidebar quando o item "Estoque" estiver ativo.

### Estrutura visual (baseada na imagem de referência):

1. **Header**: Título "Gestão de Estoque" + subtítulo "Gerencie o estoque de veículos da sua garagem."
2. **Tabs**: "Todos os Veículos", "Disponíveis", "Reservados", "Vendidos"
3. **Filtros**: Campo de busca por modelo/placa + Select de categoria + botão "Buscar" + botão "Exportar"
4. **Tabela**: Colunas: Modelo, Marca, Ano, Placa, Preço, Status, Ações (3 botões: Detalhes, Editar, Remover)
5. **Paginação**: Componente de paginação no rodapé da tabela
6. **Dados mock**: 6-8 veículos de exemplo

### Arquivos a criar/alterar:

1. **Criar `src/pages/Estoque.tsx`** -- Página completa com:
   - Layout com título e subtítulo
   - Tabs usando shadcn Tabs
   - Barra de filtros (Input + Select + Button)
   - Tabela usando shadcn Table com dados mock de veículos
   - Paginação usando shadcn Pagination
   - Botões de ação estilizados com borda (outline) como na referência

2. **Alterar `src/pages/Frame760.tsx`** -- Integrar a página de Estoque:
   - Adicionar estado `activeSection` para rastrear qual item do sidebar está selecionado
   - Quando "Estoque" estiver ativo, renderizar o componente `Estoque` na área de conteúdo principal (ao lado do sidebar)
   - Quando "Dashboard" estiver ativo, manter área vazia ou com placeholder
   - Atualizar `isActive` dinamicamente nos items do menu

3. **Alterar `src/App.tsx`** -- Adicionar rota `/estoque` apontando para Frame760

### Detalhes técnicos:
- Usar componentes shadcn existentes: Table, Tabs, Input, Button, Select, Pagination
- Dados mock com veículos brasileiros (Civic, Corolla, HB20, Onix, etc.)
- Status com badges coloridas: "Disponível" (verde), "Reservado" (amarelo), "Vendido" (cinza)
- Estilo clean com fundo claro, bordas suaves, tipografia consistente com o resto do app

