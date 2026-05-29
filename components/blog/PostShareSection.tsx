"use client";

import { useCallback, useState } from "react";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  TiktokIcon,
  WhatsappIcon,
  YoutubeIcon,
} from "@/components/layout/icons";

interface PostShareSectionProps {
  /** Título do post — usado nos intents de compartilhamento. */
  title: string;
}

/**
 * Para Instagram, TikTok e YouTube não há intent web de compartilhamento;
 * por isso esses três botões caem para `copy link`. Os demais abrem o
 * compose oficial em nova aba via handler de clique (lemos
 * `window.location.href` lazily para evitar inconsistências de URL durante
 * navegação client-side).
 */
type ShareTarget =
  | { kind: "intent"; href: (url: string, title: string) => string }
  | { kind: "copy" };

interface SocialButton {
  key: string;
  label: string;
  icon: (props: React.SVGProps<SVGSVGElement>) => React.ReactElement;
  target: ShareTarget;
}

const SOCIAL_BUTTONS: SocialButton[] = [
  {
    key: "instagram",
    label: "Copiar link para Instagram",
    icon: InstagramIcon,
    target: { kind: "copy" },
  },
  {
    key: "facebook",
    label: "Compartilhar no Facebook",
    icon: FacebookIcon,
    target: {
      kind: "intent",
      href: (url) =>
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
  },
  {
    key: "tiktok",
    label: "Copiar link para TikTok",
    icon: TiktokIcon,
    target: { kind: "copy" },
  },
  {
    key: "youtube",
    label: "Copiar link para YouTube",
    icon: YoutubeIcon,
    target: { kind: "copy" },
  },
  {
    key: "linkedin",
    label: "Compartilhar no LinkedIn",
    icon: LinkedinIcon,
    target: {
      kind: "intent",
      href: (url) =>
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    },
  },
  {
    key: "whatsapp",
    label: "Compartilhar no WhatsApp",
    icon: WhatsappIcon,
    target: {
      kind: "intent",
      href: (url, title) =>
        `https://api.whatsapp.com/send?text=${encodeURIComponent(`${title} ${url}`)}`,
    },
  },
];

export function PostShareSection({ title }: PostShareSectionProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleIntent = useCallback(
    (button: SocialButton) => {
      if (button.target.kind !== "intent") return;
      const url = window.location.href;
      const target = button.target.href(url, title);
      window.open(target, "_blank", "noopener,noreferrer");
    },
    [title],
  );

  const handleCopy = useCallback(async (key: string) => {
    const url =
      typeof window !== "undefined" ? window.location.href : "";
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedKey(key);
      window.setTimeout(
        () => setCopiedKey((current) => (current === key ? null : current)),
        2000,
      );
    } catch {
      /* silencioso */
    }
  }, []);

  return (
    <section
      aria-labelledby="post-share-heading"
      className="flex flex-col gap-[26px]"
    >
      <div className="h-px w-full bg-[rgba(132,134,136,0.3)]" />

      <div className="flex flex-col gap-[18px]">
        <h2
          id="post-share-heading"
          className="font-display text-[16px] font-medium text-black lg:text-[18px]"
        >
          Compartilhe este artigo:
        </h2>

        <ul className="flex flex-wrap items-center gap-3">
          {SOCIAL_BUTTONS.map((button) => {
            const Icon = button.icon;
            const isCopied = copiedKey === button.key;
            const className =
              "flex size-[30px] items-center justify-center rounded-full bg-[#f1f1f1] text-black transition-colors hover:bg-[#e7e7e7]";

            const handler =
              button.target.kind === "intent"
                ? () => handleIntent(button)
                : () => handleCopy(button.key);

            return (
              <li key={button.key}>
                <button
                  type="button"
                  onClick={handler}
                  aria-label={isCopied ? "Link copiado" : button.label}
                  className={className}
                >
                  <Icon className="size-[16px]" />
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="h-px w-full bg-[rgba(132,134,136,0.3)]" />
    </section>
  );
}
