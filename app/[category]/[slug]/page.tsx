import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostBottomCTA } from "@/components/blog/PostBottomCTA";
import { PostCategoryBreadcrumb } from "@/components/blog/PostCategoryBreadcrumb";
import { PostCommentForm } from "@/components/blog/PostCommentForm";
import { PostContent } from "@/components/blog/PostContent";
import { PostCTA } from "@/components/blog/PostCTA";
import { PostHero } from "@/components/blog/PostHero";
import { PostShareSection } from "@/components/blog/PostShareSection";
import { PostSidebar } from "@/components/blog/PostSidebar";
import { RelatedPostsCarousel } from "@/components/blog/RelatedPostsCarousel";
import { stripHtml } from "@/lib/format";
import { getPostBySlug } from "@/lib/graphql/queries/post";
import {
  getAllPostSlugs,
  getRecentPosts,
  getRelatedPosts,
  getTrendingPosts,
} from "@/lib/graphql/queries/posts";

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

  const [post, recentPosts, trendingPosts, relatedPosts] = await Promise.all([
    getPostBySlug(slug),
    getRecentPosts({ excludeSlug: slug, first: 5 }),
    getTrendingPosts({ excludeSlug: slug, first: 4 }),
    getRelatedPosts({ excludeSlug: slug, categorySlug: category, first: 9 }),
  ]);

  if (!post) notFound();

  // Se a categoria da URL não bater com a do post, redireciona para a URL
  // canônica via `notFound` — evita conteúdo duplicado nas SERPs.
  const postPrimaryCategory = post.categories?.nodes[0]?.slug ?? null;
  if (postPrimaryCategory && postPrimaryCategory !== category) {
    notFound();
  }

  const featured = post.featuredImage?.node;
  const author = post.author?.node;
  const categories = post.categories?.nodes ?? [];

  return (
    <article className="flex flex-col gap-10 pb-12 pt-6 sm:gap-12 sm:pt-0">
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

      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-10 px-[18px] sm:px-[54px] lg:flex-row lg:items-start lg:justify-between lg:gap-10">
        <div className="flex min-w-0 flex-col gap-[38px] lg:w-[850px]">
          <PostCategoryBreadcrumb categories={categories} />
          <PostContent html={post.content} />
          <PostCTA
            url={post.postSettings?.postCtaUrl ?? null}
            label={post.postSettings?.postCtaLabel ?? undefined}
            themeColor={post.postSettings?.postThemeColor ?? null}
          />
          <PostBottomCTA />
          <PostShareSection title={post.title} />
          <PostCommentForm />
        </div>

        <PostSidebar
          recentPosts={recentPosts}
          trendingPosts={trendingPosts}
        />
      </div>

      {relatedPosts.length > 0 && (
        <div className="mx-auto w-full max-w-[1440px] px-[18px] sm:px-[54px]">
          <RelatedPostsCarousel posts={relatedPosts} />
        </div>
      )}
    </article>
  );
}
