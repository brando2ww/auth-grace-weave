

## Plano: Adicionar logo compacto (WA) no sidebar colapsado

1. **Copiar a imagem** `user-uploads://WA_4.png` para `src/assets/wa-icon.png`

2. **Importar** em `Frame760.tsx`: `import waIcon from "@/assets/wa-icon.png"`

3. **Adicionar o logo no estado colapsado** (linha ~641): Antes do `SectionTitle`, inserir o ícone WA centralizado com tamanho ~32px:

```tsx
{isCollapsed && (
  <>
    <div className="mb-4">
      <img src={waIcon} alt="WA" className="h-8 w-8" />
    </div>
    <SectionTitle ... />
    <SearchContainer ... />
  </>
)}
```

O logo ficará no topo da área central do sidebar colapsado, acima dos ícones de navegação.

