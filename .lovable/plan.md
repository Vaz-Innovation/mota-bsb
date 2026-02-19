

## Problema

Quando o usuário navega para o Blog, sai da página, e depois volta ao Blog, a página aparece rolada para baixo. Isso acontece porque o React Router nao reseta a posicao de scroll ao trocar de rota -- o navegador mantém a posicao anterior.

Nao é um problema de cookies ou armazenamento local.

## Solucao

Criar um componente `ScrollToTop` que escuta mudancas de rota e automaticamente rola a pagina para o topo (posicao 0,0) toda vez que o usuario navega para uma nova pagina.

## Detalhes Tecnicos

### 1. Criar componente `src/components/ScrollToTop.tsx`

- Usa o hook `useLocation()` do React Router para detectar mudancas de rota
- Dentro de um `useEffect`, chama `window.scrollTo(0, 0)` sempre que `location.pathname` mudar
- O componente nao renderiza nada visualmente (retorna `null`)

### 2. Adicionar o componente em `src/App.tsx`

- Importar `ScrollToTop` e colocá-lo dentro do `<BrowserRouter>`, antes do `<Routes>`
- Isso garante que o scroll seja resetado em TODAS as navegacoes do site (Blog, Home, artigos, etc.)

## Resultado

Toda vez que o usuario clicar em qualquer link de navegacao, a pagina vai abrir no topo automaticamente, resolvendo o problema do Blog e de qualquer outra pagina.

