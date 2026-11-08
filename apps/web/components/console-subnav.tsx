"use client";

import { useUserSummary } from "@/hooks/queries";
import { cn } from "@/lib/utils";
import {
  ListMusic,
  Plus,
  Radio,
  Settings,
  Sparkles,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navTabs = [
  {
    name: "Visão Geral",
    href: "/dashboard",
    icon: Radio,
    badge: null,
  },
  {
    name: "Playlists Sincronizadas",
    href: "/dashboard/playlists",
    icon: ListMusic,
    badgeKey: "total_playlists" as const,
  },
  {
    name: "Nova Sincronização",
    href: "/dashboard/nova",
    icon: Plus,
    badge: null,
  },
  {
    name: "Configurações",
    href: "/dashboard/configuracoes",
    icon: Settings,
    badge: null,
  },
];

export function ConsoleSubnav() {
  const pathname = usePathname();
  const { data: summary } = useUserSummary();

  return (
    <div className="w-full border-b border-border/70 bg-card/40 backdrop-blur-xs px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-1">
        {navTabs.map((tab) => {
          const isActive =
            tab.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname?.startsWith(tab.href);

          const badgeCount =
            tab.badgeKey === "total_playlists" ? summary?.total_playlists : null;

          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={cn(
                "relative flex items-center gap-2 px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors rounded-md",
                isActive
                  ? "text-harmonia-lime font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
              )}
            >
              <tab.icon className={cn("h-3.5 w-3.5", isActive ? "text-harmonia-lime" : "text-muted-foreground")} />
              <span>{tab.name}</span>

              {typeof badgeCount === "number" && badgeCount > 0 && (
                <span
                  className={cn(
                    "text-[10px] font-mono px-1.5 py-0.2 rounded-full",
                    isActive
                      ? "bg-harmonia-lime/20 text-harmonia-lime border border-harmonia-lime/30"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {badgeCount}
                </span>
              )}

              {/* Active Tab Underline Indicator (Cloudflare style) */}
              {isActive && (
                <span className="absolute bottom-[-5px] left-3 right-3 h-[2px] bg-harmonia-lime rounded-full shadow-[0_0_8px_rgba(217,242,122,0.6)]" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

