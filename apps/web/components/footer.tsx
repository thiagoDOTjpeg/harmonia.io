import { HarmoniaLogo } from "@harmonia/ui";
import { Github, Globe, Linkedin } from "lucide-react";
import Link from "next/link";

const LANDING_URL =
  process.env.NEXT_PUBLIC_LANDING_URL || "https://harmonia.io";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container py-12 m-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <HarmoniaLogo className="h-7.5 w-auto text-harmonia-lime" />
            </div>
            <p className="text-sm text-muted-foreground">
              Sincronização de playlists open source.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3 font-display uppercase tracking-wider text-sm">
              Projeto
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href={`${LANDING_URL}/docs`}
                  className="hover:text-foreground transition-colors"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com/thiagogritti/harmonia"
                  target="_blank"
                  className="hover:text-foreground transition-colors"
                >
                  GitHub
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com/thiagogritti/harmonia/contribute"
                  target="_blank"
                  className="hover:text-foreground transition-colors"
                >
                  Contributing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3 font-display uppercase tracking-wider text-sm">
              Legal
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="https://github.com/thiagogritti/harmonia/blob/main/LICENSE"
                  target="_blank"
                  className="hover:text-foreground transition-colors"
                >
                  License (MIT)
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-foreground transition-colors"
                >
                  Política de Privacidade
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3 font-display uppercase tracking-wider text-sm">
              Contato
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="mailto:contato@harmonia.io"
                  className="hover:text-foreground transition-colors"
                >
                  contato@harmonia.io
                </Link>
              </li>
              <li className="flex items-center gap-3 pt-2">
                <Link
                  href="https://github.com/thiagogritti"
                  target="_blank"
                  className="hover:text-primary transition-colors"
                >
                  <Github className="h-4 w-4" />
                </Link>
                <Link
                  href="https://linkedin.com/in/thiagogritti"
                  target="_blank"
                  className="hover:text-primary transition-colors"
                >
                  <Linkedin className="h-4 w-4" />
                </Link>
                <Link
                  href="https://thiagogritti.dev"
                  target="_blank"
                  className="hover:text-primary transition-colors"
                >
                  <Globe className="h-4 w-4" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground space-y-2">
          <p className="font-display">
            Built with ❤️ by developers, for developers
          </p>
          <p>
            &copy; {new Date().getFullYear()} Thiago Gritti - Open Source
            Project
          </p>
        </div>
      </div>
    </footer>
  );
}
