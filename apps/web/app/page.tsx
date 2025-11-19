import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Check,
  Code2,
  Coffee,
  Container,
  FileCode,
  Github,
  GitPullRequest,
  Play,
  Repeat,
  Shield,
  Star,
  Terminal,
  Unlock,
  Users,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import StackIcon from "tech-stack-icons";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 w-full">
        {/* Hero Section */}
        <section className="w-full py-24 md:py-32 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] animate-pulse pointer-events-none" />

          <div className="container mx-auto px-4 max-w-4xl text-center space-y-8 relative z-10">
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Badge
                variant="outline"
                className="border-primary/30 bg-primary/5 px-4 py-1.5"
              >
                <Github className="h-3 w-3 mr-2" />
                MIT License
              </Badge>
              <Badge
                variant="outline"
                className="border-secondary/30 bg-secondary/5 px-4 py-1.5"
              >
                <Star className="h-3 w-3 mr-2" />
                100% Open Source
              </Badge>
            </div>

            <h1 className="text-4xl md:text-7xl font-bold font-display tracking-tight text-balance leading-tight">
              <span className="text-gradient">Harmonia</span> - Sincronização de
              Playlists Open Source
            </h1>

            <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto leading-relaxed">
              Sincronize suas playlists entre Spotify, YouTube Music e mais.
              Auto-hospedável, privado, gratuito.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                asChild
                className="text-base bg-linear-to-r from-primary to-secondary text-primary-foreground hover:opacity-90 transition-all glow-primary font-display uppercase tracking-wider"
              >
                <Link
                  href="https://github.com/thiagoDOTjpeg/harmonia.io"
                  target="_blank"
                >
                  <Github className="mr-2 h-4 w-4" />
                  View on GitHub
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="text-base bg-transparent border-primary/30 hover:bg-primary/10 hover:border-primary font-display uppercase tracking-wider"
              >
                <Link href="/docs">
                  <FileCode className="mr-2 h-4 w-4" />
                  Get Started
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="text-base bg-transparent border-secondary/30 hover:bg-secondary/10 hover:border-secondary font-display uppercase tracking-wider"
              >
                <Link href="/demo">
                  <Play className="mr-2 h-4 w-4" />
                  Try Live Demo
                </Link>
              </Button>
            </div>

            <Card className="card-neo max-w-2xl mx-auto text-left mt-12">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Quick Start
                  </span>
                  <Terminal className="h-4 w-4 text-primary" />
                </div>
                <pre className="text-sm bg-background/50 p-4 rounded-lg overflow-x-auto">
                  <code className="text-primary font-mono">
                    {`git clone https://github.com/thiagogritti/harmonia.git
cd harmonia
docker-compose up -d`}
                  </code>
                </pre>
                <p className="text-xs text-muted-foreground mt-3">
                  Up and running in 5 minutes with Docker
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="w-full py-16 md:py-24">
          <div className="container mx-auto px-4 max-w-5xl space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-5xl font-bold font-display tracking-tight">
                Features
              </h2>
              <p className="text-lg text-muted-foreground">
                Built by developers, for developers
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="card-neo hover:border-primary/20 transition-all duration-300 hover:-translate-y-2">
                <CardContent className="pt-6 space-y-4">
                  <div className="h-12 w-12 rounded-xl bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20">
                    <Repeat className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold font-display">
                    Sync Bidirecional
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Sincronize playlists em tempo real entre plataformas com
                    suporte completo bidirecional.
                  </p>
                </CardContent>
              </Card>

              <Card className="card-neo hover:border-secondary/20 transition-all duration-300 hover:-translate-y-2">
                <CardContent className="pt-6 space-y-4">
                  <div className="h-12 w-12 rounded-xl bg-linear-to-br from-secondary/20 to-secondary/5 flex items-center justify-center border border-secondary/20">
                    <Shield className="h-6 w-6 text-secondary" />
                  </div>
                  <h3 className="text-xl font-semibold font-display">
                    Privacidade Primeiro
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Seus dados permanecem sob seu controle. Auto-hospede e
                    mantenha privacidade total.
                  </p>
                </CardContent>
              </Card>

              <Card className="card-neo hover:border-accent/20 transition-all duration-300 hover:-translate-y-2">
                <CardContent className="pt-6 space-y-4">
                  <div className="h-12 w-12 rounded-xl bg-linear-to-br from-accent/20 to-accent/5 flex items-center justify-center border border-accent/20">
                    <Zap className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold font-display">
                    Processamento Rápido
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Sistema de filas assíncrono com BullMQ para performance
                    máxima em larga escala.
                  </p>
                </CardContent>
              </Card>

              <Card className="card-neo hover:border-primary/20 transition-all duration-300 hover:-translate-y-2">
                <CardContent className="pt-6 space-y-4">
                  <div className="h-12 w-12 rounded-xl bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20">
                    <Code2 className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold font-display">
                    Arquitetura Limpa
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Código bem estruturado seguindo princípios SOLID e padrões
                    de Clean Architecture.
                  </p>
                </CardContent>
              </Card>

              <Card className="card-neo hover:border-secondary/20 transition-all duration-300 hover:-translate-y-2">
                <CardContent className="pt-6 space-y-4">
                  <div className="h-12 w-12 rounded-xl bg-linear-to-br from-secondary/20 to-secondary/5 flex items-center justify-center border border-secondary/20">
                    <Container className="h-6 w-6 text-secondary" />
                  </div>
                  <h3 className="text-xl font-semibold font-display">
                    Deploy Fácil
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Docker Compose para instalação completa em minutos. Sem
                    complicações.
                  </p>
                </CardContent>
              </Card>

              <Card className="card-neo hover:border-accent/20 transition-all duration-300 hover:-translate-y-2">
                <CardContent className="pt-6 space-y-4">
                  <div className="h-12 w-12 rounded-xl bg-linear-to-br from-accent/20 to-accent/5 flex items-center justify-center border border-accent/20">
                    <Unlock className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold font-display">
                    100% Open Source
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Código MIT. Use, modifique e distribua livremente.
                    Contribuições são bem-vindas.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="w-full py-16 md:py-24 bg-linear-to-b from-transparent via-primary/5 to-transparent">
          <div className="container mx-auto px-4 max-w-5xl space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-5xl font-bold font-display tracking-tight">
                Tech Stack
              </h2>
              <p className="text-lg text-muted-foreground">
                Construído com tecnologias modernas e confiáveis
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              <Card className="card-neo hover:border-primary/20 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="h-16 w-16 mx-auto mb-3 rounded-xl bg-linear-to-br from-green-500/20 to-transparent flex items-center justify-center border border-green-500/20">
                    <StackIcon
                      name="nodejs"
                      variant="light"
                      style={{ height: "40px", width: "40px" }}
                    />
                  </div>
                  <p className="text-sm font-semibold font-display">Node.js</p>
                </CardContent>
              </Card>

              <Card className="card-neo hover:border-primary/20 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="h-16 w-16 mx-auto mb-3 rounded-xl bg-linear-to-br from-blue-500/20 to-transparent flex items-center justify-center border border-blue-500/20">
                    <StackIcon
                      name="typescript"
                      variant="light"
                      style={{ height: "40px", width: "40px" }}
                    />
                  </div>
                  <p className="text-sm font-semibold font-display">
                    TypeScript
                  </p>
                </CardContent>
              </Card>

              <Card className="card-neo hover:border-primary/20 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="h-16 w-16 mx-auto mb-3 rounded-xl bg-linear-to-br from-blue-600/20 to-transparent flex items-center justify-center border border-blue-600/20">
                    <StackIcon
                      name="postgresql"
                      variant="light"
                      style={{ height: "40px", width: "40px" }}
                    />
                  </div>
                  <p className="text-sm font-semibold font-display">
                    PostgreSQL
                  </p>
                </CardContent>
              </Card>

              <Card className="card-neo hover:border-primary/20 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="h-16 w-16 mx-auto mb-3 rounded-xl bg-linear-to-br from-red-500/20 to-transparent flex items-center justify-center border border-red-500/20">
                    <StackIcon
                      name="redis"
                      variant="light"
                      style={{ height: "40px", width: "40px" }}
                    />
                  </div>
                  <p className="text-sm font-semibold font-display">Redis</p>
                </CardContent>
              </Card>

              <Card className="card-neo hover:border-primary/20 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="h-16 w-16 mx-auto mb-3 rounded-xl bg-linear-to-br from-purple-500/20 to-transparent flex items-center justify-center border border-purple-500/20">
                    <Image
                      width={40}
                      height={40}
                      src={"/bullmq-logo.png"}
                      alt="BullMQ"
                    />
                  </div>
                  <p className="text-sm font-semibold font-display">BullMQ</p>
                </CardContent>
              </Card>

              <Card className="card-neo hover:border-primary/20 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="h-16 w-16 mx-auto mb-3 rounded-xl bg-linear-to-br from-cyan-500/20 to-transparent flex items-center justify-center border border-cyan-500/20">
                    <StackIcon
                      name="react"
                      variant="light"
                      style={{ height: "40px", width: "40px" }}
                    />
                  </div>
                  <p className="text-sm font-semibold font-display">React</p>
                </CardContent>
              </Card>

              <Card className="card-neo hover:border-primary/20 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="h-16 w-16 mx-auto mb-3 rounded-xl bg-linear-to-br from-white/20 to-transparent flex items-center justify-center border border-white/20">
                    <StackIcon
                      name="nextjs"
                      variant="light"
                      style={{ height: "40px", width: "40px" }}
                    />
                  </div>
                  <p className="text-sm font-semibold font-display">Next.js</p>
                </CardContent>
              </Card>

              <Card className="card-neo hover:border-primary/20 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="h-16 w-16 mx-auto mb-3 rounded-xl bg-linear-to-br from-blue-400/20 to-transparent flex items-center justify-center border border-blue-400/20">
                    <StackIcon
                      name="docker"
                      variant="light"
                      style={{ height: "40px", width: "40px" }}
                    />
                  </div>
                  <p className="text-sm font-semibold font-display">Docker</p>
                </CardContent>
              </Card>

              <Card className="card-neo hover:border-primary/20 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="h-16 w-16 mx-auto mb-3 rounded-xl bg-linear-to-br from-primary/20 to-transparent flex items-center justify-center border border-primary/10">
                    <Code2 className="h-10 w-10 text-primary" />
                  </div>
                  <p className="text-sm font-semibold font-display">
                    Clean Arch
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="como-funciona" className="w-full py-16 md:py-24">
          <div className="container mx-auto px-4 max-w-3xl text-center space-y-12">
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
                  Autenticação segura via OAuth 2.0 com Spotify e YouTube Music.
                </p>
              </div>

              <div className="space-y-3">
                <div className="h-12 w-12 rounded-full bg-linear-to-br from-secondary to-accent text-secondary-foreground flex items-center justify-center font-bold text-xl font-display shadow-lg shadow-secondary/30">
                  2
                </div>
                <h3 className="text-xl font-semibold font-display">
                  Configure o Sync
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Escolha quais playlists sincronizar e configure preferências.
                </p>
              </div>

              <div className="space-y-3">
                <div className="h-12 w-12 rounded-full bg-linear-to-br from-accent to-primary text-accent-foreground flex items-center justify-center font-bold text-xl font-display shadow-lg shadow-accent/30">
                  3
                </div>
                <h3 className="text-xl font-semibold font-display">
                  Mantenha Atualizado
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Sync automático ou manual quando quiser. Você tem o controle.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-16 md:py-24">
          <div className="container mx-auto px-4 max-w-5xl space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-5xl font-bold font-display tracking-tight">
                Self-Hosted vs Hosted
              </h2>
              <p className="text-lg text-muted-foreground">
                Escolha a opção que funciona melhor para você
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-6 font-display uppercase tracking-wider text-sm">
                      Feature
                    </th>
                    <th className="text-center py-4 px-6 font-display uppercase tracking-wider text-sm">
                      Self-Hosted
                    </th>
                    <th className="text-center py-4 px-6 font-display uppercase tracking-wider text-sm">
                      Hosted by Us
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/50">
                    <td className="py-4 px-6 text-muted-foreground">Preço</td>
                    <td className="py-4 px-6 text-center font-semibold text-primary">
                      Grátis
                    </td>
                    <td className="py-4 px-6 text-center font-semibold text-primary">
                      Grátis (doações opcionais)
                    </td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-4 px-6 text-muted-foreground">
                      Controle dos dados
                    </td>
                    <td className="py-4 px-6 text-center">
                      <Check className="h-5 w-5 text-primary mx-auto" />
                    </td>
                    <td className="py-4 px-6 text-center text-muted-foreground text-sm">
                      Hospedado com segurança
                    </td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-4 px-6 text-muted-foreground">
                      Manutenção
                    </td>
                    <td className="py-4 px-6 text-center text-sm">
                      Você gerencia
                    </td>
                    <td className="py-4 px-6 text-center">
                      <Check className="h-5 w-5 text-primary mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-4 px-6 text-muted-foreground">Uptime</td>
                    <td className="py-4 px-6 text-center text-sm">
                      Depende de você
                    </td>
                    <td className="py-4 px-6 text-center font-semibold">
                      99.9% SLA
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 text-muted-foreground">Setup</td>
                    <td className="py-4 px-6 text-center font-semibold">
                      5 minutos com Docker
                    </td>
                    <td className="py-4 px-6 text-center font-semibold text-secondary">
                      Instantâneo
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <Card className="card-neo border-primary/30">
                <CardContent className="p-8 text-center space-y-4">
                  <Container className="h-12 w-12 text-primary mx-auto" />
                  <h3 className="text-xl font-semibold font-display">
                    Self-host Now
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Controle total sobre seus dados e infraestrutura
                  </p>
                  <Button
                    asChild
                    className="bg-linear-to-r from-primary to-secondary text-primary-foreground hover:opacity-90 glow-primary"
                  >
                    <Link href="/docs">
                      <FileCode className="mr-2 h-4 w-4" />
                      Ver Documentação
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="card-neo border-secondary/30">
                <CardContent className="p-8 text-center space-y-4">
                  <Zap className="h-12 w-12 text-secondary mx-auto" />
                  <h3 className="text-xl font-semibold font-display">
                    Use Hosted Version
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Comece imediatamente sem configuração
                  </p>
                  <Button
                    asChild
                    variant="outline"
                    className="border-secondary/30 hover:bg-secondary/10"
                  >
                    <Link href="/cadastro">
                      <Play className="mr-2 h-4 w-4" />
                      Criar Conta
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="w-full py-16 md:py-24 bg-linear-to-b from-primary/5 to-transparent">
          <div className="container mx-auto px-4 max-w-3xl text-center space-y-8">
            <div className="space-y-4">
              <Users className="h-12 w-12 text-primary mx-auto" />
              <h2 className="text-3xl md:text-5xl font-bold font-display tracking-tight">
                Join the Community
              </h2>
              <p className="text-lg text-muted-foreground">
                Junte-se a desenvolvedores construindo o futuro da sincronização
                de playlists
              </p>
            </div>

            <div className="flex items-center justify-center gap-6 flex-wrap">
              <Button
                asChild
                variant="outline"
                className="border-primary/30 hover:bg-primary/10"
              >
                <Link
                  href="https://github.com/thiagoDOTjpeg/harmonia.io"
                  target="_blank"
                >
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-secondary/30 hover:bg-secondary/10"
              >
                <Link href="https://discord.gg/3gYajwJuXA" target="_blank">
                  <Users className="mr-2 h-4 w-4" />
                  Discord
                </Link>
              </Button>
            </div>

            <Card className="card-neo">
              <CardContent className="p-8">
                <div className="flex items-center justify-center gap-8 flex-wrap">
                  <div className="text-center">
                    <div className="text-4xl font-bold font-display text-gradient">
                      1.2k+
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      GitHub Stars
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold font-display text-gradient">
                      200+
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Contributors
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold font-display text-gradient">
                      50+
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Releases
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="w-full py-16 md:py-24">
          <div className="container mx-auto px-4 max-w-3xl">
            <Card className="border-primary/30 bg-linear-to-br from-primary/10 via-secondary/10 to-accent/10 relative overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent" />
              <CardContent className="py-12 text-center space-y-6 relative z-10">
                <Coffee className="h-16 w-16 text-primary mx-auto" />
                <h2 className="text-3xl md:text-4xl font-bold font-display tracking-tight">
                  Support the Project
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  Harmonia é mantido por desenvolvedores apaixonados. Se o
                  projeto te ajudou, considere apoiar:
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                  <Button
                    size="lg"
                    asChild
                    className="bg-linear-to-r from-yellow-500 to-orange-500 text-white hover:opacity-90 transition-all shadow-lg shadow-yellow-500/30 font-display uppercase tracking-wider"
                  >
                    <Link
                      href="https://buymeacoffee.com/harmoniaio"
                      target="_blank"
                    >
                      <Coffee className="mr-2 h-4 w-4" />
                      Buy Me a Coffee
                    </Link>
                  </Button>
                </div>
                <div className="flex items-center justify-center gap-4 pt-4 flex-wrap">
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="hover:text-primary"
                  >
                    <Link
                      href="https://github.com/thiagoDOTjpeg/harmonia.io"
                      target="_blank"
                    >
                      <Star className="mr-2 h-4 w-4" />
                      Star on GitHub
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="hover:text-primary"
                  >
                    <Link
                      href="https://github.com/thiagoDOTjpeg/harmonia.io/contribute"
                      target="_blank"
                    >
                      <GitPullRequest className="mr-2 h-4 w-4" />
                      Contribute
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
