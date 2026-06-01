import { stripHtml } from "@/lib/format";

/** CTA extraído de um bloco `wp-block-buttons` do conteúdo Gutenberg. */
export interface PostButton {
  /** Texto do botão (`wp-block-button__link`). */
  label: string;
  /** `href` do botão, ou `null` quando o editor não preencheu o link. */
  url: string | null;
}

export interface ExtractPostButtonsResult {
  /** Botões encontrados no corpo, na ordem em que aparecem. */
  buttons: PostButton[];
  /** HTML do conteúdo sem os blocos `wp-block-buttons` extraídos. */
  html: string;
}

/**
 * Encontra o índice do `</div>` que fecha o `<div>` iniciado em `openStart`,
 * contando aberturas/fechamentos aninhados. Retorna -1 se não houver par.
 */
function findMatchingDivEnd(html: string, openStart: number): number {
  const tag = /<\/?div\b[^>]*>/gi;
  tag.lastIndex = openStart;
  let depth = 0;
  let match: RegExpExecArray | null;
  while ((match = tag.exec(html)) !== null) {
    if (match[0].startsWith("</")) {
      depth -= 1;
      if (depth === 0) return match.index + match[0].length;
    } else {
      depth += 1;
    }
  }
  return -1;
}

const ATTR_RE = (name: string) =>
  new RegExp(`\\b${name}\\s*=\\s*("([^"]*)"|'([^']*)')`, "i");

function readAttr(attrs: string, name: string): string | null {
  const m = attrs.match(ATTR_RE(name));
  if (!m) return null;
  const value = (m[2] ?? m[3] ?? "").trim();
  return value || null;
}

/**
 * Extrai os botões dos blocos `wp-block-buttons` do conteúdo Gutenberg e
 * remove esses blocos do HTML, evitando que apareçam duplicados (no corpo do
 * post e novamente no CTA do final).
 *
 * O link vem do "anchor" do bloco (Gutenberg renderiza como `id` na div
 * `wp-block-button`, ex.: `id="/teste"`); se ausente, cai para um eventual
 * `href` do próprio `<a>`. Pode vir `null` quando só o label foi cadastrado —
 * nesse caso quem renderiza decide o fallback.
 */
export function extractPostButtons(html: string): ExtractPostButtonsResult {
  const buttons: PostButton[] = [];
  const blockRe = /<div\b[^>]*class="[^"]*\bwp-block-buttons\b[^"]*"[^>]*>/gi;

  let result = "";
  let cursor = 0;
  let match: RegExpExecArray | null;

  while ((match = blockRe.exec(html)) !== null) {
    const blockStart = match.index;
    const blockEnd = findMatchingDivEnd(html, blockStart);
    if (blockEnd === -1) break;

    const block = html.slice(blockStart, blockEnd);
    const buttonRe =
      /<div\b([^>]*\bwp-block-button\b[^>]*)>[\s\S]*?<a\b([^>]*)>([\s\S]*?)<\/a>/gi;
    let btn: RegExpExecArray | null;
    while ((btn = buttonRe.exec(block)) !== null) {
      const label = stripHtml(btn[3]).trim();
      if (!label) continue;
      const url = readAttr(btn[1], "id") ?? readAttr(btn[2], "href");
      buttons.push({ label, url });
    }

    result += html.slice(cursor, blockStart);
    cursor = blockEnd;
    blockRe.lastIndex = blockEnd;
  }

  result += html.slice(cursor);
  return { buttons, html: result };
}
