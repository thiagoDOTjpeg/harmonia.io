"use client";

import { HarmoniaLogo, HarmoniaMark } from "@harmonia/ui";
import {
  Activity,
  AudioWaveform,
  CheckCircle2,
  Cpu,
  Github,
  Radio,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export function AuthShowcase() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5, active: false });

  // Stereo Peak Level Simulator
  const [meterLevels, setMeterLevels] = useState({ left: 74, right: 78 });
  const [bpm, setBpm] = useState(124);

  // Oscilloscope Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const handleResize = () => {
      if (!canvas || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // Render loop
    const render = () => {
      time += 0.022;

      // Animate level meters
      if (Math.floor(time * 30) % 6 === 0) {
        setMeterLevels({
          left: 68 + Math.sin(time * 2.5) * 18 + Math.random() * 8,
          right: 72 + Math.cos(time * 2.2) * 16 + Math.random() * 8,
        });
      }

      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      ctx.clearRect(0, 0, width, height);

      // 1. Subtle Caliper Grid & Crosshairs
      ctx.strokeStyle = "rgba(255, 255, 255, 0.035)";
      ctx.lineWidth = 1;

      // Horizontal grid lines
      const horizontalLines = 7;
      for (let i = 0; i <= horizontalLines; i++) {
        const y = (height / horizontalLines) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Vertical grid lines
      const verticalLines = 10;
      for (let i = 0; i <= verticalLines; i++) {
        const x = (width / verticalLines) * i;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Center reference zero-line
      const centerY = height / 2;
      ctx.strokeStyle = "rgba(217, 242, 122, 0.12)";
      ctx.setLineDash([4, 6]);
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.stroke();
      ctx.setLineDash([]);

      const mouseInfluence = mouseRef.current.active
        ? (mouseRef.current.y - 0.5) * 40
        : 0;

      // Waveform generator function
      const drawWave = (
        amplitude: number,
        frequency: number,
        phase: number,
        color: string,
        lineWidth: number,
        glow = false
      ) => {
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;

        if (glow) {
          ctx.shadowColor = color;
          ctx.shadowBlur = 18;
        }

        for (let x = 0; x < width; x += 2) {
          // Window envelope: smooth taper at the borders (Hanning-like)
          const normX = x / width;
          const envelope = Math.sin(normX * Math.PI);

          // Combined multi-harmonic audio signal
          const wave1 = Math.sin(x * frequency * 0.015 + phase + time);
          const wave2 = Math.cos(x * frequency * 0.032 - time * 1.4) * 0.45;
          const wave3 = Math.sin(x * frequency * 0.008 + time * 0.7) * 0.3;

          const composite = (wave1 + wave2 + wave3) * amplitude * envelope;
          const y = centerY + composite + mouseInfluence * envelope;

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.stroke();
        ctx.restore();
      };

      // 2. Ambient harmonic sub-wave (Cyan/Deep Emerald, soft fill)
      drawWave(48, 0.9, 0, "rgba(52, 211, 153, 0.18)", 1.5, false);

      // 3. Secondary harmonic wave (Audio Phase alignment - Emerald)
      drawWave(32, 1.4, Math.PI / 3, "rgba(52, 211, 153, 0.75)", 1.8, true);

      // 4. Primary fundamental wave (Harmonia Signature Lime #d9f27a)
      drawWave(42, 1.1, time * 0.5, "#d9f27a", 2.4, true);

      // 5. Delicate high-frequency overtone carrier (Studio 24-bit quantization)
      drawWave(14, 3.2, time * 2, "rgba(255, 255, 255, 0.4)", 1, false);

      // 6. Draw central frequency convergence node
      const nodeX = width * 0.5 + Math.sin(time) * 12;
      const nodeY = centerY + Math.sin(time * 1.5) * 8;

      ctx.save();
      ctx.beginPath();
      ctx.arc(nodeX, nodeY, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#d9f27a";
      ctx.shadowColor = "#d9f27a";
      ctx.shadowBlur = 14;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(nodeX, nodeY, 14, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(217, 242, 122, 0.35)";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseRef.current = {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
      active: true,
    };
  };

  const handleMouseLeave = () => {
    mouseRef.current.active = false;
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative hidden lg:flex flex-col justify-between p-10 xl:p-14 bg-[#050906] border-r border-border/80 overflow-hidden select-none"
    >
      {/* Background ambient lighting and grain */}
      <div className="absolute inset-0 bg-grid-subtle opacity-25 pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-harmonia-lime/[0.07] rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-emerald-500/[0.08] rounded-full blur-[160px] pointer-events-none" />

      {/* Top Header: Brand Identity & Precision Badge */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <HarmoniaLogo className="h-6 w-auto text-harmonia-lime" />
          <span className="text-zinc-700 font-mono text-xs">/</span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-harmonia-lime/10 border border-harmonia-lime/25 text-[11px] font-mono font-medium text-harmonia-lime">
            <span className="h-1.5 w-1.5 rounded-full bg-harmonia-lime animate-pulse" />
            RESONANCE LAB
          </span>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span>48.0 kHz • 24-BIT MASTER</span>
        </div>
      </div>

      {/* Centerpiece: The Conceptual Harmonic Chamber */}
      <div className="relative z-10 my-auto py-6 space-y-6">
        {/* Conceptual Headline */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-harmonia-lime font-mono text-xs tracking-widest uppercase font-semibold">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Convergência Acústica</span>
          </div>

          <h2 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-white leading-tight font-display">
            Onde frequências <br />
            <span className="bg-linear-to-r from-harmonia-lime via-[#b8e855] to-emerald-400 bg-clip-text text-transparent">
              encontram harmonia.
            </span>
          </h2>

          <p className="text-xs xl:text-sm text-zinc-400 max-w-lg leading-relaxed font-sans pt-1">
            Do streaming de videoclipes à fidelidade de estúdio. O Harmonia decodifica o ruído
            e sincroniza cada nuance entre seus mundos musicais.
          </p>
        </div>

        {/* The Oscilloscope Canvas Chamber */}
        <div className="relative rounded-2xl border border-white/[0.08] bg-[#070d09]/90 backdrop-blur-xl p-5 shadow-2xl card-sculpted overflow-hidden">
          {/* Top Scope Caliper Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] text-[10px] font-mono text-zinc-400">
            <div className="flex items-center gap-3">
              <span className="text-harmonia-lime font-bold">OSCILLOSCOPE 01</span>
              <span>•</span>
              <span>PHASE: 180° COHERENT</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 font-semibold">ACOUSTIC LOCK 99.8%</span>
            </div>
          </div>

          {/* Canvas Viewport */}
          <div
            ref={containerRef}
            className="relative w-full h-56 xl:h-64 my-2 flex items-center justify-center cursor-crosshair"
          >
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

            {/* Overlaid Scope HUD Elements */}
            <div className="absolute top-2 left-2 text-[9px] font-mono text-zinc-500 pointer-events-none select-none space-y-0.5">
              <div>+6.0 dB</div>
              <div>0.0 dB (REF)</div>
              <div>-12.0 dB</div>
            </div>

            <div className="absolute bottom-2 right-2 text-[9px] font-mono text-zinc-500 pointer-events-none select-none text-right space-y-0.5">
              <div>SPECTRUM: 20Hz - 20kHz</div>
              <div>FILTER: STUDIO REMASTER</div>
            </div>
          </div>

          {/* Bottom Precision Stereo Meters & Audio HUD */}
          <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between gap-4 font-mono text-[10px]">
            {/* Left Channel Level */}
            <div className="flex-1 space-y-1">
              <div className="flex justify-between text-zinc-400">
                <span className="text-zinc-500">CH 1 • YOUTUBE IN</span>
                <span className="text-foreground font-semibold">
                  {Math.round(meterLevels.left)}%
                </span>
              </div>
              <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden flex">
                <div
                  className="h-full bg-linear-to-r from-emerald-500 to-harmonia-lime transition-all duration-150 rounded-full"
                  style={{ width: `${meterLevels.left}%` }}
                />
              </div>
            </div>

            {/* Right Channel Level */}
            <div className="flex-1 space-y-1">
              <div className="flex justify-between text-zinc-400">
                <span className="text-zinc-500">CH 2 • SPOTIFY OUT</span>
                <span className="text-foreground font-semibold">
                  {Math.round(meterLevels.right)}%
                </span>
              </div>
              <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden flex">
                <div
                  className="h-full bg-linear-to-r from-emerald-500 to-harmonia-lime transition-all duration-150 rounded-full"
                  style={{ width: `${meterLevels.right}%` }}
                />
              </div>
            </div>

            {/* Center Status */}
            <div className="shrink-0 text-right pl-2 hidden sm:block">
              <span className="text-zinc-500 block">LATENCY</span>
              <span className="text-harmonia-lime font-bold">&lt; 118ms</span>
            </div>
          </div>
        </div>

        {/* Minimalist Audio Specs Ribbon */}
        <div className="grid grid-cols-3 gap-3 font-mono text-[11px]">
          <div className="p-3 rounded-xl border border-white/[0.06] bg-card/40 backdrop-blur-xs flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-harmonia-lime/10 border border-harmonia-lime/20 flex items-center justify-center text-harmonia-lime shrink-0">
              <AudioWaveform className="h-3.5 w-3.5" />
            </div>
            <div className="min-w-0">
              <span className="text-zinc-400 text-[10px] block truncate">Algoritmo</span>
              <span className="font-bold text-foreground text-xs truncate block">ISRC Match</span>
            </div>
          </div>

          <div className="p-3 rounded-xl border border-white/[0.06] bg-card/40 backdrop-blur-xs flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <Zap className="h-3.5 w-3.5" />
            </div>
            <div className="min-w-0">
              <span className="text-zinc-400 text-[10px] block truncate">Pipeline</span>
              <span className="font-bold text-foreground text-xs truncate block">Automático 24/7</span>
            </div>
          </div>

          <div className="p-3 rounded-xl border border-white/[0.06] bg-card/40 backdrop-blur-xs flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-harmonia-lime/10 border border-harmonia-lime/20 flex items-center justify-center text-harmonia-lime shrink-0">
              <ShieldCheck className="h-3.5 w-3.5" />
            </div>
            <div className="min-w-0">
              <span className="text-zinc-400 text-[10px] block truncate">Segurança</span>
              <span className="font-bold text-foreground text-xs truncate block">OAuth 2.0 PKCE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Technical Spec Footer */}
      <div className="relative z-10 flex items-center justify-between text-xs text-zinc-500 font-mono pt-4 border-t border-border/60">
        <div className="flex items-center gap-2">
          <HarmoniaMark className="h-3.5 w-auto text-harmonia-lime" />
          <span>Harmonia Open Source • Continuous Audio Synchronization</span>
        </div>

        <Link
          href="https://github.com/thiagoDOTjpeg/harmonia"
          target="_blank"
          className="hover:text-zinc-300 transition-colors flex items-center gap-1.5"
        >
          <Github className="h-3.5 w-3.5" />
          <span>GitHub</span>
        </Link>
      </div>
    </div>
  );
}
