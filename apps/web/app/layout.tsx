import { BackgroundDistortion, Toaster } from "@harmonia/ui";
import { AuthProvider } from "@/context/AuthContext";
import { QueryProvider } from "@/context/QueryProvider";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type React from "react";
import "./globals.css";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Harmonia — Sincronize YouTube para Spotify",
  description:
    "Sincronize suas playlists do YouTube para o Spotify em segundos com score de curadoria e processamento em background",
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
    title: "Harmonia — Sincronize YouTube para Spotify",
    description:
      "Sincronize suas playlists do YouTube para o Spotify em segundos com score de curadoria",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <BackgroundDistortion />
        <QueryProvider>
          <AuthProvider>{children}</AuthProvider>
          <Toaster />
          <Analytics />
        </QueryProvider>
      </body>
    </html>
  );
}
