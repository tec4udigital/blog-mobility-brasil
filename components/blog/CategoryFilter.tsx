"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import type { Category } from "@/types/wordpress";

interface CategoryFilterProps {
  categories: Category[];
  /** Slug atualmente ativo (vindo do `?category=` da home). */
  activeSlug?: string | null;
}

/**
 * Filtro de categorias da home. Atualiza o `searchParam` `category` sem
 * recarregar a página (`router.replace` + `scroll: false`).
 *
 * Client component porque depende de `useSearchParams` e interação do
 * usuário; é a única ilha interativa da home.
 */
export function CategoryFilter({ categories, activeSlug }: CategoryFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleSelect = useCallback(
    (slug: string | null) => {
      const params = new URLSearchParams(searchParams?.toString() ?? "");
      if (slug) params.set("category", slug);
      else params.delete("category");

      const query = params.toString();
      const href = query ? `${pathname}?${query}` : pathname;

      startTransition(() => {
        router.replace(href, { scroll: false });
      });
    },
    [pathname, router, searchParams],
  );

  const baseClass =
    "rounded-full border px-4 py-1.5 text-sm font-medium transition disabled:opacity-60";
  const activeClass = "border-neutral-900 bg-neutral-900 text-white";
  const inactiveClass =
    "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400 hover:text-neutral-900";

  return (
    <nav
      aria-label="Filtrar por categoria"
      className="flex flex-wrap items-center gap-2"
    >
      <button
        type="button"
        onClick={() => handleSelect(null)}
        disabled={isPending}
        className={`${baseClass} ${activeSlug ? inactiveClass : activeClass}`}
      >
        Todas
      </button>

      {categories.map((category) => {
        const isActive = activeSlug === category.slug;
        return (
          <button
            key={category.databaseId}
            type="button"
            onClick={() => handleSelect(category.slug)}
            disabled={isPending}
            className={`${baseClass} ${isActive ? activeClass : inactiveClass}`}
          >
            {category.name}
            {typeof category.count === "number" && (
              <span className="ml-2 text-xs opacity-60">{category.count}</span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
