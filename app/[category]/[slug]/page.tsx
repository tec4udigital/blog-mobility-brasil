import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PostCTA } from "@/components/blog/PostCTA";
import { PostContent } from "@/components/blog/PostContent";
import { formatDate, safeColor, stripHtml } from "@/lib/format";
import { getPostBySlug } from "@/lib/graphql/queries/post";
import { getAllPostSlugs } from "@/lib/graphql/queries/posts";

export const revalidate = 3600;
export const dynamicParams = true;

interface PostPageProps {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateStaticParams(): Promise<
  Array<{ category: string; slug: string }>
> {
  const slugs = await getAllPostSlugs();
  return slugs.map((s) => ({ category: s.category, slug: s.slug }));
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post não encontrado" };

  const seo = post.seo;
  const fallbackTitle = stripHtml(post.title);
  const fallbackDescription = stripHtml(post.excerpt ?? "");
  const ogImage =
    seo?.opengraphImage?.sourceUrl ?? post.featuredImage?.node?.sourceUrl ?? null;

  return {
    title: seo?.title ?? fallbackTitle,
    description: seo?.metaDesc ?? fallbackDescription,
    alternates: { canonical: seo?.canonical ?? undefined },
    keywords: seo?.metaKeywords ?? undefined,
    robots: {
      index: seo?.metaRobotsNoindex !== "noindex",
      follow: seo?.metaRobotsNofollow !== "nofollow",
    },
    openGraph: {
      title: seo?.opengraphTitle ?? fallbackTitle,
      description: seo?.opengraphDescription ?? fallbackDescription,
      type: "article",
      url: seo?.opengraphUrl ?? undefined,
      siteName: seo?.opengraphSiteName ?? undefined,
      images: ogImage
        ? [
            {
              url: ogImage,
              width: seo?.opengraphImage?.mediaDetails?.width ?? undefined,
              height: seo?.opengraphImage?.mediaDetails?.height ?? undefined,
              alt: seo?.opengraphImage?.altText ?? fallbackTitle,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: seo?.twitterTitle ?? fallbackTitle,
      description: seo?.twitterDescription ?? fallbackDescription,
      images: seo?.twitterImage?.sourceUrl
        ? [seo.twitterImage.sourceUrl]
        : ogImage
          ? [ogImage]
          : undefined,
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { category, slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  // Se a categoria da URL não bater com a do post, redireciona para a URL
  // canônica via `notFound` — evita conteúdo duplicado nas SERPs.
  const postPrimaryCategory = post.categories?.nodes[0]?.slug ?? null;
  if (postPrimaryCategory && postPrimaryCategory !== category) {
    notFound();
  }

  const themeColor = safeColor(post.postFields?.postThemeColor ?? null);
  const featured = post.featuredImage?.node;
  const author = post.author?.node;
  const authorBio =
    post.postFields?.authorBio ?? author?.description ?? null;

  return (
    <article className="mx-auto flex max-w-3xl flex-col gap-8 px-6 py-12">
      <nav className="text-sm text-neutral-500">
        <Link href="/" className="hover:text-neutral-900">
          Blog
        </Link>
        {post.categories?.nodes[0] && (
          <>
            <span aria-hidden> / </span>
            <Link
              href={`/?category=${post.categories.nodes[0].slug}`}
              className="hover:text-neutral-900"
            >
              {post.categories.nodes[0].name}
            </Link>
          </>
        )}
      </nav>

      <header className="flex flex-col gap-4">
        {themeColor && (
          <span
            className="w-fit rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white"
            style={{ backgroundColor: themeColor }}
          >
            {post.categories?.nodes[0]?.name ?? "Artigo"}
          </span>
        )}

        <h1 className="text-4xl font-bold leading-tight text-neutral-900 sm:text-5xl">
          {post.title}
        </h1>

        {post.excerpt && (
          <p
            className="text-lg text-neutral-600"
            dangerouslySetInnerHTML={{ __html: post.excerpt }}
          />
        )}

        <div className="flex flex-wrap items-center gap-4 border-y border-black/5 py-4 text-sm text-neutral-600">
          {author && (
            <div className="flex items-center gap-3">
              {author.avatar?.url && (
                <Image
                  src={author.avatar.url}
                  alt={author.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              )}
              <div>
                <p className="font-medium text-neutral-900">{author.name}</p>
                {authorBio && (
                  <p className="text-xs text-neutral-500">{authorBio}</p>
                )}
              </div>
            </div>
          )}
          <time dateTime={post.date} className="ml-auto text-xs uppercase tracking-wider">
            {formatDate(post.date)}
          </time>
        </div>
      </header>

      {featured?.sourceUrl && (
        <figure className="relative overflow-hidden rounded-2xl bg-neutral-100">
          <Image
            src={featured.sourceUrl}
            alt={featured.altText ?? post.title}
            width={featured.mediaDetails?.width ?? 1600}
            height={featured.mediaDetails?.height ?? 900}
            className="h-auto w-full object-cover"
            priority
            sizes="(min-width: 1024px) 768px, 100vw"
          />
        </figure>
      )}

      <PostContent html={post.content} />

      <PostCTA
        url={post.postFields?.postCTA ?? null}
        themeColor={post.postFields?.postThemeColor ?? null}
      />

      {post.tags?.nodes && post.tags.nodes.length > 0 && (
        <footer className="flex flex-wrap items-center gap-2 border-t border-black/5 pt-6 text-sm">
          <span className="text-neutral-500">Tags:</span>
          {post.tags.nodes.map((tag) => (
            <span
              key={tag.databaseId}
              className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-700"
            >
              #{tag.name}
            </span>
          ))}
        </footer>
      )}
    </article>
  );
}
