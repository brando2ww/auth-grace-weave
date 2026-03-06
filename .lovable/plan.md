

## Plano: Substituir logo do sidebar expandido pela nova imagem

O usuário enviou uma nova versão do logo WiseAuto (`WA_5.png`) e quer usá-la no menu aberto, mantendo o mesmo tamanho.

### Alterações:

1. **Copiar** `user-uploads://WA_5.png` para `src/assets/wiseauto-logo-new.png`

2. **Em `src/pages/Frame760.tsx`** — atualizar o import e o `BrandBadge`:
   - Trocar `import wiseautoLogo from "@/assets/wiseauto-logo.png"` para importar o novo arquivo
   - O `BrandBadge` já usa `className="h-[75px] w-auto"`, manter o mesmo tamanho

