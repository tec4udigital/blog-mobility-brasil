"use client";

import Link from "next/link";
import { useState } from "react";
import type { Category } from "@/types/wordpress";
import { AngleDownIcon } from "./icons";

interface HeaderDesktopNavProps {
  categories: Category[];
}

/**
 * Nav desktop do header. Renderiza cada categoria raiz como link e abre um
 * dropdown no hover quando houver categorias filhas. O estado é necessário
 * porque o hover precisa também responder ao foco do teclado (acessibilidade)
 * — daí ser Client Component.
 */
export function HeaderDesktopNav({ categories }: HeaderDesktopNavProps) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  return (
    <ul className="flex items-center gap-8">
      {categories.map((category) => {
        const children = category.children?.nodes ?? [];
        const hasChildren = children.length > 0;
        const href = `/?category=${category.slug}`;
        const isOpen = openSlug === category.slug;

        return (
          <li
            key={category.databaseId}
            className="relative"
            onMouseEnter={() => hasChildren && setOpenSlug(category.slug)}
            onMouseLeave={() => hasChildren && setOpenSlug(null)}
            onFocus={() => hasChildren && setOpenSlug(category.slug)}
            onBlur={(event) => {
              if (
                hasChildren &&
                !event.currentTarget.contains(event.relatedTarget as Node)
              ) {
                setOpenSlug(null);
              }
            }}
          >
            <Link
              href={href}
              className="font-display flex items-center gap-1.5 py-2 text-[12px] font-medium uppercase italic tracking-[0.05em] text-white transition-opacity hover:opacity-80"
              aria-haspopup={hasChildren || undefined}
              aria-expanded={hasChildren ? isOpen : undefined}
            >
              {category.name}
              {hasChildren && <AngleDownIcon className="size-3" />}
            </Link>

            {hasChildren && (
              <div
                className={`absolute left-1/2 top-full z-50 min-w-[220px] -translate-x-1/2 pt-2 ${
                  isOpen ? "block" : "hidden"
                }`}
              >
                <ul className="overflow-hidden rounded-md bg-white py-2 shadow-lg ring-1 ring-black/5">
                  {children.map((child) => (
                    <li key={child.databaseId}>
                      <Link
                        href={`/?category=${child.slug}`}
                        className="block px-4 py-2 text-sm text-neutral-800 transition-colors hover:bg-neutral-100"
                      >
                        {child.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
