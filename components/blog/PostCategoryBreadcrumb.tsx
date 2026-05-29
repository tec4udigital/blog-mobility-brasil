import Link from "next/link";
import type { CategoryNode } from "@/types/wordpress";

interface PostCategoryBreadcrumbProps {
  categories: CategoryNode[];
  /** Quantas categorias mostrar no máximo. Padrão 2 (espelhando o Figma). */
  max?: number;
}

/**
 * Linha de categorias exibida acima do título do corpo do post — não é
 * o breadcrumb de navegação (esse fica no `PostHero`), mas sim os rótulos
 * editoriais do post atual, separados por uma barra vertical fina.
 */
export function PostCategoryBreadcrumb({
  categories,
  max = 2,
}: PostCategoryBreadcrumbProps) {
  if (categories.length === 0) return null;
  const items = categories.slice(0, max);

  return (
    <nav
      aria-label="Categorias do post"
      className="flex flex-wrap items-center gap-2.5"
    >
      {items.map((category, idx) => (
        <span key={category.databaseId} className="flex items-center gap-2.5">
          <Link
            href={`/${category.slug}`}
            className="text-[14px] font-bold leading-normal text-[#373435] transition-colors hover:text-black lg:text-[16px]"
          >
            {category.name}
          </Link>
          {idx < items.length - 1 && (
            <span
              aria-hidden
              className="h-4 w-px bg-[#373435]"
            />
          )}
        </span>
      ))}
    </nav>
  );
}
