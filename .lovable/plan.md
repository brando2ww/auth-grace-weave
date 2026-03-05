

## Plano: Excluir dashboard atual e começar do zero

### Alterações

1. **Excluir `src/pages/Frame760.tsx`** - remover o arquivo completamente

2. **Atualizar `src/pages/Dashboard.tsx`** - remover a referência ao Frame760 e renderizar uma página vazia com layout mínimo:
   - Fundo escuro (`bg-neutral-950`)
   - Mensagem "Dashboard" centralizada como placeholder
   - Manter a lógica de autenticação existente (redirect se não autenticado)

3. **Atualizar `src/App.tsx`** - remover o import de Frame760 (se houver referência direta)

