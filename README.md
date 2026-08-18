# Mi Hogar Atlanta · Landing de registro — Evento Norcross

Landing de captura de leads en español para el evento del **domingo 06 de septiembre** (10:00 a.m. – 6:00 p.m., 6055 Atlantic Blvd Ste A1, Norcross, GA 30071). Reemplaza el Google Form y envía cada registro a GoHighLevel.

Stack: Next.js (App Router) + Tailwind CSS. Sin librerías de UI externas.

## Correr en local

```bash
npm install
cp .env.example .env.local   # y llena las variables
npm run dev
```

## Deploy en Vercel

```bash
vercel deploy
```

Configura en Vercel las variables de entorno de `.env.example` (Settings → Environment Variables). `NEXT_PUBLIC_SITE_URL` debe ser la URL final del sitio para que la tarjeta OG se vea bien en WhatsApp/Instagram.

## Configurar GoHighLevel

El endpoint `POST /api/lead` valida el formulario en el servidor y reenvía el lead a GHL. Hay dos opciones; la activa se elige con `GHL_MODE`.

### Opción A (default) · Inbound Webhook

1. En GHL: **Automation → Workflows → Create Workflow**.
2. Agrega el trigger **Inbound Webhook** y copia la URL que genera.
3. Pégala en `GHL_WEBHOOK_URL` y deja `GHL_MODE=webhook`.
4. Envía un registro de prueba desde la landing para que GHL capture el esquema del payload, y mapea los campos en los pasos del workflow (Create/Update Contact, Add Tag, etc.).

Payload que envía la landing:

```json
{
  "first_name": "María",
  "last_name": "González",
  "full_name": "María González",
  "phone": "+14045550134",
  "email": "maria@gmail.com",
  "asistencia": "Sí, asistiré",
  "asistencia_valor": "si",
  "consentimiento": "Aceptó ser contactado/a por teléfono, SMS o email",
  "source": "Landing Evento Norcross",
  "tags": ["evento-norcross", "asiste-si"]
}
```

`asistencia_valor` es `si` | `no` | `info` y los tags correspondientes son `asiste-si` / `asiste-no` / `pedir-info`.

### Opción B · API v2 (contacts/upsert)

1. En GHL: **Settings → Private Integrations → Create new integration**, con scopes `contacts.write` (y `contacts.readonly`). Copia el token.
2. Copia el **Location ID** (Settings → Business Profile).
3. En GHL crea dos custom fields de contacto y anota sus *keys*:
   - `asistencia_evento` (texto)
   - `consentimiento_contacto` (texto)
   Si usas otros keys, actualízalos en `app/api/lead/route.ts` (función `enviarAApi`).
4. Configura `GHL_MODE=api`, `GHL_API_TOKEN` y `GHL_LOCATION_ID`.

La landing hace upsert por email/teléfono y agrega los tags `evento-norcross` + `asiste-si`/`asiste-no`/`pedir-info`.

## Reemplazar el arte del evento

La sección "Los detalles de tu invitación" muestra el post vertical (9:16) del evento. Para cambiarlo por el arte de una nueva fecha:

```bash
# Post que se ve en la landing
ffmpeg -y -i arte-nuevo.png -vf "scale=810:-2" -q:v 3 public/post-evento-sept.jpg

# Imagen OG (tarjeta de WhatsApp/Instagram), 1200x630 sobre fondo navy
ffmpeg -y -i arte-nuevo.png -vf "scale=-2:630,pad=1200:630:(ow-iw)/2:0:0x0A1B45" -frames:v 1 public/og.jpg
```

La foto de fondo del hero es `public/hero-casa-v3.jpg` (usa un nombre de archivo nuevo al cambiarla para evitar caché del navegador).

## Editar los textos

- **Título, subtítulo, datos del evento (fecha/hora/lugar) y footer**: `app/page.tsx` (constante `EVENTO` y el bloque del título; ahí están comentadas las 3 variantes de titular).
- **Textos del formulario, opciones y mensajes de error/éxito**: `app/components/LeadForm.tsx`.
- **SEO / Open Graph (title, description, og:image)**: `app/layout.tsx`. La imagen OG es `public/og.jpg`.
- **Colores y tipografías**: `app/globals.css` (tokens) y fuentes en `app/layout.tsx`.

## Antispam

El formulario incluye un campo honeypot invisible (`empresa`). Si un bot lo llena, la API responde éxito pero no reenvía nada a GHL.
