import { BlogHero } from "@/components/blog/BlogHero";
import { CategoryFilter } from "@/components/blog/CategoryFilter";
import {
  CategoryShowcase,
  COMPONENTS_HOME_URI,
} from "@/components/blog/CategoryShowcase";
import { LatestNews } from "@/components/blog/LatestNews";
import { PostCard } from "@/components/blog/PostCard";
import { PostCardFeatured } from "@/components/blog/PostCardFeatured";
import { getCategories } from "@/lib/graphql/queries/categories";
import { getPageByUri } from "@/lib/graphql/queries/pages";
import { getPosts } from "@/lib/graphql/queries/posts";

export const revalidate = 3600;

export default async function HomePage() {
  const [categories, posts, showcasePage] = await Promise.all([
    getCategories(),
    getPosts({ first: 12 }),
    getPageByUri(COMPONENTS_HOME_URI),
  ]);

  const highlighted = posts.find((p) => p.postFields?.postHighlight) ?? null;

  const latestPosts = posts.slice(0, 3);
  const latestIds = new Set(latestPosts.map((p) => p.databaseId));

  // Evita duplicação: posts mostrados no LatestNews e o destaque (ACF) saem do grid.
  const gridPosts = posts.filter(
    (p) =>
      !latestIds.has(p.databaseId) &&
      (!highlighted || p.databaseId !== highlighted.databaseId),
  );

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-12">
      <BlogHero categories={categories} />

      {latestPosts.length > 0 && <LatestNews posts={latestPosts} />}

      <CategoryShowcase page={showcasePage} />

      {highlighted && (
        <section aria-labelledby="featured-heading">
          <h2 id="featured-heading" className="sr-only">
            Post em destaque
          </h2>
          <PostCardFeatured post={highlighted} />
        </section>
      )}

      <section className="flex flex-col gap-6" aria-labelledby="latest-heading">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <h2
            id="latest-heading"
            className="text-2xl font-bold text-neutral-900 sm:text-3xl"
          >
            Últimas publicações
          </h2>
          {categories.length > 0 && (
            <CategoryFilter categories={categories} activeSlug={null} />
          )}
        </div>

        {gridPosts.length === 0 ? (
          <p className="rounded-xl border border-dashed border-neutral-300 bg-white p-10 text-center text-neutral-500">
            Nenhum post encontrado.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {gridPosts.map((post, index) => (
              <PostCard
                key={post.databaseId}
                post={post}
                priority={!highlighted && index < 3}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
