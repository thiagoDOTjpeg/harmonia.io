import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container m-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <svg
                viewBox="0 0 40 40"
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient
                    id="footer-logo-grad"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop
                      offset="0%"
                      style={{
                        stopColor: "oklch(0.75 0.25 155)",
                        stopOpacity: 1,
                      }}
                    />
                    <stop
                      offset="50%"
                      style={{
                        stopColor: "oklch(0.75 0.20 210)",
                        stopOpacity: 1,
                      }}
                    />
                    <stop
                      offset="100%"
                      style={{
                        stopColor: "oklch(0.60 0.25 295)",
                        stopOpacity: 1,
                      }}
                    />
                  </linearGradient>
                </defs>
                <path
                  d="M 10 20 Q 15 12, 20 20 T 30 20"
                  fill="none"
                  stroke="url(#footer-logo-grad)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <path
                  d="M 10 20 Q 15 26, 20 20 T 30 20"
                  fill="none"
                  stroke="url(#footer-logo-grad)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  opacity="0.6"
                />
                <circle cx="20" cy="20" r="3" fill="oklch(0.75 0.25 155)" />
              </svg>
              <span className="font-bold font-display">
                Harmonia<span className="text-primary">.io</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Sincronize suas playlists do YouTube para o Spotify em segundos.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3 font-display uppercase tracking-wider text-sm">
              Produto
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/#como-funciona"
                  className="hover:text-foreground transition-colors"
                >
                  Como Funciona
                </Link>
              </li>
              <li>
                <Link
                  href="/planos"
                  className="hover:text-foreground transition-colors"
                >
                  Planos
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="hover:text-foreground transition-colors"
                >
                  Dashboard
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
                  href="#"
                  className="hover:text-foreground transition-colors"
                >
                  Termos de Serviço
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
                  href="#"
                  className="hover:text-foreground transition-colors"
                >
                  Suporte
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-foreground transition-colors"
                >
                  Email
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} Harmonia.io. Todos os direitos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
