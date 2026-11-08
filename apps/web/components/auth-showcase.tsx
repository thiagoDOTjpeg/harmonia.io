"use client";

import { HarmoniaLogo } from "@harmonia/ui";
import { Github } from "lucide-react";
import Link from "next/link";

export function AuthShowcase() {
  return (
    <div className="relative hidden lg:flex flex-col justify-between p-12 xl:p-16 bg-[#060907] border-r border-border/70 overflow-hidden select-none">
      {/* Subtle background ambient gradient */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-harmonia-lime/[0.03] rounded-full blur-3xl pointer-events-none" />

      {/* Top: Logo & Subtitle */}
      <div className="relative z-10 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-90 transition-opacity"
          aria-label="Harmonia Início"
        >
          <HarmoniaLogo className="h-6 w-auto text-harmonia-lime" />
        </Link>
        <span className="text-xs text-zinc-400 font-mono">
          Sincronizador de Playlists
        </span>
      </div>

      {/* Center: Pure text about the system */}
      <div className="relative z-10 my-auto max-w-lg space-y-8 py-8">
        <div className="space-y-3">
          <h2 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-white leading-tight font-display">
            Sua música sincronizada,{" "}
            <span className="text-harmonia-lime">sem esforço manual.</span>
          </h2>
          <p className="text-sm xl:text-base text-zinc-400 leading-relaxed font-sans">
            O Harmonia monitora suas playlists entre o YouTube e o Spotify,
            garantindo que sua biblioteca esteja sempre atualizada e com a melhor
            versão de cada faixa.
          </p>
        </div>

        {/* Core System Features */}
        <div className="space-y-5 pt-2">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-harmonia-lime shrink-0" />
              Sincronização contínua
            </h3>
            <p className="text-xs xl:text-sm text-zinc-400 leading-relaxed pl-3.5">
              Adicione músicas no YouTube e veja-as refletidas no Spotify em
              minutos, sem precisar refazer sua biblioteca manualmente.
            </p>
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-harmonia-lime shrink-0" />
              Identificação inteligente de faixas
            </h3>
            <p className="text-xs xl:text-sm text-zinc-400 leading-relaxed pl-3.5">
              O sistema ignora ruídos de videoclipe, intros longas e versões ao
              vivo indesejadas para salvar a versão de estúdio oficial no
              Spotify.
            </p>
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-harmonia-lime shrink-0" />
              Conexão segura e transparente
            </h3>
            <p className="text-xs xl:text-sm text-zinc-400 leading-relaxed pl-3.5">
              Autenticação direta através das APIs oficiais do Google e Spotify.
              Código 100% aberto e sob seu controle.
            </p>
          </div>
        </div>

        {/* Minimal Quote */}
        <div className="pt-6 border-t border-white/[0.06]">
          <p className="text-xs xl:text-sm text-zinc-400 italic leading-relaxed">
            “Feito para quem descobre música no YouTube, mas ouve no Spotify no dia a dia.”
          </p>
        </div>
      </div>

      {/* Bottom: Minimal Footer */}
      <div className="relative z-10 flex items-center justify-between text-xs text-zinc-400 font-mono pt-4 border-t border-border/40">
        <span>Harmonia • Open Source</span>
        <Link
          href="https://github.com/thiagoDOTjpeg/harmonia"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-zinc-300 transition-colors flex items-center gap-1.5"
        >
          <Github className="h-3.5 w-3.5" />
          <span>GitHub</span>
        </Link>
      </div>
    </div>
  );
}
