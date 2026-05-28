// TEMP MOCK — remover quando a página `/components-home` estiver
// disponível no WordPress com os blocos Heading (h3) + Image + Button para
// cada categoria, e os blocos wp:video para a showcase de vídeos.

import type { CategoryShowcaseGalleryItem } from "@/lib/parseCategoryShowcase";
import type { VideoShowcaseItem } from "@/lib/parseVideoShowcase";

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

// Mock dos vídeos da home — usado enquanto a página
// `/components-home/` no WP não está populada com `wp:video`.
export const MOCK_VIDEO_SHOWCASE: VideoShowcaseItem[] = [
  {
    src: "https://slategrey-dove-397328.hostingersite.com/wp-content/uploads/2026/05/experiencia-real-power-stand-2.mp4",
    poster: null,
  },
  {
    src: "https://slategrey-dove-397328.hostingersite.com/wp-content/uploads/2026/05/experiencia-real-power-stand.mp4",
    poster: null,
  },
  {
    src: "https://slategrey-dove-397328.hostingersite.com/wp-content/uploads/2026/05/Cecilia-Passeando.mp4",
    poster: null,
  },
  {
    src: "https://slategrey-dove-397328.hostingersite.com/wp-content/uploads/2026/05/Video-HD-720p-4.5Mbps.mp4",
    poster: null,
  },
];
