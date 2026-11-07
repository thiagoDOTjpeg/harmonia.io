"use client";

import { Button, HarmoniaLogo } from "@harmonia/ui";
import { useAuthContext } from "@/context/AuthContext";
import { useUser } from "@/hooks/use-user";
import { cn } from "@/lib/utils";
import { Coffee, Home, LogOut, Music2, Plus, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "Visão Geral", href: "/dashboard", icon: Home },
  { name: "Minhas Playlists", href: "/dashboard/playlists", icon: Music2 },
  { name: "Nova Sincronização", href: "/dashboard/nova", icon: Plus },
  { name: "Configurações", href: "/dashboard/configuracoes", icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { logout } = useAuthContext();
  const { user } = useUser();

  const handleLogout = () => {
    logout();
  };

  const userInitial = user?.name?.charAt(0)?.toUpperCase() ?? "?";

  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col">
      <div className="p-6 border-b border-border m-auto">
        <Link href="/" className="hover:opacity-90 transition-opacity" aria-label="Harmonia Início">
          <HarmoniaLogo className="h-7 w-auto text-harmonia-lime" />
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 space-y-1 border-t border-border">
        <a
          href="https://buymeacoffee.com/harmoniaio"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <Coffee className="h-4 w-4" />
          Buy Me a Coffee
        </a>

        <div className="flex items-center gap-3 px-3 py-2 mt-2 border-t border-border pt-3">
          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-primary">{userInitial}</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium truncate">{user?.name ?? "—"}</p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email ?? ""}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 h-8 w-8"
            onClick={handleLogout}
            title="Sair"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
}
