

## Plano: Atualizar tipos de veículos com lista completa

### Alterações em `src/pages/Estoque.tsx`:

1. **Substituir `VehicleType`** pelo union type com todos os 19 tipos:
   `"Agrícolas" | "Antigos" | "Bicicleta Elétrica" | "Camionetes" | "Carros" | "Empilhadeira" | "Kart" | "Motos" | "Náuticos" | "Off-Roads" | "Outros" | "Patinete Elétrico" | "Quadriciclos" | "Reboques" | "Scooter Elétrico" | "Trailer" | "Triciclos" | "Utilitários" | "Van"`

2. **Criar array constante `vehicleTypes`** com todos os tipos ordenados para usar no filtro dropdown (substituindo o `uniqueTypes` derivado dos mocks).

3. **Atualizar os mock vehicles** para usar os novos nomes de tipo (ex: `"Sedan"` → `"Carros"`, `"SUV"` → `"Utilitários"` ou `"Camionetes"`, `"Hatchback"` → `"Carros"`, `"Pickup"` → `"Camionetes"`).

4. **Atualizar o dropdown de filtro "Tipo"** para iterar sobre o array `vehicleTypes` em vez de `uniqueTypes`.

### Arquivo alterado:
- `src/pages/Estoque.tsx`

