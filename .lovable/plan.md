

## Problema

O mapa do Google Maps embutido na seção de contato está apontando para o local errado. As coordenadas usadas no iframe são genéricas e não correspondem ao endereço real do escritório (SGAS 902, lote 74, Bloco B, Salas 102 a 112 - Ed. Athenas, Brasília - DF).

## Solução

Atualizar a URL do iframe do Google Maps no arquivo `src/components/ContactSection.tsx` (linha 93) com o embed correto que aponta exatamente para o endereço **SGAS 902, Bloco B, Ed. Athenas, Brasília - DF, CEP 70390-020**.

### Detalhes Técnicos

- **Arquivo**: `src/components/ContactSection.tsx`, linha 93
- **Ação**: Substituir a URL do `src` do iframe por uma URL de embed do Google Maps que busca pelo endereço correto: `SGAS 902, lote 74, Bloco B, Ed. Athenas, Brasília - DF, 70390-020`
- Usar o formato `https://www.google.com/maps/embed/v1/place?key=...&q=...` ou o formato de embed padrão com a query correta para garantir que o pin apareça no local certo

