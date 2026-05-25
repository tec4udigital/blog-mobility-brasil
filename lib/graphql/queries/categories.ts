import { MOCK_CATEGORIES } from "@/lib/mocks/posts";
import { cacheTags, fetchGraphQL } from "@/lib/wordpress";
import type { Category, GetCategoriesResponse } from "@/types/wordpress";

/**
 * Lista de categorias visíveis (com pelo menos 1 post). Ordenado pelo
 * número de posts, decrescente — útil para o filtro da home.
 */
export const CATEGORIES_QUERY = /* GraphQL */ `
  query GetCategories($first: Int = 50) {
    categories(
      first: $first
      where: { hideEmpty: true, orderby: COUNT, order: DESC }
    ) {
      nodes {
        databaseId
        name
        slug
        count
        description
        uri
      }
    }
  }
`;

export async function getCategories(): Promise<Category[]> {
  try {
    const data = await fetchGraphQL<GetCategoriesResponse>(
      CATEGORIES_QUERY,
      { first: 50 },
      { tags: [cacheTags.categories], operationName: "GetCategories" },
    );
    const nodes = data.categories?.nodes ?? [];
    if (nodes.length > 0) return nodes;
    return MOCK_CATEGORIES;
  } catch (error) {
    console.warn(
      "[wordpress] getCategories falhou, usando MOCK_CATEGORIES.",
      error instanceof Error ? error.message : error,
    );
    return MOCK_CATEGORIES;
  }
}
