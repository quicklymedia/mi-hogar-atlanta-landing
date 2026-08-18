"use client";

import { useEffect, useState } from "react";

const SEGMENTOS = [
  { texto: "Deja de pagar renta: ", clase: "" },
  { texto: "aprende cómo comprar tu casa", clase: "text-azul-claro" },
  { texto: " con un proceso claro y transparente", clase: "" },
] as const;

const TOTAL = SEGMENTOS.reduce((suma, s) => suma + s.texto.length, 0);
const RETRASO_MS = 400;
const DURACION_MS = 1600; // < 2 s incluyendo el retraso

export default function TituloTypewriter() {
  // Arranca completo (SSR/SEO); al montar se reinicia y se "escribe"
  const [visibles, setVisibles] = useState(TOTAL);
  const [animando, setAnimando] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    setVisibles(0);
    setAnimando(true);
    let intervalo: ReturnType<typeof setInterval>;
    const retraso = setTimeout(() => {
      const inicio = performance.now();
      intervalo = setInterval(() => {
        const avance = (performance.now() - inicio) / DURACION_MS;
        if (avance >= 1) {
          setVisibles(TOTAL);
          setAnimando(false);
          clearInterval(intervalo);
        } else {
          setVisibles(Math.round(TOTAL * avance));
        }
      }, 16);
    }, RETRASO_MS);

    return () => {
      clearTimeout(retraso);
      clearInterval(intervalo);
    };
  }, []);

  let restantes = visibles;

  return (
    <h1
      aria-label="Deja de pagar renta: aprende cómo comprar tu casa con un proceso claro y transparente"
      className="font-grotesk mt-6 max-w-xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl"
    >
      <span aria-hidden="true">
        {SEGMENTOS.map((segmento) => {
          const corte = Math.max(0, Math.min(segmento.texto.length, restantes));
          restantes -= corte;
          return (
            <span key={segmento.texto} className={segmento.clase}>
              {segmento.texto.slice(0, corte)}
            </span>
          );
        })}
        {animando && (
          <span className="ml-1 inline-block h-[0.9em] w-[3px] translate-y-[0.12em] animate-pulse bg-white" />
        )}
      </span>
    </h1>
  );
}
