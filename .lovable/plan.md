

## Plano: Criar novo Dashboard com sidebar exata do usuário

O código fornecido referencia arquivos e propriedades que ainda não existem no projeto. Preciso criar/ajustar vários arquivos:

### 1. Criar assets de imagem placeholder
- `src/assets/indux-x-icon.png` - ícone pequeno da marca (placeholder)
- `src/assets/indux-logo-new.png` - logo da marca (placeholder)

Como não tenho as imagens reais, vou usar o logo existente (`wiseauto-logo.png`) como fallback temporário nos imports, ou criar imports que apontam para placeholders. O usuário poderá substituir depois.

### 2. Criar `src/components/EditProfileDialog.tsx`
- Componente dialog vazio/placeholder (referenciado no import mas não usado no JSX visível)

### 3. Adaptar `useAuth` hook
- O código usa `refetchUserData` e `profile?.name` - propriedades que não existem
- Adicionar `refetchUserData` como alias de `refreshProfile`
- O profile atual tem `first_name`, não `name` - adaptar o componente para usar `first_name`

### 4. Criar `src/pages/Frame760.tsx` com o código exato fornecido
- Adaptar minimamente: remover `"use client"`, ajustar `profile?.name` → `profile?.first_name`, mapear `refetchUserData` → `refreshProfile`
- Usar `useAuthContext` em vez de `useAuth` diretamente (para manter consistência com o contexto existente)

### 5. Atualizar `src/pages/Dashboard.tsx`
- Importar e usar `Frame760` como layout wrapper
- Renderizar conteúdo placeholder dentro

### 6. Adicionar rotas no `App.tsx`
- Adicionar placeholders para as rotas referenciadas: `/leads`, `/crm`, `/orcamentos`, `/atendimento`, `/producao`, `/representantes`, `/relatorios`, `/pos-venda`

