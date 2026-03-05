

## Plano: Centralizar icones e corrigir seta no estado colapsado

### Alteracoes em `src/pages/Frame760.tsx`

1. **DetailSidebar (colapsado)**: O conteudo dos menus precisa ficar centralizado verticalmente. Trocar o container `flex-1 overflow-y-auto` para usar `flex-1 flex flex-col items-center justify-center` quando colapsado, para que os icones fiquem no meio vertical da sidebar.

2. **SectionTitle (colapsado)**: A seta de abrir o menu deve apontar para cima (indicando "expandir"). Trocar `rotate-[-90deg]` para `rotate-180` no ChevronDownIcon colapsado.

3. **MenuSection (colapsado)**: Remover padding lateral extra e garantir que os icones fiquem centralizados.

