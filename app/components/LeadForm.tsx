"use client";

import { useState, type FormEvent } from "react";

type Estado = "idle" | "enviando" | "exito" | "error";

const TEL_US = /^\(?([2-9]\d{2})\)?[\s.-]?(\d{3})[\s.-]?(\d{4})$/;

export default function LeadForm({ prefijo = "" }: { prefijo?: string }) {
  const [estado, setEstado] = useState<Estado>("idle");
  const [mensajeError, setMensajeError] = useState("");
  const [errores, setErrores] = useState<Record<string, string>>({});

  function validar(datos: FormData) {
    const e: Record<string, string> = {};
    const nombre = String(datos.get("nombre") ?? "").trim();
    const telefono = String(datos.get("telefono") ?? "").trim();
    const email = String(datos.get("email") ?? "").trim();

    if (nombre.length < 3 || !nombre.includes(" "))
      e.nombre = "Escribe tu nombre y apellido.";
    const digitos = telefono.replace(/\D/g, "").replace(/^1/, "");
    if (!TEL_US.test(digitos.replace(/^(\d{3})(\d{3})(\d{4})$/, "$1-$2-$3")))
      e.telefono = "Escribe un teléfono válido de EE. UU. (10 dígitos).";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))
      e.email = "Escribe un correo válido, por ejemplo nombre@gmail.com.";
    if (!datos.get("consentimiento"))
      e.consentimiento = "Necesitamos tu autorización para poder contactarte.";
    return e;
  }

  async function manejarEnvio(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const formulario = evento.currentTarget;
    const datos = new FormData(formulario);

    const e = validar(datos);
    setErrores(e);
    if (Object.keys(e).length > 0) {
      const primero = formulario.querySelector<HTMLElement>(
        `[name="${Object.keys(e)[0]}"]`
      );
      primero?.focus();
      return;
    }

    setEstado("enviando");
    setMensajeError("");
    try {
      const respuesta = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: String(datos.get("nombre")).trim(),
          telefono: String(datos.get("telefono")).trim(),
          email: String(datos.get("email")).trim(),
          asistencia: "si",
          consentimiento: true,
          empresa: String(datos.get("empresa") ?? ""), // honeypot
        }),
      });
      if (!respuesta.ok) {
        const cuerpo = await respuesta.json().catch(() => null);
        throw new Error(cuerpo?.error ?? "No pudimos guardar tu registro.");
      }
      setEstado("exito");
    } catch (err) {
      setEstado("error");
      setMensajeError(
        err instanceof Error && err.message !== "Failed to fetch"
          ? err.message
          : "No pudimos guardar tu registro. Revisa tu conexión e inténtalo de nuevo."
      );
    }
  }

  if (estado === "exito") {
    return (
      <div
        role="status"
        className="rounded-3xl bg-white p-8 text-center text-tinta shadow-xl"
      >
        <svg viewBox="0 0 48 48" className="mx-auto h-14 w-14" aria-hidden="true">
          <circle cx="24" cy="24" r="22" fill="#e9f8ef" />
          <path
            d="M15 24.5 21 30.5 33 18.5"
            stroke="#1a9e55"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
        <h2 className="font-display mt-4 text-2xl">¡Listo, quedaste registrado!</h2>
        <p className="mt-2 text-sm leading-relaxed text-tinta/70">
          Te enviaremos la confirmación y los detalles del evento por correo y
          SMS. Nos vemos el domingo 06 de septiembre en Norcross.
        </p>
      </div>
    );
  }

  const claseCampo =
    "mt-1.5 w-full rounded-xl border border-tinta/15 bg-crema px-4 py-3 text-base text-tinta placeholder:text-tinta/40 focus:border-azul focus:outline-2 focus:outline-azul/40";
  const claseError = "mt-1.5 text-sm font-medium text-red-600";

  return (
    <form
      onSubmit={manejarEnvio}
      noValidate
      className="relative rounded-3xl bg-white p-6 text-tinta shadow-xl sm:p-7"
    >
      <h2 className="font-display text-xl">Reserva tu cupo gratis</h2>
      <p className="mt-1 text-sm text-tinta/60">
        Toma menos de un minuto. Los cupos son limitados.
      </p>

      {/* Honeypot: invisible para personas, los bots lo llenan */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 overflow-hidden">
        <label htmlFor={`${prefijo}empresa`}>Empresa</label>
        <input id={`${prefijo}empresa`} name="empresa" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="mt-5 flex flex-col gap-4">
        <div>
          <label htmlFor={`${prefijo}nombre`} className="text-sm font-semibold">
            Nombre y apellido <span className="text-red-600">*</span>
          </label>
          <input
            id={`${prefijo}nombre`}
            name="nombre"
            type="text"
            required
            autoComplete="name"
            placeholder="María González"
            aria-invalid={!!errores.nombre}
            aria-describedby={errores.nombre ? `${prefijo}error-nombre` : undefined}
            className={claseCampo}
          />
          {errores.nombre && (
            <p id={`${prefijo}error-nombre`} role="alert" className={claseError}>
              {errores.nombre}
            </p>
          )}
        </div>

        <div>
          <label htmlFor={`${prefijo}telefono`} className="text-sm font-semibold">
            Número de teléfono <span className="text-red-600">*</span>
          </label>
          <input
            id={`${prefijo}telefono`}
            name="telefono"
            type="tel"
            required
            autoComplete="tel-national"
            inputMode="tel"
            placeholder="(404) 555-0134"
            aria-invalid={!!errores.telefono}
            aria-describedby={errores.telefono ? `${prefijo}error-telefono` : undefined}
            className={claseCampo}
          />
          {errores.telefono && (
            <p id={`${prefijo}error-telefono`} role="alert" className={claseError}>
              {errores.telefono}
            </p>
          )}
        </div>

        <div>
          <label htmlFor={`${prefijo}email`} className="text-sm font-semibold">
            Correo electrónico <span className="text-red-600">*</span>
          </label>
          <input
            id={`${prefijo}email`}
            name="email"
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            placeholder="maria@gmail.com"
            aria-invalid={!!errores.email}
            aria-describedby={errores.email ? `${prefijo}error-email` : undefined}
            className={claseCampo}
          />
          {errores.email && (
            <p id={`${prefijo}error-email`} role="alert" className={claseError}>
              {errores.email}
            </p>
          )}
        </div>

        <div>
          <label className="flex cursor-pointer items-start gap-3 text-sm leading-snug">
            <input
              type="checkbox"
              name="consentimiento"
              required
              className="mt-0.5 h-4 w-4 shrink-0 accent-azul"
            />
            Acepto ser contactado/a por Mi Hogar Atlanta por teléfono, SMS o
            email. <span className="text-red-600">*</span>
          </label>
          {errores.consentimiento && (
            <p role="alert" className={claseError}>
              {errores.consentimiento}
            </p>
          )}
        </div>

        {estado === "error" && (
          <p
            role="alert"
            className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
          >
            {mensajeError}
          </p>
        )}

        <button
          type="submit"
          disabled={estado === "enviando"}
          className="mt-1 flex min-h-13 w-full items-center justify-center gap-2 rounded-xl bg-rojo px-6 text-base font-bold text-white transition-colors hover:bg-rojo-oscuro focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rojo disabled:cursor-not-allowed disabled:opacity-60"
        >
          {estado === "enviando" ? (
            <>
              <svg
                className="h-5 w-5 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
              Enviando registro…
            </>
          ) : (
            "Reservar mi cupo gratis"
          )}
        </button>

        <p className="text-center text-xs text-tinta/50">
          Tus datos solo se usan para confirmar tu asistencia. Nada de spam.
        </p>
      </div>
    </form>
  );
}
