

## Plano: Corrigir redirecionamento pós-login

### Problema

O `useAuth.tsx` ainda tem referências a `/onboarding` nos redirects do OAuth e signup. Após login com Google ou cadastro, o Supabase redireciona para `/onboarding` que não existe mais, resultando na página 404 ou tela travada.

### Alterações

**Arquivo:** `src/hooks/useAuth.tsx`

- Linha 133: Trocar `emailRedirectTo` de `/onboarding` para `/dashboard`
- Linha 179: Trocar `redirectTo` de `/onboarding` para `/dashboard`

