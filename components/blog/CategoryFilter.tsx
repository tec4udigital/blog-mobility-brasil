import Link from "next/link";
import type { Category } from "@/types/wordpress";

interface CategoryFilterProps {
  categories: Category[];
  /** Slug da categoria ativa, ou `null` quando estamos na home. */
  activeSlug?: string | null;
}

/**
 * Filtro de categorias renderizado como links — navega para `/` (todas) ou
 * `/<slug>` (categoria específica). Server Component: não precisa de estado
 * porque o destino é uma rota real.
 */
export function CategoryFilter({ categories, activeSlug }: CategoryFilterProps) {
  const baseClass =
    "rounded-full border px-4 py-1.5 text-sm font-medium transition";
  const activeClass = "border-neutral-900 bg-neutral-900 text-white";
  const inactiveClass =
    "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400 hover:text-neutral-900";

  return (
    <nav
      aria-label="Filtrar por categoria"
      className="flex flex-wrap items-center gap-2"
    >
      <Link
        href="/"
        aria-current={activeSlug ? undefined : "page"}
        className={`${baseClass} ${activeSlug ? inactiveClass : activeClass}`}
      >
        Todas
      </Link>

      {categories.map((category) => {
        const isActive = activeSlug === category.slug;
        return (
          <Link
            key={category.databaseId}
            href={`/${category.slug}`}
            aria-current={isActive ? "page" : undefined}
            className={`${baseClass} ${isActive ? activeClass : inactiveClass}`}
          >
            {category.name}
            {typeof category.count === "number" && (
              <span className="ml-2 text-xs opacity-60">{category.count}</span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
