import { MOCK_VIDEO_SHOWCASE } from "@/lib/mocks/componentsHome";
import { parseVideoShowcaseFromContent } from "@/lib/parseVideoShowcase";
import type { PageContent } from "@/types/wordpress";
import { VideoShowcaseCarousel } from "./VideoShowcaseCarousel";

interface VideoShowcaseProps {
  page: PageContent | null;
}

export function VideoShowcase({ page }: VideoShowcaseProps) {
  const parsed = parseVideoShowcaseFromContent(page?.content);
  const items = parsed.length > 0 ? parsed : MOCK_VIDEO_SHOWCASE;

  if (items.length === 0) return null;

  return (
    <section
      aria-labelledby="video-showcase-heading"
      className="flex flex-col gap-6"
    >
      <h2
        id="video-showcase-heading"
        className="px-6 font-display text-[20px] font-medium text-black"
      >
        Conteúdo em vídeo para ir além da leitura
      </h2>
      <VideoShowcaseCarousel items={items} />
    </section>
  );
}
