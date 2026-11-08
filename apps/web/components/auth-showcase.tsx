"use client";

import { HarmoniaLogo, HarmoniaMark } from "@harmonia/ui";
import {
  ArrowRight,
  CheckCircle2,
  Cpu,
  Github,
  Music2,
  Radio,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Terminal,
  Video,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const LIVE_LOG_LINES = [
  { tag: "ENGINE", text: "Worker pool ativo: 2 instâncias BullMQ processando filas.", color: "text-harmonia-lime" },
  { tag: "AUDIO", text: "Remoção de ruído de videoclipe: [Official Video] -> Master Studio.", color: "text-sky-400" },
  { tag: "MATCH", text: "ISRC confirmada: 'Daft Punk - One More Time' (99.8% precisão).", color: "text-emerald-400" },
  { tag: "SYNC", text: "Snapshot da playlist aplicado no Spotify via Web API.", color: "text-harmonia-lime" },
  { tag: "STATUS", text: "Pipeline em repouso. Próxima varredura automática em 24h.", color: "text-zinc-400" },
];

export function AuthShowcase() {
  const [activeLogIndex, setActiveLogIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveLogIndex((prev) => (prev + 1) % LIVE_LOG_LINES.length);
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative hidden lg:flex flex-col justify-between p-10 xl:p-14 bg-[#070c09] border-r border-border/80 overflow-hidden select-none">
      {/* Background ambient lighting and subtle grid */}
      <div className="absolute inset-0 bg-grid-subtle opacity-40 pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-harmonia-lime/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Header */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <HarmoniaLogo className="h-6 w-auto text-harmonia-lime" />
          <span className="text-zinc-700 font-mono text-xs">/</span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-harmonia-lime/10 border border-harmonia-lime/30 text-[11px] font-mono font-semibold text-harmonia-lime">
            <span className="h-1.5 w-1.5 rounded-full bg-harmonia-lime animate-pulse" />
            Core Engine v1.0
          </span>
        </div>

        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-mono text-emerald-400">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          <span>All Systems Operational</span>
        </div>
      </div>

      {/* Centerpiece: Live Audio Pipeline Architecture */}
      <div className="relative z-10 my-auto py-8 space-y-8">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-harmonia-lime font-bold">
            Motor de Sincronização em Tempo Real
          </span>
          <h2 className="text-2xl xl:text-3xl font-extrabold tracking-tight text-white mt-1">
            Pareamento Acústico de Alta Fidelidade
          </h2>
          <p className="text-xs xl:text-sm text-zinc-400 mt-2 max-w-lg leading-relaxed">
            Elimina versões ao vivo e introduções de clipes do YouTube, localizando a faixa
            oficial em estúdio no Spotify com correspondência de metadados e ISRC.
          </p>
        </div>

        {/* Visual Pipeline Nodes */}
        <div className="relative rounded-2xl border border-white/[0.08] bg-card/60 backdrop-blur-md p-6 card-sculpted shadow-2xl space-y-6">
          <div className="grid grid-cols-3 items-center gap-2">
            {/* Origin Node: YouTube */}
            <div className="flex flex-col items-center text-center p-3.5 rounded-xl border border-red-500/30 bg-red-500/5">
              <div className="h-10 w-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 mb-2">
                <Video className="h-5 w-5" />
              </div>
              <span className="text-xs font-bold text-foreground">YouTube</span>
              <span className="text-[10px] font-mono text-zinc-400 mt-0.5">Origem (Vídeos)</span>
              <div className="flex items-center gap-1 mt-2 text-[10px] font-mono text-emerald-400">
                <CheckCircle2 className="h-3 w-3" />
                <span>API Quota OK</span>
              </div>
            </div>

            {/* Bridge: Processing Core */}
            <div className="flex flex-col items-center text-center px-1">
              <div className="relative flex items-center justify-center w-full my-2">
                <div className="h-[2px] w-full bg-linear-to-r from-red-500/40 via-harmonia-lime/60 to-emerald-500/40" />
                <div className="absolute h-9 w-9 rounded-full bg-background border border-harmonia-lime/50 flex items-center justify-center shadow-[0_0_15px_rgba(217,242,122,0.3)]">
                  <HarmoniaMark className="h-4.5 w-auto text-harmonia-lime" animated={true} />
                </div>
              </div>
              <span className="text-[11px] font-mono font-bold text-harmonia-lime mt-2">
                Acoustic Matcher
              </span>
              <span className="text-[10px] font-mono text-zinc-400">
                ISRC + Álbum + Filtro
              </span>
            </div>

            {/* Target Node: Spotify */}
            <div className="flex flex-col items-center text-center p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-2">
                <Music2 className="h-5 w-5" />
              </div>
              <span className="text-xs font-bold text-foreground">Spotify</span>
              <span className="text-[10px] font-mono text-zinc-400 mt-0.5">Destino (Áudio)</span>
              <div className="flex items-center gap-1 mt-2 text-[10px] font-mono text-emerald-400">
                <Zap className="h-3 w-3" />
                <span>Rate-Limit 100%</span>
              </div>
            </div>
          </div>

          {/* Real-time Telemetry Simulator */}
          <div className="rounded-xl border border-border/80 bg-[#040806] p-3.5 font-mono text-[11px] space-y-2">
            <div className="flex items-center justify-between text-[10px] pb-1.5 border-b border-border/60 text-zinc-400">
              <div className="flex items-center gap-1.5">
                <Terminal className="h-3 w-3 text-harmonia-lime" />
                <span>Harmonia Live Event Bus</span>
              </div>
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Streaming
              </span>
            </div>

            <div className="space-y-1 transition-all duration-300 min-h-[52px]">
              <div className="flex items-center gap-2">
                <span className="text-zinc-600 select-none">›</span>
                <span className={`font-bold ${LIVE_LOG_LINES[activeLogIndex].color}`}>
                  [{LIVE_LOG_LINES[activeLogIndex].tag}]
                </span>
                <span className="text-zinc-200 truncate">
                  {LIVE_LOG_LINES[activeLogIndex].text}
                </span>
              </div>
              <div className="flex items-center gap-2 opacity-50">
                <span className="text-zinc-700 select-none">›</span>
                <span className="text-zinc-500 font-bold">
                  [{LIVE_LOG_LINES[(activeLogIndex + 1) % LIVE_LOG_LINES.length].tag}]
                </span>
                <span className="text-zinc-400 truncate text-[10px]">
                  {LIVE_LOG_LINES[(activeLogIndex + 1) % LIVE_LOG_LINES.length].text}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Ribbon */}
          <div className="grid grid-cols-3 gap-2 pt-1 text-center font-mono">
            <div className="p-2 rounded-lg bg-background/60 border border-border/60">
              <span className="text-[10px] text-zinc-400 block">Precisão de Match</span>
              <span className="text-xs font-bold text-harmonia-lime">99.4%</span>
            </div>
            <div className="p-2 rounded-lg bg-background/60 border border-border/60">
              <span className="text-[10px] text-zinc-400 block">Latência Média</span>
              <span className="text-xs font-bold text-emerald-400">&lt; 120ms</span>
            </div>
            <div className="p-2 rounded-lg bg-background/60 border border-border/60">
              <span className="text-[10px] text-zinc-400 block">Monitoramento</span>
              <span className="text-xs font-bold text-foreground">24/7 Ativo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="relative z-10 flex items-center justify-between text-xs text-zinc-500 font-mono pt-4 border-t border-border/60">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-harmonia-lime" />
          <span>OAuth 2.0 PKCE • End-to-End Encrypted</span>
        </div>

        <Link
          href="https://github.com/thiagoDOTjpeg/harmonia"
          target="_blank"
          className="hover:text-zinc-300 transition-colors flex items-center gap-1.5"
        >
          <Github className="h-3.5 w-3.5" />
          <span>GitHub OSS</span>
        </Link>
      </div>
    </div>
  );
}
