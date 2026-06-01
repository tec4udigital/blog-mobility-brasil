import { fetchGraphQL } from "@/lib/wordpress";

/**
 * Cria um comentário nativo no WordPress (tabela `wp_comments`) via WPGraphQL.
 *
 * O comentário entra com o status definido nas configurações de Discussão do
 * WP (normalmente `hold` → moderação) e aparece em WP Admin → Comentários.
 */
export const CREATE_COMMENT_MUTATION = /* GraphQL */ `
  mutation CreateComment($input: CreateCommentInput!) {
    createComment(input: $input) {
      success
      comment {
        id
        status
      }
    }
  }
`;

export interface CreateCommentInput {
  /** databaseId do post comentado (campo `commentOn` do WPGraphQL). */
  commentOn: number;
  author: string;
  authorEmail: string;
  content: string;
  /** databaseId do comentário pai, para respostas em thread. */
  parent?: number;
}

export interface CreateCommentResponse {
  createComment: {
    success: boolean;
    comment: {
      id: string;
      /** Ex.: "HOLD" (aguardando moderação) ou "APPROVE". */
      status: string | null;
    } | null;
  } | null;
}

export async function createComment(
  input: CreateCommentInput,
): Promise<CreateCommentResponse["createComment"]> {
  const data = await fetchGraphQL<
    CreateCommentResponse,
    { input: CreateCommentInput }
  >(
    CREATE_COMMENT_MUTATION,
    { input },
    {
      // Mutation nunca deve ser cacheada.
      revalidate: 0,
      operationName: "CreateComment",
    },
  );

  return data.createComment;
}
