

## Plano: Corrigir login travado em "Entrando..."

### Problema

O redirecionamento em `Index.tsx` exige `isAuthenticated && profile`. Se o perfil não for encontrado no banco (ou a consulta falhar), o usuário fica preso na tela de login mesmo estando autenticado.

### Alterações

**`src/pages/Index.tsx`** (linha 14):
- Mudar a condição de redirecionamento de `isAuthenticated && profile` para apenas `isAuthenticated`
- Isso garante que o usuário seja redirecionado ao dashboard mesmo que o perfil não exista ainda

**`src/pages/Dashboard.tsx`**:
- Garantir que o dashboard funciona mesmo com `profile` sendo `null` (já funciona com o fallback `'usuário'`)

### Resultado
Login redireciona ao dashboard imediatamente após autenticação, sem depender do carregamento do perfil.

