"use client";

import { ComparisonSlider } from "@/components/comparison-slider";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { requestAccess } from "@/lib/api";
import { RequestAccessDTO, RequestAccessSchema } from "@harmonia/shared";
import {
  Alert,
  AlertDescription,
  BackgroundDistortion,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  HarmoniaMark,
  Input,
  Label,
} from "@harmonia/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowDown,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Coffee,
  Copy,
  FileCode2,
  GitBranch,
  Github,
  KeyRound,
  Layers,
  Loader2,
  Lock,
  Play,
  Radio,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import StackIcon from "tech-stack-icons";

/* =========================================================
   FRAMER MOTION HELPERS & HEADLINE ANIMATIONS
   ========================================================= */

function StageItem({
  active,
  step = 0,
  children,
  className = "",
}: {
  active: boolean;
  step?: number;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.98, filter: "blur(4px)" }}
      animate={
        active
          ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }
          : { opacity: 0, y: 28, scale: 0.98, filter: "blur(4px)" }
      }
      transition={{
        duration: 0.65,
        delay: active ? 0.06 + step * 0.11 : 0,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Splits a string into GPU-animated characters with smooth writing effect
 */
function WrittenChars({
  text,
  startDelay = 0,
  charSpeed = 0.022,
  active = true,
}: {
  text: string;
  startDelay?: number;
  charSpeed?: number;
  active?: boolean;
}) {
  return (
    <>
      {Array.from(text).map((char, idx) => (
        <motion.span
          key={idx}
          initial={{ opacity: 0, y: 10, filter: "blur(5px)" }}
          animate={
            active
              ? { opacity: 1, y: 0, filter: "blur(0px)" }
              : { opacity: 0, y: 10, filter: "blur(5px)" }
          }
          transition={{
            duration: 0.28,
            delay: active ? startDelay + idx * charSpeed : 0,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="inline-block whitespace-pre"
        >
          {char}
        </motion.span>
      ))}
    </>
  );
}

/**
 * Section title where normal words write in and the italic editorial accent drops from top in ease-in
 */
function AnimatedSectionHeading({
  active,
  normalText,
  dropAccentText,
  className = "text-3xl font-semibold tracking-tight sm:text-4xl",
}: {
  active: boolean;
  normalText: string;
  dropAccentText: string;
  className?: string;
}) {
  const words = normalText.trim().split(" ");
  const dropDelay = 0.12 + words.length * 0.055;

  return (
    <h2 className={className}>
      {words.map((word, idx) => (
        <motion.span
          key={idx}
          initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
          animate={
            active
              ? { opacity: 1, y: 0, filter: "blur(0px)" }
              : { opacity: 0, y: 12, filter: "blur(4px)" }
          }
          transition={{
            duration: 0.38,
            delay: active ? 0.1 + idx * 0.055 : 0,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="inline-block mr-[0.28em]"
        >
          {word}
        </motion.span>
      ))}
      <motion.span
        initial={{ opacity: 0, y: -38, scale: 1.06, filter: "blur(5px)" }}
        animate={
          active
            ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }
            : { opacity: 0, y: -38, scale: 1.06, filter: "blur(5px)" }
        }
        transition={{
          duration: 0.45,
          delay: active ? dropDelay : 0,
          ease: [0.42, 0, 0.2, 1],
        }}
        className="inline-block font-editorial italic font-normal text-muted-foreground"
      >
        {dropAccentText}
      </motion.span>
    </h2>
  );
}

/**
 * Hero Headline:
 * - "Suas playlists do " writes smoothly char-by-char
 * - [▶ YouTube] drops from top to bottom in ease-in
 * - " no " writes smoothly
 * - [((( Spotify] drops from top to bottom in ease-in
 * - "," + "sem perder a curadoria." writes smoothly on the second line
 */
function HeroAnimatedHeadline({ active }: { active: boolean }) {
  const part1 = "Suas playlists do ";
  const part2 = " no ";
  const part4 = "sem perder a curadoria.";

  const tStart = 0.08;
  const speed = 0.022;
  const ytDropTime = tStart + part1.length * speed + 0.04; // ~0.48s
  const part2Start = ytDropTime + 0.28; // ~0.76s
  const spDropTime = part2Start + part2.length * speed + 0.04; // ~0.89s
  const commaTime = spDropTime + 0.28; // ~1.17s
  const part4Start = commaTime + 0.06; // ~1.23s

  return (
    <h1 className="text-4xl font-semibold tracking-[-0.035em] text-foreground sm:text-6xl md:text-[72px] md:leading-[1.06]">
      <WrittenChars
        text={part1}
        startDelay={tStart}
        charSpeed={speed}
        active={active}
      />

      <motion.span
        initial={{
          opacity: 0,
          y: -68,
          scale: 1.14,
          rotate: -10,
          filter: "blur(6px)",
        }}
        animate={
          active
            ? {
                opacity: 1,
                y: 0,
                scale: 1,
                rotate: -2,
                filter: "blur(0px)",
              }
            : {
                opacity: 0,
                y: -68,
                scale: 1.14,
                rotate: -10,
                filter: "blur(6px)",
              }
        }
        transition={{
          delay: active ? ytDropTime : 0,
          duration: 0.42,
          ease: [0.42, 0, 0.2, 1],
        }}
        whileHover={{ scale: 1.05, rotate: 0 }}
        className="inline-flex items-center gap-1.5 rounded-2xl border border-red-500/30 bg-red-500/10 px-3.5 py-0.5 text-[0.82em] font-medium text-red-300 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.14)] align-baseline will-change-transform"
      >
        <Play className="h-4 w-4 fill-red-400 text-red-400 sm:h-6 sm:w-6" />
        YouTube
      </motion.span>

      <WrittenChars
        text={part2}
        startDelay={part2Start}
        charSpeed={speed}
        active={active}
      />

      <motion.span
        initial={{
          opacity: 0,
          y: -68,
          scale: 1.14,
          rotate: 10,
          filter: "blur(6px)",
        }}
        animate={
          active
            ? {
                opacity: 1,
                y: 0,
                scale: 1,
                rotate: 2,
                filter: "blur(0px)",
              }
            : {
                opacity: 0,
                y: -68,
                scale: 1.14,
                rotate: 10,
                filter: "blur(6px)",
              }
        }
        transition={{
          delay: active ? spDropTime : 0,
          duration: 0.42,
          ease: [0.42, 0, 0.2, 1],
        }}
        whileHover={{ scale: 1.05, rotate: 0 }}
        className="inline-flex items-center gap-1.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-0.5 text-[0.82em] font-medium text-emerald-300 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.14)] align-baseline will-change-transform"
      >
        <Radio className="h-4 w-4 text-emerald-400 sm:h-6 sm:w-6" />
        Spotify
      </motion.span>

      <WrittenChars
        text=","
        startDelay={commaTime}
        charSpeed={speed}
        active={active}
      />

      <span className="block mt-1.5 font-editorial italic font-normal text-foreground/95">
        <WrittenChars
          text={part4}
          startDelay={part4Start}
          charSpeed={0.02}
          active={active}
        />
      </span>
    </h1>
  );
}

/* =========================================================
   DATA & TYPES
   ========================================================= */

const SECTION_IDS = [
  "hero",
  "palco",
  "jornada",
  "arquitetura",
  "self-host",
] as const;

type SectionId = (typeof SECTION_IDS)[number];

const JOURNEY_STEPS = [
  {
    step: "01",
    tag: "Autenticação OAuth 2.0",
    title: "Conecte suas contas sem expor credenciais.",
    description:
      "Em um popup isolado, você autoriza leitura das suas playlists do YouTube e criação de playlists no Spotify. Os tokens são criptografados com AES-256 no banco antes de qualquer job rodar.",
    codeLabel: "oauth-handshake.ts",
  },
  {
    step: "02",
    tag: "Sanitização & Heurística",
    title: "O motor limpa o título bruto e calcula o score.",
    description:
      "Removemos sufixos como [Official Video], (Lyrics) ou [4K Remaster], extraímos artista e faixa e comparamos com os metadados do Spotify. Acima de 80% vai direto; abaixo disso aguarda seu veredito.",
    codeLabel: "track-matcher.service.ts",
  },
  {
    step: "03",
    tag: "Fila Assíncrona BullMQ",
    title: "Workers sincronizam em background sem travar a tela.",
    description:
      "Mesmo playlists com centenas de músicas não dão timeout. O Redis enfileira os lotes e o worker insere as faixas respeitando os limites de requisição da API do Spotify.",
    codeLabel: "sync-playlist.processor.ts",
  },
];

const TERMINAL_COMMANDS = {
  docker: [
    "git clone https://github.com/thiagoDOTjpeg/harmonia.io.git",
    "cd harmonia.io",
    "cp .env.example .env",
    "docker compose up --build -d",
  ],
  local: [
    "git clone https://github.com/thiagoDOTjpeg/harmonia.io.git",
    "cd harmonia.io",
    "npm install",
    "npm run db:migrate && npm run dev",
  ],
};

export default function HomePage() {
  const [open, setOpen] = useState(false);
  const [activeJourneyStep, setActiveJourneyStep] = useState<number>(0);
  const [terminalTab, setTerminalTab] = useState<"docker" | "local">("docker");
  const [copied, setCopied] = useState(false);

  const [activeSection, setActiveSection] = useState<SectionId>("hero");

  const isGlidingRef = useRef(false);
  const activeIndexRef = useRef(0);
  const lastWheelTimeRef = useRef(0);

  /* =========================================================
     INSTANT-START SMOOTH GLIDE + STAGGERED SCREEN LOAD
     ========================================================= */
  const glideToSection = useCallback((sectionId: SectionId) => {
    const target = document.getElementById(sectionId);
    if (!target) return;

    const nextIdx = SECTION_IDS.indexOf(sectionId);
    if (nextIdx !== -1) {
      activeIndexRef.current = nextIdx;
      setActiveSection(sectionId);
    }

    isGlidingRef.current = true;

    const startY = window.scrollY;
    const targetY = target.getBoundingClientRect().top + window.scrollY;
    const distance = targetY - startY;

    if (Math.abs(distance) < 2) {
      isGlidingRef.current = false;
      return;
    }

    const duration = 680;
    let startTime: number | null = null;

    function easeOutCubic(t: number): number {
      return 1 - Math.pow(1 - t, 3);
    }

    function step(timestamp: number) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);

      window.scrollTo({
        top: startY + distance * eased,
        behavior: "instant" as ScrollBehavior,
      });

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setTimeout(() => {
          isGlidingRef.current = false;
        }, 140);
      }
    }

    window.requestAnimationFrame(step);
  }, []);

  /* Intercept First Wheel Tick & Keyboard to Auto-Glide Immediately */
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (open || window.innerWidth < 1024) return;

      const now = performance.now();

      if (isGlidingRef.current || now - lastWheelTimeRef.current < 820) {
        e.preventDefault();
        return;
      }

      if (Math.abs(e.deltaY) < 6) return;

      const currentId = SECTION_IDS[activeIndexRef.current];
      const currentEl = document.getElementById(currentId);
      if (!currentEl) return;

      const rect = currentEl.getBoundingClientRect();
      const goingDown = e.deltaY > 0;
      const goingUp = e.deltaY < 0;

      if (goingDown && rect.bottom > window.innerHeight + 28) {
        return;
      }
      if (goingUp && rect.top < -28) {
        return;
      }

      const nextIndex = goingDown
        ? activeIndexRef.current + 1
        : activeIndexRef.current - 1;

      if (nextIndex < 0 || nextIndex >= SECTION_IDS.length) {
        return;
      }

      e.preventDefault();
      lastWheelTimeRef.current = now;
      glideToSection(SECTION_IDS[nextIndex]);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (open || isGlidingRef.current) return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "BUTTON") return;

      if (e.key === "ArrowDown" || e.key === "PageDown") {
        const nextIdx = activeIndexRef.current + 1;
        if (nextIdx < SECTION_IDS.length) {
          e.preventDefault();
          glideToSection(SECTION_IDS[nextIdx]);
        }
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        const prevIdx = activeIndexRef.current - 1;
        if (prevIdx >= 0) {
          e.preventDefault();
          glideToSection(SECTION_IDS[prevIdx]);
        }
      }
    };

    const handleScrollSync = () => {
      if (isGlidingRef.current) return;

      let detectedIdx = 0;
      for (let i = 0; i < SECTION_IDS.length; i++) {
        const el = document.getElementById(SECTION_IDS[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.45) {
            detectedIdx = i;
          }
        }
      }
      if (detectedIdx !== activeIndexRef.current) {
        activeIndexRef.current = detectedIdx;
        setActiveSection(SECTION_IDS[detectedIdx]);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", handleScrollSync, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleScrollSync);
    };
  }, [open, glideToSection]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RequestAccessDTO>({
    resolver: zodResolver(RequestAccessSchema),
    defaultValues: {
      name: "",
      email: "",
      reason: "",
    },
  });

  async function onSubmit(
    data: RequestAccessDTO,
    e?: React.BaseSyntheticEvent
  ) {
    e?.preventDefault();
    setOpen(false);
    reset();
    await requestAccess(data);
  }


  function handleCopyCode() {
    navigator.clipboard.writeText(TERMINAL_COMMANDS[terminalTab].join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="relative flex min-h-screen flex-col text-foreground overflow-x-hidden">
      <BackgroundDistortion zIndex={0} />
      <Header
        setOpen={setOpen}
        activeSection={activeSection}
        onNavigate={(id) => glideToSection(id as SectionId)}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="border-white/10 bg-zinc-950 sm:max-w-md shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold tracking-tight">
              Solicitar acesso ao Harmonia
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
              As APIs do Google e Spotify em modo de desenvolvimento exigem
              liberação manual de e-mails. Preencha abaixo para testar a
              instância hospedada.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(onSubmit)(e);
            }}
            className="space-y-4 pt-2"
          >
            <div className="space-y-1.5">
              <Label htmlFor="nome" className="text-xs">
                Nome completo
              </Label>
              <Input
                id="nome"
                type="text"
                placeholder="Ex: Thiago Gritti"
                autoComplete="name"
                className="h-9 text-sm bg-zinc-900/70 border-white/10"
                {...register("name")}
                disabled={isSubmitting}
              />
              {errors.name && (
                <p className="text-xs text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs">
                E-mail da conta Spotify / Google
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="voce@exemplo.com"
                autoComplete="email"
                className="h-9 text-sm bg-zinc-900/70 border-white/10"
                {...register("email")}
                disabled={isSubmitting}
              />
              {errors.email && (
                <p className="text-xs text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="motivo" className="text-xs">
                Como pretende usar o Harmonia?
              </Label>
              <Input
                id="motivo"
                type="text"
                placeholder="Ex: Migrar minhas playlists / estudar a arquitetura"
                className="h-9 text-sm bg-zinc-900/70 border-white/10"
                {...register("reason")}
                disabled={isSubmitting}
              />
              {errors.reason && (
                <p className="text-xs text-destructive">
                  {errors.reason.message}
                </p>
              )}
            </div>
            {errors.root && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errors.root.message}</AlertDescription>
              </Alert>
            )}
            <DialogFooter className="pt-2">
              <Button
                type="submit"
                className="w-full h-9 rounded-full text-xs font-semibold bg-harmonia-lime text-harmonia-green hover:bg-harmonia-lime/90 transition-all shadow-[0_0_16px_rgba(217,242,122,0.22)]"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                    Enviando solicitação...
                  </>
                ) : (
                  "Enviar solicitação de acesso"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <main className="relative z-10 flex-1">
        {/* =========================================================
            SLIDE 00 — FULL-SCREEN EDITORIAL HERO (#hero)
           ========================================================= */}
        <section
          id="hero"
          className="relative flex min-h-screen w-full flex-col justify-between border-b border-white/[0.08] pt-24 pb-8"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-[620px] bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(34,197,94,0.13),transparent_70%)]"
          />

          <div />

          <div className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: -14 }}
              animate={
                activeSection === "hero"
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: -14 }
              }
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="mb-7 inline-flex items-center gap-2 rounded-full border border-harmonia-lime/25 bg-harmonia-green/40 px-3.5 py-1 text-xs text-zinc-200 backdrop-blur-md shadow-[0_0_16px_rgba(217,242,122,0.12)]"
            >
              <HarmoniaMark className="h-3 w-auto text-harmonia-lime" />
              <span>Open Source &amp; Self-Hosted</span>
            </motion.div>

            <HeroAnimatedHeadline active={activeSection === "hero"} />

            <motion.p
              initial={{ opacity: 0, y: 18, filter: "blur(4px)" }}
              animate={
                activeSection === "hero"
                  ? { opacity: 1, y: 0, filter: "blur(0px)" }
                  : { opacity: 0, y: 18, filter: "blur(4px)" }
              }
              transition={{
                duration: 0.6,
                delay: activeSection === "hero" ? 1.35 : 0,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg"
            >
              Vídeos com títulos poluídos, gravações ao vivo e remixes raros
              enganam conversores comuns. O Harmonia limpa o ruído, calcula o
              score de confiança de cada faixa e deixa você resolver conflitos
              em um clique.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={
                activeSection === "hero"
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 18 }
              }
              transition={{
                duration: 0.55,
                delay: activeSection === "hero" ? 1.52 : 0,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mt-9 flex flex-wrap items-center justify-center gap-3.5"
            >
              <Button
                size="lg"
                className="h-11 rounded-full px-6 text-sm font-semibold bg-harmonia-lime text-harmonia-green hover:bg-harmonia-lime/90 transition-all shadow-[0_0_22px_rgba(217,242,122,0.28)] active:scale-95"
                onClick={() => glideToSection("palco")}
              >
                Ver demonstração
                <ArrowDown className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-11 rounded-full border-white/15 bg-zinc-900/60 px-6 text-sm font-medium hover:bg-zinc-800/80"
                onClick={() => setOpen(true)}
              >
                Solicitar acesso
              </Button>
            </motion.div>

            <div className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-2.5 sm:grid-cols-4">
              {[
                { label: "Score Automático", val: "Threshold >= 80%" },
                { label: "Fila em Background", val: "BullMQ + Redis" },
                { label: "Segurança OAuth2", val: "AES-256-GCM" },
                { label: "Auto-Hospedável", val: "Docker Compose" },
              ].map((stat, idx) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: -22, filter: "blur(4px)" }}
                  animate={
                    activeSection === "hero"
                      ? { opacity: 1, y: 0, filter: "blur(0px)" }
                      : { opacity: 0, y: -22, filter: "blur(4px)" }
                  }
                  transition={{
                    duration: 0.45,
                    delay: activeSection === "hero" ? 1.65 + idx * 0.08 : 0,
                    ease: [0.42, 0, 0.2, 1],
                  }}
                  whileHover={{ y: -3 }}
                  className="rounded-2xl border border-white/[0.07] bg-zinc-950/75 px-3.5 py-2.5 text-left backdrop-blur-md"
                >
                  <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    {stat.label}
                  </div>
                  <div className="mt-0.5 text-xs font-semibold text-foreground">
                    {stat.val}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <StageItem
            active={activeSection === "hero"}
            step={3}
            className="relative z-10 mx-auto flex flex-col items-center"
          >
            <button
              type="button"
              onClick={() => glideToSection("palco")}
              aria-label="Rolar para próxima seção"
              className="group flex flex-col items-center gap-1 text-muted-foreground/50 hover:text-foreground transition-colors"
            >
              <span className="text-[11px] tracking-wide">Role</span>
              <ChevronDown className="h-4 w-4 animate-bounce" />
            </button>
          </StageItem>
        </section>

        {/* =========================================================
            SLIDE 01 — FULL-SCREEN INTERACTIVE STAGE (#palco)
           ========================================================= */}
        <section
          id="palco"
          className="relative flex min-h-screen w-full flex-col justify-between border-b border-white/[0.08] pt-20 pb-6"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_50%_50%,rgba(56,189,248,0.06),transparent_70%)]"
          />

          <div className="relative z-10 my-auto mx-auto w-full max-w-5xl px-4 sm:px-6">
            <StageItem active={activeSection === "palco"} step={0}>
              <div className="mb-6 text-center">
                <span className="font-mono text-[11px] uppercase tracking-widest text-primary">
                  Comparativo
                </span>
                <div className="mt-1">
                  <AnimatedSectionHeading
                    active={activeSection === "palco"}
                    normalText="A mesma playlist, dois resultados"
                    dropAccentText="muito diferentes."
                    className="text-2xl font-semibold tracking-tight sm:text-4xl"
                  />
                </div>
                <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
                  Arraste o divisor para comparar o que um conversor comum faz
                  com títulos poluídos e o que o Harmonia entrega.
                </p>
              </div>
            </StageItem>

            <StageItem active={activeSection === "palco"} step={1}>
              <ComparisonSlider active={activeSection === "palco"} />
            </StageItem>
          </div>

          <StageItem
            active={activeSection === "palco"}
            step={2}
            className="relative z-10 mx-auto flex flex-col items-center pt-2"
          >
            <button
              type="button"
              onClick={() => glideToSection("jornada")}
              aria-label="Rolar para Como funciona"
              className="group flex flex-col items-center gap-1 text-muted-foreground/50 hover:text-foreground transition-colors"
            >
              <span className="text-[11px] tracking-wide">Como funciona</span>
              <ChevronDown className="h-4 w-4" />
            </button>
          </StageItem>
        </section>

        {/* =========================================================
            SLIDE 02 — FULL-SCREEN STEP-BY-STEP WALKTHROUGH (#jornada)
           ========================================================= */}
        <section
          id="jornada"
          className="relative flex min-h-screen w-full flex-col justify-between border-b border-white/[0.08] pt-20 pb-6"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_45%_at_70%_50%,rgba(34,197,94,0.07),transparent_70%)]"
          />

          <div className="relative z-10 my-auto mx-auto w-full max-w-6xl px-4 sm:px-6">
            <StageItem active={activeSection === "jornada"} step={0}>
              <div className="max-w-2xl space-y-2">
                <span className="font-mono text-[11px] uppercase tracking-widest text-primary">
                  Como Funciona
                </span>
                <AnimatedSectionHeading
                  active={activeSection === "jornada"}
                  normalText="Três estágios."
                  dropAccentText="Zero dor de cabeça."
                  className="text-3xl font-semibold tracking-tight sm:text-5xl"
                />
                <p className="text-sm text-muted-foreground sm:text-base">
                  Clique em cada etapa abaixo para inspecionar como o Harmonia
                  conduz seus dados do YouTube até o Spotify.
                </p>
              </div>
            </StageItem>

            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
              <StageItem
                active={activeSection === "jornada"}
                step={1}
                className="lg:col-span-6 space-y-3"
              >
                {JOURNEY_STEPS.map((item, idx) => {
                  const isActive = activeJourneyStep === idx;
                  return (
                    <button
                      key={item.step}
                      type="button"
                      onClick={() => setActiveJourneyStep(idx)}
                      className={`relative w-full text-left rounded-2xl border p-5 transition-all duration-300 ${
                        isActive
                          ? "card-sculpted border-primary/40"
                          : "border-white/[0.06] bg-zinc-950/40 hover:border-white/15 hover:bg-zinc-900/40 opacity-75 hover:opacity-100"
                      }`}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="journeyActiveBar"
                          className="absolute left-0 top-4 bottom-4 w-1 rounded-r-full bg-primary"
                          transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 30,
                          }}
                        />
                      )}
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`flex h-6 w-6 items-center justify-center rounded-full font-mono text-xs font-bold transition-colors ${
                              isActive
                                ? "bg-primary text-primary-foreground"
                                : "bg-white/[0.06] text-muted-foreground"
                            }`}
                          >
                            {item.step}
                          </span>
                          <span className="font-mono text-xs uppercase tracking-wider text-primary">
                            {item.tag}
                          </span>
                        </div>
                        <span className="font-mono text-[11px] text-muted-foreground">
                          {item.codeLabel}
                        </span>
                      </div>
                      <h3 className="text-base font-semibold text-foreground">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                        {item.description}
                      </p>
                    </button>
                  );
                })}
              </StageItem>

              <StageItem
                active={activeSection === "jornada"}
                step={2}
                className="lg:col-span-6"
              >
                <div className="card-sculpted relative overflow-hidden rounded-3xl p-6 sm:p-7 min-h-[340px] flex flex-col justify-between bg-grid-subtle">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                      <span className="font-mono text-xs text-foreground">
                        {JOURNEY_STEPS[activeJourneyStep].codeLabel}
                      </span>
                    </div>
                    <span className="rounded-full border border-white/10 bg-zinc-900 px-2.5 py-0.5 font-mono text-[11px] text-muted-foreground">
                      Etapa {activeJourneyStep + 1} de 3
                    </span>
                  </div>

                  <AnimatePresence mode="wait">
                    {activeJourneyStep === 0 && (
                      <motion.div
                        key="step-0"
                        initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="my-auto py-5 space-y-4"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <motion.div
                            initial={{ opacity: 0, y: -24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              delay: 0.06,
                              duration: 0.35,
                              ease: [0.42, 0, 0.2, 1],
                            }}
                            className="rounded-2xl border border-red-500/25 bg-red-500/[0.06] p-4 space-y-1.5"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-xs text-red-300">
                                Google OAuth 2.0
                              </span>
                              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                            </div>
                            <p className="text-xs font-medium text-foreground">
                              Escopo: youtube.readonly
                            </p>
                            <p className="font-mono text-[11px] text-muted-foreground">
                              Leitura de playlists e itens
                            </p>
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, y: -24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              delay: 0.14,
                              duration: 0.35,
                              ease: [0.42, 0, 0.2, 1],
                            }}
                            className="rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.06] p-4 space-y-1.5"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-xs text-emerald-300">
                                Spotify OAuth 2.0
                              </span>
                              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                            </div>
                            <p className="text-xs font-medium text-foreground">
                              Escopo: playlist-modify
                            </p>
                            <p className="font-mono text-[11px] text-muted-foreground">
                              Criação e adição de URIs
                            </p>
                          </motion.div>
                        </div>

                        <motion.div
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.22, duration: 0.35 }}
                          className="flex items-center justify-between rounded-2xl border border-white/10 bg-zinc-950/90 p-4"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 border border-primary/30 text-primary">
                              <KeyRound className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-foreground">
                                Tokens Criptografados em Repouso
                              </p>
                              <p className="font-mono text-[11px] text-muted-foreground">
                                AES-256-GCM · PostgreSQL ServiceConnection
                              </p>
                            </div>
                          </div>
                          <ShieldCheck className="h-5 w-5 text-primary" />
                        </motion.div>
                      </motion.div>
                    )}

                    {activeJourneyStep === 1 && (
                      <motion.div
                        key="step-1"
                        initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="my-auto py-5 space-y-3 font-mono text-xs"
                      >
                        <div className="rounded-2xl border border-white/10 bg-zinc-950/90 p-3.5 space-y-1.5">
                          <span className="text-[10px] uppercase text-muted-foreground">
                            1. Entrada do YouTube Data API
                          </span>
                          <p className="text-foreground">
                            &quot;The Cure - A Forest{" "}
                            <span className="text-red-400 line-through">
                              (Official Video 1980) [HD]
                            </span>
                            &quot;
                          </p>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-zinc-950/90 p-3.5 space-y-2">
                          <span className="text-[10px] uppercase text-muted-foreground">
                            2. Ponderação de Similaridade
                          </span>
                          <div className="grid grid-cols-3 gap-2">
                            {[
                              { label: "Título", val: "1.00" },
                              { label: "Artista", val: "1.00" },
                              { label: "Duração", val: "0.94" },
                            ].map((metric, idx) => (
                              <motion.div
                                key={metric.label}
                                initial={{ opacity: 0, y: -16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                  delay: 0.08 + idx * 0.07,
                                  duration: 0.3,
                                }}
                                className="rounded-lg bg-zinc-900 p-2 text-center"
                              >
                                <div className="text-[10px] text-muted-foreground">
                                  {metric.label}
                                </div>
                                <div className="text-emerald-400 font-bold">
                                  {metric.val}
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        <motion.div
                          initial={{ opacity: 0, scale: 0.96 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.25, duration: 0.3 }}
                          className="flex items-center justify-between rounded-2xl border border-primary/30 bg-primary/10 px-4 py-2.5"
                        >
                          <span className="text-foreground">
                            Resultado: Match Automático
                          </span>
                          <span className="font-bold text-primary">
                            Score 97% (&ge; 80%)
                          </span>
                        </motion.div>
                      </motion.div>
                    )}

                    {activeJourneyStep === 2 && (
                      <motion.div
                        key="step-2"
                        initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="my-auto py-5 space-y-3 font-mono text-xs"
                      >
                        <div className="space-y-2 rounded-2xl border border-white/10 bg-zinc-950/90 p-4">
                          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                            <span>QUEUE: sync-playlist</span>
                            <span className="text-primary">CONCURRENCY: 2</span>
                          </div>
                          <div className="space-y-1.5 pt-2">
                            {[
                              {
                                text: "[Job #841] Fetch YouTube Items",
                                status: "DONE 140ms",
                                highlight: false,
                              },
                              {
                                text: "[Job #841] Resolve Spotify Candidates",
                                status: "DONE 620ms",
                                highlight: false,
                              },
                              {
                                text: "[Job #841] Push Batch URIs to Spotify",
                                status: "201 CREATED",
                                highlight: true,
                              },
                            ].map((job, idx) => (
                              <motion.div
                                key={job.text}
                                initial={{ opacity: 0, x: -14 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{
                                  delay: 0.06 + idx * 0.09,
                                  duration: 0.3,
                                }}
                                className={`flex items-center justify-between rounded-lg px-3 py-2 ${
                                  job.highlight
                                    ? "border border-primary/30 bg-primary/10 text-foreground"
                                    : "bg-zinc-900 text-zinc-300"
                                }`}
                              >
                                <span>{job.text}</span>
                                <span
                                  className={
                                    job.highlight
                                      ? "text-primary"
                                      : "text-emerald-400"
                                  }
                                >
                                  {job.status}
                                </span>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex items-center justify-between border-t border-white/10 pt-4">
                    <button
                      type="button"
                      onClick={() =>
                        setActiveJourneyStep((prev) => (prev + 2) % 3)
                      }
                      className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      ← Etapa anterior
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveJourneyStep((prev) => (prev + 1) % 3)
                      }
                      className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                    >
                      Próxima etapa →
                    </button>
                  </div>
                </div>
              </StageItem>
            </div>
          </div>

          <StageItem
            active={activeSection === "jornada"}
            step={3}
            className="relative z-10 mx-auto flex flex-col items-center pt-2"
          >
            <button
              type="button"
              onClick={() => glideToSection("arquitetura")}
              aria-label="Rolar para Arquitetura"
              className="group flex flex-col items-center gap-1 text-muted-foreground/50 hover:text-foreground transition-colors"
            >
              <span className="text-[11px] tracking-wide">Arquitetura</span>
              <ChevronDown className="h-4 w-4" />
            </button>
          </StageItem>
        </section>

        {/* =========================================================
            SLIDE 03 — FULL-SCREEN BENTO ARCHITECTURE (#arquitetura)
           ========================================================= */}
        <section
          id="arquitetura"
          className="relative flex min-h-screen w-full flex-col justify-between border-b border-white/[0.08] pt-20 pb-6"
        >
          <div className="relative z-10 my-auto mx-auto w-full max-w-6xl px-4 sm:px-6">
            <StageItem active={activeSection === "arquitetura"} step={0}>
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div className="max-w-2xl space-y-2">
                  <span className="font-mono text-[11px] uppercase tracking-widest text-primary">
                    Arquitetura &amp; Engenharia
                  </span>
                  <AnimatedSectionHeading
                    active={activeSection === "arquitetura"}
                    normalText="Construído como um produto real,"
                    dropAccentText="não apenas um script."
                  />
                </div>
                <Link
                  href="/docs/arquitetura"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Ler documentação de arquitetura
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </StageItem>

            <div className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-12">
              <StageItem
                active={activeSection === "arquitetura"}
                step={1}
                className="md:col-span-7 flex"
              >
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 24 }}
                  className="card-sculpted rounded-3xl p-5 sm:p-6 flex flex-col justify-between w-full"
                >
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-0.5 font-mono text-[10px] text-muted-foreground">
                      <SlidersHorizontal className="h-3 w-3 text-primary" />
                      <span>Score de Confiança &amp; Curadoria</span>
                    </div>
                    <h3 className="text-lg font-semibold tracking-tight sm:text-xl">
                      Você decide o que acontece quando o título é ambíguo.
                    </h3>
                    <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                      Outros conversores escolhem qualquer cover de karaokê
                      quando não encontram a música exata. O Harmonia separa
                      matches de alta precisão (&ge; 80%) daqueles que merecem
                      sua revisão.
                    </p>
                  </div>

                  <div className="mt-5 rounded-2xl border border-white/[0.07] bg-zinc-950/80 p-3.5 space-y-2">
                    <div className="flex items-center justify-between font-mono text-[11px]">
                      <span className="text-amber-300">
                        &lt; 80%: Fila de Revisão Manual
                      </span>
                      <span className="text-emerald-400">
                        &ge; 80%: Sync Automático
                      </span>
                    </div>
                    <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-zinc-900 flex">
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={
                          activeSection === "arquitetura"
                            ? { width: "78%" }
                            : { width: "0%" }
                        }
                        transition={{ duration: 0.7, delay: 0.25, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-red-500/40 via-amber-500/50 to-amber-400/70"
                      />
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={
                          activeSection === "arquitetura"
                            ? { width: "22%" }
                            : { width: "0%" }
                        }
                        transition={{ duration: 0.5, delay: 0.65, ease: "easeOut" }}
                        className="h-full bg-primary"
                      />
                    </div>
                  </div>
                </motion.div>
              </StageItem>

              <StageItem
                active={activeSection === "arquitetura"}
                step={1}
                className="md:col-span-5 flex"
              >
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 24 }}
                  className="card-sculpted rounded-3xl p-5 sm:p-6 flex flex-col justify-between w-full"
                >
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-0.5 font-mono text-[10px] text-muted-foreground">
                      <Layers className="h-3 w-3 text-primary" />
                      <span>BullMQ + Redis Workers</span>
                    </div>
                    <h3 className="text-lg font-semibold tracking-tight sm:text-xl">
                      Zero timeouts em playlists grandes.
                    </h3>
                    <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                      A importação e a escrita no Spotify rodam em workers
                      assíncronos em background, respeitando os limites das
                      APIs.
                    </p>
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-2 font-mono text-[11px]">
                    <div className="rounded-xl border border-white/[0.06] bg-zinc-950/70 p-2.5 text-center">
                      <div className="text-muted-foreground">1. HTTP</div>
                      <div className="mt-0.5 text-foreground">202 OK</div>
                    </div>
                    <div className="rounded-xl border border-white/[0.06] bg-zinc-950/70 p-2.5 text-center">
                      <div className="text-muted-foreground">2. Redis</div>
                      <div className="mt-0.5 text-amber-300">Job Batch</div>
                    </div>
                    <div className="rounded-xl border border-primary/30 bg-primary/10 p-2.5 text-center">
                      <div className="text-foreground">3. Spotify</div>
                      <div className="mt-0.5 text-primary">Synced</div>
                    </div>
                  </div>
                </motion.div>
              </StageItem>

              <StageItem
                active={activeSection === "arquitetura"}
                step={2}
                className="md:col-span-5 flex"
              >
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 24 }}
                  className="card-sculpted rounded-3xl p-5 sm:p-6 flex flex-col justify-between w-full"
                >
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-0.5 font-mono text-[10px] text-muted-foreground">
                      <Lock className="h-3 w-3 text-primary" />
                      <span>Privacidade &amp; OAuth 2.0</span>
                    </div>
                    <h3 className="text-lg font-semibold tracking-tight sm:text-xl">
                      Tokens criptografados sob seu controle.
                    </h3>
                    <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                      Autenticação oficial com escopos mínimos, tokens
                      protegidos no PostgreSQL e revogação instantânea no
                      painel.
                    </p>
                  </div>

                  <div className="mt-5 rounded-2xl border border-white/[0.07] bg-zinc-950/80 px-4 py-3 font-mono text-xs flex items-center justify-between">
                    <span className="text-muted-foreground">Criptografia</span>
                    <span className="text-emerald-400">
                      AES-256 · OAuth2 Popup
                    </span>
                  </div>
                </motion.div>
              </StageItem>

              <StageItem
                active={activeSection === "arquitetura"}
                step={2}
                className="md:col-span-7 flex"
              >
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 24 }}
                  className="card-sculpted rounded-3xl p-5 sm:p-6 flex flex-col justify-between w-full"
                >
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-0.5 font-mono text-[10px] text-muted-foreground">
                      <GitBranch className="h-3 w-3 text-primary" />
                      <span>Clean Architecture &amp; Turborepo</span>
                    </div>
                    <h3 className="text-lg font-semibold tracking-tight sm:text-xl">
                      Arquitetura Limpa, SOLID e Ports &amp; Adapters.
                    </h3>
                    <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                      Domínio isolado, contratos compartilhados com Zod em{" "}
                      <code className="rounded bg-white/[0.07] px-1.5 py-0.5 font-mono text-xs text-foreground">
                        @harmonia/shared
                      </code>{" "}
                      e persistência desacoplada.
                    </p>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4 font-mono text-xs">
                    {[
                      { pkg: "apps/api", desc: "Domínio & Workers" },
                      { pkg: "apps/web", desc: "App Next.js 16" },
                      { pkg: "packages/shared", desc: "Zod Schemas" },
                      { pkg: "packages/database", desc: "Prisma + PG" },
                    ].map((item) => (
                      <div
                        key={item.pkg}
                        className="rounded-xl border border-white/[0.07] bg-zinc-950/80 p-2.5"
                      >
                        <div className="text-[10px] text-primary">
                          {item.pkg}
                        </div>
                        <div className="mt-0.5 font-sans text-xs font-medium text-foreground">
                          {item.desc}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </StageItem>
            </div>
          </div>

          <StageItem
            active={activeSection === "arquitetura"}
            step={3}
            className="relative z-10 mx-auto flex flex-col items-center pt-2"
          >
            <button
              type="button"
              onClick={() => glideToSection("self-host")}
              aria-label="Rolar para Self-Host"
              className="group flex flex-col items-center gap-1 text-muted-foreground/50 hover:text-foreground transition-colors"
            >
              <span className="text-[11px] tracking-wide">Self-Host</span>
              <ChevronDown className="h-4 w-4" />
            </button>
          </StageItem>
        </section>

        {/* =========================================================
            SLIDE 04 — FULL-SCREEN SELF-HOST + COMMUNITY + FOOTER (#self-host)
           ========================================================= */}
        <section
          id="self-host"
          className="relative flex min-h-screen w-full flex-col justify-between pt-22"
        >
          <div className="relative z-10 my-auto mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 space-y-10">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
              <StageItem
                active={activeSection === "self-host"}
                step={0}
                className="space-y-5 lg:col-span-5"
              >
                <span className="font-mono text-[11px] uppercase tracking-widest text-primary">
                  Self-Hosted em 5 Minutos
                </span>
                <AnimatedSectionHeading
                  active={activeSection === "self-host"}
                  normalText="Rode sua própria instância com"
                  dropAccentText="Docker Compose."
                />
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Não quer esperar na fila da instância hospedada? Com um único
                  comando você sobe o banco PostgreSQL, o Redis, a API com os
                  workers e o painel web na sua própria máquina.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <Button
                    asChild
                    className="h-10 rounded-full px-5 text-xs font-medium bg-foreground text-background hover:bg-foreground/90"
                  >
                    <Link href="/docs/setup">
                      <FileCode2 className="mr-2 h-3.5 w-3.5" />
                      Ver guia completo de Setup
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-10 rounded-full border-white/15 bg-zinc-900/60 px-5 text-xs font-medium"
                    onClick={() => setOpen(true)}
                  >
                    Pedir acesso ao deploy oficial
                  </Button>
                </div>
              </StageItem>

              <StageItem
                active={activeSection === "self-host"}
                step={1}
                className="lg:col-span-7"
              >
                <div className="card-sculpted overflow-hidden rounded-3xl">
                  <div className="flex items-center justify-between border-b border-white/[0.08] bg-zinc-950/80 px-4 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <div className="flex items-center gap-1.5 mr-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
                        <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
                        <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
                      </div>
                      {(["docker", "local"] as const).map((tab) => {
                        const isTabActive = terminalTab === tab;
                        return (
                          <button
                            key={tab}
                            type="button"
                            onClick={() => setTerminalTab(tab)}
                            className={`relative rounded-lg px-2.5 py-1 font-mono text-xs transition-colors ${
                              isTabActive
                                ? "text-foreground"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            {isTabActive && (
                              <motion.span
                                layoutId="terminalActiveTabPill"
                                className="absolute inset-0 rounded-lg bg-white/10"
                                transition={{
                                  type: "spring",
                                  stiffness: 380,
                                  damping: 30,
                                }}
                              />
                            )}
                            <span className="relative z-10">
                              {tab === "docker"
                                ? "docker-compose"
                                : "turborepo-dev"}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={handleCopyCode}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {copied ? (
                        <>
                          <Check className="h-3 w-3 text-primary" />
                          Copiado
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          Copiar
                        </>
                      )}
                    </button>
                  </div>

                  <div className="overflow-x-auto p-5 font-mono text-xs leading-6 text-zinc-200 bg-zinc-950/50 min-h-[136px]">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={terminalTab}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        className="space-y-1"
                      >
                        {TERMINAL_COMMANDS[terminalTab].map((line, idx) => (
                          <motion.div
                            key={line}
                            initial={{ opacity: 0, x: -10, filter: "blur(3px)" }}
                            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                            transition={{
                              delay: idx * 0.07,
                              duration: 0.28,
                              ease: [0.22, 1, 0.36, 1],
                            }}
                            className="flex items-center gap-2.5"
                          >
                            <span className="select-none text-primary/70">$</span>
                            <code>{line}</code>
                          </motion.div>
                        ))}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  <div className="border-t border-white/[0.07] bg-zinc-950/90 px-5 py-3">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <span className="font-mono text-[11px] text-muted-foreground">
                        Stack principal:
                      </span>
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <StackIcon
                            name="nodejs"
                            variant="light"
                            style={{ height: "14px", width: "14px" }}
                          />
                          <span>Node.js</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <StackIcon
                            name="typescript"
                            variant="light"
                            style={{ height: "14px", width: "14px" }}
                          />
                          <span>TypeScript</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <StackIcon
                            name="nextjs"
                            variant="light"
                            style={{ height: "14px", width: "14px" }}
                          />
                          <span>Next.js</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <StackIcon
                            name="postgresql"
                            variant="light"
                            style={{ height: "14px", width: "14px" }}
                          />
                          <span>PostgreSQL</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <StackIcon
                            name="redis"
                            variant="light"
                            style={{ height: "14px", width: "14px" }}
                          />
                          <span>Redis</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Image
                            width={14}
                            height={14}
                            src="/bullmq-logo.png"
                            alt="BullMQ"
                          />
                          <span>BullMQ</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </StageItem>
            </div>

            <StageItem active={activeSection === "self-host"} step={2}>
              <div className="card-sculpted rounded-3xl p-6 sm:p-8 flex flex-col justify-between gap-6 md:flex-row md:items-center">
                <div className="space-y-1.5">
                  <span className="font-mono text-[11px] uppercase tracking-widest text-primary">
                    100% Open Source · Licença MIT
                  </span>
                  <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">
                    Feito com café, código limpo e paixão por música.
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Explore o repositório no GitHub, contribua ou apoie a
                    manutenção do projeto.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <Button
                    asChild
                    variant="outline"
                    className="h-10 rounded-full border-white/15 bg-zinc-900/80 px-5 text-xs font-medium hover:bg-zinc-800"
                  >
                    <Link
                      href="https://github.com/thiagoDOTjpeg/harmonia.io"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Github className="mr-2 h-3.5 w-3.5" />
                      Dar Star no GitHub
                    </Link>
                  </Button>
                  <Button
                    asChild
                    className="h-10 rounded-full bg-harmonia-lime text-harmonia-green hover:bg-harmonia-lime/90 font-semibold px-5 text-xs shadow-[0_0_16px_rgba(217,242,122,0.22)]"
                  >
                    <Link
                      href="https://buymeacoffee.com/harmoniaio"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Coffee className="mr-2 h-3.5 w-3.5" />
                      Buy Me a Coffee
                    </Link>
                  </Button>
                </div>
              </div>
            </StageItem>
          </div>

          <Footer />
        </section>
      </main>
    </div>
  );
}
