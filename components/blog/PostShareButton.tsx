"use client";

import { useCallback, useState } from "react";
import { ShareIcon } from "@/components/layout/icons";

interface PostShareButtonProps {
  title: string;
  /** Tamanho do círculo (px). Padrão = desktop (34); mobile usa 28. */
  size?: number;
  /** Tamanho do ícone interno (px). Padrão = 14; mobile usa 12. */
  iconSize?: number;
}

export function PostShareButton({
  title,
  size = 34,
  iconSize = 14,
}: PostShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const onClick = useCallback(async () => {
    if (typeof window === "undefined") return;
    const shareUrl = window.location.href;

    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title, url: shareUrl });
        return;
      } catch {
        // Usuário fechou o sheet nativo — não tratar como erro.
        return;
      }
    }

    // Fallback: copia o link (navegadores desktop sem Web Share).
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
      } catch {
        /* silencioso */
      }
    }
  }, [title]);

  return (
    <button
      type="button"
      aria-label={copied ? "Link copiado" : "Compartilhar"}
      onClick={onClick}
      className="flex items-center justify-center rounded-full border border-[#f1f1f1] bg-white text-[#373435] transition-colors hover:bg-[#f1f1f1]"
      style={{ width: size, height: size }}
    >
      <ShareIcon style={{ width: iconSize, height: iconSize }} />
    </button>
  );
}
