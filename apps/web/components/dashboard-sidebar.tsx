"use client";

import { useStartTour } from "@/components/onboarding-tour";
import { useAuthContext } from "@/context/AuthContext";
import { useUser } from "@/hooks/use-user";
import { cn } from "@/lib/utils";
import { Button, HarmoniaLogo } from "@harmonia/ui";
import {
  Coffee,
  HelpCircle,
  Home,
  LogOut,
  Music2,
  Plus,
  Settings,
  Sparkles,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "Visão Geral", href: "/dashboard", icon: Home },
  { name: "Minhas Playlists", href: "/dashboard/playlists", icon: Music2 },
  { name: "Nova Sincronização", href: "/dashboard/nova", icon: Plus },
  { name: "Configurações", href: "/dashboard/configuracoes", icon: Settings },
];

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
  const startTour = useStartTour();

  const handleLogout = () => {
    logout();
  };

  const handleLinkClick = () => {
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const userInitial = user?.name?.charAt(0)?.toUpperCase() ?? "?";

  return (
    <>
      {mobileOpen && (
        <div
          role="presentation"
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={cn(
          "w-64 border-r border-border bg-card/95 backdrop-blur-md flex flex-col z-50",
          "md:static md:flex md:translate-x-0 md:min-h-screen",
          "fixed inset-y-0 left-0 transition-transform duration-200 ease-in-out",
          mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-border/80 px-5 md:justify-center">
          <Link
            href="/dashboard"
            onClick={handleLinkClick}
            className="hover:opacity-90 transition-opacity flex items-center gap-2"
            aria-label="Harmonia Início"
          >
            <HarmoniaLogo className="h-6 w-auto text-harmonia-lime" />
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 md:hidden text-muted-foreground hover:text-white"
            onClick={onCloseMobile}
            aria-label="Fechar menu"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <nav
          data-tour="sidebar-nav"
          className="flex-1 p-4 space-y-1.5 overflow-y-auto"
        >
          <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
            Menu
          </div>
          {navigation.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname?.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={handleLinkClick}
                className={cn(
                  "group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                  isActive
                    ? "bg-harmonia-lime text-harmonia-green font-semibold shadow-sm"
                    : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                )}
              >
                <item.icon
                  className={cn(
                    "h-4.5 w-4.5 shrink-0 transition-transform group-hover:scale-105",
                    isActive ? "text-harmonia-green" : "text-muted-foreground group-hover:text-foreground"
                  )}
                />
                <span className="flex-1 truncate">{item.name}</span>
                {isActive && (
                  <span className="h-1.5 w-1.5 rounded-full bg-harmonia-green" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 space-y-2 border-t border-border/80 mt-auto bg-muted/20">
          <button
            type="button"
            onClick={() => {
              handleLinkClick();
              startTour();
            }}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors w-full text-left cursor-pointer group"
          >
            <Sparkles className="h-3.5 w-3.5 text-harmonia-lime group-hover:scale-110 transition-transform shrink-0" />
            <span className="flex-1">Tour Guiado</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-harmonia-lime/10 text-harmonia-lime font-mono">
              Ajuda
            </span>
          </button>

          <a
            href="https://buymeacoffee.com/harmoniaio"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
          >
            <Coffee className="h-3.5 w-3.5 text-amber-400 shrink-0" />
            <span>Apoiar Projeto</span>
          </a>

          <div className="flex items-center gap-3 px-3 py-2.5 border-t border-border/60 pt-3">
            <div className="h-8 w-8 rounded-full bg-harmonia-lime/20 border border-harmonia-lime/30 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-harmonia-lime">
                {userInitial}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-foreground truncate">
                {user?.name ?? "Usuário"}
              </p>
              <p className="text-[11px] text-muted-foreground truncate">
                {user?.email ?? ""}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              onClick={handleLogout}
              title="Sair"
              aria-label="Sair da conta"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
