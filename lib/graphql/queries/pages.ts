import { cacheTags, fetchGraphQL } from "@/lib/wordpress";
import type {
  GetPageByUriResponse,
  GetPageByUriVariables,
  PageContent,
} from "@/types/wordpress";

/**
 * Busca uma página do WordPress pelo URI (ex.: `/components-home/`).
 *
 * Por hora só precisamos do `content` (HTML renderizado) — usado pelo
 * `CategoryShowcase` para extrair a galeria de imagens do Gutenberg. Se
 * outras páginas exigirem ACF/SEO no futuro, adicione fragments aqui.
 */
export const PAGE_BY_URI_QUERY = /* GraphQL */ `
  query GetPageByUri($uri: ID!) {
    page(id: $uri, idType: URI) {
      databaseId
      slug
      uri
      title
      content
    }
  }
`;

export async function getPageByUri(uri: string): Promise<PageContent | null> {
  try {
    const data = await fetchGraphQL<GetPageByUriResponse, GetPageByUriVariables>(
      PAGE_BY_URI_QUERY,
      { uri },
      {
        tags: [`page:${uri.replace(/^\/|\/$/g, "")}`, cacheTags.posts],
        operationName: "GetPageByUri",
      },
    );
    return data.page;
  } catch (error) {
    console.warn(
      `[wordpress] getPageByUri(${uri}) falhou.`,
      error instanceof Error ? error.message : error,
    );
    return null;
  }
}
