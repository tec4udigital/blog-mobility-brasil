"use client";

import { useEffect, useRef, useState } from "react";
import { AngleLeftIcon, AngleRightIcon } from "@/components/layout/icons";
import type { PostListItem } from "@/types/wordpress";
import { SecondaryNewsCard } from "./SecondaryNewsCard";

interface LatestNewsMobileCarouselProps {
  posts: PostListItem[];
}

export function LatestNewsMobileCarousel({
  posts,
}: LatestNewsMobileCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  function goTo(index: number) {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const clamped = Math.max(0, Math.min(index, posts.length - 1));
    const slide = scroller.children[clamped] as HTMLElement | undefined;
    if (!slide) return;
    scroller.scrollTo({ left: slide.offsetLeft, behavior: "smooth" });
  }

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    function handleScroll() {
      if (!scroller) return;
      const width = scroller.clientWidth;
      if (width === 0) return;
      const index = Math.round(scroller.scrollLeft / width);
      setActiveIndex(index);
    }

    scroller.addEventListener("scroll", handleScroll, { passive: true });
    return () => scroller.removeEventListener("scroll", handleScroll);
  }, []);

  if (posts.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      <div
        ref={scrollerRef}
        className="flex w-full snap-x snap-mandatory overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-roledescription="carousel"
      >
        {posts.map((post, index) => (
          <div
            key={post.databaseId}
            className="w-full shrink-0 snap-start"
            aria-roledescription="slide"
            aria-label={`${index + 1} de ${posts.length}`}
          >
            <SecondaryNewsCard post={post} />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => goTo(activeIndex - 1)}
          disabled={activeIndex === 0}
          aria-label="Slide anterior"
          className="flex size-9 items-center justify-center rounded-full bg-[#e8e8e8] text-[#373435] disabled:opacity-40"
        >
          <AngleLeftIcon className="size-5" />
        </button>

        <div className="flex items-center gap-2" role="tablist">
          {posts.map((post, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={post.databaseId}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`Ir para slide ${index + 1}`}
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
          disabled={activeIndex === posts.length - 1}
          aria-label="Próximo slide"
          className="flex size-9 items-center justify-center rounded-full bg-[#e8e8e8] text-[#373435] disabled:opacity-40"
        >
          <AngleRightIcon className="size-5" />
        </button>
      </div>
    </div>
  );
}
