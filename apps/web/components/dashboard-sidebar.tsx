"use client";

import { useStartTour } from "@/components/onboarding-tour";
import { useAuthContext } from "@/context/AuthContext";
import { useUserSummary } from "@/hooks/queries";
import { useUser } from "@/hooks/use-user";
import { cn } from "@/lib/utils";
import { HarmoniaLogo, HarmoniaMark } from "@harmonia/ui";
import { Button } from "@harmonia/ui/components/button";
import {
  Activity,
  CheckCircle2,
  Coffee,
  ExternalLink,
  Github,
  Home,
  ListMusic,
  LogOut,
  Music2,
  Plus,
  Radio,
  Settings,
  ShieldCheck,
  Sparkles,
  Video,
  X,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface DashboardSidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function DashboardSidebar({
  mobileOpen = false,
  onCloseMobile,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuthContext();
  const { user } = useUser();
  const { data: summary } = useUserSummary();
  const startTour = useStartTour();

  const handleLinkClick = () => {
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const userInitial = user?.name?.charAt(0)?.toUpperCase() ?? "?";
  const userFirstName = user?.name ? user.name.split(" ")[0] : "Usuário";

  const isYtConnected = summary?.is_youtube_connected ?? false;
  const isSpConnected = summary?.is_spotify_connected ?? false;

  return (
    <>
      {mobileOpen && (
        <div
          role="presentation"
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs md:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={cn(
          "w-60 border-r border-border/80 bg-card/95 backdrop-blur-md flex flex-col z-50",
          "md:static md:flex md:translate-x-0 md:min-h-[calc(100vh-3.5rem)]",
          "fixed inset-y-0 left-0 transition-transform duration-200 ease-in-out shrink-0",
          mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Mobile Header */}
        <div className="flex h-14 items-center justify-between border-b border-border/80 px-4 md:hidden">
          <Link
            href="/dashboard"
            onClick={handleLinkClick}
            className="flex items-center gap-2"
          >
            <HarmoniaMark className="h-5 w-auto text-harmonia-lime" />
            <span className="font-bold text-sm tracking-tight text-foreground">
              harmonia console
            </span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-white"
            onClick={onCloseMobile}
            aria-label="Fechar menu"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Enterprise Navigation Rail */}
        <div className="flex-1 p-3 space-y-5 overflow-y-auto" data-tour="sidebar-nav">
          {/* Section 1: CORE */}
          <div className="space-y-1">
            <div className="px-2.5 pb-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground/60">
              Core Operations
            </div>
            <Link
              href="/dashboard"
              onClick={handleLinkClick}
              className={cn(
                "group flex items-center gap-2.5 px-2.5 py-2 rounded-md text-xs font-medium transition-all duration-150",
                pathname === "/dashboard"
                  ? "bg-harmonia-lime text-harmonia-green font-bold shadow-xs"
                  : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
              )}
            >
              <Home className="h-4 w-4 shrink-0" />
              <span className="flex-1 truncate">Visão Geral</span>
            </Link>

            <Link
              href="/dashboard/playlists"
              onClick={handleLinkClick}
              className={cn(
                "group flex items-center gap-2.5 px-2.5 py-2 rounded-md text-xs font-medium transition-all duration-150",
                pathname?.startsWith("/dashboard/playlists")
                  ? "bg-harmonia-lime text-harmonia-green font-bold shadow-xs"
                  : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
              )}
            >
              <ListMusic className="h-4 w-4 shrink-0" />
              <span className="flex-1 truncate">Minhas Playlists</span>
              {typeof summary?.total_playlists === "number" && (
                <span
                  className={cn(
                    "text-[10px] font-mono px-1.5 py-0.2 rounded-full",
                    pathname?.startsWith("/dashboard/playlists")
                      ? "bg-harmonia-green/20 text-harmonia-green font-bold"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {summary.total_playlists}
                </span>
              )}
            </Link>

            <Link
              href="/dashboard/nova"
              onClick={handleLinkClick}
              className={cn(
                "group flex items-center gap-2.5 px-2.5 py-2 rounded-md text-xs font-medium transition-all duration-150",
                pathname === "/dashboard/nova"
                  ? "bg-harmonia-lime text-harmonia-green font-bold shadow-xs"
                  : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
              )}
            >
              <Plus className="h-4 w-4 shrink-0 text-harmonia-lime" />
              <span className="flex-1 truncate font-semibold text-foreground">
                Nova Sincronização
              </span>
            </Link>
          </div>

          {/* Section 2: PIPELINE & INTEGRATIONS */}
          <div className="space-y-1">
            <div className="px-2.5 pb-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground/60">
              Pipeline de Conexões
            </div>

            <Link
              href="/dashboard/configuracoes"
              onClick={handleLinkClick}
              className="flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors group"
            >
              <div className="flex items-center gap-2">
                <Video className="h-3.5 w-3.5 text-red-400" />
                <span>YouTube API</span>
              </div>
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  isYtConnected ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" : "bg-amber-400"
                )}
              />
            </Link>

            <Link
              href="/dashboard/configuracoes"
              onClick={handleLinkClick}
              className="flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors group"
            >
              <div className="flex items-center gap-2">
                <Music2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>Spotify Web API</span>
              </div>
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  isSpConnected ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" : "bg-amber-400"
                )}
              />
            </Link>
          </div>

          {/* Section 3: ADMINISTRATION */}
          <div className="space-y-1">
            <div className="px-2.5 pb-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground/60">
              Administração
            </div>

            <Link
              href="/dashboard/configuracoes"
              onClick={handleLinkClick}
              className={cn(
                "group flex items-center gap-2.5 px-2.5 py-2 rounded-md text-xs font-medium transition-all duration-150",
                pathname === "/dashboard/configuracoes"
                  ? "bg-harmonia-lime text-harmonia-green font-bold shadow-xs"
                  : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
              )}
            >
              <Settings className="h-4 w-4 shrink-0" />
              <span className="flex-1 truncate">Configurações</span>
            </Link>

            <button
              type="button"
              onClick={() => {
                handleLinkClick();
                startTour();
              }}
              className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors w-full text-left cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5 text-harmonia-lime" />
              <span className="flex-1">Tour Guiado</span>
            </button>
          </div>
        </div>

        {/* Footer: Live Engine Telemetry Card + User */}
        <div className="p-3 space-y-2 border-t border-border/70 mt-auto bg-muted/20">
          {/* Cloudflare-style Telemetry Card */}
          <div className="rounded-lg border border-border/80 bg-background/60 p-2.5 space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-mono text-muted-foreground">Engine Status</span>
              <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live
              </span>
            </div>
            <div className="text-[10px] font-mono text-zinc-400 space-y-0.5">
              <div className="flex justify-between">
                <span>Workers BullMQ:</span>
                <span className="text-foreground">2 ativos</span>
              </div>
              <div className="flex justify-between">
                <span>Latência Média:</span>
                <span className="text-foreground">~118ms</span>
              </div>
            </div>
          </div>

          {/* User profile line */}
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-md hover:bg-muted/40 transition-colors">
            <div className="h-7 w-7 rounded-full bg-harmonia-lime/20 border border-harmonia-lime/30 flex items-center justify-center shrink-0">
              <span className="text-[11px] font-bold text-harmonia-lime">
                {userInitial}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-foreground truncate">
                {userFirstName}
              </p>
              <p className="text-[10px] text-muted-foreground truncate font-mono">
                {user?.email ?? ""}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
              onClick={logout}
              title="Sair"
            >
              <LogOut className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
