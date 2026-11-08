"use client";

import { useStartTour } from "@/components/onboarding-tour";
import { useAuthContext } from "@/context/AuthContext";
import { useUserSummary } from "@/hooks/queries";
import { useUser } from "@/hooks/use-user";
import { HarmoniaLogo, HarmoniaMark } from "@harmonia/ui";
import { Button } from "@harmonia/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@harmonia/ui/components/dropdown-menu";
import {
  ChevronDown,
  ExternalLink,
  Github,
  LogOut,
  Menu,
  Plus,
  Search,
  Settings,
  Sparkles,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

interface ConsoleHeaderProps {
  onOpenMobileSidebar: () => void;
}

export function ConsoleHeader({ onOpenMobileSidebar }: ConsoleHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();
  const { logout } = useAuthContext();
  const { data: summary } = useUserSummary();
  const startTour = useStartTour();
  const [searchQuery, setSearchQuery] = useState("");

  const userInitial = user?.name?.charAt(0)?.toUpperCase() ?? "?";
  const userFirstName = user?.name ? user.name.split(" ")[0] : "Usuário";

  const isBothConnected =
    (summary?.is_youtube_connected ?? false) &&
    (summary?.is_spotify_connected ?? false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/dashboard/playlists?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-card/90 backdrop-blur-md">
      <div className="flex h-14 items-center justify-between px-3 sm:px-5 gap-3">
        {/* Left: Mobile Toggle + Logo + Workspace Selector */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 md:hidden text-muted-foreground hover:text-foreground shrink-0"
            onClick={onOpenMobileSidebar}
            aria-label="Abrir menu lateral"
          >
            <Menu className="h-4.5 w-4.5" />
          </Button>

          <Link
            href="/dashboard"
            className="flex items-center gap-2 shrink-0 hover:opacity-90 transition-opacity"
            aria-label="Harmonia Dashboard"
          >
            <HarmoniaMark className="h-5 w-auto text-harmonia-lime" />
            <span className="font-bold text-sm tracking-tight hidden sm:inline text-foreground">
              harmonia
            </span>
          </Link>

          <span className="hidden lg:inline text-zinc-700 font-mono text-sm">/</span>

          {/* Account / Workspace Switcher (Cloudflare style) */}
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-md bg-muted/40 border border-border/60 hover:bg-muted/70 transition-colors cursor-pointer text-xs">
            <span className="h-2 w-2 rounded-full bg-harmonia-lime" />
            <span className="font-semibold text-foreground truncate max-w-[140px]">
              {userFirstName}&apos;s Workspace
            </span>
            <span className="text-[10px] font-mono font-medium px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              CORE OSS
            </span>
            <ChevronDown className="h-3 w-3 text-muted-foreground ml-0.5" />
          </div>
        </div>

        {/* Center: Global Quick Command Search Bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <Search className="absolute left-3 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar playlists, faixas ou integrações... (Ctrl+K)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8.5 pl-8.5 pr-14 rounded-lg bg-background/80 border border-border/80 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-harmonia-lime/60 focus:ring-1 focus:ring-harmonia-lime/30 transition-all font-mono"
            />
            <span className="absolute right-2 px-1.5 py-0.5 rounded bg-muted text-[10px] font-mono text-muted-foreground border border-border/60 pointer-events-none">
              ⌘K
            </span>
          </form>
        </div>

        {/* Right: Operational Status Pill + Actions + Profile */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Edge telemetry status */}
          <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span>Motor Operacional</span>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={startTour}
            className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground hidden sm:flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5 text-harmonia-lime" />
            <span>Tour</span>
          </Button>

          <Button
            asChild
            size="sm"
            data-tour="quick-new-sync"
            className="h-8 px-3 text-xs bg-harmonia-lime text-harmonia-green hover:brightness-105 active:scale-95 font-semibold transition-all shadow-xs"
          >
            <Link href="/dashboard/nova">
              <Plus className="h-3.5 w-3.5 mr-1" />
              <span className="hidden sm:inline">Nova Sync</span>
              <span className="sm:hidden">Nova</span>
            </Link>
          </Button>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="h-8 w-8 rounded-full bg-harmonia-lime/20 border border-harmonia-lime/40 flex items-center justify-center text-xs font-bold text-harmonia-lime hover:scale-105 transition-transform cursor-pointer focus:outline-none"
              >
                {userInitial}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 mt-1">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-xs font-semibold leading-none text-foreground">
                    {user?.name ?? "Usuário"}
                  </p>
                  <p className="text-[11px] leading-none text-muted-foreground font-mono truncate">
                    {user?.email ?? ""}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard" className="cursor-pointer">
                  <User className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                  Visão Geral
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/configuracoes" className="cursor-pointer">
                  <Settings className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                  Configurações do Console
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="https://github.com/thiagoDOTjpeg/harmonia"
                  target="_blank"
                  className="cursor-pointer"
                >
                  <Github className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                  Repositório GitHub
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={logout}
                className="text-destructive focus:text-destructive cursor-pointer"
              >
                <LogOut className="mr-2 h-3.5 w-3.5" />
                Sair da Conta
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
