interface PostContentProps {
  /** HTML do editor do WordPress (campo `content`). */
  html: string;
}

/**
 * Renderiza o HTML do conteúdo do post.
 *
 * O HTML aqui vem direto do editor do WordPress, que é uma fonte confiável
 * (apenas editores autenticados conseguem publicar). Mesmo assim, fazemos
 * uma limpeza defensiva removendo `<script>`, handlers `on*=` e `javascript:`
 * antes de injetar — Server Component, sanitização ocorre no servidor.
 *
 * Quando a equipe permitir comentários ou contribuições externas, troque
 * por uma sanitização mais robusta (ex.: `isomorphic-dompurify`).
 */
function sanitizeHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/\son[a-z]+\s*=\s*"[^"]*"/gi, "")
    .replace(/\son[a-z]+\s*=\s*'[^']*'/gi, "")
    .replace(/\son[a-z]+\s*=\s*[^\s>]+/gi, "")
    .replace(/href\s*=\s*"\s*javascript:[^"]*"/gi, 'href="#"')
    .replace(/href\s*=\s*'\s*javascript:[^']*'/gi, "href='#'");
}

export function PostContent({ html }: PostContentProps) {
  const clean = sanitizeHtml(html);

  return (
    <div
      className="prose prose-neutral max-w-none prose-headings:font-semibold prose-a:text-neutral-900 prose-a:underline prose-img:rounded-xl"
      // O HTML já foi sanitizado acima. Esta é a única forma suportada pelo
      // React para renderizar markup vindo do CMS.
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}
