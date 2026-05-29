interface PostContentProps {
  /** HTML do editor do WordPress (campo `content`). */
  html: string;
}

/**
 * Sanitização defensiva — o HTML vem de editores autenticados, mas ainda
 * assim removemos `<script>`, handlers `on*=` e `javascript:` antes de
 * injetar via `dangerouslySetInnerHTML`. Se eventualmente o blog aceitar
 * conteúdo de terceiros, troque por algo robusto (ex.: `isomorphic-dompurify`).
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

/**
 * Reescreve `<iframe>` para ser responsivo:
 *
 * - Lê `width`/`height` (atributos ou inline style) para descobrir o aspect
 *   ratio nativo do embed; usa 16/9 como fallback.
 * - Remove os atributos `width`/`height` que o navegador respeitaria.
 * - Envolve o `<iframe>` num wrapper com `aspect-ratio` aplicado por CSS
 *   (.post-embed), de modo a não depender das classes que o WP injeta
 *   (que mudam entre versões do Gutenberg).
 *
 * Roda no servidor — sem custo no cliente.
 */
function wrapEmbeds(html: string): string {
  return html.replace(
    /<iframe\b([^>]*)>([\s\S]*?)<\/iframe>/gi,
    (_match, rawAttrs: string, inner: string) => {
      const attrs = rawAttrs;

      const widthMatch =
        attrs.match(/\bwidth\s*=\s*["']?(\d+)/i) ??
        attrs.match(/width\s*:\s*(\d+)/i);
      const heightMatch =
        attrs.match(/\bheight\s*=\s*["']?(\d+)/i) ??
        attrs.match(/height\s*:\s*(\d+)/i);

      let aspect = "16 / 9";
      if (widthMatch && heightMatch) {
        const w = Number(widthMatch[1]);
        const h = Number(heightMatch[1]);
        if (w > 0 && h > 0) aspect = `${w} / ${h}`;
      }

      // Remove dimensões fixas (atributos e propriedades CSS).
      const cleanedAttrs = attrs
        .replace(/\swidth\s*=\s*["'][^"']*["']/gi, "")
        .replace(/\sheight\s*=\s*["'][^"']*["']/gi, "")
        .replace(/\swidth\s*=\s*\d+/gi, "")
        .replace(/\sheight\s*=\s*\d+/gi, "")
        .replace(/(style\s*=\s*["'])[^"']*["']/gi, (_full, prefix: string) => {
          const cleaned = _full
            .replace(/width\s*:\s*[^;"']+;?/gi, "")
            .replace(/height\s*:\s*[^;"']+;?/gi, "");
          return cleaned.length > prefix.length + 1 ? cleaned : "";
        });

      return (
        `<div class="post-embed" style="--aspect:${aspect}">` +
        `<iframe${cleanedAttrs} loading="lazy">${inner}</iframe>` +
        `</div>`
      );
    },
  );
}

export function PostContent({ html }: PostContentProps) {
  const clean = wrapEmbeds(sanitizeHtml(html));

  return (
    <div
      className="post-content"
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}
