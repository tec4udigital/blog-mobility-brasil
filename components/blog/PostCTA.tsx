import { safeColor } from "@/lib/format";

interface PostCTAProps {
  /** URL informada pelo ACF `postCTA`. */
  url: string | null | undefined;
  /** Cor de destaque do post (ACF `postThemeColor`). */
  themeColor?: string | null;
  /** Texto principal do CTA. Default: "Saiba mais". */
  label?: string;
  /** Texto auxiliar exibido acima do label. */
  caption?: string;
}

/**
 * Renderiza o CTA customizado do post. Se `url` for nulo ou inválido,
 * o componente não renderiza nada.
 *
 * Segurança: validamos protocolo (`http`/`https`/`mailto`/`tel`) antes
 * de adicionar `rel`/`target` apropriados.
 */
export function PostCTA({
  url,
  themeColor,
  label = "Saiba mais",
  caption = "Próximo passo",
}: PostCTAProps) {
  if (!url) return null;

  let parsed: URL | null = null;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }

  const allowedProtocols = new Set(["http:", "https:", "mailto:", "tel:"]);
  if (!allowedProtocols.has(parsed.protocol)) return null;

  const isExternal = parsed.protocol === "http:" || parsed.protocol === "https:";
  const accent = safeColor(themeColor) ?? "#111827";

  return (
    <aside
      className="my-12 flex flex-col gap-4 rounded-2xl border border-black/5 bg-neutral-50 p-8 sm:flex-row sm:items-center sm:justify-between"
      style={{ borderLeftColor: accent, borderLeftWidth: 6 }}
    >
      <div className="flex flex-col gap-1">
        <span
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: accent }}
        >
          {caption}
        </span>
        <p className="text-lg font-semibold text-neutral-900">
          Continue sua jornada com a Mobility Brasil
        </p>
      </div>

      <a
        href={parsed.toString()}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className="inline-flex w-fit items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
        style={{ backgroundColor: accent }}
      >
        {label}
        <span aria-hidden>→</span>
      </a>
    </aside>
  );
}
