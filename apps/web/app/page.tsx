import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle2,
  CircleDashed,
  Code2,
  Coffee,
  Container,
  FileCode,
  Github,
  KanbanSquare,
  ListMusic,
  Shield,
  Terminal,
  Timer,
  Unlock,
  Users,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import StackIcon from "tech-stack-icons";

const kanbanData = {
  done: [
    {
      id: "MVP-01",
      title: "Clean Architecture Core",
      tag: "Backend",
      desc: "Implementação de Ports & Adapters e isolamento de domínio.",
    },
    {
      id: "MVP-02",
      title: "Sistema de Filas (BullMQ)",
      tag: "Infra",
      desc: "Processamento assíncrono para evitar timeouts em playlists grandes.",
    },
    {
      id: "MVP-03",
      title: "Sync YouTube -> Spotify",
      tag: "Feature",
      desc: "Motor de conversão unilateral funcional e testado.",
    },
    {
      id: "MVP-04",
      title: "Dockerização Completa",
      tag: "DevOps",
      desc: "Setup com um comando (Compose) para API, Banco e Redis.",
    },
  ],
  inProgress: [
    {
      id: "WIP-01",
      title: "Notificações Real-time",
      tag: "WebSocket",
      desc: "Avisar o frontend instantaneamente quando o worker finalizar.",
    },
    {
      id: "WIP-02",
      title: "Refinamento de UX",
      tag: "Frontend",
      desc: "Melhorias visuais e feedback de erro para o usuário.",
    },
    {
      id: "WIP-03",
      title: "Testes Unitários/Integração",
      tag: "Backend",
      desc: "Criação de teste para cobertura de casos de uso.",
    },
  ],
  todo: [
    {
      id: "FUTURE-01",
      title: "Sync Bilateral",
      tag: "Feature",
      desc: "Permitir sincronização do Spotify de volta para o YouTube.",
    },
    {
      id: "FUTURE-02",
      title: "Sync Recorrente (Cron)",
      tag: "Backend",
      desc: "Verificação automática diária de novas músicas.",
    },
    {
      id: "FUTURE-03",
      title: "Cache Inteligente",
      tag: "Database",
      desc: "Banco de 'de-para' de músicas para economizar requests de API.",
    },
  ],
};

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
                <Code2 className="h-3 w-3 mr-2" />
                MVP Release v0.1
              </Badge>
            </div>

            <h1 className="text-4xl md:text-7xl font-bold font-display tracking-tight text-balance leading-tight">
              <span className="text-gradient">Harmonia</span> - Transferência de
              Playlists Open Source
            </h1>

            <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto leading-relaxed">
              Transfira suas playlists do YouTube para o Spotify com uma
              arquitetura robusta. Auto-hospedável, privado e construído para
              escalar.
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
                  View Source Code
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
                  Docs & Architecture
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
                    {`git clone https://github.com/thiagoDOTjpeg/harmonia.io.git
cd harmonia
docker compose up --build -d`}
                  </code>
                </pre>
                <p className="text-xs text-muted-foreground mt-3">
                  Rode o MVP localmente em 5 minutos com Docker
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="w-full py-16 md:py-24">
          <div className="container mx-auto px-4 max-w-5xl space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-5xl font-bold font-display tracking-tight">
                Principais Recursos
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="card-neo hover:border-primary/20 transition-all duration-300 hover:-translate-y-2">
                <CardContent className="pt-6 space-y-4">
                  <div className="h-12 w-12 rounded-xl bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20">
                    <ListMusic className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold font-display">
                    Transferência Unilateral
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Converta suas playlists do YouTube Music diretamente para o
                    Spotify preservando a curadoria das faixas.
                  </p>
                </CardContent>
              </Card>

              <Card className="card-neo hover:border-secondary/20 transition-all duration-300 hover:-translate-y-2">
                <CardContent className="pt-6 space-y-4">
                  <div className="h-12 w-12 rounded-xl bg-linear-to-br from-secondary/20 to-secondary/5 flex items-center justify-center border border-secondary/20">
                    <Shield className="h-6 w-6 text-secondary" />
                  </div>
                  <h3 className="text-xl font-semibold font-display">
                    Segurança de Dados
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Integração oficial via OAuth 2.0. Seus tokens são
                    criptografados e você tem controle total no deploy local.
                  </p>
                </CardContent>
              </Card>

              <Card className="card-neo hover:border-accent/20 transition-all duration-300 hover:-translate-y-2">
                <CardContent className="pt-6 space-y-4">
                  <div className="h-12 w-12 rounded-xl bg-linear-to-br from-accent/20 to-accent/5 flex items-center justify-center border border-accent/20">
                    <Zap className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold font-display">
                    Arquitetura Assíncrona
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Uso de Workers e Filas (BullMQ) para processamento em
                    background, evitando timeouts na API principal.
                  </p>
                </CardContent>
              </Card>

              <Card className="card-neo hover:border-primary/20 transition-all duration-300 hover:-translate-y-2">
                <CardContent className="pt-6 space-y-4">
                  <div className="h-12 w-12 rounded-xl bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20">
                    <Code2 className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold font-display">
                    Clean Architecture
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Projeto desenvolvido como estudo de caso de arquitetura
                    limpa, SOLID e padrão Ports & Adapters.
                  </p>
                </CardContent>
              </Card>

              <Card className="card-neo hover:border-secondary/20 transition-all duration-300 hover:-translate-y-2">
                <CardContent className="pt-6 space-y-4">
                  <div className="h-12 w-12 rounded-xl bg-linear-to-br from-secondary/20 to-secondary/5 flex items-center justify-center border border-secondary/20">
                    <Container className="h-6 w-6 text-secondary" />
                  </div>
                  <h3 className="text-xl font-semibold font-display">
                    Container First
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Ambiente totalmente dockerizado (App, Banco, Redis),
                    facilitando o setup e a escalabilidade horizontal.
                  </p>
                </CardContent>
              </Card>

              <Card className="card-neo hover:border-accent/20 transition-all duration-300 hover:-translate-y-2">
                <CardContent className="pt-6 space-y-4">
                  <div className="h-12 w-12 rounded-xl bg-linear-to-br from-accent/20 to-accent/5 flex items-center justify-center border border-accent/20">
                    <Unlock className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold font-display">
                    Open Source
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Código aberto para estudo e contribuição. Ideal para quem
                    quer aprender sobre monólitos modulares.
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
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="como-funciona" className="w-full py-16 md:py-24">
          <div className="container mx-auto px-4 max-w-3xl text-center space-y-12">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-5xl font-bold font-display tracking-tight">
                Fluxo de Uso
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Simples e eficiente, como deve ser.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              <div className="space-y-3">
                <div className="h-12 w-12 rounded-full bg-linear-to-br from-primary to-secondary text-primary-foreground flex items-center justify-center font-bold text-xl font-display shadow-lg shadow-primary/30">
                  1
                </div>
                <h3 className="text-xl font-semibold font-display">Conecte</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Faça login e conecte suas contas do Spotify e Google com
                  segurança.
                </p>
              </div>

              <div className="space-y-3">
                <div className="h-12 w-12 rounded-full bg-linear-to-br from-secondary to-accent text-secondary-foreground flex items-center justify-center font-bold text-xl font-display shadow-lg shadow-secondary/30">
                  2
                </div>
                <h3 className="text-xl font-semibold font-display">
                  Selecione
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Escolha a playlist de origem (YouTube) que você deseja levar
                  para o Spotify.
                </p>
              </div>

              <div className="space-y-3">
                <div className="h-12 w-12 rounded-full bg-linear-to-br from-accent to-primary text-accent-foreground flex items-center justify-center font-bold text-xl font-display shadow-lg shadow-accent/30">
                  3
                </div>
                <h3 className="text-xl font-semibold font-display">Execute</h3>
                <p className="text-muted-foreground leading-relaxed">
                  O sistema enfileira o trabalho e processa as músicas em
                  segundo plano.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* NOVA SECTION KANBAN ROADMAP */}
        <section className="w-full py-16 md:py-24 bg-linear-to-b from-primary/5 to-transparent">
          <div className="container mx-auto px-4 max-w-7xl space-y-12">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <KanbanSquare className="h-6 w-6 text-primary" />
                <span className="text-sm font-semibold tracking-wider text-primary uppercase">
                  Desenvolvimento Aberto
                </span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold font-display tracking-tight">
                Roadmap do Projeto
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Acompanhe o que já foi entregue e o que está sendo construído
                agora.
              </p>
            </div>

            {/* Grid do Kanban */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Coluna DONE */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-2 rounded-lg bg-green-500/10 border border-green-500/20">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span className="font-bold text-green-500">Concluído</span>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-green-500/20 text-green-600 hover:bg-green-500/30"
                  >
                    {kanbanData.done.length}
                  </Badge>
                </div>
                <div className="space-y-3">
                  {kanbanData.done.map((item) => (
                    <Card
                      key={item.id}
                      className="card-neo border-l-4 border-l-green-500/50 hover:translate-y-0 transition-colors"
                    >
                      <CardContent className="p-4 space-y-3">
                        <div className="flex justify-between items-start">
                          <span className="text-xs font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                            {item.id}
                          </span>
                          <Badge
                            variant="outline"
                            className="text-[10px] h-5 px-2"
                          >
                            {item.tag}
                          </Badge>
                        </div>
                        <h4 className="font-semibold leading-tight">
                          {item.title}
                        </h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {item.desc}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Coluna IN PROGRESS */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-2 rounded-lg bg-primary/10 border border-primary/20 relative overflow-hidden">
                  <div className="absolute inset-0 bg-linear-to-r from-primary/5 via-primary/10 to-primary/5 animate-pulse" />
                  <div className="flex items-center gap-2 relative z-10">
                    <Timer className="h-4 w-4 text-primary animate-spin-slow" />
                    <span className="font-bold text-primary">Em Progresso</span>
                  </div>
                  <Badge className="bg-primary text-primary-foreground relative z-10">
                    {kanbanData.inProgress.length}
                  </Badge>
                </div>
                <div className="space-y-3">
                  {kanbanData.inProgress.map((item) => (
                    <Card
                      key={item.id}
                      className="card-neo border-l-4 border-l-primary hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300"
                    >
                      <CardContent className="p-4 space-y-3">
                        <div className="flex justify-between items-start">
                          <span className="text-xs font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                            {item.id}
                          </span>
                          <Badge
                            variant="secondary"
                            className="text-[10px] h-5 px-2 bg-primary/10 text-primary border-primary/20"
                          >
                            {item.tag}
                          </Badge>
                        </div>
                        <h4 className="font-semibold leading-tight">
                          {item.title}
                        </h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {item.desc}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                  {/* Card vazio para preencher espaço visual se precisar */}
                  <div className="border-2 border-dashed border-primary/10 rounded-lg p-4 flex items-center justify-center text-muted-foreground/50 text-sm italic h-24">
                    Codando... ☕
                  </div>
                </div>
              </div>

              {/* Coluna TODO */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50 border border-border">
                  <div className="flex items-center gap-2">
                    <CircleDashed className="h-4 w-4 text-muted-foreground" />
                    <span className="font-bold text-muted-foreground">
                      Backlog
                    </span>
                  </div>
                  <Badge variant="outline" className="text-muted-foreground">
                    {kanbanData.todo.length}
                  </Badge>
                </div>
                <div className="space-y-3 opacity-70 hover:opacity-100 transition-opacity">
                  {kanbanData.todo.map((item) => (
                    <Card
                      key={item.id}
                      className="card-neo border-l-4 border-l-muted hover:border-l-foreground/50 transition-colors"
                    >
                      <CardContent className="p-4 space-y-3">
                        <div className="flex justify-between items-start">
                          <span className="text-xs font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                            {item.id}
                          </span>
                          <Badge
                            variant="outline"
                            className="text-[10px] h-5 px-2 text-muted-foreground"
                          >
                            {item.tag}
                          </Badge>
                        </div>
                        <h4 className="font-semibold leading-tight text-foreground/80">
                          {item.title}
                        </h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {item.desc}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-16 md:py-24">
          <div className="container mx-auto px-4 max-w-3xl text-center space-y-8">
            <div className="space-y-4">
              <Users className="h-12 w-12 text-primary mx-auto" />
              <h2 className="text-3xl md:text-5xl font-bold font-display tracking-tight">
                Join the Community
              </h2>
              <p className="text-lg text-muted-foreground">
                Junte-se ao desenvolvimento e ajude a construir as próximas
                features.
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
                  Star on GitHub
                </Link>
              </Button>
            </div>
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
                  Harmonia é um projeto Open Source mantido com café e paixão
                  por código. Se o projeto te ajudou ou você curtiu a
                  arquitetura, considere apoiar:
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
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
