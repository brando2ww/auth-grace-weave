

## Plano: Substituir Frame760.tsx pelo codigo fornecido

O codigo que voce enviou teve o JSX removido na formatacao (aparecem linhas vazias onde deveria haver JSX). Vou reconstruir o arquivo baseado no seu codigo, aplicando as diferencas reais em relacao ao arquivo atual:

### Alteracoes em `src/pages/Frame760.tsx`:

1. **Adicionar `"use client"` no topo**
2. **Trocar import**: `useAuthContext` de `@/contexts/AuthContext` -> `useAuth` de `@/hooks/useAuth`
3. **Remover import** de `wiseautoLogo`
4. **DetailSidebar**: Usar `useAuth()` com destructuring `{ profile, user, refetchUserData, signOut }`
5. **Remover logo do header**: Nao renderizar nenhuma imagem no header, manter apenas o botao de collapse
6. **Profile name**: `profile?.first_name` -> `profile?.name`
7. **Footer**: Mostrar footer apenas quando `!isCollapsed`
8. **Adicionar `TwoLevelSidebar`** wrapper e manter estrutura do `Frame760`

### Problema de compatibilidade:

O hook `useAuth` exporta `refreshProfile` (nao `refetchUserData`) e o profile tem `first_name` (nao `name`). Vou usar os nomes corretos do hook existente para evitar erros de runtime:
- `refetchUserData` -> `refreshProfile`  
- `profile?.name` -> `profile?.first_name`

