/**
 * Extrai os itens de uma galeria Gutenberg (`wp-block-gallery` /
 * `wp-block-image`) a partir do HTML renderizado de uma página/post do
 * WordPress.
 *
 * Cada item retorna:
 * - `src`  : URL da imagem
 * - `alt`  : texto alternativo (usamos como título do card)
 * - `href` : link configurado na imagem ("Link para → URL personalizada"
 *            no editor do Gutenberg), ou `null` se a imagem não tem link.
 *
 * Mantemos a varredura simples via regex — não precisamos de DOM completo
 * só pra ler `<figure class="wp-block-image">`. Se a estrutura mudar, vale
 * reavaliar (cheerio, parse5, etc.).
 */
export interface GalleryItem {
  src: string;
  alt: string;
  href: string | null;
}

const FIGURE_RE =
  /<figure[^>]*class="[^"]*wp-block-image[^"]*"[^>]*>([\s\S]*?)<\/figure>/gi;
const IMG_SRC_RE = /<img[^>]*\bsrc=["']([^"']+)["']/i;
const IMG_ALT_RE = /<img[^>]*\balt=["']([^"']*)["']/i;
const A_HREF_RE = /<a[^>]*\bhref=["']([^"']+)["']/i;

export function parseGalleryFromContent(html: string | null | undefined): GalleryItem[] {
  if (!html) return [];
  const items: GalleryItem[] = [];
  for (const match of html.matchAll(FIGURE_RE)) {
    const inner = match[1];
    const src = inner.match(IMG_SRC_RE)?.[1];
    if (!src) continue;
    items.push({
      src,
      alt: inner.match(IMG_ALT_RE)?.[1] ?? "",
      href: inner.match(A_HREF_RE)?.[1] ?? null,
    });
  }
  return items;
}
