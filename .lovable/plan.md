

## Plano: Mudar fundo do menu sidebar para branco

Alterar as cores do sidebar em `src/pages/Frame760.tsx` de tema escuro para fundo branco:

### Alterações em `src/pages/Frame760.tsx`:

1. **Sidebar container** (linha 247): `bg-neutral-900 border-r border-neutral-800` → `bg-white border-r border-neutral-200`
2. **Search container** (linha 128): `bg-neutral-800/50 border border-neutral-700/50` → `bg-neutral-100 border border-neutral-200`
3. **Search input text** (linha 147): `text-[#3d3d3d] placeholder:text-neutral-500` → manter (já escuro)
4. **Search icon**: `text-neutral-400` → `text-neutral-500`
5. **Hover states** em botões/links (linhas 213, 231, 290, 353, 365): `hover:bg-neutral-800` → `hover:bg-neutral-100`
6. **Section title text**: `text-neutral-400` / `text-neutral-500` → `text-neutral-500` / `text-neutral-400`
7. **Menu item text**: `text-neutral-300` → `text-neutral-700`
8. **Menu item icons**: `text-neutral-400` → `text-neutral-500`
9. **User footer border** (linha 280): `border-t border-neutral-800` → `border-t border-neutral-200`
10. **User name text**: `text-neutral-300` → `text-neutral-700`
11. **Avatar circle**: `bg-neutral-700` → `bg-neutral-200`, icon `text-neutral-300` → `text-neutral-500`
12. **SVG logo fills**: `fill="white"` → `fill="black"` (ou cor escura) para ficarem visíveis no fundo branco
13. **Root container** (linha 410): manter `bg-neutral-950` ou ajustar conforme necessário

