# Graph Report - .  (2026-05-26)

## Corpus Check
- 37 files · ~12,545 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 130 nodes · 98 edges · 43 communities detected
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.7)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]

## God Nodes (most connected - your core abstractions)
1. `Blog Mobility Brasil` - 6 edges
2. `fetchGraphQL` - 6 edges
3. `WordPress Headless CMS` - 5 edges
4. `Next.js 16` - 4 edges
5. `flattenCategories()` - 3 edges
6. `findCategoryBySlug()` - 3 edges
7. `generateStaticParams()` - 3 edges
8. `generateMetadata()` - 3 edges
9. `Tailwind CSS v4` - 3 edges
10. `WPGraphQL` - 3 edges

## Surprising Connections (you probably didn't know these)
- `Header Component` --references--> `Mobility Brasil White Logo (logo-mobility-white.svg)`  [EXTRACTED]
  components/layout/Header.tsx → public/logo-mobility-white.svg
- `Next.js 16` --warns_about--> `Next.js Breaking Changes Warning`  [EXTRACTED]
  CLAUDE.md → AGENTS.md
- `Next.js 16` --loaded_via--> `Geist Font`  [EXTRACTED]
  CLAUDE.md → README.md
- `File/Document Icon (file.svg)` --semantically_similar_to--> `Globe/World Icon (globe.svg)`  [INFERRED] [semantically similar]
  public/file.svg → public/globe.svg
- `File/Document Icon (file.svg)` --semantically_similar_to--> `Browser Window Icon (window.svg)`  [INFERRED] [semantically similar]
  public/file.svg → public/window.svg

## Hyperedges (group relationships)
- **Request Data Flow Pipeline** — server_components, graphql_queries_dir, fetch_graphql, wpgraphql, isr_caching [INFERRED]
- **WordPress Plugin Stack** — wordpress_headless, wpgraphql, acf_pro, yoast_seo [INFERRED]
- **ACF Field Addition Pipeline** — acf_field_workflow, wpgraphql, graphql_fragments_dir, types_wordpress_ts, cache_tags [INFERRED]
- **Next.js Default Starter Template Icons** — file_svg_document_icon, globe_svg_globe_icon, vercel_svg_vercel_logo, next_svg_nextjs_logo, window_svg_window_icon [INFERRED 0.85]
- **Mobility Brasil Brand Identity Assets** — logo_mobility_white_svg, header_component [EXTRACTED 0.95]

## Communities

### Community 0 - "Community 0"
Cohesion: 0.16
Nodes (15): ACF Field Addition Workflow, ACF PRO, Cache Tags Convention, fetchGraphQL, generateMetadata, lib/graphql/fragments/, lib/graphql/queries/, ISR (Incremental Static Regeneration) (+7 more)

### Community 1 - "Community 1"
Cohesion: 0.17
Nodes (10): app/globals.css, Blog Mobility Brasil, Geist Font, Next.js 16, Next.js Breaking Changes Warning, Pending: Figma Design System, React 19, Tailwind CSS v4 (+2 more)

### Community 2 - "Community 2"
Cohesion: 0.18
Nodes (0): 

### Community 3 - "Community 3"
Cohesion: 0.6
Nodes (4): findCategoryBySlug(), flattenCategories(), generateMetadata(), generateStaticParams()

### Community 4 - "Community 4"
Cohesion: 0.4
Nodes (0): 

### Community 5 - "Community 5"
Cohesion: 0.4
Nodes (5): App Router, Client Component Minimization Rationale, Client Components, generateStaticParams, Server Components

### Community 6 - "Community 6"
Cohesion: 0.5
Nodes (1): WordPressGraphQLError

### Community 7 - "Community 7"
Cohesion: 0.5
Nodes (0): 

### Community 8 - "Community 8"
Cohesion: 0.5
Nodes (0): 

### Community 9 - "Community 9"
Cohesion: 0.67
Nodes (0): 

### Community 10 - "Community 10"
Cohesion: 0.67
Nodes (0): 

### Community 11 - "Community 11"
Cohesion: 1.0
Nodes (2): PostContent(), sanitizeHtml()

### Community 12 - "Community 12"
Cohesion: 0.67
Nodes (0): 

### Community 13 - "Community 13"
Cohesion: 0.67
Nodes (0): 

### Community 14 - "Community 14"
Cohesion: 0.67
Nodes (0): 

### Community 15 - "Community 15"
Cohesion: 0.67
Nodes (3): File/Document Icon (file.svg), Globe/World Icon (globe.svg), Browser Window Icon (window.svg)

### Community 16 - "Community 16"
Cohesion: 1.0
Nodes (0): 

### Community 17 - "Community 17"
Cohesion: 1.0
Nodes (0): 

### Community 18 - "Community 18"
Cohesion: 1.0
Nodes (0): 

### Community 19 - "Community 19"
Cohesion: 1.0
Nodes (0): 

### Community 20 - "Community 20"
Cohesion: 1.0
Nodes (0): 

### Community 21 - "Community 21"
Cohesion: 1.0
Nodes (0): 

### Community 22 - "Community 22"
Cohesion: 1.0
Nodes (0): 

### Community 23 - "Community 23"
Cohesion: 1.0
Nodes (0): 

### Community 24 - "Community 24"
Cohesion: 1.0
Nodes (0): 

### Community 25 - "Community 25"
Cohesion: 1.0
Nodes (0): 

### Community 26 - "Community 26"
Cohesion: 1.0
Nodes (0): 

### Community 27 - "Community 27"
Cohesion: 1.0
Nodes (0): 

### Community 28 - "Community 28"
Cohesion: 1.0
Nodes (0): 

### Community 29 - "Community 29"
Cohesion: 1.0
Nodes (0): 

### Community 30 - "Community 30"
Cohesion: 1.0
Nodes (2): Header Component, Mobility Brasil White Logo (logo-mobility-white.svg)

### Community 31 - "Community 31"
Cohesion: 1.0
Nodes (2): Next.js Wordmark Logo (next.svg), Vercel Triangle Logo (vercel.svg)

### Community 32 - "Community 32"
Cohesion: 1.0
Nodes (0): 

### Community 33 - "Community 33"
Cohesion: 1.0
Nodes (0): 

### Community 34 - "Community 34"
Cohesion: 1.0
Nodes (0): 

### Community 35 - "Community 35"
Cohesion: 1.0
Nodes (0): 

### Community 36 - "Community 36"
Cohesion: 1.0
Nodes (0): 

### Community 37 - "Community 37"
Cohesion: 1.0
Nodes (0): 

### Community 38 - "Community 38"
Cohesion: 1.0
Nodes (0): 

### Community 39 - "Community 39"
Cohesion: 1.0
Nodes (0): 

### Community 40 - "Community 40"
Cohesion: 1.0
Nodes (1): next/image

### Community 41 - "Community 41"
Cohesion: 1.0
Nodes (1): Naming Conventions

### Community 42 - "Community 42"
Cohesion: 1.0
Nodes (1): Request Data Flow

## Knowledge Gaps
- **22 isolated node(s):** `Header Component`, `React 19`, `TypeScript Strict`, `ACF PRO`, `Vercel Hosting` (+17 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 16`** (2 nodes): `page.tsx`, `HomePage()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 17`** (2 nodes): `parseGallery.ts`, `parseGalleryFromContent()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 18`** (2 nodes): `post.ts`, `getPostBySlug()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 19`** (2 nodes): `getCategories()`, `categories.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 20`** (2 nodes): `pages.ts`, `getPageByUri()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 21`** (2 nodes): `posts.ts`, `baseListItem()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 22`** (2 nodes): `PostCTA.tsx`, `PostCTA()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 23`** (2 nodes): `CategoryFilter()`, `CategoryFilter.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 24`** (2 nodes): `PostCard.tsx`, `buildPostHref()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 25`** (2 nodes): `BlogHero()`, `BlogHero.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 26`** (2 nodes): `NewsletterCard.tsx`, `NewsletterCard()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 27`** (2 nodes): `SecondaryNewsCard.tsx`, `buildPostHref()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 28`** (2 nodes): `LatestNews.tsx`, `buildPostHref()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 29`** (2 nodes): `CategoryShowcase()`, `CategoryShowcase.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 30`** (2 nodes): `Header Component`, `Mobility Brasil White Logo (logo-mobility-white.svg)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 31`** (2 nodes): `Next.js Wordmark Logo (next.svg)`, `Vercel Triangle Logo (vercel.svg)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 32`** (1 nodes): `next-env.d.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 33`** (1 nodes): `next.config.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 34`** (1 nodes): `wordpress.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 35`** (1 nodes): `site.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 36`** (1 nodes): `seo.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 37`** (1 nodes): `postFields.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 38`** (1 nodes): `componentsHome.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 39`** (1 nodes): `HeaderDesktopNav.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 40`** (1 nodes): `next/image`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 41`** (1 nodes): `Naming Conventions`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 42`** (1 nodes): `Request Data Flow`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Blog Mobility Brasil` connect `Community 1` to `Community 0`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Why does `WordPress Headless CMS` connect `Community 0` to `Community 1`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **Why does `Next.js 16` connect `Community 1` to `Community 5`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **What connects `Header Component`, `React 19`, `TypeScript Strict` to the rest of the system?**
  _22 weakly-connected nodes found - possible documentation gaps or missing edges._