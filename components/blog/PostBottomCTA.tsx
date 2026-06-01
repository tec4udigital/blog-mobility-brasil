import { AngleRightIcon } from "@/components/layout/icons";
import type { PostButton } from "@/lib/postButtons";
import { HELP_URL, STORE_URL } from "@/lib/site";

interface PostBottomCTAProps {
  /** Botões extraídos do conteúdo Gutenberg (`wp-block-buttons`). */
  buttons: PostButton[];
}

/** Links de fallback quando o botão do Gutenberg não tem `href`. */
const FALLBACK_URLS = [HELP_URL, STORE_URL];

/**
 * Par de chamadas para ação ao final do corpo do post. Label e link vêm dos
 * botões do conteúdo Gutenberg; quando o editor não preenche o `href`, usamos
 * um fallback por posição (atendimento da loja / catálogo de produtos).
 */
export function PostBottomCTA({ buttons }: PostBottomCTAProps) {
  if (buttons.length === 0) return null;

  return (
    <div className="flex flex-col gap-3.5 text-white sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      {buttons.map((button, index) => {
        const href = button.url ?? FALLBACK_URLS[index] ?? STORE_URL;
        const isExternal = /^https?:\/\//i.test(href);

        return (
          <a
            key={`${button.label}-${index}`}
            href={href}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            className="flex items-center justify-center gap-2 rounded-[4px] border border-black bg-black px-6 py-3 font-display text-[16px] font-medium leading-normal transition-opacity hover:opacity-90"
          >
            <span>{button.label}</span>
            <AngleRightIcon className="size-4 shrink-0" />
          </a>
        );
      })}
    </div>
  );
}
