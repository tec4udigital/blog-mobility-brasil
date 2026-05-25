/**
 * Helpers de formatação compartilhados por componentes do blog.
 * Mantenha-os puros — sem efeitos colaterais, sem dependências do DOM.
 */

const DATE_FORMATTER = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

export function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "";
  return DATE_FORMATTER.format(date);
}

/**
 * Remove tags HTML e entidades comuns do excerpt do WordPress.
 * Útil quando você precisa de texto puro (ex.: meta description fallback).
 */
export function stripHtml(html: string | null | undefined): string {
  if (!html) return "";
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Garante que uma cor enviada pelo ACF seja segura para injeção em
 * `style`. Aceita `#rgb`, `#rrggbb`, `rgb()`, `rgba()` e `hsl()`. Se for
 * inválida, retorna `null`.
 */
export function safeColor(value: string | null | undefined): string | null {
  if (!value) return null;
  const v = value.trim();
  const hex = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
  const fn = /^(?:rgba?|hsla?)\([^)]+\)$/i;
  if (hex.test(v) || fn.test(v)) return v;
  return null;
}
