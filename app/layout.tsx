import type { Metadata } from "next";
import localFont from "next/font/local";
import { Lato } from "next/font/google";
import { Header } from "@/components/layout/Header";
import "./globals.css";

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

const helveticaNeue = localFont({
  variable: "--font-helvetica",
  display: "swap",
  src: [
    {
      path: "../public/fonts/HelveticaNeueLTLight.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/HelveticaNeueLTRegular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/HelveticaNeueLTBold.otf",
      weight: "700",
      style: "normal",
    },
  ],
});

export const metadata: Metadata = {
  title: {
    default: "Blog Mobility Brasil",
    template: "%s · Mobility Brasil",
  },
  description:
    "Conteúdo sobre mobilidade urbana, sustentabilidade e tecnologia para empresas que querem mover o futuro.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${lato.variable} ${helveticaNeue.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-neutral-50 text-neutral-900">
        <Header />

        <main className="flex-1">{children}</main>

        <footer className="border-t border-black/5 bg-white">
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-2 px-6 py-8 text-sm text-neutral-500 sm:flex-row">
            <p>© {new Date().getFullYear()} Mobility Brasil. Todos os direitos reservados.</p>
            <p>Conteúdo gerenciado em WordPress headless.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
