"use client";

import { useEffect, useRef, useState } from "react";

interface FooterNewsletterFormProps {
  placeholder: string;
  ctaLabel: string;
}

const EMAIL_REGEX = /@.*\.[A-Za-z]/;

type Status = "idle" | "submitting" | "ok" | "error";

export function FooterNewsletterForm({
  placeholder,
  ctaLabel,
}: FooterNewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [invalid, setInvalid] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, []);

  function scheduleReset() {
    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => {
      setStatus("idle");
    }, 5000);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    const value = email.trim();
    if (!EMAIL_REGEX.test(value)) {
      setInvalid(true);
      return;
    }
    setInvalid(false);
    setStatus("submitting");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value }),
      });
      const data = (await response.json().catch(() => ({}))) as {
        sucesso?: boolean;
      };
      if (response.ok && data.sucesso) {
        setStatus("ok");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    } finally {
      scheduleReset();
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex w-full items-center justify-between rounded-[4px] border bg-white px-3 py-2.5 transition-colors ${
        invalid
          ? "border-red-500 shadow-[0_0_5px_rgba(255,0,0,0.3)]"
          : "border-[color:var(--color-brand-border)]"
      }`}
    >
      <label className="sr-only" htmlFor="footer-newsletter-email">
        E-mail
      </label>
      <input
        id="footer-newsletter-email"
        type="email"
        required
        value={email}
        onChange={(event) => {
          setEmail(event.target.value);
          if (invalid) setInvalid(false);
          if (status !== "idle" && status !== "submitting") {
            setStatus("idle");
            if (resetTimer.current) clearTimeout(resetTimer.current);
          }
        }}
        placeholder={placeholder}
        disabled={status === "submitting"}
        className="flex-1 bg-transparent text-[14px] tracking-[0.02em] text-black placeholder:text-black focus:outline-none"
      />
      <button
        type="submit"
        disabled={status === "submitting" || status === "ok"}
        aria-label={ctaLabel}
        className="shrink-0 flex items-center gap-1 text-[14px] font-semibold underline tracking-[0.02em] text-black disabled:no-underline"
      >
        {status === "idle" && <span>{ctaLabel}</span>}
        {status === "submitting" && (
          <svg
            className="size-[18px] animate-spin text-[color:var(--color-brand-gray)]"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
              strokeOpacity="0.25"
            />
            <path
              d="M22 12a10 10 0 0 1-10 10"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        )}
        {status === "ok" && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="18"
            width="18"
            viewBox="0 0 24 24"
            fill="#128637"
            aria-hidden
          >
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path d="M16.59 7.58L10 14.17l-3.59-3.58L5 12l5 5 8-8zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
          </svg>
        )}
        {status === "error" && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="18"
            width="18"
            viewBox="0 0 24 24"
            fill="#fe001f"
            aria-hidden
          >
            <path d="M0 0h24v24H0z" fill="none" />
            <path d="M14.59 8L12 10.59 9.41 8 8 9.41 10.59 12 8 14.59 9.41 16 12 13.41 14.59 16 16 14.59 13.41 12 16 9.41 14.59 8zM12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
          </svg>
        )}
      </button>
    </form>
  );
}
