import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import { PLATAFORMA } from "@/lib/config";
import "./globals.css";

// Tipografia do Manual de Branding:
// Cormorant Garamond para títulos e display; Montserrat para corpo e legendas.
const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: PLATAFORMA.nome,
  description: PLATAFORMA.fraseAncora,
};

export const viewport: Viewport = {
  themeColor: "#020C50", // Azul Noite
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-PT" className={`${serif.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
