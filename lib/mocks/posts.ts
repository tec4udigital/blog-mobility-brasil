// TEMP MOCK — remover quando o WordPress estiver com posts publicados.
// Usado apenas como fallback se a query do WPGraphQL falhar ou retornar
// vazio durante o desenvolvimento. NÃO deve ser importado em produção.

import type { Category, Post, PostListItem } from "@/types/wordpress";

export const MOCK_CATEGORIES: Category[] = [
  {
    databaseId: 1,
    name: "Mobilidade Urbana",
    slug: "mobilidade-urbana",
    count: 4,
    description: "Tendências e iniciativas em mobilidade urbana.",
    uri: "/category/mobilidade-urbana",
    children: {
      nodes: [
        {
          databaseId: 11,
          name: "Transporte Público",
          slug: "transporte-publico",
          count: 2,
          description: null,
          uri: "/category/mobilidade-urbana/transporte-publico",
        },
        {
          databaseId: 12,
          name: "Micromobilidade",
          slug: "micromobilidade",
          count: 1,
          description: null,
          uri: "/category/mobilidade-urbana/micromobilidade",
        },
      ],
    },
  },
  {
    databaseId: 2,
    name: "Sustentabilidade",
    slug: "sustentabilidade",
    count: 3,
    description: "Transporte limpo e impacto ambiental.",
    uri: "/category/sustentabilidade",
    children: { nodes: [] },
  },
  {
    databaseId: 3,
    name: "Tecnologia",
    slug: "tecnologia",
    count: 2,
    description: "Inovações tecnológicas para mobilidade.",
    uri: "/category/tecnologia",
    children: {
      nodes: [
        {
          databaseId: 31,
          name: "Veículos Autônomos",
          slug: "veiculos-autonomos",
          count: 1,
          description: null,
          uri: "/category/tecnologia/veiculos-autonomos",
        },
      ],
    },
  },
];

const baseListItem = (overrides: Partial<PostListItem>): PostListItem => ({
  databaseId: 0,
  id: "",
  slug: "",
  uri: null,
  title: "",
  excerpt: null,
  date: new Date().toISOString(),
  modified: null,
  featuredImage: null,
  author: {
    node: {
      databaseId: 1,
      name: "Equipe Mobility Brasil",
      slug: "equipe-mobility-brasil",
      description: null,
      avatar: null,
    },
  },
  categories: { nodes: [MOCK_CATEGORIES[0]] },
  tags: { nodes: [] },
  postFields: {
    postHighlight: false,
    postThemeColor: null,
    authorBio: null,
    postCTA: null,
  },
  seo: null,
  ...overrides,
});

export const MOCK_POSTS: PostListItem[] = [
  baseListItem({
    databaseId: 101,
    id: "post-mock-101",
    slug: "futuro-da-mobilidade-eletrica-no-brasil",
    title: "O futuro da mobilidade elétrica no Brasil",
    excerpt:
      "<p>Como a infraestrutura de recarga e os incentivos fiscais estão moldando a próxima década da mobilidade no país.</p>",
    categories: { nodes: [MOCK_CATEGORIES[0]] },
    postFields: {
      postHighlight: true,
      postThemeColor: "#0f766e",
      authorBio: "Especialista em transporte sustentável.",
      postCTA: "https://mobilitybrasil.com/contato",
    },
  }),
  baseListItem({
    databaseId: 102,
    id: "post-mock-102",
    slug: "10-iniciativas-de-cidades-inteligentes",
    title: "10 iniciativas de cidades inteligentes que valem ser observadas",
    excerpt:
      "<p>De ônibus autônomos a vias compartilhadas, conheça projetos que estão redesenhando os centros urbanos.</p>",
    categories: { nodes: [MOCK_CATEGORIES[2]] },
  }),
  baseListItem({
    databaseId: 103,
    id: "post-mock-103",
    slug: "como-medir-o-impacto-ambiental-da-frota",
    title: "Como medir o impacto ambiental da sua frota",
    excerpt:
      "<p>Um guia prático para empresas que querem entender e reduzir suas emissões de CO₂.</p>",
    categories: { nodes: [MOCK_CATEGORIES[1]] },
  }),
];

export const MOCK_POST: Post = {
  ...MOCK_POSTS[0],
  content: `
    <p>Conteúdo de exemplo do post. Substituído pelo HTML do WordPress assim que a API estiver disponível.</p>
    <h2>Por que isso importa</h2>
    <p>Este é um placeholder. Os tipos garantem que a forma do payload bate com o esperado pelo front-end.</p>
  `,
};
