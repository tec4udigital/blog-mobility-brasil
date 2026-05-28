import Link from "next/link";
import type { FooterColumn } from "@/types/wordpress";
import { AngleDownIcon } from "./icons";

interface FooterAccordionProps {
  columns: FooterColumn[];
}

export function FooterAccordion({ columns }: FooterAccordionProps) {
  return (
    <ul className="flex w-full flex-col gap-[10px]">
      {columns.map((column, index) => {
        const inputId = `footer-acc-${index}`;
        return (
          <li
            key={`${column.titulo}-${index}`}
            className="relative bg-[color:var(--color-brand-footer)] rounded-[6px]"
          >
            <input
              type="checkbox"
              id={inputId}
              aria-label={column.titulo}
              className="peer sr-only"
            />
            <label
              htmlFor={inputId}
              className="flex w-full cursor-pointer items-center justify-between p-3 pr-10"
            >
              <span className="text-[18px] font-medium text-black opacity-80">
                {column.titulo.replace("Footer", "")}
              </span>
            </label>
            <AngleDownIcon
              aria-hidden
              className="pointer-events-none absolute right-3 top-[18px] size-3 text-black transition-transform duration-200 peer-checked:rotate-180"
            />
            {column.links.length > 0 && (
              <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-out peer-checked:grid-rows-[1fr]">
                <ul className="flex flex-col gap-2 overflow-hidden px-3">
                  {column.links.map((link, linkIndex) => {
                    const isExternal = /^https?:\/\//.test(link.url);
                    const target = link.abrirEmNovaAba ? "_blank" : undefined;
                    const rel = link.abrirEmNovaAba ? "noreferrer" : undefined;
                    const className =
                      "text-[14px] text-black opacity-80 hover:opacity-100";

                    return (
                      <li key={`${link.label}-${linkIndex}`}>
                        {isExternal ? (
                          <a
                            href={link.url}
                            target={target}
                            rel={rel}
                            className={className}
                          >
                            {link.label}
                          </a>
                        ) : (
                          <Link
                            href={link.url}
                            target={target}
                            rel={rel}
                            className={className}
                          >
                            {link.label}
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
