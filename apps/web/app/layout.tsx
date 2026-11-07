import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type React from "react";
import "./globals.css";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Harmonia.io - Sincronize YouTube para Spotify",
  description:
    "Sincronize suas playlists do YouTube para o Spotify em segundos",
  icons: {
    icon: "/favicon-16x16.png",
  },
};

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryClientProvider client={queryClient}>
      <html lang="pt-BR" className="dark" suppressHydrationWarning>
        <body className={`font-sans antialiased`}>
          <AuthProvider>{children}</AuthProvider>
          <Toaster />
          <Analytics />
        </body>
      </html>
    </QueryClientProvider>
  );
}
