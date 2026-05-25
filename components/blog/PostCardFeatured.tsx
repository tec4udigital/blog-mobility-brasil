import Image from "next/image";
import Link from "next/link";
import { formatDate, safeColor, stripHtml } from "@/lib/format";
import type { PostListItem } from "@/types/wordpress";

interface PostCardFeaturedProps {
  post: PostListItem;
}

function buildPostHref(post: PostListItem): string {
  const category = post.categories?.nodes[0]?.slug ?? "sem-categoria";
  return `/${category}/${post.slug}`;
}

/**
 * Variante destacada de PostCard. Renderizada quando o ACF `postHighlight`
 * está verdadeiro. Usa layout horizontal em telas largas.
 */
export function PostCardFeatured({ post }: PostCardFeaturedProps) {
  const href = buildPostHref(post);
  const themeColor = safeColor(post.postFields?.postThemeColor ?? null);
  const featured = post.featuredImage?.node;
  const category = post.categories?.nodes[0];

  return (
    <article
      className="group relative overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm"
      style={themeColor ? { borderColor: themeColor } : undefined}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <Link
          href={href}
          className="relative block aspect-[16/10] overflow-hidden bg-neutral-100 lg:aspect-auto lg:min-h-[420px]"
        >
          {featured?.sourceUrl ? (
            <Image
              src={featured.sourceUrl}
              alt={featured.altText ?? post.title}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover transition duration-500 group-hover:scale-[1.03]"
              priority
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-neutral-400">
              Sem imagem
            </div>
          )}
        </Link>

        <div className="flex flex-col justify-center gap-4 p-8 lg:p-12">
          <div className="flex items-center gap-3">
            <span
              className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white"
              style={{ backgroundColor: themeColor ?? "#111827" }}
            >
              Destaque
            </span>
            {category && (
              <Link
                href={`/${category.slug}`}
                className="text-xs font-semibold uppercase tracking-wider text-neutral-500 hover:text-neutral-900"
              >
                {category.name}
              </Link>
            )}
          </div>

          <h2 className="text-3xl font-bold leading-tight text-neutral-900 lg:text-4xl">
            <Link href={href} className="hover:underline">
              {post.title}
            </Link>
          </h2>

          {post.excerpt && (
            <p className="line-clamp-4 text-base text-neutral-600 lg:text-lg">
              {stripHtml(post.excerpt)}
            </p>
          )}

          <div className="mt-2 flex items-center justify-between text-sm text-neutral-500">
            <span>Por {post.author?.node?.name ?? "Autor desconhecido"}</span>
            <time dateTime={post.date}>{formatDate(post.date)}</time>
          </div>

          <Link
            href={href}
            className="mt-2 inline-flex w-fit items-center gap-2 rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-700"
            style={themeColor ? { backgroundColor: themeColor } : undefined}
          >
            Ler artigo
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
