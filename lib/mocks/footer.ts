// Fallback granular usado por lib/uappi/footer.ts quando um endpoint
// específico da Uappi falha (cada slot — newsletter, colunas, redesSociais,
// bottom — pode cair pra esses defaults sem derrubar o footer inteiro).

import type { FooterData } from "@/types/wordpress";

export const MOCK_FOOTER: FooterData = {
  newsletter: {
    titulo: "Newsletter",
    textoPrincipal: "Cadastre-se e ganhe 5% de desconto na primeira compra*",
    textoSecundario:
      "*Cupom não acumulativo com outros descontos e promoções (válido para compras acima de R$ 5.000)",
    placeholderEmail: "E-mail",
    ctaLabel: "Inscrever-se",
    textoPrivacidade: "Ao inscrever-se, você concorda com a nossa política de privacidade.",
    urlPoliticaPrivacidade: "/politica-de-privacidade",
  },
  colunas: [
    {
      titulo: "Sobre Mobility",
      links: [
        { label: "Quem somos", url: "/sobre-1", abrirEmNovaAba: false },
        { label: "Nossa história", url: "/historia", abrirEmNovaAba: false },
        { label: "Trabalhe conosco", url: "/carreiras", abrirEmNovaAba: false },
      ],
    },
    {
      titulo: "Área do Cliente",
      links: [
        { label: "Meus pedidos", url: "https://mobilitybrasil.com.br/conta", abrirEmNovaAba: true },
        { label: "Trocas e devoluções", url: "/trocas", abrirEmNovaAba: false },
        { label: "Acompanhar pedido", url: "/rastreio", abrirEmNovaAba: false },
      ],
    },
    {
      titulo: "Contato",
      links: [
        { label: "Fale conosco", url: "/contato", abrirEmNovaAba: false },
        { label: "Atendimento", url: "/atendimento", abrirEmNovaAba: false },
        { label: "WhatsApp", url: "https://wa.me/5500000000000", abrirEmNovaAba: true },
      ],
    },
    {
      titulo: "Políticas",
      links: [
        { label: "Política de privacidade", url: "/politica-de-privacidade", abrirEmNovaAba: false },
        { label: "Termos de uso", url: "/termos-de-uso", abrirEmNovaAba: false },
        { label: "Política de trocas", url: "/politica-trocas", abrirEmNovaAba: false },
      ],
    },
  ],
  redesSociais: [
    { rede: "instagram", url: "https://instagram.com/mobilitybrasil" },
    { rede: "facebook", url: "https://facebook.com/mobilitybrasil" },
    { rede: "tiktok", url: "https://tiktok.com/@mobilitybrasil" },
    { rede: "youtube", url: "https://youtube.com/@mobilitybrasil" },
    { rede: "linkedin", url: "https://linkedin.com/company/mobilitybrasil" },
    { rede: "whatsapp", url: "https://wa.me/5500000000000" },
  ],
  bottom: {
    copyright:
      "© 2025, Mobility Brasil Importação e Comércio de Cadeiras de Rodas Eireli. Todos os direitos reservados.",
    linksLegais: [
      { label: "Endereço", url: "/endereco" },
      { label: "Atendimento", url: "/atendimento" },
      { label: "CNPJ", url: "/cnpj" },
    ],
    textoTecnologia: "Tecnologia de e-commerce",
    urlTecnologia: "https://uappi.com.br",
    textoDesenvolvido: "Desenvolvido por",
    urlDesenvolvedor: "https://tec4udigital.com",
  },
};
