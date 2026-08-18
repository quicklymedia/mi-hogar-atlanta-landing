import { NextResponse } from "next/server";

export const runtime = "nodejs";

type Lead = {
  nombre: string;
  telefono: string;
  email: string;
  asistencia: "si" | "no" | "info";
  consentimiento: boolean;
  empresa?: string; // honeypot
};

const ETIQUETAS_ASISTENCIA: Record<Lead["asistencia"], string> = {
  si: "Sí, asistiré",
  no: "No podré asistir",
  info: "Quiero recibir información sobre cómo comprar casa, contáctenme",
};

const TAGS_ASISTENCIA: Record<Lead["asistencia"], string> = {
  si: "asiste-si",
  no: "asiste-no",
  info: "pedir-info",
};

function validar(body: unknown): { lead?: Lead; error?: string } {
  if (typeof body !== "object" || body === null)
    return { error: "Solicitud inválida." };
  const b = body as Record<string, unknown>;

  const nombre = typeof b.nombre === "string" ? b.nombre.trim() : "";
  const telefono = typeof b.telefono === "string" ? b.telefono.trim() : "";
  const email = typeof b.email === "string" ? b.email.trim() : "";
  const asistencia = b.asistencia;
  const consentimiento = b.consentimiento === true;
  const empresa = typeof b.empresa === "string" ? b.empresa : "";

  if (nombre.length < 3 || nombre.length > 120)
    return { error: "Escribe tu nombre y apellido." };

  const digitos = telefono.replace(/\D/g, "").replace(/^1/, "");
  if (!/^[2-9]\d{9}$/.test(digitos))
    return { error: "Escribe un teléfono válido de EE. UU. (10 dígitos)." };

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 254)
    return { error: "Escribe un correo electrónico válido." };

  if (asistencia !== "si" && asistencia !== "no" && asistencia !== "info")
    return { error: "Elige una opción de asistencia." };

  if (!consentimiento)
    return { error: "Necesitamos tu autorización para poder contactarte." };

  return {
    lead: {
      nombre,
      telefono: `+1${digitos}`,
      email: email.toLowerCase(),
      asistencia,
      consentimiento,
      empresa,
    },
  };
}

/** Opción A (default): reenviar al Inbound Webhook de un workflow de GHL. */
async function enviarAWebhook(lead: Lead) {
  const url = process.env.GHL_WEBHOOK_URL;
  if (!url) throw new Error("GHL_WEBHOOK_URL no está configurada.");

  const [firstName, ...resto] = lead.nombre.split(/\s+/);
  const respuesta = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      first_name: firstName,
      last_name: resto.join(" "),
      full_name: lead.nombre,
      phone: lead.telefono,
      email: lead.email,
      asistencia: ETIQUETAS_ASISTENCIA[lead.asistencia],
      asistencia_valor: lead.asistencia,
      consentimiento: "Aceptó ser contactado/a por teléfono, SMS o email",
      source: "Landing Evento Norcross",
      tags: ["evento-norcross", TAGS_ASISTENCIA[lead.asistencia]],
    }),
  });
  if (!respuesta.ok)
    throw new Error(`GHL webhook respondió ${respuesta.status}`);
}

/** Opción B: upsert de contacto vía GHL API v2 con Private Integration token. */
async function enviarAApi(lead: Lead) {
  const token = process.env.GHL_API_TOKEN;
  const locationId = process.env.GHL_LOCATION_ID;
  if (!token || !locationId)
    throw new Error("GHL_API_TOKEN o GHL_LOCATION_ID no están configuradas.");

  const [firstName, ...resto] = lead.nombre.split(/\s+/);
  const respuesta = await fetch(
    "https://services.leadconnectorhq.com/contacts/upsert",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Version: "2021-07-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        locationId,
        firstName,
        lastName: resto.join(" "),
        email: lead.email,
        phone: lead.telefono,
        source: "Landing Evento Norcross",
        tags: ["evento-norcross", TAGS_ASISTENCIA[lead.asistencia]],
        customFields: [
          // Reemplaza los keys por los de tus custom fields en GHL (ver README)
          { key: "asistencia_evento", field_value: ETIQUETAS_ASISTENCIA[lead.asistencia] },
          { key: "consentimiento_contacto", field_value: "Sí" },
        ],
      }),
    }
  );
  if (!respuesta.ok) {
    const cuerpo = await respuesta.text();
    throw new Error(`GHL API respondió ${respuesta.status}: ${cuerpo.slice(0, 300)}`);
  }
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  const { lead, error } = validar(body);
  if (error || !lead)
    return NextResponse.json({ error }, { status: 400 });

  // Honeypot: a los bots les respondemos éxito sin reenviar nada.
  if (lead.empresa && lead.empresa.length > 0)
    return NextResponse.json({ ok: true });

  try {
    if (process.env.GHL_MODE === "api") {
      await enviarAApi(lead);
    } else {
      await enviarAWebhook(lead);
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[/api/lead]", err);
    return NextResponse.json(
      {
        error:
          "No pudimos guardar tu registro en este momento. Inténtalo de nuevo en unos minutos.",
      },
      { status: 502 }
    );
  }
}
