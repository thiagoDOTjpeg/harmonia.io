"use client";

import { HarmoniaLogo, HarmoniaMark } from "@harmonia/ui";
import { Button } from "@harmonia/ui/components/button";
import { BookOpen, ExternalLink, Github, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex h-14 items-center justify-between px-4 sm:px-6">
        {/* Brand + Console Chip */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-90 transition-opacity"
            aria-label="Harmonia Início"
          >
            <HarmoniaLogo className="h-6 w-auto text-harmonia-lime" />
          </Link>
          <span className="hidden sm:inline-block text-zinc-600 font-mono text-xs">/</span>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-muted text-[11px] font-mono font-medium text-muted-foreground border border-border/60">
            <span className="h-1.5 w-1.5 rounded-full bg-harmonia-lime" />
            Console
          </span>
        </div>

        {/* Right side: Telemetry status + Docs + Auth switch */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Operational Status indicator (Cloudflare style) */}
          <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span>All Systems Operational</span>
          </div>

          <Link
            href="https://github.com/thiagoDOTjpeg/harmonia"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <Github className="h-3.5 w-3.5" />
            <span>GitHub</span>
          </Link>

          {isLoginPage ? (
            <Button
              asChild
              variant="outline"
              size="sm"
              className="text-xs border-border/80 hover:border-harmonia-lime/50 h-8"
            >
              <Link href="/cadastro">Criar Conta</Link>
            </Button>
          ) : (
            <Button
              asChild
              variant="outline"
              size="sm"
              className="text-xs border-border/80 hover:border-harmonia-lime/50 h-8"
            >
              <Link href="/login">Entrar</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
