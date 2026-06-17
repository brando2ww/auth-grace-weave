

## Alterar nome exibido para "Demonstração"

### Arquivo: `src/components/layouts/DashboardLayout.tsx`

Na linha onde exibe `{userName || "Usuário"}` (linha ~68), adicionar uma lógica: se o role for `demo_estoque`, exibir "Demonstração" em vez do userName real.

Também na linha do role (~69), exibir "Demonstração" em vez de "demo_estoque".

```ts
// Antes
<span className="text-sm font-semibold">{userName || "Usuário"}</span>
<span className="text-xs">{role}</span>

// Depois
<span className="text-sm font-semibold">
  {role === "demo_estoque" ? "Demonstração" : (userName || "Usuário")}
</span>
<span className="text-xs">
  {role === "demo_estoque" ? "Demonstração" : role}
</span>
```

Apenas 1 arquivo, 2 linhas alteradas.

