"use client";

import { useState } from "react";
import { ShareIcon } from "@/components/layout/icons";

/**
 * Formulário visual de comentário do post.
 *
 * TEMP MOCK — ainda não há integração com WordPress Comments / Disqus.
 * Quando definirmos o provedor, este componente passa a postar para a
 * rota correspondente. Por ora, o submit apenas dá feedback local.
 */
export function PostCommentForm() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!message.trim()) return;
    setSubmitted(true);
    setName("");
    setMessage("");
    window.setTimeout(() => setSubmitted(false), 4000);
  }

  return (
    <section
      aria-labelledby="post-comment-heading"
      className="flex flex-col gap-4"
    >
      <h2
        id="post-comment-heading"
        className="font-display text-[18px] font-medium text-black"
      >
        Deixe um comentário
      </h2>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 rounded-2xl border border-[rgba(132,134,136,0.3)] bg-white px-[18px] py-[19px]"
      >
        <div className="flex flex-col gap-[13px]">
          <div className="flex w-full max-w-[260px] flex-col gap-[7px]">
            <label htmlFor="post-comment-name" className="sr-only">
              Seu nome
            </label>
            <input
              id="post-comment-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Escreva seu nome"
              className="bg-transparent text-[16px] font-light leading-6 text-[#333] placeholder:text-[#333]/70 focus:outline-none"
            />
            <div className="h-px w-full bg-[#f1f1f1]" />
          </div>

          <label htmlFor="post-comment-message" className="sr-only">
            Sua mensagem
          </label>
          <textarea
            id="post-comment-message"
            required
            rows={4}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Escreva seu comentário"
            className="min-h-[120px] w-full resize-y bg-transparent text-[16px] leading-6 text-[#333] placeholder:text-[#333]/60 focus:outline-none"
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          <p
            aria-live="polite"
            className="text-[12px] leading-[1.4] text-[#848688]"
          >
            {submitted ? "Comentário enviado para moderação." : ""}
          </p>
          <button
            type="submit"
            className="inline-flex items-center gap-2.5 rounded-[8px] bg-[#f1f1f1] px-6 py-2.5 text-[16px] font-bold tracking-[0.05em] text-[#333] transition-colors hover:bg-[#e7e7e7]"
          >
            <ShareIcon className="size-5" />
            Enviar
          </button>
        </div>
      </form>
    </section>
  );
}
