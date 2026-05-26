/**
 * Types que espelham os dados retornados pelas queries em
 * `lib/graphql/queries/*`. Quando adicionar um campo numa query, atualize
 * o type correspondente aqui — não use `any`.
 *
 * Convenção:
 * - Sufixo `Response`  → forma do objeto `data` retornado pela query
 * - Sufixo `Variables` → forma das variáveis aceitas pela query
 */

// ---------- Yoast SEO ----------------------------------------------------

export interface SEOImage {
  sourceUrl: string | null;
  altText: string | null;
  mediaDetails?: {
    width: number | null;
    height: number | null;
  } | null;
}

export interface SEOOpenGraph {
  title: string | null;
  description: string | null;
  type: string | null;
  url: string | null;
  siteName: string | null;
  image: SEOImage | null;
}

export interface SEOTwitter {
  title: string | null;
  description: string | null;
  image: SEOImage | null;
}

export interface SEOSchema {
  raw: string | null;
}

export interface SEOData {
  title: string | null;
  metaDesc: string | null;
  canonical: string | null;
  metaRobotsNoindex: string | null;
  metaRobotsNofollow: string | null;
  metaKeywords: string | null;
  opengraphTitle: string | null;
  opengraphDescription: string | null;
  opengraphType: string | null;
  opengraphUrl: string | null;
  opengraphSiteName: string | null;
  opengraphImage: SEOImage | null;
  twitterTitle: string | null;
  twitterDescription: string | null;
  twitterImage: SEOImage | null;
  schema: SEOSchema | null;
}

// ---------- Mídia --------------------------------------------------------

export interface FeaturedImage {
  node: {
    sourceUrl: string;
    altText: string | null;
    mediaDetails: {
      width: number | null;
      height: number | null;
    } | null;
  } | null;
}

// ---------- Autor --------------------------------------------------------

export interface AuthorACFFields {
  authorBio: string | null;
}

export interface Author {
  node: {
    databaseId: number;
    name: string;
    slug: string;
    description: string | null;
    avatar: {
      url: string | null;
    } | null;
    /**
     * Campos ACF aplicados ao próprio usuário. Pode ser `null` se não
     * houver field group para User no WP.
     */
    authorAcf?: AuthorACFFields | null;
  } | null;
}

// ---------- Categorias e Tags --------------------------------------------

export interface CategoryNode {
  databaseId: number;
  name: string;
  slug: string;
  count: number | null;
  description: string | null;
}

export interface Category extends CategoryNode {
  uri: string | null;
  children?: {
    nodes: Array<CategoryNode & { uri: string | null }>;
  } | null;
}

export interface PostCategories {
  nodes: CategoryNode[];
}

export interface TagNode {
  databaseId: number;
  name: string;
  slug: string;
}

export interface PostTags {
  nodes: TagNode[];
}

// ---------- ACF do Post --------------------------------------------------

/**
 * Espelha o Field Group ACF aplicado ao tipo `post`. O nome da chave no
 * GraphQL é definido pelo `graphql_field_name` do Field Group — aqui usa-se
 * `postFields` por padrão. Ajuste se o nome no WP for diferente.
 */
export interface ACFPostFields {
  postHighlight: boolean | null;
  postThemeColor: string | null;
  authorBio: string | null;
  postCTA: string | null;
}

// ---------- Post --------------------------------------------------------

export interface PostListItem {
  databaseId: number;
  id: string;
  slug: string;
  uri: string | null;
  title: string;
  excerpt: string | null;
  date: string;
  modified: string | null;
  featuredImage: FeaturedImage | null;
  author: Author | null;
  categories: PostCategories | null;
  tags: PostTags | null;
  postFields: ACFPostFields | null;
  seo?: SEOData | null;
}

export interface Post extends PostListItem {
  content: string;
}

// ---------- Paginação ---------------------------------------------------

export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
  endCursor: string | null;
}

// ---------- Respostas das queries ---------------------------------------

export interface GetPostsResponse {
  posts: {
    pageInfo: PageInfo;
    nodes: PostListItem[];
  } | null;
}

export interface GetPostsVariables {
  first?: number;
  after?: string | null;
  categorySlug?: string | null;
  /** Quando `true`, retorna apenas posts com ACF `postHighlight = true`. */
  highlightedOnly?: boolean;
}

export interface GetPostBySlugResponse {
  post: Post | null;
}

export interface GetPostBySlugVariables {
  slug: string;
}

export interface GetAllPostSlugsResponse {
  posts: {
    nodes: Array<{
      slug: string;
      categories: {
        nodes: Array<Pick<CategoryNode, "slug">>;
      } | null;
    }>;
  } | null;
}

export interface GetCategoriesResponse {
  categories: {
    nodes: Category[];
  } | null;
}

// ---------- Página (WP Page) --------------------------------------------

export interface PageContent {
  databaseId: number;
  slug: string;
  uri: string | null;
  title: string;
  content: string | null;
}

export interface GetPageByUriResponse {
  page: PageContent | null;
}

export interface GetPageByUriVariables {
  uri: string;
}
