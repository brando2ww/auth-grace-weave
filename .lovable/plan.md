

## Plano: Substituir Frame760.tsx exatamente pelo codigo fornecido

### Alteracao 1: `src/pages/Frame760.tsx`
Substituir o arquivo inteiro pelo codigo exato que voce enviou. O novo componente e auto-contido, com sidebar de dois niveis (icon rail + detail panel), sem dependencia de `useAuth`.

### Alteracao 2: `src/App.tsx`
O novo `Frame760` nao aceita `children` -- a assinatura mudou de `Frame760({ children })` para `Frame760()`. As rotas que usam `SidebarPage` com `<Frame760>` precisam ser atualizadas. Opcoes:
- Usar `<Frame760 />` diretamente nas rotas (sem children)
- Ou remover as rotas de sidebar que dependiam do wrapper

Vou atualizar o `/dashboard` para usar `<Frame760 />` e simplificar as demais rotas.

