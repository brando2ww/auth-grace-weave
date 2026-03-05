

## Plano: Corrigir botão travado em "Entrando..."

### Problema

O `useAuth` inicia com `loading: true` enquanto verifica a sessão existente no Supabase. Esse mesmo `loading` é passado como `isLoading` para o `SignInPage`, fazendo o botão mostrar "Entrando..." antes mesmo do usuário clicar.

### Solução

Separar o estado de "inicializando auth" do estado de "submetendo formulário":

**`src/pages/Index.tsx`**:
- Criar um estado local `isSubmitting` para controlar o loading do formulário
- Passar `isSubmitting` (em vez de `loading`) como `isLoading` para o `SignInPage`
- Setar `isSubmitting = true` no `handleSignIn` e `false` quando terminar
- Enquanto o auth estiver inicializando (`loading && !initialized`), mostrar um spinner em vez do formulário

Isso garante que o botão só mostra "Entrando..." quando o usuário efetivamente clica nele.

