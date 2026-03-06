

## Plano: Reduzir logo da Mobiauto

No `Marketplaces.tsx`, o logo da Mobiauto usa a mesma classe `h-14` dos demais. Vou adicionar uma lógica condicional para aplicar `h-7` (metade) quando o item for "Mobiauto".

### Alteração em `src/pages/Marketplaces.tsx`

Na tag `<img>` dentro de `MarketplaceCard`, alterar a classe de altura para ser condicional:
- `h-7` para Mobiauto
- `h-14` para os demais

