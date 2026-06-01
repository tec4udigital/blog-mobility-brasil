"use client";

import { useState } from "react";
import { ShareIcon } from "@/components/layout/icons";

interface PostCommentFormProps {
  /** databaseId do post — usado como `commentOn` no WordPress. */
  postId: number;
}

type Status = "idle" | "submitting" | "success" | "error";

/**
 * Formulário de comentário do post.
 *
 * Posta para `app/api/comments/route.ts`, que repassa para a mutation nativa
 * `createComment` do WPGraphQL. O comentário entra em moderação no WP.
 */
export function PostCommentForm({ postId }: PostCommentFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [feedback, setFeedback] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;
    if (!message.trim()) return;

    setStatus("submitting");
    setFeedback("");

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId,
          author: name,
          authorEmail: email,
          content: message,
        }),
      });

      const data = (await response.json()) as {
        error?: string;
        success?: boolean;
      };

      if (!response.ok || !data.success) {
        setStatus("error");
        setFeedback(data.error ?? "Não foi possível enviar o comentário.");
        return;
      }

      setStatus("success");
      setFeedback("Comentário enviado para moderação.");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setStatus("error");
      setFeedback("Não foi possível enviar o comentário. Tente novamente.");
    }
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

      {status === "success" ? (
        <div
          role="status"
          className="flex flex-col items-center gap-3 rounded-2xl border border-[#1f9d55]/30 bg-[#1f9d55]/5 px-[18px] py-8 text-center"
        >
          <span className="flex size-12 items-center justify-center rounded-full bg-[#1f9d55]/15 text-[#1f9d55]">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-6"
              aria-hidden="true"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </span>
          <p className="font-display text-[18px] font-medium text-black">
            Comentário enviado com sucesso!
          </p>
          <p className="max-w-[420px] text-[14px] leading-normal text-[#848688]">
            Obrigado pela sua participação. Seu comentário foi enviado e
            aparecerá assim que for aprovado pela moderação.
          </p>
          <button
            type="button"
            onClick={() => {
              setStatus("idle");
              setFeedback("");
            }}
            className="mt-1 text-[14px] font-bold tracking-wider text-[#1f9d55] underline-offset-4 hover:underline"
          >
            Escrever outro comentário
          </button>
        </div>
      ) : (
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 rounded-2xl border border-[rgba(132,134,136,0.3)] bg-white px-[18px] py-[19px]"
      >
        <div className="flex flex-col gap-[13px]">
          <div className="flex flex-col gap-[13px] sm:flex-row sm:gap-6">
            <div className="flex w-full max-w-[260px] flex-col gap-[7px]">
              <label htmlFor="post-comment-name" className="sr-only">
                Seu nome
              </label>
              <input
                id="post-comment-name"
                type="text"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Escreva seu nome"
                className="bg-transparent text-[16px] font-light leading-6 text-[#333] placeholder:text-[#333]/70 focus:outline-none"
              />
              <div className="h-px w-full bg-[#f1f1f1]" />
            </div>

            <div className="flex w-full max-w-[260px] flex-col gap-[7px]">
              <label htmlFor="post-comment-email" className="sr-only">
                Seu e-mail
              </label>
              <input
                id="post-comment-email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Escreva seu e-mail"
                className="bg-transparent text-[16px] font-light leading-6 text-[#333] placeholder:text-[#333]/70 focus:outline-none"
              />
              <div className="h-px w-full bg-[#f1f1f1]" />
            </div>
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
            className={`text-[12px] leading-[1.4] ${
              status === "error" ? "text-red-600" : "text-[#848688]"
            }`}
          >
            {feedback}
          </p>
          <button
            type="submit"
            disabled={status === "submitting"}
            className="inline-flex items-center gap-2.5 rounded-[8px] bg-[#f1f1f1] px-6 py-2.5 text-[16px] font-bold tracking-[0.05em] text-[#333] transition-colors hover:bg-[#e7e7e7] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <ShareIcon className="size-5" />
            {status === "submitting" ? "Enviando…" : "Enviar"}
          </button>
        </div>
      </form>
      )}
    </section>
  );
}
