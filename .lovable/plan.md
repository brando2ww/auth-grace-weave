

## Plano: Fundo branco na sidebar e pagina

Trocar todas as cores de fundo escuras para branco/claro em `src/pages/Frame760.tsx`:

1. **Container principal** (linha 831): `bg-neutral-950` → `bg-white`
2. **DetailSidebar** (linha 640): `bg-neutral-900` → `bg-white`, `border-neutral-800` → `border-neutral-200`
3. **Textos e icones**: Trocar `text-neutral-300/400` → `text-neutral-500/600`, `text-neutral-50` → `text-neutral-900`
4. **Hover states**: `hover:bg-neutral-800` → `hover:bg-neutral-100`
5. **Item ativo**: `bg-neutral-700 text-neutral-50` → `bg-blue-50 text-blue-600` (seguindo a identidade azul da marca)
6. **Search bar**: `bg-neutral-800 border-neutral-700` → `bg-neutral-100 border-neutral-200`
7. **Avatar**: `bg-neutral-700` → `bg-neutral-200`

Todas as ~46 ocorrencias de `bg-neutral-7xx/8xx/9xx` serao atualizadas para equivalentes claros.

