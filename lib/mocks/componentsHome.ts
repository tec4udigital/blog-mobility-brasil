// TEMP MOCK — remover quando a página `/components-home` estiver
// disponível no WordPress com os blocos Heading (h3) + Image + Button para
// cada categoria.

import type { CategoryShowcaseGalleryItem } from "@/lib/parseCategoryShowcase";

// `src` vazio → o componente renderiza placeholder cinza no lugar da imagem.
export const MOCK_CATEGORY_SHOWCASE: CategoryShowcaseGalleryItem[] = [
  {
    title: "Cadeira de Rodas Manual",
    src: "",
    alt: "Cadeira de Rodas Manual",
    href: null,
    buttonLabel: "Explorar",
  },
  {
    title: "Cadeira de Rodas Monobloco",
    src: "",
    alt: "Cadeira de Rodas Monobloco",
    href: null,
    buttonLabel: "Explorar",
  },
  {
    title: "Acessórios para cadeira de rodas",
    src: "",
    alt: "Acessórios para cadeira de rodas",
    href: null,
    buttonLabel: "Explorar",
  },
  {
    title: "Almofadas para cadeira de rodas",
    src: "",
    alt: "Almofadas para cadeira de rodas",
    href: null,
    buttonLabel: "Explorar",
  },
  {
    title: "Dispositivos Motorizados",
    src: "",
    alt: "Dispositivos Motorizados",
    href: null,
    buttonLabel: "Explorar",
  },
];
