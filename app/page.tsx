import { CategoryFilter } from "@/components/blog/CategoryFilter";
import { PostCard } from "@/components/blog/PostCard";
import { PostCardFeatured } from "@/components/blog/PostCardFeatured";
import { getCategories } from "@/lib/graphql/queries/categories";
import { getHighlightedPost, getPosts } from "@/lib/graphql/queries/posts";

export const revalidate = 3600;

export default async function HomePage() {
  const [categories, posts, highlighted] = await Promise.all([
    getCategories(),
    getPosts({ first: 12 }),
    getHighlightedPost(),
  ]);

  // Quando o destaque está no topo, removemos do grid para evitar duplicação.
  const gridPosts = highlighted
    ? posts.filter((p) => p.databaseId !== highlighted.databaseId)
    : posts;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-12">
      <section className="flex flex-col gap-4">
        <p className="text-sm font-semibold uppercase tracking-wider text-neutral-500">
          Blog Mobility Brasil
        </p>
        <h1 className="text-4xl font-bold leading-tight text-neutral-900 sm:text-5xl">
          Conteúdo para quem move o futuro.
        </h1>
        <p className="max-w-2xl text-base text-neutral-600 sm:text-lg">
          Reflexões e estudos de caso sobre mobilidade urbana, sustentabilidade
          e tecnologia aplicada ao transporte.
        </p>
      </section>

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
