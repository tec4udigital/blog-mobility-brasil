import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryFilter } from "@/components/blog/CategoryFilter";
import { PostCard } from "@/components/blog/PostCard";
import { getCategories } from "@/lib/graphql/queries/categories";
import { getPosts } from "@/lib/graphql/queries/posts";
import type { Category, CategoryNode } from "@/types/wordpress";

export const revalidate = 3600;
export const dynamicParams = true;

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

function flattenCategories(categories: Category[]): CategoryNode[] {
  return categories.flatMap((category) => [
    category,
    ...(category.children?.nodes ?? []),
  ]);
}

async function findCategoryBySlug(slug: string): Promise<CategoryNode | null> {
  const categories = await getCategories();
  return flattenCategories(categories).find((c) => c.slug === slug) ?? null;
}

export async function generateStaticParams(): Promise<Array<{ category: string }>> {
  const categories = await getCategories();
  return flattenCategories(categories).map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const node = await findCategoryBySlug(category);
  if (!node) return { title: "Categoria não encontrada" };

  return {
    title: `${node.name} — Blog Mobility Brasil`,
    description:
      node.description ??
      `Posts da categoria ${node.name} no Blog Mobility Brasil.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const node = await findCategoryBySlug(category);

  if (!node) notFound();

  const [categories, posts] = await Promise.all([
    getCategories(),
    getPosts({ first: 12, categorySlug: node.slug }),
  ]);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-12">
      <section className="flex flex-col gap-4">
        <p className="text-sm font-semibold uppercase tracking-wider text-neutral-500">
          Categoria
        </p>
        <h1 className="text-4xl font-bold leading-tight text-neutral-900 sm:text-5xl">
          {node.name}
        </h1>
        {node.description && (
          <p className="max-w-2xl text-base text-neutral-600 sm:text-lg">
            {node.description}
          </p>
        )}
      </section>

      <section className="flex flex-col gap-6" aria-labelledby="latest-heading">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <h2
            id="latest-heading"
            className="text-2xl font-bold text-neutral-900 sm:text-3xl"
          >
            Publicações
          </h2>
          {categories.length > 0 && (
            <CategoryFilter categories={categories} activeSlug={node.slug} />
          )}
        </div>

        {posts.length === 0 ? (
          <p className="rounded-xl border border-dashed border-neutral-300 bg-white p-10 text-center text-neutral-500">
            Nenhum post encontrado em &quot;{node.name}&quot;.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <PostCard
                key={post.databaseId}
                post={post}
                priority={index < 3}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
