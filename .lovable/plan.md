

## Plano: Remover sub-opções do Estoque

Alterar o item "Estoque" em `sidebarMenuItems` no `src/pages/Frame760.tsx` (linhas 185-195):

- Remover `hasDropdown: true`
- Remover `children` array

Resultado:
```tsx
{
  icon: <Folder size={16} />,
  label: "Estoque",
  sectionKey: "estoque",
},
```

