import { NewsletterCard } from "./NewsletterCard";
import { PostSidebarRecent } from "./PostSidebarRecent";
import { PostSidebarTrending } from "./PostSidebarTrending";
import type { PostListItem } from "@/types/wordpress";

interface PostSidebarProps {
  recentPosts: PostListItem[];
  trendingPosts: PostListItem[];
}

/**
 * Coluna lateral da página de post — agrega os 3 widgets (recents,
 * newsletter, trending). "Produtos relacionados" ainda não está pronto
 * (depende de integração com a loja) e foi omitido propositalmente.
 */
export function PostSidebar({
  recentPosts,
  trendingPosts,
}: PostSidebarProps) {
  return (
    <aside className="flex flex-col gap-9 lg:w-[378px] lg:shrink-0">
      <div className="flex flex-col gap-9 lg:sticky lg:top-8">
        <PostSidebarRecent posts={recentPosts} />
        <NewsletterCard />
        <PostSidebarTrending posts={trendingPosts} />
      </div>
    </aside>
  );
}
