

## Plano: Remover verificação/exibição de CNAE

Remover a seção de CNAE (read-only) do componente `StepCompany.tsx`.

### Alteração

**Arquivo:** `src/components/onboarding/StepCompany.tsx`

- Remover o bloco de CNAE Principal (linhas ~230-242) que exibe `companyData.cnae_principal`, `companyData.cnae_descricao` e `companyData.situacao_cadastral`
- Remover o import do ícone `Building2` que é usado apenas nessa seção
- Manter todos os outros campos editáveis intactos

