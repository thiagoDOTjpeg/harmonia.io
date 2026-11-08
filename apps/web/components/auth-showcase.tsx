"use client";

import { HarmoniaLogo } from "@harmonia/ui";
import { ArrowDown, CheckCircle2, Github } from "lucide-react";
import Link from "next/link";

export function AuthShowcase() {
  return (
    <div className="relative hidden lg:flex flex-col justify-between p-12 xl:p-16 bg-[#060907] border-r border-border/70 overflow-hidden select-none">
      {/* Subtle ambient lighting */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-harmonia-lime/[0.04] rounded-full blur-3xl pointer-events-none" />

      {/* Top: Logo & Platform Label */}
      <div className="relative z-10 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-90 transition-opacity"
          aria-label="Harmonia Início"
        >
          <HarmoniaLogo className="h-6 w-auto text-harmonia-lime" />
        </Link>
      </div>

      {/* Center: Headline + 1 Sentence + Live Product Preview (Mostrar > Explicar) */}
      <div className="relative z-10 my-auto max-w-lg space-y-6 py-6">
        <div className="space-y-3">
          <h2 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-white leading-tight font-display">
            Sua música sincronizada,{" "}
            <span className="text-harmonia-lime">sem esforço manual.</span>
          </h2>
          <p className="text-sm xl:text-base text-zinc-300 leading-relaxed font-sans">
            O Harmonia monitora suas listas em tempo real e espelha automaticamente
            faixas entre o YouTube e o Spotify, localizando a versão oficial em estúdio.
          </p>
        </div>

        {/* Live Product Mini Preview Card */}
        <div className="relative rounded-2xl border border-white/[0.08] bg-[#0c130e]/90 p-5 shadow-2xl backdrop-blur-md space-y-4">
          {/* Card Header */}
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-harmonia-lime animate-pulse" />
              <span className="text-xs font-semibold text-white tracking-wide">
                Sincronização em tempo real
              </span>
            </div>
            <span className="text-[11px] font-mono text-zinc-400">
              48 faixas sincronizadas
            </span>
          </div>

          {/* Sync Transformation Flow */}
          <div className="space-y-2.5">
            {/* Origin (YouTube) */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/80 border border-white/[0.05]">
              <div className="h-8 w-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                <svg className="h-4 w-4 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase">Origem • YouTube</span>
                  <span className="text-[10px] font-mono text-zinc-500">Clipe Oficial</span>
                </div>
                <p className="text-xs sm:text-sm font-medium text-white truncate">
                  Kendrick Lamar - luther (Official Video)
                </p>
              </div>
            </div>

            {/* Sync Connector */}
            <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-zinc-500">
              <div className="h-px bg-white/[0.08] flex-1" />
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-harmonia-lime/10 border border-harmonia-lime/20 text-harmonia-lime font-medium">
                <ArrowDown className="h-3 w-3" />
                Filtro de ruído & correspondência ISRC
              </span>
              <div className="h-px bg-white/[0.08] flex-1" />
            </div>

            {/* Destination (Spotify) */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/80 border border-white/[0.05]">
              <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <svg className="h-4 w-4 text-emerald-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.495 17.303c-.216.353-.674.468-1.027.253c-2.815-1.72-6.359-2.109-10.533-1.155c-.404.092-.809-.163-.901-.567c-.092-.404.163-.809.567-.901c4.571-1.045 8.494-.602 11.641 1.343c.353.216.468.674.253 1.027zm1.468-3.264c-.272.443-.85.583-1.293.311c-3.222-1.98-8.134-2.553-11.946-1.396c-.498.152-1.027-.134-1.179-.633c-.152-.498.134-1.027.633-1.179c4.359-1.323 9.775-.684 13.474 1.594c.443.272.583.85.311 1.293zm.126-3.41c-3.864-2.295-10.238-2.506-13.918-1.388-.593.18-1.22-.162-1.4-.755-.18-.593.162-1.22.755-1.4c4.237-1.286 11.28-1.042 15.727 1.597c.533.316.708 1.008.392 1.541c-.316.533-1.008.708-1.541.392z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase">Destino • Spotify</span>
                  <span className="text-[10px] font-mono text-emerald-400 font-semibold">Versão Estúdio</span>
                </div>
                <p className="text-xs sm:text-sm font-medium text-white truncate">
                  luther • Kendrick Lamar, SZA
                </p>
              </div>
            </div>
          </div>

          {/* Footer note in card */}
          <div className="pt-2 flex items-center justify-between text-xs text-zinc-300">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-harmonia-lime" />
              Versão limpa sincronizada sem intros ou vinhetas
            </span>
            <span className="font-mono text-emerald-400 text-[11px] font-semibold">100% match</span>
          </div>
        </div>
      </div>

      {/* Bottom: Minimal Footer */}
      <div className="relative z-10 flex items-center justify-between text-xs text-zinc-400 font-mono pt-4 border-t border-border/40">
        <Link
          href="https://github.com/thiagoDOTjpeg/harmonia"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-zinc-200 transition-colors flex items-center gap-1.5"
        >
          <Github className="h-3.5 w-3.5" />
          <span>Código aberto</span>
        </Link>
      </div>
    </div>
  );
}
