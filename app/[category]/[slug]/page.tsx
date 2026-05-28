import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostCTA } from "@/components/blog/PostCTA";
import { PostContent } from "@/components/blog/PostContent";
import { PostHero } from "@/components/blog/PostHero";
import { stripHtml } from "@/lib/format";
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

  const featured = post.featuredImage?.node;
  const author = post.author?.node;

  return (
    <article className="flex flex-col gap-8 pb-12 pt-6 sm:pt-0">
      <PostHero
        title={post.title}
        date={post.date}
        content={post.content}
        author={
          author
            ? { name: author.name, avatarUrl: author.avatar?.url ?? null }
            : null
        }
        featuredImage={
          featured?.sourceUrl
            ? {
                sourceUrl: featured.sourceUrl,
                altText: featured.altText,
                width: featured.mediaDetails?.width ?? null,
                height: featured.mediaDetails?.height ?? null,
              }
            : null
        }
      />

      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-[18px] sm:px-6">
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
      </div>
    </article>
  );
}
