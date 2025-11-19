"use client";

import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/context/AuthContext";
import { useUser } from "@/hooks/use-user";
import { cn } from "@/lib/utils";
import { Coffee, Home, LogOut, Music2, Plus, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navigation = [
  { name: "Visão Geral", href: "/dashboard", icon: Home },
  { name: "Minhas Playlists", href: "/dashboard/playlists", icon: Music2 },
  { name: "Nova Sincronização", href: "/dashboard/nova", icon: Plus },
  { name: "Configurações", href: "/dashboard/configuracoes", icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuthContext();
  const { clearUser } = useUser();

  const handelLogout = () => {
    logout();
    clearUser();
    router.push("/");
  };

  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col">
      <div className="p-6 border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <Music2 className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">SyncTune</span>
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
          <Link href="/">
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Link>
        </Button>
      </div>
    </aside>
  );
}
