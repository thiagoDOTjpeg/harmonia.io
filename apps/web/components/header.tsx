import { Button, HarmoniaLogo } from "@harmonia/ui";
import { Github } from "lucide-react";
import Link from "next/link";

const LANDING_URL =
  process.env.NEXT_PUBLIC_LANDING_URL || "http://localhost:3002";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container m-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <Link href={LANDING_URL} className="hover:opacity-90 transition-opacity" aria-label="Harmonia Início">
          <HarmoniaLogo className="h-7.5 w-auto text-harmonia-lime" />
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href={`${LANDING_URL}/#como-funciona`}
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors uppercase tracking-wider"
          >
            Como Funciona
          </Link>
          <Link
            href={`${LANDING_URL}/docs`}
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
