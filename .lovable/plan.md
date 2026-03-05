

## Plano: Adicionar botão de colapsar/expandir o sidebar

### Alteração em `src/pages/Frame760.tsx`:

1. **Adicionar botão de toggle no header** (após o logo, linha ~263): Um botão com ícone `ChevronDown` rotacionado que alterna `isCollapsed`. Quando expandido, mostra seta para a esquerda; quando colapsado, seta para a direita.

2. **Header layout**: Mudar o header para `justify-between` para posicionar logo à esquerda e botão de collapse à direita. No estado colapsado, centralizar o botão.

3. **Footer colapsado**: Quando colapsado, mostrar apenas o avatar (sem nome/dropdown) como botão de expand, ou mostrar um botão de expand no footer.

### Detalhes técnicos:

- Usar o `ChevronDownIcon` já importado, com rotação CSS (`rotate-90` quando colapsado, `-rotate-90` quando expandido)
- O botão terá estilo `p-1.5 rounded-md hover:bg-neutral-100` para consistência visual
- No estado colapsado, o footer mostrará apenas o avatar centralizado

