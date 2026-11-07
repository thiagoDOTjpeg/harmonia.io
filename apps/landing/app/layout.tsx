import { Toaster } from "@harmonia/ui";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import type React from "react";
import { SuppressConsoleWarnings } from "@/components/suppress-console-warnings";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif-editorial",
});

export const metadata: Metadata = {
  title: "harmonia ",
  description:
    "Sincronize playlists do YouTube para o Spotify com score de confiança, curadoria visual e processamento assíncrono open-source.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "harmonia",
    description:
      "Sincronize playlists do YouTube para o Spotify com score de confiança, curadoria visual e processamento assíncrono open-source.",
    url: "https://harmonia.io",
    siteName: "Harmonia",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Harmonia: cinco barras de equalizador e curadoria inteligente",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Harmonia",
    description:
      "Sincronize playlists do YouTube para o Spotify com score de confiança, curadoria visual e processamento assíncrono open-source.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`dark ${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased bg-background text-foreground">
        <SuppressConsoleWarnings />
        {children}
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}

