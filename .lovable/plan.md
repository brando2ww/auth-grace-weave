

## Plano: Atualizar opções do sidebar para os novos itens

**Objetivo:** Substituir todas as seções atuais do sidebar (Dashboard, Tasks, Projects, Calendar, Teams, Analytics, Files, Settings) pelas novas opções: Dashboard, Estoque, Leads, Anúncios, Automação, Inteligência, Integrações, Financeiro, Equipe.

### Alterações em `src/pages/Frame760.tsx`:

1. **Substituir o `contentMap` em `getSidebarContent`** — Remover as seções antigas e criar novas entradas para cada item. Cada seção terá sub-itens relevantes ao contexto automotivo/dealership:

| Item | Ícone Carbon | Sub-itens exemplo |
|------|-------------|-------------------|
| Dashboard | `Dashboard` | Overview, Resumo Executivo, KPIs |
| Estoque | `Folder` | Veículos Disponíveis, Entrada de Veículos, Avaliações |
| Leads | `UserMultiple` | Novos Leads, Em Negociação, Convertidos |
| Anúncios | `View` | Ativos, Criar Anúncio, Performance |
| Automação | `InProgress` | Fluxos Ativos, Criar Fluxo, Histórico |
| Inteligência | `Analytics` | Métricas, Previsões, Relatórios |
| Integrações | `Integration` | Conectadas, Marketplace, Configurações |
| Financeiro | `ChartBar` | Faturamento, Despesas, Fluxo de Caixa |
| Equipe | `Group` | Membros, Desempenho, Permissões |

2. **Tornar o sidebar navegável** — Em vez de um `activeSection` fixo em "dashboard", renderizar todos os 9 itens como menu principal no sidebar (sem depender de um rail externo). Cada item será um `MenuItem` com ícone, e ao clicar expande seus sub-itens.

3. **Simplificar a estrutura** — Remover a lógica de `activeSection` e `contentMap` com múltiplas seções. Usar uma única lista de itens de menu com `children` expansíveis, renderizados diretamente no sidebar.

4. **Atualizar `TwoLevelSidebar`** — Remover a prop `activeSection` já que todos os itens estarão visíveis no mesmo sidebar.

