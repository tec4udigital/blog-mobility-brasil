# Blog Mobility Brasil — Headless Next.js + WordPress

Este arquivo é o guia operacional para qualquer agente (humano ou IA) que
trabalhe neste repositório. Mantenha-o atualizado quando convenções mudarem.

## PROTOCOLO DE TOKENS

REGRAS CAVERNA:
- Sem introduções. Sem conclusões. Sem repetições.
- Resposta curta = boa. Resposta longa só se MUITO necessário.
- Listas > parágrafos. Código > explicação de código.
- Sem "Claro!", "Ótima pergunta!", "Certamente!". Começa já com a resposta.
- Se pergunta simples → resposta 1 linha.
- Confirma ação com ✓. Erro com ✗. Dúvida com ?.
- Nunca repete o que usuário disse antes de responder.
- Omite contexto óbvio. Assume que usuário é expert.

## EXEMPLO DE RESPOSTAS
- Apreendido.
- Feito componente xxx.
- Finalizando ajuste.
---


## graphify

This project has a graphify knowledge graph at graphify-out/.

Rules:
- Before answering architecture or codebase questions, read graphify-out/GRAPH_REPORT.md for god nodes and community structure
- If graphify-out/wiki/index.md exists, navigate it instead of reading raw files
- After modifying code files in this session, run `python3 -c "from graphify.watch import _rebuild_code; from pathlib import Path; _rebuild_code(Path('.'))"` to keep the graph current

## 1. Visão Geral da Arquitetura

- **Front-end**: Next.js 16 (App Router) + React 19 + TypeScript estrito.
- **Estilo**: Tailwind CSS v4 (sem `tailwind.config.js`; tokens definidos via
  `@theme` em `app/globals.css`).
- **CMS**: WordPress headless com WPGraphQL + ACF PRO + Yoast SEO.
- **Camada de dados**: `fetch` nativo do Next.js (sem Apollo Client) com
  cache de Data Cache + `revalidateTag` para invalidação granular.
- **Hospedagem**: Vercel (preview por branch, produção pela `main`).

Fluxo de uma requisição:

1. Página (Server Component) chama uma função em `lib/graphql/queries/*`.
2. A função monta as variáveis e chama `fetchGraphQL` (`lib/wordpress.ts`).
3. `fetchGraphQL` envia a query ao endpoint `NEXT_PUBLIC_WORDPRESS_API_URL`
   com `next: { tags, revalidate }` configurados.
4. O resultado tipado retorna ao Server Component, que renderiza HTML
   estático (ISR). Componentes Client só são usados para interatividade.

## 2. Estrutura de Pastas

```
app/
  layout.tsx                # Layout raiz
  page.tsx                  # Home (/)
  [category]/[slug]/page.tsx# Post individual
  api/revalidate/route.ts   # Webhook ISR (configurado no WordPress)
components/
  blog/                     # Componentes específicos do blog
  ui/                       # Primitivos reutilizáveis (futuro)
lib/
  wordpress.ts              # fetchGraphQL + helpers
  graphql/
    queries/                # Operations (posts, post, categories)
    fragments/              # Fragments reutilizáveis (SEO, postFields)
  mocks/                    # Fallbacks tipados, marcados como temporários
types/
  wordpress.ts              # Types que espelham as queries
public/                     # Assets estáticos
```

> Importe sempre pelo alias `@/` (ex.: `@/lib/wordpress`).

## 3. Convenções de Nomenclatura

| Item | Convenção | Exemplo |
|------|-----------|---------|
| Componente React | `PascalCase.tsx` | `PostCard.tsx` |
| Hook | `useCamelCase.ts` | `usePostFilter.ts` |
| Função utilitária | `camelCase` | `formatDate` |
| Type / Interface | `PascalCase` | `Post`, `ACFPostFields` |
| Constante global | `UPPER_SNAKE_CASE` | `DEFAULT_REVALIDATE` |
| Query GraphQL (const) | `UPPER_SNAKE_CASE` terminando em `_QUERY` | `POSTS_QUERY` |
| Fragment GraphQL (const) | `UPPER_SNAKE_CASE` terminando em `_FRAGMENT` | `SEO_FRAGMENT` |
| Variável GraphQL (TS) | `PascalCase` terminando em `Variables` | `GetPostBySlugVariables` |
| Resposta GraphQL (TS) | `PascalCase` terminando em `Response` | `GetPostsResponse` |
| Cache tag | `kebab-case` | `posts`, `post:{slug}`, `category:{slug}` |

## 4. Regras de Renderização

- **Server Component (padrão)**: páginas, layouts e qualquer componente que
  apenas leia dados do WordPress. Use `async` para `await` queries.
- **Client Component (`'use client'`)**: apenas quando houver estado,
  efeitos, eventos de DOM ou APIs de browser. Mantenha-os pequenos e nas
  folhas da árvore.
- **ISR**: o cache padrão das queries é revalidado por **tags** + um
  `revalidate` de fallback (1h). Não use `cache: 'no-store'` exceto em
  rotas explicitamente dinâmicas.
- **`generateStaticParams`**: usar em `[category]/[slug]/page.tsx` para
  pré-renderizar os posts publicados no build, com fallback `dynamicParams`.
- **`generateMetadata`**: usar para gerar `<title>`, OpenGraph e canonical
  a partir do SEO do Yoast.
- **`next/image`**: obrigatório para qualquer imagem do WordPress. Sempre
  passar `width`, `height` (ou `fill` com container relativo) e `alt`.

### Tags de cache (convenção)

| Tag                  | Quando invalidar                                   |
|----------------------|----------------------------------------------------|
| `posts`              | qualquer post criado/editado/removido              |
| `post:{slug}`        | post específico editado                            |
| `categories`         | categoria criada/editada/removida                  |
| `category:{slug}`    | listagem de uma categoria atualizada               |

Webhooks ACF/WP devem chamar `/api/revalidate?tag=...&secret=...` com o
`WORDPRESS_REVALIDATE_SECRET`.

## 5. GraphQL

- Toda query mora em `lib/graphql/queries/<entidade>.ts` e exporta a
  string como `const X_QUERY = /* GraphQL */ \`...\``.
- Campos repetidos viram **fragments** em `lib/graphql/fragments/`.
- Fragments para ACF e SEO são sempre obrigatórios em listagens e na
  página individual.
- Para chamar, use `fetchGraphQL<Response, Variables>(QUERY, variables, {
  tags: ['posts'] })`.

## 6. Como adicionar um novo campo ACF no front-end

1. Garanta que o campo está exposto no WPGraphQL (Field Group ACF marcado
   como `Show in GraphQL`, com `graphql_field_name` definido).
2. Adicione o campo ao fragment correspondente (ex.: `POST_FIELDS_FRAGMENT`
   em `lib/graphql/fragments/postFields.ts`).
3. Atualize o type em `types/wordpress.ts` — espelhe exatamente o nome e
   tipo retornado pelo GraphQL.
4. Use o campo no componente. Se for opcional, trate `null`/`undefined`
   explicitamente (nada de `as`/`!` para "calar" o TS).
5. Se o campo afetar cache (ex.: nova rota), avalie criar/disparar nova
   `tag`.

## 7. Convenções de Código

- TypeScript estrito. **Proibido `any`**. Use `unknown` + narrow se
  precisar.
- Tailwind v4: classes utilitárias na marcação. Sem CSS externo por
  enquanto — design system do Figma será aplicado na fase 2.
- Nunca commitar `.env.local`. Use `.env.local.example` como referência.
- Sem dados fictícios em produção. Mocks só em `lib/mocks/` e marcados com
  comentário `// TEMP MOCK — remover quando ...`.
- Imagens externas devem ter hostname permitido em `next.config.ts`.

## 8. Scripts

```bash
npm run dev      # ambiente de desenvolvimento
npm run build    # build de produção
npm run start    # roda o build localmente
npm run lint     # ESLint
```

## 9. O que ainda não está pronto

- Webhook `/api/revalidate` (será criado quando o WP estiver configurado
  para disparar).
- `sitemap.ts` / `robots.ts` — fase de SEO.
- Design system do Figma — fase 2.
- Autenticação para áreas privadas (não previsto).
