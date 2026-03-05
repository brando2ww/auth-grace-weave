

## Plano: Remover o Onboarding

### Arquivos a Deletar
- `src/pages/Onboarding.tsx`
- `src/hooks/useOnboarding.ts`
- `src/components/onboarding/OnboardingProgress.tsx`
- `src/components/onboarding/StepCompany.tsx`
- `src/components/onboarding/StepOperation.tsx`
- `src/components/onboarding/StepChannels.tsx`
- `src/components/onboarding/StepObjective.tsx`
- `src/components/onboarding/StepComplete.tsx`
- `src/lib/api/cnpj.ts`
- `supabase/functions/cnpj-lookup/index.ts`

### Arquivos a Modificar

**`src/App.tsx`**: Remover a rota `/onboarding` e o import de `Onboarding`.

**`src/pages/Index.tsx`**: Remover a lógica de redirecionamento para `/onboarding`. Após login, redirecionar sempre para `/dashboard`.

**`src/pages/Dashboard.tsx`**: Remover o redirecionamento para `/onboarding` quando `onboarding_completed` é falso.

**`src/hooks/useAuth.tsx`**: Remover os campos `onboarding_step` e `onboarding_completed` da interface `Profile` (cleanup opcional, não quebra nada se mantidos).

### Resultado
Login leva direto ao Dashboard, sem fluxo intermediário de onboarding.

