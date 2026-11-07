"use client";

import { HarmoniaMark } from "@harmonia/ui";
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
} from "framer-motion";
import {
  AlertTriangle,
  Check,
  ChevronsLeftRight,
  Play,
  UserCheck,
  X,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

type OtherVerdict = "wrong" | "missing" | "version" | "ok";

interface ComparisonRow {
  ytTitle: string;
  ytChannel: string;
  other: {
    title: string;
    detail: string;
    verdict: OtherVerdict;
    reason: string;
  };
  harmonia: {
    title: string;
    detail: string;
    score: number;
    manual?: boolean;
  };
}

const ROWS: ComparisonRow[] = [
  {
    ytTitle: "Joy Division - Disorder (Official Audio) [HD Remaster]",
    ytChannel: "Joy Division Official",
    other: {
      title: "Disorder (Karaoke Version)",
      detail: "Sing2Music",
      verdict: "wrong",
      reason: "Cover de karaokê",
    },
    harmonia: {
      title: "Disorder - 2007 Remaster",
      detail: "Joy Division · Unknown Pleasures",
      score: 0.98,
    },
  },
  {
    ytTitle: "New Order - Blue Monday (Live at BBC 1984) [VHS Rip]",
    ytChannel: "Factory Archives UK",
    other: {
      title: "Blue Monday '88 - 7\" Mix",
      detail: "New Order · Singles",
      verdict: "version",
      reason: "Versão errada",
    },
    harmonia: {
      title: "Blue Monday - Peel Session",
      detail: "New Order · BBC Radio 1 Live",
      score: 1,
      manual: true,
    },
  },
  {
    ytTitle: "Molchat Doma - Sudno (Борис Рыжий) [Lyric Video]",
    ytChannel: "Detriti Records",
    other: {
      title: "Nenhum resultado",
      detail: "Faixa ignorada",
      verdict: "missing",
      reason: "Não encontrada",
    },
    harmonia: {
      title: "Судно (Борис Рыжий)",
      detail: "Molchat Doma · Этажи",
      score: 0.95,
    },
  },
  {
    ytTitle: "Daft Punk - Veridis Quo (Interstella 5555) 4K",
    ytChannel: "Daft Punk",
    other: {
      title: "Veridis Quo (Nightcore Remix)",
      detail: "NightcoreZone",
      verdict: "wrong",
      reason: "Remix de terceiros",
    },
    harmonia: {
      title: "Veridis Quo",
      detail: "Daft Punk · Discovery",
      score: 0.99,
    },
  },
  {
    ytTitle: "The Cure - A Forest (Official Video 1980)",
    ytChannel: "The Cure",
    other: {
      title: "A Forest",
      detail: "The Cure · Seventeen Seconds",
      verdict: "ok",
      reason: "Correta",
    },
    harmonia: {
      title: "A Forest - 2006 Remaster",
      detail: "The Cure · Seventeen Seconds",
      score: 0.97,
    },
  },
  {
    ytTitle: "Boy Harsher - Pain [Boiler Room Extended Edit]",
    ytChannel: "Nude Club",
    other: {
      title: "Pain",
      detail: "Three Days Grace · One-X",
      verdict: "wrong",
      reason: "Artista errado",
    },
    harmonia: {
      title: "Pain",
      detail: "Boy Harsher · Yr Body Is Nothing",
      score: 0.91,
    },
  },
];

const OTHER_CORRECT = ROWS.filter((r) => r.other.verdict === "ok").length;

function VerdictBadge({ verdict, reason }: { verdict: OtherVerdict; reason: string }) {
  const styles: Record<OtherVerdict, string> = {
    wrong: "border-red-500/30 bg-red-500/10 text-red-300",
    missing: "border-zinc-500/30 bg-zinc-500/10 text-zinc-400",
    version: "border-amber-500/30 bg-amber-500/10 text-amber-300",
    ok: "border-white/15 bg-white/[0.05] text-zinc-300",
  };
  const Icon =
    verdict === "ok" ? Check : verdict === "version" ? AlertTriangle : X;

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded-md border px-1.5 py-0.5 font-mono text-[10px] ${styles[verdict]}`}
    >
      <Icon className="h-3 w-3" />
      {reason}
    </span>
  );
}

/** One full panel layer. Both layers share the exact same geometry so the slider seam is seamless. */
function PanelLayer({ variant }: { variant: "other" | "harmonia" }) {
  const isHarmonia = variant === "harmonia";

  return (
    <div
      className={`h-full w-full ${
        isHarmonia ? "bg-zinc-950" : "bg-[#0d0b0b]"
      }`}
    >
      {/* Layer header */}
      <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          {isHarmonia ? (
            <HarmoniaMark className="h-3 w-auto text-harmonia-lime" />
          ) : (
            <span className="h-2 w-2 rounded-full bg-red-400/80" />
          )}
          <span className="text-xs font-medium text-foreground">
            {isHarmonia ? "Harmonia" : "Conversor comum"}
          </span>
        </div>
        <span
          className={`font-mono text-[11px] ${
            isHarmonia ? "text-harmonia-lime" : "text-red-300/80"
          }`}
        >
          {isHarmonia
            ? `${ROWS.length}/${ROWS.length} corretas`
            : `${OTHER_CORRECT}/${ROWS.length} corretas`}
        </span>
      </div>

      {/* Rows */}
      <div className="divide-y divide-white/[0.05]">
        {ROWS.map((row) => (
          <div
            key={row.ytTitle}
            className="grid grid-cols-12 items-center gap-3 px-4 py-2.5 sm:px-6"
          >
            {/* Source (identical on both layers) */}
            <div className="col-span-6 flex min-w-0 items-center gap-2.5">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-red-500/25 bg-red-500/10">
                <Play className="h-2.5 w-2.5 fill-red-400 text-red-400" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-xs text-zinc-300">{row.ytTitle}</p>
                <p className="truncate text-[10px] text-muted-foreground">
                  {row.ytChannel}
                </p>
              </div>
            </div>

            {/* Result */}
            <div className="col-span-6 flex min-w-0 items-center justify-between gap-2">
              {isHarmonia ? (
                <>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium text-foreground">
                      {row.harmonia.title}
                    </p>
                    <p className="truncate text-[10px] text-muted-foreground">
                      {row.harmonia.detail}
                    </p>
                  </div>
                  {row.harmonia.manual ? (
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-md border border-harmonia-lime/30 bg-harmonia-lime/10 px-1.5 py-0.5 font-mono text-[10px] text-harmonia-lime">
                      <UserCheck className="h-3 w-3" />
                      Revisada
                    </span>
                  ) : (
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-md border border-harmonia-lime/30 bg-harmonia-lime/10 px-1.5 py-0.5 font-mono text-[10px] text-harmonia-lime">
                      <Check className="h-3 w-3" />
                      {Math.round(row.harmonia.score * 100)}%
                    </span>
                  )}
                </>
              ) : (
                <>
                  <div className="min-w-0">
                    <p
                      className={`truncate text-xs font-medium ${
                        row.other.verdict === "missing"
                          ? "italic text-zinc-500"
                          : row.other.verdict === "ok"
                            ? "text-foreground"
                            : "text-zinc-400 line-through decoration-red-400/60"
                      }`}
                    >
                      {row.other.title}
                    </p>
                    <p className="truncate text-[10px] text-muted-foreground">
                      {row.other.detail}
                    </p>
                  </div>
                  <VerdictBadge
                    verdict={row.other.verdict}
                    reason={row.other.reason}
                  />
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ComparisonSlider({ active }: { active: boolean }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef(false);
  const hasInteractedRef = useRef(false);
  const position = useMotionValue(50); // percentage of width revealing "other" on the left
  const [leaning, setLeaning] = useState<"other" | "harmonia" | "even">("even");

  const clipPath = useTransform(
    position,
    (p) => `inset(0 0 0 ${p}%)`
  );
  const handleLeft = useTransform(position, (p) => `${p}%`);

  useMotionValueEvent(position, "change", (p) => {
    setLeaning(p < 35 ? "harmonia" : p > 65 ? "other" : "even");
  });

  // Hint sweep when the section comes into view (only until the user interacts)
  useEffect(() => {
    if (!active || hasInteractedRef.current) return;
    const controls = animate(position, [50, 72, 28, 50], {
      duration: 2.2,
      delay: 0.7,
      ease: [0.45, 0, 0.25, 1],
      times: [0, 0.3, 0.7, 1],
    });
    return () => controls.stop();
  }, [active, position]);

  const updateFromClientX = (clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    position.set(Math.min(96, Math.max(4, pct)));
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    hasInteractedRef.current = true;
    isDraggingRef.current = true;
    position.stop();
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    updateFromClientX(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    updateFromClientX(e.clientX);
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  const snapTo = (target: number) => {
    hasInteractedRef.current = true;
    animate(position, target, { type: "spring", stiffness: 260, damping: 30 });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      e.stopPropagation();
      snapTo(Math.max(4, position.get() - 10));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      e.stopPropagation();
      snapTo(Math.min(96, position.get() + 10));
    }
  };

  return (
    <div className="space-y-4">
      {/* Quick toggles */}
      <div className="flex items-center justify-center gap-1 rounded-full border border-white/10 bg-zinc-950/80 p-1 w-fit mx-auto">
        {(
          [
            { id: "other", label: "Conversor comum", target: 96 },
            { id: "even", label: "Lado a lado", target: 50 },
            { id: "harmonia", label: "Harmonia", target: 4 },
          ] as const
        ).map((opt) => {
          const isActive = leaning === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => snapTo(opt.target)}
              className={`relative rounded-full px-3 py-1 text-xs transition-colors ${
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="comparisonTogglePill"
                  className="absolute inset-0 rounded-full bg-white/10"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">{opt.label}</span>
            </button>
          );
        })}
      </div>

      {/* Slider stage */}
      <div
        ref={containerRef}
        role="slider"
        tabIndex={0}
        aria-label="Comparar conversor comum com Harmonia"
        aria-valuemin={0}
        aria-valuemax={100}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onKeyDown={handleKeyDown}
        className="relative select-none overflow-hidden rounded-3xl border border-white/10 shadow-[0_32px_80px_-20px_rgba(0,0,0,0.85),inset_0_1px_0_0_rgba(255,255,255,0.09)] cursor-ew-resize touch-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
      >
        {/* Base layer: other converter */}
        <PanelLayer variant="other" />

        {/* Top layer: Harmonia, clipped from the left */}
        <motion.div
          className="absolute inset-0"
          style={{ clipPath, WebkitClipPath: clipPath }}
        >
          <PanelLayer variant="harmonia" />
        </motion.div>

        {/* Divider + handle */}
        <motion.div
          className="pointer-events-none absolute inset-y-0 z-20 -translate-x-1/2"
          style={{ left: handleLeft }}
        >
          <div className="h-full w-px bg-gradient-to-b from-transparent via-white/70 to-transparent" />
          <div className="absolute top-1/2 left-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-zinc-900/95 text-foreground shadow-[0_8px_24px_-4px_rgba(0,0,0,0.8)] backdrop-blur-md">
            <ChevronsLeftRight className="h-4 w-4" />
          </div>
        </motion.div>
      </div>

      {/* Score summary */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex items-center justify-between rounded-2xl border border-red-500/15 bg-red-500/[0.04] px-4 py-3">
          <div>
            <p className="text-xs font-medium text-foreground">Conversor comum</p>
            <p className="text-[11px] text-muted-foreground">
              Covers, remixes e artistas errados na sua playlist
            </p>
          </div>
          <span className="font-mono text-lg font-semibold text-red-300">
            {Math.round((OTHER_CORRECT / ROWS.length) * 100)}%
          </span>
        </div>
        <div className="flex items-center justify-between rounded-2xl border border-primary/20 bg-primary/[0.05] px-4 py-3">
          <div>
            <p className="text-xs font-medium text-foreground">Harmonia</p>
            <p className="text-[11px] text-muted-foreground">
              Score de confiança + revisão manual quando há dúvida
            </p>
          </div>
          <span className="font-mono text-lg font-semibold text-primary">
            100%
          </span>
        </div>
      </div>
    </div>
  );
}

