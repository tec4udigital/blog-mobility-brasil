"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Barra de acessibilidade global (porte do componente Vue do site principal).
 * Três ferramentas: alto contraste, leitura em voz alta (clique para ouvir) e
 * ampliar/reduzir conteúdo (escala apenas a fonte). Contraste e zoom persistem
 * em localStorage; a leitura falada é um modo de interação e não persiste.
 */

const ZOOM_KEY = "acessibilidadeZoom";
const CONTRASTE_KEY = "acessibilidadeContraste";
const CONTRASTE_CLASSE = "acessibilidade-contraste";
const AUDIO_CLASSE = "acessibilidade-audio"; // marca no <html> p/ cursor especial
const AUDIO_REALCE = "acessibilidade-audio-alvo"; // contorno do elemento sob o mouse/lido
const AUDIO_LANG = "pt-BR";
const ZOOM_MIN = 0.7;
const ZOOM_MAX = 1.6;
const ZOOM_STEP = 0.1;

// Ícones (Material Symbols) — usam currentColor para herdar o tema do botão
function IconeContraste() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 22C10.6167 22 9.31667 21.7375 8.1 21.2125C6.88333 20.6875 5.825 19.975 4.925 19.075C4.025 18.175 3.3125 17.1167 2.7875 15.9C2.2625 14.6833 2 13.3833 2 12C2 10.6167 2.2625 9.31667 2.7875 8.1C3.3125 6.88333 4.025 5.825 4.925 4.925C5.825 4.025 6.88333 3.3125 8.1 2.7875C9.31667 2.2625 10.6167 2 12 2C13.3833 2 14.6833 2.2625 15.9 2.7875C17.1167 3.3125 18.175 4.025 19.075 4.925C19.975 5.825 20.6875 6.88333 21.2125 8.1C21.7375 9.31667 22 10.6167 22 12C22 13.3833 21.7375 14.6833 21.2125 15.9C20.6875 17.1167 19.975 18.175 19.075 19.075C18.175 19.975 17.1167 20.6875 15.9 21.2125C14.6833 21.7375 13.3833 22 12 22ZM13 19.925C14.9833 19.675 16.6458 18.8042 17.9875 17.3125C19.3292 15.8208 20 14.05 20 12C20 9.95 19.3292 8.17917 17.9875 6.6875C16.6458 5.19583 14.9833 4.325 13 4.075V19.925Z"
        fill="currentColor"
      />
    </svg>
  );
}

function IconeAudio() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6 22C7.03333 22 7.87917 21.7417 8.5375 21.225C9.19583 20.7083 9.7 19.95 10.05 18.95C10.3333 18.1167 10.6042 17.5333 10.8625 17.2C11.1208 16.8667 11.7167 16.3333 12.65 15.6C13.6833 14.7667 14.5 13.825 15.1 12.775C15.7 11.725 16 10.4667 16 9C16 7.01667 15.3292 5.35417 13.9875 4.0125C12.6458 2.67083 10.9833 2 9 2C7.01667 2 5.35417 2.67083 4.0125 4.0125C2.67083 5.35417 2 7.01667 2 9H4C4 7.58333 4.47917 6.39583 5.4375 5.4375C6.39583 4.47917 7.58333 4 9 4C10.4167 4 11.6042 4.47917 12.5625 5.4375C13.5208 6.39583 14 7.58333 14 9C14 10.1333 13.775 11.1 13.325 11.9C12.875 12.7 12.2333 13.4167 11.4 14.05C10.5333 14.6833 9.85833 15.3 9.375 15.9C8.89167 16.5 8.53333 17.15 8.3 17.85C8.06667 18.5833 7.7875 19.125 7.4625 19.475C7.1375 19.825 6.65 20 6 20C5.45 20 4.97917 19.8042 4.5875 19.4125C4.19583 19.0208 4 18.55 4 18H2C2 19.1 2.39167 20.0417 3.175 20.825C3.95833 21.6083 4.9 22 6 22ZM9 11.5C9.7 11.5 10.2917 11.2542 10.775 10.7625C11.2583 10.2708 11.5 9.68333 11.5 9C11.5 8.3 11.2583 7.70833 10.775 7.225C10.2917 6.74167 9.7 6.5 9 6.5C8.3 6.5 7.70833 6.74167 7.225 7.225C6.74167 7.70833 6.5 8.3 6.5 9C6.5 9.68333 6.74167 10.2708 7.225 10.7625C7.70833 11.2542 8.3 11.5 9 11.5ZM18.5 14.525L17.025 13.05C17.3417 12.4333 17.5833 11.7875 17.75 11.1125C17.9167 10.4375 18 9.73333 18 9C18 8.26667 17.9167 7.56667 17.75 6.9C17.5833 6.23333 17.3417 5.59167 17.025 4.975L18.5 3.5C18.9833 4.31667 19.3542 5.1875 19.6125 6.1125C19.8708 7.0375 20 8 20 9C20 10.0167 19.8708 10.9875 19.6125 11.9125C19.3542 12.8375 18.9833 13.7083 18.5 14.525ZM21.425 17.425L19.95 15.975C20.6 14.975 21.1042 13.8917 21.4625 12.725C21.8208 11.5583 22 10.3333 22 9.05C22 7.75 21.8167 6.5125 21.45 5.3375C21.0833 4.1625 20.575 3.075 19.925 2.075L21.425 0.575C22.2417 1.775 22.875 3.0875 23.325 4.5125C23.775 5.9375 24 7.43333 24 9C24 10.5667 23.775 12.0625 23.325 13.4875C22.875 14.9125 22.2417 16.225 21.425 17.425Z"
        fill="currentColor"
      />
    </svg>
  );
}

function IconeLupa() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M10 16C11.6667 16 13.0833 15.4167 14.25 14.25C15.4167 13.0833 16 11.6667 16 10C16 8.33333 15.4167 6.91667 14.25 5.75C13.0833 4.58333 11.6667 4 10 4C8.33333 4 6.91667 4.58333 5.75 5.75C4.58333 6.91667 4 8.33333 4 10C4 11.6667 4.58333 13.0833 5.75 14.25C6.91667 15.4167 8.33333 16 10 16ZM8.95 13.55L14.6 7.875L13.175 6.45L8.95 10.7L6.825 8.6L5.4 10L8.95 13.55ZM10 18C7.76667 18 5.875 17.225 4.325 15.675C2.775 14.125 2 12.2333 2 10C2 7.76667 2.775 5.875 4.325 4.325C5.875 2.775 7.76667 2 10 2C12.2333 2 14.125 2.775 15.675 4.325C17.225 5.875 18 7.76667 18 10C18 10.9333 17.8542 11.8125 17.5625 12.6375C17.2708 13.4625 16.8583 14.2167 16.325 14.9L22 20.6L20.6 22L14.9 16.325C14.2167 16.8583 13.4625 17.2708 12.6375 17.5625C11.8125 17.8542 10.9333 18 10 18Z"
        fill="currentColor"
      />
    </svg>
  );
}

function IconeMais() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor" />
    </svg>
  );
}

function IconeMenos() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 13H5v-2h14v2z" fill="currentColor" />
    </svg>
  );
}

type Internals = {
  baseFont: WeakMap<Element, number>; // font-size natural de cada elemento (px)
  observer: MutationObserver | null;
  pendentes: Element[]; // nós aguardando escala (batch do observer)
  rafId: number;
  ttsVoz: SpeechSynthesisVoice | null; // voz pt-BR escolhida (opcional)
  ttsAlvo: Element | null; // elemento com realce no momento
  nivelZoom: number;
};

export function AccessibilityToolbar() {
  const [contraste, setContraste] = useState(false);
  const [audioAtivo, setAudioAtivo] = useState(false);
  const [zoomAberto, setZoomAberto] = useState(false);
  const [nivelZoom, setNivelZoom] = useState(1);
  const [ttsSuportado, setTtsSuportado] = useState(false);

  const R = useRef<Internals>({
    baseFont: new WeakMap(),
    observer: null,
    pendentes: [],
    rafId: 0,
    ttsVoz: null,
    ttsAlvo: null,
    nivelZoom: 1,
  });

  // ----- Zoom: escala apenas a fonte, preservando a hierarquia visual -----
  // Só escala elementos com texto próprio (ou campos de formulário) — evita
  // mexer em contêineres puros, reduzindo nós mutados e efeitos colaterais.
  const elegivel = useCallback((el: Element) => {
    const tag = el.tagName;
    if (tag === "SCRIPT" || tag === "STYLE") return false;
    if (el.namespaceURI === "http://www.w3.org/2000/svg") return false;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || tag === "OPTION") return true;
    for (let n = el.firstChild; n; n = n.nextSibling) {
      if (n.nodeType === 3 && n.nodeValue && n.nodeValue.trim()) return true;
    }
    return false;
  }, []);

  const coletarCandidatos = useCallback(
    (raiz: Element) => {
      const lista: Element[] = [];
      const considerar = (el: Element) => {
        if (el.nodeType !== 1) return;
        if (el.closest("#barraAcessibilidade")) return;
        if (elegivel(el)) lista.push(el);
      };
      considerar(raiz);
      raiz.querySelectorAll("*").forEach(considerar);
      return lista;
    },
    [elegivel]
  );

  // Lê todos os tamanhos-base antes de escrever qualquer um — evita layout thrashing
  const escalarLista = useCallback((candidatos: Element[], nivel: number) => {
    if (!candidatos.length) return;
    const r = R.current;
    for (const el of candidatos) {
      if (!r.baseFont.has(el)) {
        const base = parseFloat(getComputedStyle(el).fontSize);
        if (base) r.baseFont.set(el, base);
      }
    }
    for (const el of candidatos) {
      const base = r.baseFont.get(el);
      if (base === undefined) continue;
      (el as HTMLElement).style.fontSize = nivel === 1 ? "" : `${(base * nivel).toFixed(2)}px`;
    }
  }, []);

  const desativarObserver = useCallback(() => {
    const r = R.current;
    if (r.observer) {
      r.observer.disconnect();
      r.observer = null;
    }
    if (r.rafId) {
      cancelAnimationFrame(r.rafId);
      r.rafId = 0;
    }
    r.pendentes = [];
  }, []);

  // Agrupa as mutações num único batch por frame (coalesce)
  const agendarFlush = useCallback(() => {
    const r = R.current;
    if (r.rafId || !r.pendentes.length) return;
    r.rafId = requestAnimationFrame(() => {
      r.rafId = 0;
      const lote = r.pendentes;
      r.pendentes = [];
      const cands: Element[] = [];
      for (const raiz of lote) {
        if (raiz.isConnected) cands.push(...coletarCandidatos(raiz));
      }
      escalarLista(cands, r.nivelZoom);
    });
  }, [coletarCandidatos, escalarLista]);

  const ativarObserver = useCallback(() => {
    const r = R.current;
    if (r.observer) return;
    r.observer = new MutationObserver((mutacoes) => {
      for (const m of mutacoes) {
        m.addedNodes.forEach((n) => {
          if (n.nodeType === 1) r.pendentes.push(n as Element);
        });
      }
      agendarFlush();
    });
    r.observer.observe(document.body, { childList: true, subtree: true });
  }, [agendarFlush]);

  const aplicarZoom = useCallback(
    (nivel: number) => {
      R.current.nivelZoom = nivel;
      escalarLista(coletarCandidatos(document.body), nivel);
      if (nivel === 1) desativarObserver();
      else ativarObserver();
    },
    [escalarLista, coletarCandidatos, desativarObserver, ativarObserver]
  );

  const definirZoom = useCallback(
    (valor: number) => {
      const nivel = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, Math.round(valor * 10) / 10));
      setNivelZoom(nivel);
      aplicarZoom(nivel);
      localStorage.setItem(ZOOM_KEY, String(nivel));
    },
    [aplicarZoom]
  );

  // ----- Alto contraste -----
  const aplicarContraste = useCallback((ativo: boolean) => {
    document.documentElement.classList.toggle(CONTRASTE_CLASSE, ativo);
    localStorage.setItem(CONTRASTE_KEY, ativo ? "1" : "0");
  }, []);

  const toggleContraste = useCallback(() => {
    const next = !contraste;
    setContraste(next);
    aplicarContraste(next);
  }, [contraste, aplicarContraste]);

  // ----- Leitura em voz alta (TTS) — modo "clique para ouvir" (estilo HandTalk) -----
  const falar = useCallback(
    (texto: string) => {
      if (!ttsSuportado || !texto) return;
      window.speechSynthesis.cancel();
      const fala = new SpeechSynthesisUtterance(texto);
      fala.lang = AUDIO_LANG;
      if (R.current.ttsVoz) fala.voice = R.current.ttsVoz;
      window.speechSynthesis.speak(fala);
    },
    [ttsSuportado]
  );

  // Escolhe uma voz pt-BR; vozes carregam de forma assíncrona em alguns navegadores
  const prepararVoz = useCallback(() => {
    const r = R.current;
    const escolher = () => {
      const vozes = window.speechSynthesis.getVoices();
      r.ttsVoz =
        vozes.find((v) => /pt[-_]?br/i.test(v.lang)) ||
        vozes.find((v) => /^pt/i.test(v.lang)) ||
        null;
    };
    escolher();
    if (!r.ttsVoz && "onvoiceschanged" in window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = escolher;
    }
  }, []);

  const limparRealce = useCallback(() => {
    const r = R.current;
    if (r.ttsAlvo) r.ttsAlvo.classList.remove(AUDIO_REALCE);
    r.ttsAlvo = null;
  }, []);

  const realcarAlvo = useCallback(
    (el: Element) => {
      const r = R.current;
      if (r.ttsAlvo === el) return;
      limparRealce();
      el.classList.add(AUDIO_REALCE);
      r.ttsAlvo = el;
    },
    [limparRealce]
  );

  // Resolve o texto a ser falado a partir do elemento clicado
  const textoDoAlvo = useCallback((el: Element): string => {
    if (!el || el.nodeType !== 1) return "";
    if (el.tagName === "IMG") {
      return (el.getAttribute("alt") || "").trim() || "Imagem sem descrição";
    }
    const aria = (el.getAttribute("aria-label") || "").trim();
    if (aria) return aria;
    let texto = ((el as HTMLElement).innerText || el.textContent || "").trim();
    el.querySelectorAll("img[alt]").forEach((img) => {
      const alt = (img.getAttribute("alt") || "").trim();
      if (alt) texto += `. ${alt}`;
    });
    return texto.trim();
  }, []);

  const tratarClique = useCallback(
    (e: Event) => {
      const alvo = e.target as Element;
      // Mantém a barra de acessibilidade clicável (trocar ferramenta / desativar)
      if (alvo.closest && alvo.closest("#barraAcessibilidade")) return;
      e.preventDefault();
      e.stopPropagation();
      const texto = textoDoAlvo(alvo);
      if (texto) {
        realcarAlvo(alvo);
        falar(texto);
      }
    },
    [textoDoAlvo, realcarAlvo, falar]
  );

  const tratarHover = useCallback(
    (e: Event) => {
      const alvo = e.target as Element;
      const tag = alvo.tagName;
      // Ignora a barra e contêineres globais (evita contorno na página toda)
      if (tag === "BODY" || tag === "HTML") return;
      if (alvo.closest && alvo.closest("#barraAcessibilidade")) return;
      realcarAlvo(alvo);
    },
    [realcarAlvo]
  );

  const onAudioToggle = useCallback(() => {
    if (!audioAtivo && !ttsSuportado) {
      window.alert("Seu navegador não suporta leitura em voz alta.");
      return;
    }
    setAudioAtivo((v) => !v);
  }, [audioAtivo, ttsSuportado]);

  // Liga/desliga o modo leitura: listeners + cursor + anúncios sonoros
  useEffect(() => {
    if (!audioAtivo) return;
    document.documentElement.classList.add(AUDIO_CLASSE);
    prepararVoz();
    document.addEventListener("click", tratarClique, true);
    document.addEventListener("mouseover", tratarHover, { capture: true, passive: true });
    falar("Modo de leitura falado ativo");
    return () => {
      window.speechSynthesis.cancel();
      document.documentElement.classList.remove(AUDIO_CLASSE);
      document.removeEventListener("click", tratarClique, true);
      document.removeEventListener("mouseover", tratarHover, true);
      limparRealce();
      falar("Modo de leitura falada desativado");
    };
  }, [audioAtivo, prepararVoz, tratarClique, tratarHover, falar, limparRealce]);

  // Restaura contraste/zoom salvos e detecta suporte a TTS (client-only).
  // Sincroniza o estado React com prefs externas (localStorage) — setState
  // aqui é intencional, roda só uma vez na montagem.
  /* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
  useEffect(() => {
    setTtsSuportado(typeof window !== "undefined" && "speechSynthesis" in window);
    const z = parseFloat(localStorage.getItem(ZOOM_KEY) || "");
    if (!isNaN(z) && z !== 1) {
      const nivel = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, z));
      setNivelZoom(nivel);
      aplicarZoom(nivel);
    }
    if (localStorage.getItem(CONTRASTE_KEY) === "1") {
      setContraste(true);
      aplicarContraste(true);
    }
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */

  // Limpa o observer ao desmontar
  useEffect(() => () => desativarObserver(), [desativarObserver]);

  const porcentagemZoom = Math.round(nivelZoom * 100);

  const ferramentas = [
    { id: "contraste", label: "Alto contraste", icone: <IconeContraste />, ativo: contraste, onClick: toggleContraste },
    { id: "audio", label: "Leitura em voz alta", icone: <IconeAudio />, ativo: audioAtivo, onClick: onAudioToggle },
    {
      id: "lupa",
      label: "Ampliar ou reduzir conteúdo",
      icone: <IconeLupa />,
      ativo: zoomAberto,
      onClick: () => setZoomAberto((v) => !v),
    },
  ];

  return (
    <aside id="barraAcessibilidade" className="acessibilidade" role="region" aria-label="Ferramentas de acessibilidade">
      {ferramentas.map((item) => (
        <button
          key={item.id}
          type="button"
          className={`acessibilidade-botao${item.ativo ? " acessibilidade-botao--ativo" : ""}`}
          aria-label={item.label}
          aria-pressed={item.ativo ? "true" : "false"}
          title={item.label}
          onClick={item.onClick}
        >
          <span className="acessibilidade-icone" aria-hidden="true">
            {item.icone}
          </span>
        </button>
      ))}

      {zoomAberto && (
        <div className="acessibilidade-zoom" role="group" aria-label="Ajustar tamanho do conteúdo">
          <button
            type="button"
            className="acessibilidade-botao"
            aria-label="Reduzir conteúdo"
            title="Reduzir conteúdo"
            disabled={nivelZoom <= ZOOM_MIN}
            onClick={() => definirZoom(nivelZoom - ZOOM_STEP)}
          >
            <span className="acessibilidade-icone" aria-hidden="true">
              <IconeMenos />
            </span>
          </button>
          <span className="acessibilidade-zoom-nivel" aria-live="polite">
            {porcentagemZoom}%
          </span>
          <button
            type="button"
            className="acessibilidade-botao"
            aria-label="Ampliar conteúdo"
            title="Ampliar conteúdo"
            disabled={nivelZoom >= ZOOM_MAX}
            onClick={() => definirZoom(nivelZoom + ZOOM_STEP)}
          >
            <span className="acessibilidade-icone" aria-hidden="true">
              <IconeMais />
            </span>
          </button>
        </div>
      )}
    </aside>
  );
}
