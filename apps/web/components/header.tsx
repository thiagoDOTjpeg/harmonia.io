import { Button } from "@/components/ui/button";
import { Music2 } from "lucide-react";
import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container m-auto flex h-16 justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Music2 className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">Harmonia.io</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/#como-funciona"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Como Funciona
          </Link>
          <Link
            href="/planos"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Planos
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" asChild>
            <Link href="/login">Entrar</Link>
          </Button>
          <Button asChild>
            <Link href="/cadastro">Começar Grátis</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
