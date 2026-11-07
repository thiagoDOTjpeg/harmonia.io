import { HarmoniaLogo } from "@harmonia/ui";
import { Github, Globe, Linkedin } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border/80 bg-background">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="space-y-3 md:col-span-5">
            <div className="flex items-center gap-2.5">
              <HarmoniaLogo className="h-7.5 w-auto text-harmonia-lime" />
            </div>
            <p className="max-w-xs text-xs leading-relaxed text-muted-foreground">
              Sincronização open-source de playlists do YouTube para o Spotify.
              Auto-hospedável, privado e projetado com arquitetura limpa.
            </p>
            <div className="flex items-center gap-2 pt-1 text-[11px] font-mono text-muted-foreground">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-harmonia-lime" />
              Licença MIT · v0.1.0
            </div>
          </div>

          <div className="md:col-span-2">
            <h3 className="mb-3 text-xs font-medium text-foreground">
              Projeto
            </h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link
                  href="/docs"
                  className="hover:text-foreground transition-colors"
                >
                  Documentação
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/arquitetura"
                  className="hover:text-foreground transition-colors"
                >
                  Arquitetura
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/roadmap"
                  className="hover:text-foreground transition-colors"
                >
                  Roadmap
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/contribuindo"
                  className="hover:text-foreground transition-colors"
                >
                  Como Contribuir
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h3 className="mb-3 text-xs font-medium text-foreground">
              Código & Licença
            </h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link
                  href="https://github.com/thiagoDOTjpeg/harmonia.io"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  Repositório GitHub
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com/thiagoDOTjpeg/harmonia.io/blob/main/LICENSE"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  Licença MIT
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/setup"
                  className="hover:text-foreground transition-colors"
                >
                  Guia de Setup
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h3 className="mb-3 text-xs font-medium text-foreground">
              Autor & Contato
            </h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link
                  href="mailto:contato@harmonia.io"
                  className="font-mono hover:text-foreground transition-colors"
                >
                  contato@harmonia.io
                </Link>
              </li>
              <li className="flex items-center gap-3 pt-2">
                <Link
                  href="https://github.com/thiagoDOTjpeg"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                  className="rounded-md border border-border p-1.5 text-muted-foreground hover:border-foreground/30 hover:text-foreground transition-colors"
                >
                  <Github className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href="https://linkedin.com/in/thiagogritti"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  className="rounded-md border border-border p-1.5 text-muted-foreground hover:border-foreground/30 hover:text-foreground transition-colors"
                >
                  <Linkedin className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href="https://thiagogritti.dev"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Website"
                  className="rounded-md border border-border p-1.5 text-muted-foreground hover:border-foreground/30 hover:text-foreground transition-colors"
                >
                  <Globe className="h-3.5 w-3.5" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} Thiago Gritti. Código aberto sob
            licença MIT.
          </p>
          <p className="font-mono text-[11px] text-muted-foreground/80">
            Construído para desenvolvedores e curadores de música.
          </p>
        </div>
      </div>
    </footer>
  );
}

