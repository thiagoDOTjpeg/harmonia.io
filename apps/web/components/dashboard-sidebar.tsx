"use client";

import { Button } from "@/components/ui/button";
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
  const { clearUser } = useUser();

  const handelLogout = () => {
    logout();
    clearUser();
  };

  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col">
      <div className="p-6 border-b border-border m-auto">
        <Link href="/" className="flex items-center gap-2">
          <svg
            viewBox="0 0 40 40"
            className="h-8 w-8"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop
                  offset="0%"
                  style={{ stopColor: "oklch(0.75 0.25 155)", stopOpacity: 1 }}
                />

                <stop
                  offset="50%"
                  style={{ stopColor: "oklch(0.75 0.20 210)", stopOpacity: 1 }}
                />

                <stop
                  offset="100%"
                  style={{ stopColor: "oklch(0.60 0.25 295)", stopOpacity: 1 }}
                />
              </linearGradient>
            </defs>

            <path
              d="M 10 20 Q 15 12, 20 20 T 30 20"
              fill="none"
              stroke="url(#logo-grad)"
              strokeWidth="3"
              strokeLinecap="round"
            />

            <path
              d="M 10 20 Q 15 26, 20 20 T 30 20"
              fill="none"
              stroke="url(#logo-grad)"
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.6"
            />

            <circle cx="20" cy="20" r="3" fill="oklch(0.75 0.25 155)" />
          </svg>

          <span className="text-xl font-bold font-display tracking-tight">
            Harmonia<span className="text-primary">.io</span>
          </span>
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

      <div className="p-4 space-y-2 border-t border-border">
        <Button
          variant="outline"
          className="w-full justify-start bg-linear-to-r from-[#00FF88]/10 to-[#00CCFF]/10 border-primary/20 hover:border-primary/40"
          asChild
        >
          <a
            href="https://buymeacoffee.com/harmoniaio"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Coffee className="mr-2 h-4 w-4" />
            Buy Me a Coffee
          </a>
        </Button>
        <Button variant="ghost" className="w-full justify-start" asChild>
          <Link href="/" onClick={handelLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Link>
        </Button>
      </div>
    </aside>
  );
}
