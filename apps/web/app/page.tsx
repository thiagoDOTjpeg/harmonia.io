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

      <main className="flex-1 flex flex-col items-center">
        {/* Hero Section */}
        <section className="container py-24 md:py-32">
          <div className="mx-auto max-w-4xl text-center space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-4 py-1.5 text-sm">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-muted-foreground">
                Sincronização automática disponível
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance">
              Sincronize suas playlists do YouTube para o Spotify{" "}
              <span className="text-primary">em segundos</span>
            </h1>

            <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
              Nunca perca uma música. Mantenha suas playlists favoritas
              sincronizadas automaticamente entre YouTube e Spotify.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild className="text-base">
                <Link href="/cadastro">
                  Começar Grátis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="text-base bg-transparent"
              >
                <Link href="/planos">Ver Planos</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="container py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-border bg-card">
              <CardContent className="pt-6 space-y-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Sincronização Rápida</h3>
                <p className="text-muted-foreground">
                  Sincronize centenas de músicas em minutos. Nossa tecnologia
                  otimizada garante velocidade máxima.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardContent className="pt-6 space-y-4">
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold">Automação Inteligente</h3>
                <p className="text-muted-foreground">
                  Configure uma vez e esqueça. Suas playlists serão atualizadas
                  automaticamente.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardContent className="pt-6 space-y-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Seguro e Confiável</h3>
                <p className="text-muted-foreground">
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
              <h2 className="text-3xl md:text-4xl font-bold">Como Funciona</h2>
              <p className="text-lg text-muted-foreground">
                Três passos simples para começar a sincronizar suas playlists
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              <div className="space-y-3">
                <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                  1
                </div>
                <h3 className="text-xl font-semibold">Conecte suas Contas</h3>
                <p className="text-muted-foreground">
                  Faça login com suas contas do YouTube e Spotify de forma
                  segura.
                </p>
              </div>

              <div className="space-y-3">
                <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                  2
                </div>
                <h3 className="text-xl font-semibold">
                  Escolha suas Playlists
                </h3>
                <p className="text-muted-foreground">
                  Selecione quais playlists do YouTube você quer sincronizar.
                </p>
              </div>

              <div className="space-y-3">
                <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                  3
                </div>
                <h3 className="text-xl font-semibold">
                  Sincronize Automaticamente
                </h3>
                <p className="text-muted-foreground">
                  Relaxe enquanto mantemos tudo atualizado para você.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container py-16 md:py-24">
          <Card className="border-border bg-linear-to-br from-primary/10 to-accent/10">
            <CardContent className="py-12 text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Pronto para começar?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Junte-se a milhares de usuários que já sincronizam suas
                playlists com SyncTune
              </p>
              <Button size="lg" asChild>
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
