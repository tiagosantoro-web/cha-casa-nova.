import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import { evento } from "@/data/evento";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const description =
  "Convite e lista de presentes do chá de casa nova de Tiago & Amanda. Escolha um presente e confirme sua presença.";

export const metadata: Metadata = {
  metadataBase: new URL(evento.siteUrl || "http://localhost:3000"),
  title: "Chá de casa nova | Tiago & Amanda",
  description,
  openGraph: {
    title: "Chá de casa nova — Tiago & Amanda",
    description: "Nosso novo lar, uma nova história! Escolha um presente e venha celebrar com a gente.",
    type: "website",
    locale: "pt_BR",
    siteName: "Tiago & Amanda",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#f6f4f0",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${fraunces.variable} ${manrope.variable} antialiased`}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
