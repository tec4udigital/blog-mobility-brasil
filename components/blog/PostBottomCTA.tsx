import { AngleRightIcon } from "@/components/layout/icons";
import { HELP_URL, STORE_URL } from "@/lib/site";

interface PostBottomCTAProps {
  /** Override do link do CTA "Falar com Especialista". */
  contactUrl?: string;
  /** Override do link do CTA "Conheça as Cadeiras...". */
  productsUrl?: string;
}

/**
 * Par de chamadas para ação ao final do corpo do post: especialista
 * (atendimento da loja) + catálogo de produtos.
 */
export function PostBottomCTA({
  contactUrl = HELP_URL,
  productsUrl = STORE_URL,
}: PostBottomCTAProps = {}) {
  return (
    <div className="flex flex-col gap-3.5 text-white sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <a
        href={contactUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 rounded-[4px] border border-black bg-black px-6 py-3 font-display text-[16px] font-medium leading-normal transition-opacity hover:opacity-90"
      >
        <span>Falar com um Especialista da Mobility</span>
        <AngleRightIcon className="size-4 shrink-0" />
      </a>
      <a
        href={productsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 rounded-[4px] border border-black bg-black px-6 py-3 font-display text-[16px] font-medium leading-normal transition-opacity hover:opacity-90"
      >
        <span>Conheça as Cadeiras e Produtos da Mobility Brasil</span>
        <AngleRightIcon className="size-4 shrink-0" />
      </a>
    </div>
  );
}
