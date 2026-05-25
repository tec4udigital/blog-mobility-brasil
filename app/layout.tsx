import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-neutral-50 text-neutral-900">
        <header className="border-b border-black/5 bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
            <Link href="/" className="text-lg font-bold tracking-tight">
              Mobility Brasil <span className="text-neutral-400">Blog</span>
            </Link>
            <nav className="text-sm text-neutral-600">
              <Link href="/" className="hover:text-neutral-900">
                Início
              </Link>
            </nav>
          </div>
        </header>

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
