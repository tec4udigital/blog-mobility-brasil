/**
 * Card de inscrição na newsletter exibido no bloco "Leia nossas notícias
 * mais recentes" e em outras áreas no futuro.
 *
 * O envio ainda não está conectado a nenhum serviço — fica como mock visual
 * até o integrador de e-mail ser definido.
 */
export function NewsletterCard() {
  return (
    <div className="flex flex-col gap-2.5 rounded-[8px] bg-[#5e5e5e] px-2.5 py-[17px]">
      <div className="flex flex-col gap-3">
        <p className="font-display text-[20px] font-medium tracking-[2px] text-white">
          Newsletter
        </p>
        <div className="h-px w-full bg-white/40" />
      </div>

      <div className="flex flex-col gap-2.5">
        <p className="text-[12px] leading-[1.4] tracking-[0.6px] text-white">
          Cadastre-se e receba nossas atualizações direto no seu e-mail.
        </p>

        {/* TEMP MOCK — remover quando o integrador de newsletter for definido. */}
        <form
          action="#"
          method="post"
          aria-label="Inscrever-se na newsletter"
          className="flex items-center justify-between gap-2 rounded-[4px] border-b border-[#e7e7e7] bg-white px-3 py-2.5"
        >
          <label htmlFor="newsletter-email" className="sr-only">
            E-mail
          </label>
          <input
            id="newsletter-email"
            type="email"
            placeholder="E-mail"
            required
            className="min-w-0 flex-1 bg-transparent text-[14px] tracking-[0.28px] text-black placeholder:text-black/60 focus:outline-none"
          />
          <button
            type="submit"
            className="shrink-0 text-[14px] font-semibold tracking-[0.28px] text-black underline"
          >
            Inscrever-se
          </button>
        </form>

        <p className="text-[12px] leading-[1.4] tracking-[0.6px] text-white">
          Ao inscrever-se, você concorda com a nossa{" "}
          <a href="#" className="underline">
            política de privacidade.
          </a>
        </p>
      </div>
    </div>
  );
}
