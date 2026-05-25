/**
 * Camada de acesso ao WordPress headless via WPGraphQL.
 *
 * Centraliza:
 * - leitura do endpoint a partir de `NEXT_PUBLIC_WORDPRESS_API_URL`
 * - tipagem com generics de Response/Variables
 * - cache do Next.js com tags para invalidação granular
 * - tratamento de erros padronizado (HTTP + erros GraphQL)
 */

const WORDPRESS_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

if (!WORDPRESS_API_URL) {
  // Esse erro só é lançado quando alguma query é executada, então o build
  // de páginas estáticas falha cedo e com mensagem clara.
  throw new Error(
    "NEXT_PUBLIC_WORDPRESS_API_URL não definida. Configure o `.env.local`.",
  );
}

export const DEFAULT_REVALIDATE_SECONDS = 60 * 60; // 1h fallback

export interface GraphQLError {
  message: string;
  path?: ReadonlyArray<string | number>;
  extensions?: Record<string, unknown>;
}

export class WordPressGraphQLError extends Error {
  public readonly errors: GraphQLError[];
  public readonly status: number;

  constructor(message: string, errors: GraphQLError[], status: number) {
    super(message);
    this.name = "WordPressGraphQLError";
    this.errors = errors;
    this.status = status;
  }
}

export interface FetchGraphQLOptions {
  /** Tags do Next.js Data Cache (use `revalidateTag` para invalidar). */
  tags?: string[];
  /**
   * Tempo (em segundos) de revalidação. Use `false` para opt-out do cache
   * (ex.: previews) ou `0` para `no-store`.
   */
  revalidate?: number | false;
  /**
   * Operação GraphQL — usado apenas para logs. Não influencia o cache.
   */
  operationName?: string;
}

interface GraphQLPayload<Variables> {
  query: string;
  variables?: Variables;
  operationName?: string;
}

interface GraphQLResponse<Data> {
  data?: Data;
  errors?: GraphQLError[];
}

export async function fetchGraphQL<Data, Variables = Record<string, unknown>>(
  query: string,
  variables?: Variables,
  options: FetchGraphQLOptions = {},
): Promise<Data> {
  const { tags, revalidate, operationName } = options;

  const payload: GraphQLPayload<Variables> = { query };
  if (variables) payload.variables = variables;
  if (operationName) payload.operationName = operationName;

  const nextOptions: { tags?: string[]; revalidate?: number | false } = {};
  if (tags && tags.length > 0) nextOptions.tags = tags;
  if (revalidate !== undefined) nextOptions.revalidate = revalidate;
  else if (!nextOptions.tags) nextOptions.revalidate = DEFAULT_REVALIDATE_SECONDS;

  const response = await fetch(WORDPRESS_API_URL as string, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
    next: nextOptions,
  });

  if (!response.ok) {
    throw new WordPressGraphQLError(
      `WPGraphQL respondeu HTTP ${response.status}${operationName ? ` (${operationName})` : ""}`,
      [],
      response.status,
    );
  }

  const json = (await response.json()) as GraphQLResponse<Data>;

  if (json.errors && json.errors.length > 0) {
    const message = json.errors.map((e) => e.message).join("; ");
    throw new WordPressGraphQLError(
      `WPGraphQL retornou erros: ${message}`,
      json.errors,
      response.status,
    );
  }

  if (!json.data) {
    throw new WordPressGraphQLError(
      "WPGraphQL retornou resposta vazia (sem `data`).",
      [],
      response.status,
    );
  }

  return json.data;
}

// ---------------------------------------------------------------------
// Tags helpers — centralize a convenção de nomes de tags.
// ---------------------------------------------------------------------

export const cacheTags = {
  posts: "posts",
  post: (slug: string) => `post:${slug}`,
  categories: "categories",
  category: (slug: string) => `category:${slug}`,
} as const;
