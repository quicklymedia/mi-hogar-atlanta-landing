"use client";

import Image from "next/image";
import { useRef } from "react";
import LeadForm from "./LeadForm";

export default function ModalReserva() {
  const dialogoRef = useRef<HTMLDialogElement>(null);

  function abrir() {
    dialogoRef.current?.showModal();
  }

  function cerrar() {
    dialogoRef.current?.close();
  }

  return (
    <>
      <button
        type="button"
        onClick={abrir}
        className="flex min-h-11 items-center rounded-lg bg-rojo px-5 text-sm font-bold text-white transition-colors hover:bg-rojo-oscuro focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rojo"
      >
        Reservar cupo
      </button>

      <dialog
        ref={dialogoRef}
        aria-label="Reserva tu cupo para el evento"
        onClick={(e) => {
          // Clic en el backdrop (fuera del contenido) cierra el modal
          if (e.target === dialogoRef.current) cerrar();
        }}
        className="m-auto w-[calc(100vw-2rem)] max-w-3xl rounded-3xl bg-transparent p-0 backdrop:bg-navy-950/70 backdrop:backdrop-blur-sm"
      >
        <div className="grid overflow-hidden rounded-3xl bg-white sm:grid-cols-[240px_1fr]">
          {/* Panel de Carmela */}
          <div className="relative hidden sm:block">
            <Image
              src="/carmela.jpg"
              alt="Carmela Moreno, agente de bienes raíces"
              fill
              sizes="240px"
              className="object-cover object-top"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-950/90 to-transparent p-4 pt-12">
              <p className="text-sm font-bold text-white">Carmela Moreno</p>
              <p className="text-xs text-celeste">
                Agente de bienes raíces · +9 años
              </p>
            </div>
          </div>

          {/* Formulario */}
          <div className="relative max-h-[85dvh] overflow-y-auto">
            <button
              type="button"
              onClick={cerrar}
              aria-label="Cerrar"
              className="absolute top-3 right-3 z-10 flex h-11 w-11 items-center justify-center rounded-full text-tinta/50 transition-colors hover:bg-tinta/5 hover:text-tinta focus-visible:outline-2 focus-visible:outline-azul"
            >
              <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5" aria-hidden="true">
                <path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
            {/* En móvil, Carmela aparece como mini-cabecera */}
            <div className="flex items-center gap-3 px-6 pt-5 sm:hidden">
              <Image
                src="/carmela.jpg"
                alt="Carmela Moreno, agente de bienes raíces"
                width={44}
                height={44}
                className="h-11 w-11 rounded-full object-cover object-top"
              />
              <div>
                <p className="text-sm font-bold text-tinta">Carmela Moreno</p>
                <p className="text-xs text-tinta/60">
                  Agente de bienes raíces · +9 años
                </p>
              </div>
            </div>
            <LeadForm prefijo="modal-" />
          </div>
        </div>
      </dialog>
    </>
  );
}
