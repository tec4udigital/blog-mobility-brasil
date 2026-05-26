import { getPageByUri } from "@/lib/graphql/queries/pages";
import { MOCK_CATEGORY_SHOWCASE } from "@/lib/mocks/componentsHome";
import { parseGalleryFromContent } from "@/lib/parseGallery";
import type { Category } from "@/types/wordpress";
import {
  CategoryShowcaseCarousel,
  type CategoryShowcaseItem,
} from "./CategoryShowcaseCarousel";

const COMPONENTS_HOME_URI = "/components-home/";

interface CategoryShowcaseProps {
  /**
   * Lista de categorias do blog usada para tentar casar o título (alt da
   * imagem) com uma URL de categoria existente. Quando não há match, o
   * link da imagem (do Gutenberg) é usado; se nem isso existe, o card
   * vira não-clicável.
   */
  categories: Category[];
}

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function resolveHref(
  alt: string,
  galleryHref: string | null,
  categories: Category[],
): string | null {
  // 1) prioriza categoria do blog que bate por nome
  const normalizedAlt = normalize(alt);
  const match = categories.find((c) => normalize(c.name) === normalizedAlt);
  if (match) {
    return match.uri ?? `/${match.slug}`;
  }
  // 2) cai no link explícito do Gutenberg, se houver
  if (galleryHref) return galleryHref;
  return null;
}

export async function CategoryShowcase({ categories }: CategoryShowcaseProps) {
  const page = await getPageByUri(COMPONENTS_HOME_URI);
  const galleryItems = parseGalleryFromContent(page?.content);
  const source = galleryItems.length > 0 ? galleryItems : MOCK_CATEGORY_SHOWCASE;

  const items: CategoryShowcaseItem[] = source.map((item) => ({
    src: item.src,
    alt: item.alt,
    title: item.alt || "Categoria",
    href: resolveHref(item.alt, item.href, categories),
  }));

  if (items.length === 0) return null;

  return (
    <section
      aria-labelledby="category-showcase-heading"
      className="flex flex-col gap-6"
    >
      <h2
        id="category-showcase-heading"
        className="font-display text-[18px] font-medium text-black lg:text-[20px]"
      >
        Leia por categoria
      </h2>
      <CategoryShowcaseCarousel items={items} />
    </section>
  );
}
