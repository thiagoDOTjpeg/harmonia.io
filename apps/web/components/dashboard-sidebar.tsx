"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Music2, Home, Plus, History, Settings, Crown, LogOut } from "lucide-react"

const navigation = [
  { name: "Visão Geral", href: "/dashboard", icon: Home },
  { name: "Minhas Playlists", href: "/dashboard/playlists", icon: Music2 },
  { name: "Nova Sincronização", href: "/dashboard/nova", icon: Plus },
  { name: "Histórico", href: "/dashboard/historico", icon: History },
  { name: "Configurações", href: "/dashboard/configuracoes", icon: Settings },
]

export function DashboardSidebar() {
  const pathname = usePathname()

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
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 space-y-2 border-t border-border">
        <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
          <Link href="/planos">
            <Crown className="mr-2 h-4 w-4" />
            Upgrade de Plano
          </Link>
        </Button>
        <Button variant="ghost" className="w-full justify-start" asChild>
          <Link href="/">
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Link>
        </Button>
      </div>
    </aside>
  )
}
