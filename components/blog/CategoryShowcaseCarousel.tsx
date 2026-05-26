"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AngleLeftIcon, AngleRightIcon } from "@/components/layout/icons";

export interface CategoryShowcaseItem {
  src: string;
  alt: string;
  title: string;
  href: string | null;
}

interface CategoryShowcaseCarouselProps {
  items: CategoryShowcaseItem[];
}

export function CategoryShowcaseCarousel({
  items,
}: CategoryShowcaseCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  function goTo(index: number) {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const clamped = Math.max(0, Math.min(index, items.length - 1));
    const slide = scroller.children[clamped] as HTMLElement | undefined;
    if (!slide) return;
    scroller.scrollTo({ left: slide.offsetLeft, behavior: "smooth" });
  }

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    function handleScroll() {
      if (!scroller) return;
      const children = Array.from(scroller.children) as HTMLElement[];
      if (children.length === 0) return;
      const scrollLeft = scroller.scrollLeft;
      let closest = 0;
      let minDelta = Infinity;
      children.forEach((child, idx) => {
        const delta = Math.abs(child.offsetLeft - scrollLeft);
        if (delta < minDelta) {
          minDelta = delta;
          closest = idx;
        }
      });
      setActiveIndex(closest);
    }

    scroller.addEventListener("scroll", handleScroll, { passive: true });
    return () => scroller.removeEventListener("scroll", handleScroll);
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="flex flex-col gap-8">
      <div
        ref={scrollerRef}
        className="flex w-full snap-x snap-mandatory gap-4 overflow-x-auto sm:gap-6 lg:gap-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-roledescription="carousel"
      >
        {items.map((item, index) => (
          <div
            key={`${item.title}-${index}`}
            className="w-[260px] shrink-0 snap-start sm:w-[calc(50%-12px)] lg:w-[calc(25%-24px)]"
            aria-roledescription="slide"
            aria-label={`${index + 1} de ${items.length}`}
          >
            <CategoryCard item={item} />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => goTo(activeIndex - 1)}
          disabled={activeIndex === 0}
          aria-label="Slide anterior"
          className="flex size-9 items-center justify-center rounded-full bg-[#f1f1f1] text-[#373435] disabled:opacity-40"
        >
          <AngleLeftIcon className="size-5" />
        </button>

        <div className="flex items-center gap-2" role="tablist">
          {items.map((item, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={`dot-${item.title}-${index}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`Ir para ${item.title}`}
                onClick={() => goTo(index)}
                className={
                  isActive
                    ? "h-2 w-8 rounded-full bg-black transition-all"
                    : "size-2 rounded-full bg-[#d4d4d4] transition-all"
                }
              />
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => goTo(activeIndex + 1)}
          disabled={activeIndex === items.length - 1}
          aria-label="Próximo slide"
          className="flex size-9 items-center justify-center rounded-full bg-[#f1f1f1] text-[#373435] disabled:opacity-40"
        >
          <AngleRightIcon className="size-5" />
        </button>
      </div>
    </div>
  );
}

function CategoryCard({ item }: { item: CategoryShowcaseItem }) {
  const card = (
    <article className="flex h-[353px] flex-col items-center justify-between rounded-[8px] border border-[rgba(187,187,187,0.3)] bg-[#f5f5f7] px-6 pb-5 pt-6 text-center">
      <h3 className="font-display text-[16px] font-medium leading-[1.2] text-black">
        {item.title}
      </h3>

      <div className="relative h-[218px] w-[245px] max-w-full">
        {item.src ? (
          <Image
            src={item.src}
            alt={item.alt || item.title}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-contain"
          />
        ) : (
          <div className="h-full w-full rounded-md bg-neutral-200" />
        )}
      </div>

      <span className="inline-flex items-center gap-2 rounded-[4px] border border-black bg-black px-3.5 py-2 text-[16px] font-medium text-white">
        Explorar
        <AngleRightIcon className="size-4" />
      </span>
    </article>
  );

  if (item.href) {
    return (
      <Link href={item.href} className="block">
        {card}
      </Link>
    );
  }
  return card;
}
