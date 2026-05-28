/**
 * Extrai os vídeos da seção "Conteúdo em vídeo para ir além da leitura"
 * do HTML renderizado de uma página Gutenberg (`/components-home/`).
 *
 * O bloco `wp:video` do Gutenberg sai como:
 *
 *   <figure class="wp-block-video">
 *     <video controls src="https://.../arquivo.mp4"></video>
 *   </figure>
 *
 * Mantemos a varredura via regex — não precisamos de DOM completo.
 */
export interface VideoShowcaseItem {
  src: string;
  poster: string | null;
}

const VIDEO_FIGURE_RE =
  /<figure[^>]*class="[^"]*wp-block-video[^"]*"[^>]*>([\s\S]*?)<\/figure>/gi;
const VIDEO_SRC_RE = /<video[^>]*\bsrc=["']([^"']+)["']/i;
const VIDEO_POSTER_RE = /<video[^>]*\bposter=["']([^"']+)["']/i;
// Fallback: src dentro de <source ...>
const SOURCE_SRC_RE = /<source[^>]*\bsrc=["']([^"']+)["']/i;

export function parseVideoShowcaseFromContent(
  html: string | null | undefined,
): VideoShowcaseItem[] {
  if (!html) return [];
  const items: VideoShowcaseItem[] = [];
  for (const match of html.matchAll(VIDEO_FIGURE_RE)) {
    const inner = match[1];
    const src =
      inner.match(VIDEO_SRC_RE)?.[1] ?? inner.match(SOURCE_SRC_RE)?.[1];
    if (!src) continue;
    items.push({
      src,
      poster: inner.match(VIDEO_POSTER_RE)?.[1] ?? null,
    });
  }
  return items;
}
