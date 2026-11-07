import { BackgroundDistortion, Button, HarmoniaLogo } from "@harmonia/ui";
import { BookOpen, Home } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "404 — Fora de sintonia | Harmonia",
  description: "A página que você procurou não foi encontrada.",
};

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center px-4 py-16 text-center overflow-hidden">
      <BackgroundDistortion zIndex={0} />

      <div className="relative z-10 mx-auto flex max-w-lg flex-col items-center">
        <Link
          href="/"
          className="mb-8 inline-block hover:opacity-90 transition-opacity"
          aria-label="Harmonia Início"
        >
          <HarmoniaLogo className="h-8 w-auto text-harmonia-lime" />
        </Link>

        <div className="relative mb-6">
          <span className="font-mono text-8xl font-black tracking-tighter text-white/[0.07] sm:text-9xl select-none">
            404
          </span>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-harmonia-lime/30 bg-harmonia-lime/10 px-3.5 py-1 text-xs font-medium text-harmonia-lime">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-harmonia-lime opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-harmonia-lime" />
              </span>
              Faixa não encontrada
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Essa frequência ficou{" "}
          <span className="font-serif italic text-harmonia-lime">fora do ar</span>
        </h1>

        <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-md">
          A página que você procurava não existe, foi movida ou a URL foi digitada incorretamente.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <Button
            asChild
            className="w-full sm:w-auto h-10 rounded-full px-6 font-semibold bg-harmonia-lime text-harmonia-green hover:bg-harmonia-lime/90 shadow-[0_0_20px_rgba(217,242,122,0.25)] transition-all"
          >
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Voltar ao Início
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="w-full sm:w-auto h-10 rounded-full px-6 border-white/10 hover:bg-white/5"
          >
            <Link href="/docs">
              <BookOpen className="mr-2 h-4 w-4" />
              Documentação
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}

