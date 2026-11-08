"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Github } from "lucide-react";

const ASCII_LOGO = `
██╗  ██╗ █████╗ ██████╗ ███╗   ███╗ ██████╗ ███╗   ██╗██╗ █████╗ 
██║  ██║██╔══██╗██╔══██╗████╗ ████║██╔═══██╗████╗  ██║██║██╔══██╗
███████║███████║██████╔╝██╔████╔██║██║   ██║██╔██╗ ██║██║███████║
██╔══██║██╔══██║██╔══██╗██║╚██╔╝██║██║   ██║██║╚██╗██║██║██╔══██║
██║  ██║██║  ██║██║  ██║██║ ╚═╝ ██║╚██████╔╝██║ ╚████║██║██║  ██║
╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝╚═╝  ╚═╝
`.trim();

const ASCII_SLANT = `
    __                                      _       
   / /_   ____ _ _____ ____ ___   ____     (_)____ _
  / __ \\ / __ \`// ___// __ \`__ \\ / __ \\   / // __ \`/
 / / / // /_/ // /   / / / / / // /_/ /  / // /_/ / 
/_/ /_/ \\__,_//_/   /_/ /_/ /_/ \\____/  /_/ \\__,_/  
`.trim();

const WAVE_CHARS = [" ", " ", "▂", "▃", "▄", "▅", "▆", "▇", "█"];

export function AuthShowcase() {
  const [time, setTime] = useState(0);
  const [activePreset, setActivePreset] = useState<"block" | "slant">("block");

  // Smooth animation ticker for the ASCII audio wave
  useEffect(() => {
    const timer = setInterval(() => {
      setTime((t) => t + 0.15);
    }, 90);
    return () => clearTimeout(timer);
  }, []);

  // Compute 24 columns of undulating soundwave
  const waveBars = Array.from({ length: 28 }, (_, i) => {
    const v1 = Math.sin(i * 0.35 + time * 1.2) * 0.5 + 0.5;
    const v2 = Math.cos(i * 0.2 - time * 0.8) * 0.3;
    const v3 = Math.sin((i + time) * 0.6) * 0.2;
    const combined = Math.min(1, Math.max(0, v1 + v2 + v3));
    const charIndex = Math.min(
      WAVE_CHARS.length - 1,
      Math.floor(combined * WAVE_CHARS.length)
    );
    return WAVE_CHARS[charIndex];
  }).join(" ");

  // Real-time matrix bars
  const eqChannels = [
    { id: "CH-01", label: "YOUTUBE_PULL", val: 78 + Math.floor(Math.sin(time) * 12) },
    { id: "CH-02", label: "ISRC_RESOLV", val: 94 + Math.floor(Math.cos(time * 0.8) * 5) },
    { id: "CH-03", label: "SPOTIFY_PUB", val: 88 + Math.floor(Math.sin(time * 1.4) * 8) },
  ];

  return (
    <div className="relative hidden lg:flex flex-col justify-between p-8 xl:p-12 bg-[#050806] border-r border-border/80 overflow-hidden select-none font-mono text-xs">
      {/* Subtle background grid pattern */}
      <div className="absolute inset-0 bg-grid-subtle opacity-30 pointer-events-none" />
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-harmonia-lime/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Shell Prompt */}
      <div className="relative z-10 flex items-center justify-between text-zinc-500 border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-harmonia-lime">harmonia@core</span>
          <span className="text-zinc-600">:</span>
          <span className="text-sky-400">~/console</span>
          <span className="text-zinc-600">$</span>
          <span className="text-zinc-300">system --status</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setActivePreset((p) => (p === "block" ? "slant" : "block"))}
            className="text-[10px] text-zinc-500 hover:text-harmonia-lime transition-colors cursor-pointer"
            title="Alternar estilo da arte ASCII"
          >
            [font: {activePreset}]
          </button>
          <span className="flex items-center gap-1.5 text-[11px] text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            live
          </span>
        </div>
      </div>

      {/* Center: ASCII Art Masterpiece & Minimalist Visualizer */}
      <div className="relative z-10 my-auto py-6 space-y-6">
        {/* ASCII Logo */}
        <div className="overflow-x-auto no-scrollbar">
          <pre className="text-harmonia-lime font-mono text-[11px] xl:text-[12.5px] leading-[1.18] font-bold tracking-tight drop-shadow-[0_0_12px_rgba(217,242,122,0.25)]">
            {activePreset === "block" ? ASCII_LOGO : ASCII_SLANT}
          </pre>
        </div>

        {/* Minimal Monospace Subtitle */}
        <div className="space-y-1 text-zinc-400 text-xs">
          <p className="text-zinc-200 font-semibold tracking-wide">
            // CONTINUOUS PLAYLIST REPLICATION &amp; ACOUSTIC MATCHING
          </p>
          <p className="text-zinc-500 text-[11px]">
            Enterprise-grade background synchronization between YouTube and Spotify.
          </p>
        </div>

        {/* Real-time Oscillating ASCII Soundwave */}
        <div className="p-4 rounded-xl border border-white/[0.08] bg-[#030604] space-y-3">
          <div className="flex items-center justify-between text-[10px] text-zinc-500 border-b border-border/40 pb-2">
            <span>ACOUSTIC WAVEFORM SPECTRUM</span>
            <span className="text-harmonia-lime font-mono">44.1kHz • 16-BIT</span>
          </div>

          {/* Undulating ASCII Wave */}
          <div className="text-harmonia-lime text-sm sm:text-base tracking-[0.2em] font-mono select-none overflow-hidden whitespace-nowrap py-1">
            {waveBars}
          </div>

          {/* Channel Level Meters */}
          <div className="space-y-1.5 pt-1 text-[11px] text-zinc-400">
            {eqChannels.map((ch) => {
              const barCount = Math.floor((ch.val / 100) * 22);
              const filled = "█".repeat(barCount);
              const empty = "░".repeat(22 - barCount);

              return (
                <div key={ch.id} className="flex items-center justify-between gap-2">
                  <span className="text-zinc-500 w-12">{ch.id}</span>
                  <span className="text-zinc-300 w-28 truncate">{ch.label}</span>
                  <span className="font-mono text-harmonia-lime/90 tracking-tighter flex-1">
                    {filled}
                    <span className="text-zinc-700">{empty}</span>
                  </span>
                  <span className="w-8 text-right text-zinc-400">{ch.val}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Minimal System Parameters */}
        <div className="p-3.5 rounded-lg border border-border/70 bg-card/30 space-y-1.5 text-[11px] text-zinc-400">
          <div className="flex justify-between">
            <span className="text-zinc-500">ENGINE_CORE:</span>
            <span className="text-zinc-300">v1.0.0 (open-source)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">WORKER_POOL:</span>
            <span className="text-emerald-400">2 BullMQ Workers (active)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">MATCH_POLICY:</span>
            <span className="text-harmonia-lime">ISRC-First + Studio Filter</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">POLL_INTERVAL:</span>
            <span className="text-zinc-300">Continuous 24-Hour Cycle</span>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="relative z-10 flex items-center justify-between text-[11px] text-zinc-600 border-t border-border/60 pt-3">
        <span>© harmonia.io • MIT License</span>
        <Link
          href="https://github.com/thiagoDOTjpeg/harmonia"
          target="_blank"
          className="hover:text-zinc-300 transition-colors flex items-center gap-1.5"
        >
          <Github className="h-3.5 w-3.5 text-zinc-400" />
          <span>github.com/thiagoDOTjpeg/harmonia</span>
        </Link>
      </div>
    </div>
  );
}
