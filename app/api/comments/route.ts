import { NextResponse } from "next/server";
import { createComment } from "@/lib/graphql/mutations/comment";
import { WordPressGraphQLError } from "@/lib/wordpress";

/**
 * Recebe um comentário do `PostCommentForm` (client) e o repassa para o
 * WordPress via mutation nativa `createComment`. O comentário entra em
 * moderação conforme as configurações de Discussão do WP.
 */

export const dynamic = "force-dynamic";

interface CommentBody {
  postId?: unknown;
  author?: unknown;
  authorEmail?: unknown;
  content?: unknown;
  parent?: unknown;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_CONTENT = 5000;

export async function POST(request: Request): Promise<NextResponse> {
  let body: CommentBody;
  try {
    body = (await request.json()) as CommentBody;
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const postId =
    typeof body.postId === "number"
      ? body.postId
      : Number.parseInt(String(body.postId), 10);
  const author = typeof body.author === "string" ? body.author.trim() : "";
  const authorEmail =
    typeof body.authorEmail === "string" ? body.authorEmail.trim() : "";
  const content = typeof body.content === "string" ? body.content.trim() : "";
  const parent =
    typeof body.parent === "number" && Number.isFinite(body.parent)
      ? body.parent
      : undefined;

  if (!Number.isFinite(postId) || postId <= 0) {
    return NextResponse.json({ error: "postId inválido." }, { status: 400 });
  }
  if (!author) {
    return NextResponse.json(
      { error: "Informe seu nome." },
      { status: 400 },
    );
  }
  if (!EMAIL_RE.test(authorEmail)) {
    return NextResponse.json(
      { error: "Informe um e-mail válido." },
      { status: 400 },
    );
  }
  if (!content) {
    return NextResponse.json(
      { error: "Escreva seu comentário." },
      { status: 400 },
    );
  }
  if (content.length > MAX_CONTENT) {
    return NextResponse.json(
      { error: "Comentário muito longo." },
      { status: 400 },
    );
  }

  try {
    const result = await createComment({
      commentOn: postId,
      author,
      authorEmail,
      content,
      ...(parent ? { parent } : {}),
    });

    return NextResponse.json({
      success: result?.success ?? false,
      status: result?.comment?.status ?? null,
    });
  } catch (error) {
    const message =
      error instanceof WordPressGraphQLError
        ? error.message
        : "Falha ao enviar comentário.";
    console.error("[api/comments] erro ao criar comentário:", message);
    return NextResponse.json(
      { error: "Não foi possível enviar o comentário. Tente novamente." },
      { status: 502 },
    );
  }
}
