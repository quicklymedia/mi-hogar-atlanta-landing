import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  title: "Evento gratis en Norcross · Mi Hogar Atlanta",
  description:
    "Deja de pagar renta: aprende cómo comprar tu casa con un proceso claro y transparente. Domingo 06 de septiembre, 10:00 a.m. – 6:00 p.m., Norcross GA. Regístrate gratis.",
  openGraph: {
    title: "Conoce el proceso para comprar tu casa · Mi Hogar Atlanta",
    description:
      "Evento gratuito en español con Carmela Moreno, agente de bienes raíces. 06 de septiembre · Norcross, GA. Cupos limitados.",
    images: [{ url: "/og.jpg", width: 1200, height: 630 }],
    locale: "es_US",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#060f2b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
