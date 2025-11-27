import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import Link from "next/link";

export function Header({ setOpen }: { setOpen: React.Dispatch<boolean> }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container m-auto flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
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

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/#como-funciona"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors uppercase tracking-wider"
          >
            Como Funciona
          </Link>
          <Link
            href="/docs"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors uppercase tracking-wider"
          >
            Docs
          </Link>
          <Link
            href="https://github.com/thiagoDOTjpeg/harmonia.io"
            target="_blank"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors uppercase tracking-wider"
          >
            GitHub
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            className="hover:text-primary"
            onClick={() => setOpen(true)}
          >
            Pedir Acesso
          </Button>
          <Button
            asChild
            className="bg-linear-to-r from-primary to-secondary text-primary-foreground hover:opacity-90 transition-opacity glow-primary"
          >
            <Link
              href="https://github.com/thiagoDOTjpeg/harmonia.io"
              target="_blank"
            >
              <Github className="mr-2 h-4 w-4" />
              Star on GitHub
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
