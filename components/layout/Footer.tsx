import Image from "next/image";
import Link from "next/link";
import { getFooter } from "@/lib/uappi/footer";
import type { FooterSocialNetwork } from "@/types/wordpress";
import { FooterAccordion } from "./FooterAccordion";
import { FooterNewsletterForm } from "./FooterNewsletterForm";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  TiktokIcon,
  WhatsappIcon,
  YoutubeIcon,
} from "./icons";

const SOCIAL_ICON_BY_NETWORK: Record<
  FooterSocialNetwork,
  {
    Icon: (props: React.SVGProps<SVGSVGElement>) => React.JSX.Element;
    label: string;
  }
> = {
  instagram: { Icon: InstagramIcon, label: "Instagram" },
  facebook: { Icon: FacebookIcon, label: "Facebook" },
  tiktok: { Icon: TiktokIcon, label: "TikTok" },
  youtube: { Icon: YoutubeIcon, label: "YouTube" },
  linkedin: { Icon: LinkedinIcon, label: "LinkedIn" },
  whatsapp: { Icon: WhatsappIcon, label: "WhatsApp" },
};

/**
 * Footer global do site. Server Component — busca o conteúdo da Options
 * Page ACF (campo `footer`) e renderiza o layout responsivo:
 * - Desktop: newsletter à esquerda + colunas de links à direita (com
 *   divisor vertical entre eles).
 * - Mobile: tudo empilhado.
 *
 * Sub-componentes client são usados apenas para o acordeão das colunas
 * e para o form da newsletter — o resto fica estático/SSR.
 */
export async function Footer() {
  const data = await getFooter();
  const newsletter = data.newsletter;
  const bottom = data.bottom;

  return (
    <footer className="bg-[color:var(--color-brand-footer)] text-[color:var(--color-brand-text)]">
      {/* Linha superior */}
      <div className="border-t border-[color:var(--color-brand-divider)]" />

      {/* Seção 1: newsletter + colunas */}
      <div className="flex flex-col border-b border-[color:var(--color-brand-divider)] lg:flex-row lg:items-stretch">
        {/* Newsletter */}
        <div className="flex flex-col gap-4 px-[18px] pr-8 py-8 lg:w-[578px] lg:shrink-0 lg:border-r lg:border-[color:var(--color-brand-divider)] lg:p-8">
          {newsletter?.titulo && (
            <p className="font-display text-[16px] font-medium tracking-[0.2em] uppercase">
              {newsletter.titulo}
            </p>
          )}
          <div className="border-t border-[color:var(--color-brand-divider)]" />

          {(newsletter?.textoPrincipal || newsletter?.textoSecundario) && (
            <div className="flex flex-col gap-1 text-[12px] leading-[1.4] tracking-[0.05em] text-[color:var(--color-brand-gray)]">
              {newsletter.textoPrincipal && (
                <p className="opacity-70">{newsletter.textoPrincipal}</p>
              )}
              {newsletter.textoSecundario && (
                <p className="opacity-70">{newsletter.textoSecundario}</p>
              )}
            </div>
          )}

          <FooterNewsletterForm
            placeholder={newsletter?.placeholderEmail ?? "E-mail"}
            ctaLabel={newsletter?.ctaLabel ?? "Inscrever-se"}
          />

          {newsletter?.textoPrivacidade && (
            <p className="text-[12px] leading-[1.4] tracking-[0.05em] text-[color:var(--color-brand-gray)] opacity-70">
              {newsletter.urlPoliticaPrivacidade ? (
                <>
                  Ao inscrever-se, você concorda com a nossa{" "}
                  <Link
                    href={newsletter.urlPoliticaPrivacidade}
                    className="underline"
                  >
                    política de privacidade.
                  </Link>
                </>
              ) : (
                newsletter.textoPrivacidade
              )}
            </p>
          )}
        </div>

        {/* Colunas de links */}
        {data.colunas.length > 0 && (
          <div className="border-t border-[color:var(--color-brand-divider)] px-3 pr-6 py-3 lg:flex-1 lg:border-t-0 lg:py-3 lg:pl-6 lg:pr-[46px]">
            <FooterAccordion columns={data.colunas} />
          </div>
        )}
      </div>

      {/* Seção 2: rodapé central */}
      <div className="flex flex-col items-center gap-6 px-[18px] pb-5 pt-8 lg:gap-6">
        <div className="flex flex-col items-center gap-[18px]">
          {data.redesSociais.length > 0 && (
            <ul className="flex items-center gap-3">
              {data.redesSociais.map((social) => {
                const config = SOCIAL_ICON_BY_NETWORK[social.rede];
                if (!config) return null;
                const Icon = config.Icon;
                return (
                  <li key={social.rede}>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={config.label}
                      className="flex size-[30px] items-center justify-center rounded-full bg-white text-black"
                    >
                      <Icon className="size-4" />
                    </a>
                  </li>
                );
              })}
            </ul>
          )}

          <Link
            href="/"
            aria-label="Mobility Brasil — Home"
            className="block"
          >
            {/* TEMP: enquanto não há /logo-mobility-black.svg, invertemos o
                arquivo branco existente (monocromático). Substituir pela
                versão preta quando o asset for fornecido. */}
            <Image
              src="/logo-mobility-white.svg"
              alt="Mobility Brasil"
              width={124}
              height={25}
              className="invert"
            />
          </Link>
        </div>

        <div className="flex w-full flex-col items-center gap-3">
          {bottom && bottom.linksLegais.length > 0 && (
            <ul className="flex items-center divide-x divide-[color:var(--color-brand-gray)]">
              {bottom.linksLegais.map((link, index) => (
                <li key={`${link.label}-${index}`} className="px-3 first:pl-0 last:pr-0">
                  <Link
                    href={link.url}
                    className="text-[12px] text-[color:var(--color-brand-text)] underline opacity-70 hover:opacity-100"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {bottom?.copyright && (
            <p className="text-center text-[12px] text-[color:var(--color-brand-text)] opacity-70">
              {bottom.copyright}
            </p>
          )}

          <div className="flex flex-col items-center gap-1 text-[12px] text-[color:var(--color-brand-text)]">
            {bottom?.textoTecnologia && (
              <div className="flex items-center gap-2">
                <span className="opacity-70">{bottom.textoTecnologia}</span>
                {bottom.urlTecnologia ? (
                  <a
                    href={bottom.urlTecnologia}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] underline"
                  >
                    Uappi
                  </a>
                ) : (
                  <span className="text-[10px] underline">Uappi</span>
                )}
              </div>
            )}
            {bottom?.textoDesenvolvido && (
              <div className="flex items-center gap-1">
                <span>{bottom.textoDesenvolvido}</span>
                {/* TEMP: trocar pelo SVG da TEC4U quando o asset estiver no
                    /public. */}
                {bottom.urlDesenvolvedor ? (
                  <a
                    href={bottom.urlDesenvolvedor}
                    target="_blank"
                    rel="noreferrer"
                    className="font-display font-bold tracking-wide"
                  >
                    TEC4U
                  </a>
                ) : (
                  <span className="font-display font-bold tracking-wide">
                    TEC4U
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
