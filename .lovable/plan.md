

## Plano: Instalar @carbon/icons-react e substituir os ícones

### Problema
O dashboard ficou feio porque os ícones Lucide têm um visual diferente (stroke-based, mais finos) dos ícones Carbon (filled, mais robustos) do design original.

### Solução

**1. Instalar dependência**
- `@carbon/icons-react`

**2. Atualizar `src/pages/Frame760.tsx`**
- Trocar os imports de `lucide-react` por `@carbon/icons-react`
- Mapeamento dos imports:

| Atual (lucide-react) | Novo (@carbon/icons-react) |
|---|---|
| LayoutDashboard | Dashboard |
| CheckSquare | Task |
| FolderOpen | Folder |
| Calendar | Calendar |
| Users | UserMultiple |
| BarChart3 | Analytics |
| FilePlus | DocumentAdd |
| Settings | Settings |
| User | User |
| ChevronDown | ChevronDown |
| Plus | AddLarge |
| Filter | Filter |
| Clock | Time |
| Loader | InProgress |
| CheckCircle | CheckmarkOutline |
| Flag | Flag |
| Archive | Archive |
| Eye | View |
| FileText | Report |
| Star | StarFilled |
| BarChart | ChartBar |
| FolderClosed | FolderOpen |
| Share2 | Share |
| Upload | CloudUpload |
| Shield | Security |
| Bell | Notification |
| Plug | Integration |

- Manter toda a estrutura JSX, estilos e lógica inalterados
- Os ícones Carbon usam a mesma prop `size={16}` / `size={20}`, sem mudanças no JSX

**3. Remover `"use client"` do código** (já não está presente, apenas confirmar)

Nenhuma outra alteração necessária.

