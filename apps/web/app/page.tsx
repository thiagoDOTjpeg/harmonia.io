import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Clock, Shield, Zap } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 m-auto scroll-smooth">
        {/* Hero Section */}
        <section className="container py-24 md:py-32 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] animate-pulse-smooth pointer-events-none" />

          <div className="mx-auto max-w-4xl text-center space-y-8 relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse-smooth" />
              <span className="text-primary font-medium uppercase tracking-wider">
                Sincronização automática disponível
              </span>
            </div>

            <h1 className="text-4xl md:text-7xl font-bold font-display tracking-tight text-balance leading-tight">
              Sincronize suas playlists do YouTube para o Spotify{" "}
              <span className="text-gradient">em segundos</span>
            </h1>

            <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto leading-relaxed">
              Nunca perca uma música. Mantenha suas playlists favoritas
              sincronizadas automaticamente entre YouTube e Spotify.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                asChild
                className="text-base bg-linear-to-r from-primary to-secondary text-primary-foreground hover:opacity-90 transition-all glow-primary font-display uppercase tracking-wider"
              >
                <Link href="/cadastro">
                  Começar Grátis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="text-base bg-transparent border-primary/30 hover:bg-primary/10 hover:border-primary font-display uppercase tracking-wider"
              >
                <Link href="/planos">Ver Planos</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="container py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="card-neo hover:border-primary/20 transition-all duration-300 hover:-translate-y-2">
              <CardContent className="pt-6 space-y-4">
                <div className="h-12 w-12 rounded-xl bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold font-display">
                  Sincronização Rápida
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Sincronize centenas de músicas em minutos. Nossa tecnologia
                  otimizada garante velocidade máxima.
                </p>
              </CardContent>
            </Card>

            <Card className="card-neo hover:border-secondary/20 transition-all duration-300 hover:-translate-y-2">
              <CardContent className="pt-6 space-y-4">
                <div className="h-12 w-12 rounded-xl bg-linear-to-br from-secondary/20 to-secondary/5 flex items-center justify-center border border-secondary/20">
                  <Clock className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold font-display">
                  Automação Inteligente
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Configure uma vez e esqueça. Suas playlists serão atualizadas
                  automaticamente.
                </p>
              </CardContent>
            </Card>

            <Card className="card-neo hover:border-accent/20 transition-all duration-300 hover:-translate-y-2">
              <CardContent className="pt-6 space-y-4">
                <div className="h-12 w-12 rounded-xl bg-linear-to-br from-accent/20 to-accent/5 flex items-center justify-center border border-accent/20">
                  <Shield className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold font-display">
                  Seguro e Confiável
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Suas credenciais são protegidas com criptografia de ponta.
                  Nunca armazenamos senhas.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="como-funciona" className="container py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center space-y-12">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-5xl font-bold font-display tracking-tight">
                Como Funciona
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Três passos simples para começar a sincronizar suas playlists
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              <div className="space-y-3">
                <div className="h-12 w-12 rounded-full bg-linear-to-br from-primary to-secondary text-primary-foreground flex items-center justify-center font-bold text-xl font-display shadow-lg shadow-primary/30">
                  1
                </div>
                <h3 className="text-xl font-semibold font-display">
                  Conecte suas Contas
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Faça login com suas contas do YouTube e Spotify de forma
                  segura.
                </p>
              </div>

              <div className="space-y-3">
                <div className="h-12 w-12 rounded-full bg-linear-to-br from-secondary to-accent text-secondary-foreground flex items-center justify-center font-bold text-xl font-display shadow-lg shadow-secondary/30">
                  2
                </div>
                <h3 className="text-xl font-semibold font-display">
                  Escolha suas Playlists
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Selecione quais playlists do YouTube você quer sincronizar.
                </p>
              </div>

              <div className="space-y-3">
                <div className="h-12 w-12 rounded-full bg-linear-to-br from-accent to-primary text-accent-foreground flex items-center justify-center font-bold text-xl font-display shadow-lg shadow-accent/30">
                  3
                </div>
                <h3 className="text-xl font-semibold font-display">
                  Sincronize Automaticamente
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Relaxe enquanto mantemos tudo atualizado para você.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container py-16 md:py-24">
          <Card className="border-primary/30 bg-linear-to-br from-primary/10 via-secondary/10 to-accent/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent" />
            <CardContent className="py-12 text-center space-y-6 relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold font-display tracking-tight">
                Pronto para começar?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Junte-se a milhares de usuários que já sincronizam suas
                playlists com Harmonia.io
              </p>
              <Button
                size="lg"
                asChild
                className="bg-linear-to-r from-primary to-secondary text-primary-foreground hover:opacity-90 transition-all glow-primary-lg font-display uppercase tracking-wider"
              >
                <Link href="/cadastro">
                  Começar Grátis Agora
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
}
