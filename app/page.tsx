import Image from "next/image";
import LeadForm from "./components/LeadForm";
import ModalReserva from "./components/ModalReserva";
import TituloTypewriter from "./components/TituloTypewriter";

/*
 * TÍTULO PRINCIPAL — variantes generadas con /design:ux-copy
 * Base del brief: "Conoce el proceso para comprar tu casa de forma clara y transparente".
 *
 * V1 · "Compra tu casa con claridad: conoce el proceso paso a paso y sin sorpresas"
 *      (beneficio + método; conserva el lenguaje del flyer)
 * V2 · "Deja de pagar renta: aprende cómo comprar tu casa con un proceso claro y transparente"
 *      (acción + dolor concreto; retoma el hook del video del ad "¿Sigues pagando renta?")
 * V3 · "Tu casa propia está más cerca de lo que crees: descubre cómo comprarla sin enredos"
 *      (cercanía emocional + beneficio)
 *
 * ELEGIDA: V2. Quien llega desde Instagram viene de un anuncio cuyo gancho es la renta;
 * repetir ese hilo ("deja de pagar renta") mantiene la continuidad creativa del funnel,
 * abre con un verbo de acción y convierte el título genérico en un beneficio personal
 * medible. "Proceso claro y transparente" se conserva porque es la promesa del evento.
 */

const EVENTO = {
  fecha: "Domingo 06 de septiembre",
  hora: "10:00 a.m. – 6:00 p.m.",
  lugar: "6055 Atlantic Blvd Ste A1, Norcross, GA 30071",
  mapsUrl:
    "https://maps.google.com/?q=6055+Atlantic+Blvd+Ste+A1,+Norcross,+GA+30071",
};

const PILARES = [
  {
    titulo: "Proceso claro",
    texto:
      "Del pre-aprobado al cierre: cada etapa explicada paso a paso, sin letra pequeña ni términos confusos.",
    icono: (
      <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden="true">
        <path d="M7 3.5h7.5L19 8v12a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 20V5a1.5 1.5 0 0 1 1.5-1.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M14 3.5V8h4.5M8.5 12.5l2 2 4-4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    titulo: "Crédito y enganche",
    texto:
      "Cuánto necesitas de verdad, qué programas de ayuda existen y cómo prepararte aunque tu crédito no sea perfecto.",
    icono: (
      <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden="true">
        <rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.6" />
        <path d="M3 11h18M7 16h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M8 7V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V7" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    ),
  },
  {
    titulo: "Todo en español",
    texto:
      "Preguntas y respuestas en tu idioma, con una agente que conoce a la comunidad hispana de Georgia.",
    icono: (
      <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden="true">
        <path d="M12 21s-7.5-6-7.5-11A7.5 7.5 0 0 1 12 2.5 7.5 7.5 0 0 1 19.5 10c0 5-7.5 11-7.5 11Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M8.5 10h7M12 6.8v6.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
];

function IconoCalendario() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4 shrink-0" aria-hidden="true">
      <rect x="2.5" y="4" width="15" height="13.5" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2.5 8h15M6.5 2.5V5M13.5 2.5V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconoReloj() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4 shrink-0" aria-hidden="true">
      <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 6v4.2l2.8 1.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconoPin() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4 shrink-0" aria-hidden="true">
      <path d="M10 18s6-5.1 6-9.5a6 6 0 1 0-12 0C4 12.9 10 18 10 18Z" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="10" cy="8.5" r="2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function IconoCheck() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="mt-0.5 h-5 w-5 shrink-0 text-azul" aria-hidden="true">
      <circle cx="10" cy="10" r="8.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="m6.5 10.5 2.3 2.3 4.7-5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Logo({ compacto = false }: { compacto?: boolean }) {
  return (
    <Image
      src="/logo-mihogar.png"
      alt="Mi Hogar en Atlanta"
      width={230}
      height={150}
      priority
      className={compacto ? "h-11 w-auto" : "h-14 w-auto"}
    />
  );
}

const BTN_PRIMARIO =
  "flex min-h-13 items-center justify-center rounded-xl bg-rojo px-7 text-base font-bold text-white shadow-[0_10px_30px_-10px_rgba(225,29,72,0.8)] transition-colors hover:bg-rojo-oscuro focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rojo";

export default function Home() {
  return (
    <main className="min-h-dvh">
      {/* ── Header / Nav: solo marca + CTA ────────────────── */}
      <header className="fixed inset-x-0 top-3 z-50 px-3 sm:top-4 sm:px-5">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 rounded-2xl bg-navy-950/85 px-4 shadow-[0_12px_40px_-15px_rgba(6,15,43,0.8)] ring-1 ring-white/15 backdrop-blur-md sm:px-6">
          <a href="#" aria-label="Mi Hogar en Atlanta — inicio" className="shrink-0">
            <Logo compacto />
          </a>
          <ModalReserva />
        </div>
      </header>

      {/* ── Hero ──────────────────────────────────────────── */}
      <section id="evento" className="relative">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[url('/hero-casa-v3.jpg')] bg-cover bg-[position:70%_center]"
        />

        {/* Cortinilla móvil: oscura para legibilidad sobre el cielo claro */}
        <div
          aria-hidden="true"
          className="absolute inset-0 lg:hidden"
          style={{
            background:
              "linear-gradient(180deg, rgba(6,15,43,0.72) 0%, rgba(6,15,43,0.5) 55%, rgba(6,15,43,0.25) 100%)",
          }}
        />
        {/* Cortinilla desktop: velo claro #c2d2cf */}
        <div
          aria-hidden="true"
          className="absolute inset-0 hidden lg:block"
          style={{
            background:
              "linear-gradient(90deg, rgba(194,210,207,0.45) 0%, rgba(194,210,207,0.28) 45%, rgba(194,210,207,0.12) 100%)",
          }}
        />
        <div className="relative mx-auto grid w-full max-w-6xl gap-10 px-5 pt-28 pb-32 sm:pt-32 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:items-center lg:gap-14 lg:pt-32 lg:pb-36">
          <div>
            <p className="rise relative inline-flex items-center rounded-lg bg-black/45 px-4 py-2.5 text-xs font-bold uppercase tracking-[0.3em] text-dorado backdrop-blur-sm">
              <span className="led-ring" aria-hidden="true" />
              Evento gratuito · Con Carmela Moreno · +9 años en real estate
            </p>
            <TituloTypewriter />
            <p className="rise-2 mt-5 max-w-md text-base leading-relaxed text-white/95">
              Un solo día en Norcross para salir con tu plan de compra: crédito,
              enganche y pasos concretos, todo explicado en español.
            </p>

            <div className="rise-3 mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 rounded-2xl bg-navy-900/70 px-5 py-4 ring-1 ring-white/10 backdrop-blur-sm sm:inline-flex">
              <span className="flex items-center gap-2 text-sm font-medium text-celeste">
                <IconoCalendario />
                {EVENTO.fecha}
              </span>
              <span className="flex items-center gap-2 text-sm font-medium text-celeste">
                <IconoReloj />
                {EVENTO.hora}
              </span>
              <a
                href={EVENTO.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-11 items-center gap-2 text-sm font-medium text-white underline decoration-azul-claro/70 underline-offset-4 hover:text-azul-claro focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azul"
              >
                <IconoPin />
                Norcross, GA · Ver mapa
              </a>
            </div>
          </div>

          {/* Formulario sobre el hero para diligencia inmediata */}
          <div id="registro" className="rise-2 scroll-mt-28">
            <LeadForm />
          </div>
        </div>
      </section>

      {/* ── Sobre Carmela (las cards montan sobre el hero) ── */}
      <section id="carmela" className="bg-crema pb-16 text-tinta lg:pb-24">
        {/* Cards a caballo entre el hero (navy) y esta sección (clara) */}
        <div className="mx-auto grid w-full max-w-6xl -translate-y-16 gap-4 px-5 sm:grid-cols-3 lg:-translate-y-20 lg:gap-6">
          {PILARES.map((pilar) => (
            <article
              key={pilar.titulo}
              className="flex flex-col items-center rounded-2xl bg-white p-6 text-center shadow-[0_18px_50px_-25px_rgba(6,15,43,0.55)] ring-1 ring-tinta/5"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-azul/10 text-azul">
                {pilar.icono}
              </span>
              <h2 className="font-display mt-4 text-lg">{pilar.titulo}</h2>
              <p className="mt-2 text-sm leading-relaxed text-tinta/70">{pilar.texto}</p>
            </article>
          ))}
        </div>

        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-5 pt-2 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-azul">
              Tu anfitriona
            </p>
            <h2 className="font-display mt-3 text-3xl leading-tight sm:text-4xl">
              Carmela Moreno,
              <br />
              agente de bienes raíces
            </h2>
            <p className="mt-4 max-w-lg leading-relaxed text-tinta/75">
              Carmela acompaña a familias hispanas en Georgia a pasar de la renta
              a su casa propia. En este evento te explica el proceso completo de
              compra —sin tecnicismos ni sorpresas— y responde tus preguntas en
              persona.
            </p>
            <ul className="mt-6 flex flex-col gap-3">
              <li className="flex items-start gap-3">
                <IconoCheck />
                <span className="text-sm leading-relaxed">
                  <strong>Acompañamiento de confianza:</strong> te guía desde el
                  pre-aprobado hasta las llaves.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <IconoCheck />
                <span className="text-sm leading-relaxed">
                  <strong>Comunidad hispana:</strong> atención 100 % en español,
                  pensada para tu situación real.
                </span>
              </li>
            </ul>
            <a href="#registro" className={`${BTN_PRIMARIO} mt-8 inline-flex`}>
              Quiero mi lugar en el evento
            </a>
          </div>
          <div className="relative mx-auto w-full max-w-sm">
            <div
              aria-hidden="true"
              className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-azul/25 to-dorado/30"
            />
            <Image
              src="/carmela.jpg"
              alt="Carmela Moreno, agente de bienes raíces de Mi Hogar Atlanta"
              width={900}
              height={1634}
              className="relative aspect-[4/5] w-full rounded-3xl object-cover object-top shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* ── Invitación al evento ──────────────────────────── */}
      <section id="video" className="relative py-16 lg:py-24">
        <div className="mx-auto w-full max-w-6xl px-5">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-dorado">
              Cupos limitados
            </p>
            <h2 className="font-display mt-3 text-3xl sm:text-4xl">
              Los detalles de tu invitación
            </h2>
            <div className="spark mx-auto mt-6 max-w-xs" aria-hidden="true" />
          </div>

          <div className="mt-10 flex flex-col items-center gap-8">
            <Image
              src="/post-evento-sept.jpg"
              alt="Invitación: conoce el proceso para comprar tu casa. Domingo 06 de septiembre, 10:00 a.m. a 6:00 p.m., 6055 Atlantic Blvd Ste A1, Norcross, GA 30071."
              width={810}
              height={1440}
              className="w-full max-w-[320px] rounded-2xl shadow-[0_20px_60px_-20px_rgba(47,125,255,0.45)] ring-1 ring-white/10 sm:max-w-sm"
            />
            <a href="#registro" className={BTN_PRIMARIO}>
              Reservar mi cupo gratis
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────── */}
      <footer className="border-t border-white/10 bg-navy-900/60 py-10">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-5 px-5 text-center sm:flex-row sm:justify-between sm:text-left">
          <Logo compacto />
          <div className="text-xs leading-relaxed text-celeste/70">
            <p>{EVENTO.lugar}</p>
            <p className="mt-1">
              <a
                href="https://www.instagram.com/mihogarenatlanta"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-azul-claro"
              >
                @mihogarenatlanta
              </a>{" "}
              · Mi Hogar Atlanta
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
