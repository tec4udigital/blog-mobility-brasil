// TEMP MOCK — remover quando a página `/components-home` estiver
// disponível no WordPress e a galeria configurada.
// Espelha o resultado de `parseGalleryFromContent` aplicado ao conteúdo
// HTML de uma página Gutenberg com uma Gallery block.

import type { GalleryItem } from "@/lib/parseGallery";

// `src` vazio → o componente renderiza placeholder cinza no lugar da imagem.
export const MOCK_CATEGORY_SHOWCASE: GalleryItem[] = [
  { src: "", alt: "Cadeira de Rodas Manual", href: null },
  { src: "", alt: "Cadeira de Rodas Monobloco", href: null },
  { src: "", alt: "Acessórios para cadeira de rodas", href: null },
  { src: "", alt: "Almofadas para cadeira de rodas", href: null },
  { src: "", alt: "Dispositivos Motorizados", href: null },
];
