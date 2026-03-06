

## Plano: Página de Entrada de Veículo

Criar uma página completa (não dialog) para cadastro de veículos, acessível ao clicar no botão "Entrada de Veículo" na página de Estoque.

### Navegação

O `Frame760` usa `activeSection` para alternar conteúdo. Adicionaremos uma nova seção `"entrada-veiculo"` que renderiza a nova página. O botão "Entrada de Veículo" no Estoque mudará o `activeSection` para `"entrada-veiculo"`, e a nova página terá um botão "Voltar" que retorna para `"estoque"`.

### Arquivo novo: `src/pages/EntradaVeiculo.tsx`

Página com formulário organizado em seções:

**Dados Básicos:** Tipo (Select 19 tipos), Marca, Modelo, Versão, Placa, Ano Fabricação, Ano Modelo, Combustível (Select), Câmbio (Select), Portas (Select), Cor, Km, Tração (Select), Carroceria.

**Valores:** Preço, Valor Troca, Valor Promocional, Valor Entrada, Valor Parcela.

**Opcionais (Switch/Toggle):** Air Bag, Freio ABS, Alarme, Ar Condicionado, Blindado, Teto Solar, Turbo, Vidros Elétricos, Travas Elétricas, Desembaçador Traseiro, Direção Hidráulica.

**Informações Adicionais:** Título da Oferta, Equipamentos (Textarea), Adicionais (Textarea), Observação (Textarea), Vídeo (Input URL), Fotos/Foto1 (Input URL placeholder).

Layout em grid responsivo (2-3 colunas) com separadores visuais entre seções. Botões "Voltar" e "Salvar" no topo/rodapé.

### Alterações em `src/pages/Frame760.tsx`

- Importar `EntradaVeiculo`
- Renderizar quando `activeSection === "entrada-veiculo"`

### Alterações em `src/pages/Estoque.tsx`

- Receber prop `onNavigate` para mudar seção
- Botão "Entrada de Veículo" chama `onNavigate("entrada-veiculo")`

