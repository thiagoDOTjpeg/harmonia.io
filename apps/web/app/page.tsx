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
  Share2,
  Shield,
  Star,
  Terminal,
  Unlock,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";

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
                  href="https://github.com/thiagogritti/harmonia"
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
                    <svg
                      className="h-10 w-10"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path
                        d="M11.998,24c-0.321,0-0.641-0.084-0.922-0.247l-2.936-1.737c-0.438-0.245-0.224-0.332-0.08-0.383 c0.585-0.203,0.703-0.25,1.328-0.604c0.065-0.037,0.151-0.023,0.218,0.017l2.256,1.339c0.082,0.045,0.197,0.045,0.272,0l8.795-5.076 c0.082-0.047,0.134-0.141,0.134-0.238V6.921c0-0.099-0.053-0.192-0.137-0.242l-8.791-5.072c-0.081-0.047-0.189-0.047-0.271,0 L3.075,6.68C2.99,6.729,2.936,6.825,2.936,6.921v10.15c0,0.097,0.054,0.189,0.139,0.235l2.409,1.392 c1.307,0.654,2.108-0.116,2.108-0.89V7.787c0-0.142,0.114-0.253,0.256-0.253h1.115c0.139,0,0.255,0.112,0.255,0.253v10.021 c0,1.745-0.95,2.745-2.604,2.745c-0.508,0-0.909,0-2.026-0.551L2.28,18.675c-0.57-0.329-0.922-0.945-0.922-1.604V6.921 c0-0.659,0.353-1.275,0.922-1.603l8.795-5.082c0.557-0.315,1.296-0.315,1.848,0l8.794,5.082c0.57,0.329,0.924,0.944,0.924,1.603 v10.15c0,0.659-0.354,1.273-0.924,1.604l-8.794,5.078C12.643,23.916,12.324,24,11.998,24z M19.099,13.993 c0-1.9-1.284-2.406-3.987-2.763c-2.731-0.361-3.009-0.548-3.009-1.187c0-0.528,0.235-1.233,2.258-1.233 c1.807,0,2.473,0.389,2.747,1.607c0.024,0.117,0.129,0.211,0.251,0.211h1.141c0.073,0,0.14-0.031,0.188-0.085 c0.048-0.054,0.074-0.123,0.067-0.196c-0.177-2.098-1.571-3.076-4.388-3.076c-2.508,0-4.004,1.058-4.004,2.833 c0,1.925,1.488,2.457,3.895,2.695c2.88,0.282,3.103,0.703,3.103,1.269c0,0.983-0.789,1.402-2.642,1.402 c-2.327,0-2.839-0.584-3.011-1.742c-0.02-0.124-0.126-0.215-0.253-0.215h-1.137c-0.141,0-0.254,0.112-0.254,0.253 c0,1.482,0.806,3.248,4.655,3.248C17.501,17.007,19.099,15.91,19.099,13.993z"
                        className="text-green-500"
                      />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold font-display">Node.js</p>
                </CardContent>
              </Card>

              <Card className="card-neo hover:border-primary/20 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="h-16 w-16 mx-auto mb-3 rounded-xl bg-linear-to-br from-blue-500/20 to-transparent flex items-center justify-center border border-blue-500/20">
                    <svg
                      className="h-10 w-10"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path
                        d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z"
                        className="text-blue-500"
                      />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold font-display">
                    TypeScript
                  </p>
                </CardContent>
              </Card>

              <Card className="card-neo hover:border-primary/20 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="h-16 w-16 mx-auto mb-3 rounded-xl bg-linear-to-br from-blue-600/20 to-transparent flex items-center justify-center border border-blue-600/20">
                    <svg
                      className="h-10 w-10"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path
                        d="M23.5594 14.7228a.5269.5269 0 0 0-.0563-.1191c-.139-.2632-.4768-.3418-.7399-.2035l-2.3449 1.1305c-.2275.1096-.4364.2633-.6091.4536a4.0349 4.0349 0 0 1-1.1825.9274 3.2913 3.2913 0 0 1-1.9018.3128v.0031a3.1061 3.1061 0 0 1-1.5649-.5465 3.4488 3.4488 0 0 1-1.1157-1.2257.5759.5759 0 0 0-.5059-.3068h-2.5899a.5759.5759 0 0 0-.5059.3068 3.4488 3.4488 0 0 1-1.1157 1.2257 3.1061 3.1061 0 0 1-1.5649.5465v-.0031a3.2913 3.2913 0 0 1-1.9018-.3128 4.0349 4.0349 0 0 1-1.1825-.9274c-.1727-.1903-.3816-.344-.6091-.4536L.4403 14.5997c-.2631-.1383-.6003-.0597-.7399.2035a.5269.5269 0 0 0-.0563.1191l.0063.0219c.8334 2.6972 3.3664 4.654 6.3703 4.654.5469 0 1.0844-.0659 1.6031-.1955.3854-.0954.7595-.2385 1.1189-.4236.3287-.169.6483-.3697.9546-.5994l.0188-.0125c.2642-.1977.5189-.4134.7705-.6416a.5289.5289 0 0 0 .1646-.3568l.0031-.0125v-2.1387a.4577.4577 0 0 1 .0188-.1287.5683.5683 0 0 1 .5589-.3975h2.6556c.2705 0 .5025.1788.5589.3975a.4577.4577 0 0 1 .0188.1287v2.1387l.0031.0125a.5289.5289 0 0 0 .1646.3568c.2516.2282.5063.444.7705.6416l.0188.0125c.3063.2297.6259.4304.9546.5994.3594.1851.7335.3282 1.1189.4236.5187.1296 1.0562.1955 1.6031.1955 2.9977 0 5.5339-1.9537 6.3672-4.6509l.0063-.0219z"
                        className="text-blue-600"
                      />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold font-display">
                    PostgreSQL
                  </p>
                </CardContent>
              </Card>

              <Card className="card-neo hover:border-primary/20 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="h-16 w-16 mx-auto mb-3 rounded-xl bg-linear-to-br from-red-500/20 to-transparent flex items-center justify-center border border-red-500/20">
                    <svg
                      className="h-10 w-10"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path
                        d="M10.5 2.661l.54.997-1.797.003.002 2.178c0 .549.01 1.002.017 1.01.007.007.263.01.569.006l.556-.004-.002 1.01-.003 1.01H9.338l-.003-1.01-.002-1.01H6.666l-.003 1.01-.002 1.01H5.664l-.003-1.01-.002-1.01.556.004c.306.004.562.001.569-.006.007-.008.017-.461.017-1.01l.002-2.178-1.797-.003.54-.997L6.662 2l.54.997 1.016.003 1.015.002.54-.997L10.86 2zm3.678 8.66l-.002 1.01h-1c-.551 0-1 .003-1 .007 0 .003.005.442.01.975l.008.968H13.205l-.003-1.01-.002-1.01h-.999c-.55 0-1 .003-1 .007 0 .003.005.442.01.975l.008.968H12.229l-.003-1.01-.002-1.01h-.999c-.55 0-1 .003-1 .007 0 .003.005.442.01.975l.008.968H11.254l-.003-1.01-.002-1.01h-.999c-.55 0-1 .003-1 .007 0 .003.005.442.01.975l.008.968H10.279l-.003-1.01-.002-1.01H9.275c-.551 0-1 .003-1 .007 0 .003.005.442.01.975l.008.968H9.304l-.003-1.01-.002-1.01H8.3c-.55 0-1 .003-1 .007 0 .003.005.442.01.975l.008.968H8.329l-.003-1.01-.002-1.01H7.325c-.55 0-1 .003-1 .007 0 .003.005.442.01.975l.008.968H7.354l-.003-1.01-.002-1.01H6.35c-.55 0-1 .003-1 .007 0 .003.005.442.01.975l.008.968H6.379l-.003-1.01-.002-1.01H5.375c-.55 0-1 .003-1 .007 0 .003.005.442.01.975l.008.968H5.404l-.003-1.01-.002-1.01H4.4c-.55 0-1 .003-1 .007 0 .003.005.442.01.975l.008.968H4.429l-.003-1.01-.002-1.01H3.425c-.55 0-1 .003-1 .007 0 .003.005.442.01.975l.008.968H3.454l-.003-1.01-.002-1.01H2.45c-.55 0-1 .003-1 .007 0 .003.005.442.01.975l.008.968H2.479l-.003-1.01-.002-1.01H1.475c-.55 0-1 .003-1 .007 0 .003.005.442.01.975l.008.968H1.504l-.003-1.01-.002-1.01H.5c-.55 0-1 .003-1 .007 0 .003.005.442.01.975l.008.968H.529l-.003-1.01-.002-1.01h1.976zm9.15 0l-.002 1.01H22.327l-.003-1.01-.002-1.01h-1c-.551 0-1 .003-1 .007 0 .003.005.442.01.975l.008.968H21.351l-.003-1.01-.002-1.01h-.999c-.55 0-1 .003-1 .007 0 .003.005.442.01.975l.008.968H20.376l-.003-1.01-.002-1.01h-.999c-.55 0-1 .003-1 .007 0 .003.005.442.01.975l.008.968H19.401l-.003-1.01-.002-1.01h-.999c-.55 0-1 .003-1 .007 0 .003.005.442.01.975l.008.968H18.426l-.003-1.01-.002-1.01h-.999c-.55 0-1 .003-1 .007 0 .003.005.442.01.975l.008.968H17.451l-.003-1.01-.002-1.01h-.999c-.55 0-1 .003-1 .007 0 .003.005.442.01.975l.008.968H16.476l-.003-1.01-.002-1.01h-.999c-.55 0-1 .003-1 .007 0 .003.005.442.01.975l.008.968H15.501l-.003-1.01-.002-1.01h-.999c-.55 0-1 .003-1 .007 0 .003.005.442.01.975l.008.968H14.526l-.003-1.01-.002-1.01h-.999c-.55 0-1 .003-1 .007 0 .003.005.442.01.975l.008.968H13.551l-.003-1.01-.002-1.01h-.999c-.55 0-1 .003-1 .007 0 .003.005.442.01.975l.008.968H12.576l-.003-1.01-.002-1.01h-.999c-.55 0-1 .003-1 .007 0 .003.005.442.01.975l.008.968H11.601l-.003-1.01-.002-1.01h1.976z"
                        className="text-red-500"
                      />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold font-display">Redis</p>
                </CardContent>
              </Card>

              <Card className="card-neo hover:border-primary/20 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="h-16 w-16 mx-auto mb-3 rounded-xl bg-linear-to-br from-purple-500/20 to-transparent flex items-center justify-center border border-purple-500/20">
                    <svg
                      className="h-10 w-10"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path
                        d="M20.47 3.53a2.118 2.118 0 0 0-2.989 0L3.53 17.47a2.12 2.12 0 1 0 2.989 2.989L20.47 6.519a2.118 2.118 0 0 0 0-2.989zM6.519 6.519L3.53 3.53a2.12 2.12 0 1 1 2.989 2.989zm10.952 10.951l2.989 2.989a2.12 2.12 0 1 1-2.989 2.989z"
                        className="text-purple-500"
                      />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold font-display">BullMQ</p>
                </CardContent>
              </Card>

              <Card className="card-neo hover:border-primary/20 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="h-16 w-16 mx-auto mb-3 rounded-xl bg-linear-to-br from-cyan-500/20 to-transparent flex items-center justify-center border border-cyan-500/20">
                    <svg
                      className="h-10 w-10"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path
                        d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38a2.167 2.167 0 0 0-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44a23.476 23.476 0 0 0-3.107-.534A23.892 23.892 0 0 0 12.769 4.7c1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442a22.73 22.73 0 0 0-3.113.538 15.02 15.02 0 0 1-.254-1.42c-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.345-.034-.46 0-.915.01-1.36.034.44-.572.895-1.096 1.345-1.565zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.868A25.64 25.64 0 0 1-4.412.005 26.64 26.64 0 0 1-1.183-1.86c-.372-.64-.71-1.29-1.018-1.946a25.17 25.17 0 0 1 1.013-1.954c.38-.66.773-1.286 1.18-1.868A25.245 25.245 0 0 1 12 8.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933a25.952 25.952 0 0 0-1.345-2.32zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493a23.966 23.966 0 0 0-1.1-2.98c.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98a23.142 23.142 0 0 0-1.086 2.964c-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39a25.819 25.819 0 0 0 1.341-2.338zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143a22.005 22.005 0 0 1-2.006-.386c.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295a1.185 1.185 0 0 1-.553-.132c-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.345.034.46 0 .915-.01 1.36-.034-.44.572-.895 1.095-1.345 1.565-.455-.47-.91-.993-1.36-1.565z"
                        className="text-cyan-500"
                      />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold font-display">React</p>
                </CardContent>
              </Card>

              <Card className="card-neo hover:border-primary/20 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="h-16 w-16 mx-auto mb-3 rounded-xl bg-linear-to-br from-white/20 to-transparent flex items-center justify-center border border-white/20">
                    <svg
                      className="h-10 w-10"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path
                        d="M11.572 0c-.176 0-.31.001-.358.007a19.76 19.76 0 0 1-.364.033C7.443.346 4.25 2.185 2.228 5.012a11.875 11.875 0 0 0-2.119 5.243c-.096.659-.108.854-.108 1.747s.012 1.089.108 1.748c.652 4.506 3.86 8.292 8.209 9.695.779.25 1.6.422 2.534.525.363.04 1.935.04 2.299 0 1.611-.178 2.977-.577 4.323-1.264.207-.106.247-.134.219-.158-.02-.013-.9-1.193-1.955-2.62l-1.919-2.592-2.404-3.558a338.739 338.739 0 0 0-2.422-3.556c-.009-.002-.018 1.579-.023 3.51-.007 3.38-.01 3.515-.052 3.595a.426.426 0 0 1-.206.214c-.075.037-.14.044-.495.044H7.81l-.108-.068a.438.438 0 0 1-.157-.171l-.05-.106.006-4.703.007-4.705.072-.092a.645.645 0 0 1 .174-.143c.096-.047.134-.051.54-.051.478 0 .558.018.682.154.035.038 1.337 1.999 2.895 4.361a10760.433 10760.433 0 0 0 4.735 7.17l1.9 2.879.096-.063a12.317 12.317 0 0 0 2.466-2.163 11.944 11.944 0 0 0 2.824-6.134c.096-.66.108-.854.108-1.748 0-.893-.012-1.088-.108-1.747-.652-4.506-3.859-8.292-8.208-9.695a12.597 12.597 0 0 0-2.499-.523A33.119 33.119 0 0 0 11.573 0zm4.069 7.217c.347 0 .408.005.486.047a.473.473 0 0 1 .237.277c.018.06.023 1.365.018 4.304l-.006 4.218-.744-1.14-.746-1.14v-3.066c0-1.982.01-3.097.023-3.15a.478.478 0 0 1 .233-.296c.096-.05.13-.054.5-.054z"
                        className="text-white"
                      />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold font-display">Next.js</p>
                </CardContent>
              </Card>

              <Card className="card-neo hover:border-primary/20 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="h-16 w-16 mx-auto mb-3 rounded-xl bg-linear-to-br from-blue-400/20 to-transparent flex items-center justify-center border border-blue-400/20">
                    <svg
                      className="h-10 w-10"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path
                        d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.185.185.186m-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.185.185.186m-2.964 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.184-.185H5.136a.186.186 0 00-.186.185v1.887c0 .102.084.185.186.186m5.893 2.715h2.118a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.082.185.185.185m-2.964 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.887c0 .102.084.185.186.185m-2.92 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.082.185.185.185M23.763 9.89c-.065-.051-.672-.51-1.954-.51-.338.001-.676.03-1.01.087-.248-1.7-1.653-2.53-1.716-2.566l-.344-.199-.226.327c-.284.438-.49.922-.612 1.43-.23.97-.09 1.882.403 2.661-.595.332-1.55.413-1.744.42H.751a.751.751 0 00-.75.748 11.376 11.376 0 00.692 4.062c.545 1.428 1.355 2.48 2.41 3.124 1.18.723 3.1 1.137 5.275 1.137.983.003 1.963-.086 2.93-.266a12.248 12.248 0 003.823-1.389c.98-.567 1.86-1.288 2.61-2.136 1.252-1.418 1.998-2.997 2.553-4.4h.221c1.372 0 2.215-.549 2.68-1.009.309-.293.55-.65.707-1.046l.098-.288z"
                        className="text-blue-400"
                      />
                    </svg>
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
                  href="https://github.com/thiagogritti/harmonia"
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
                <Link href="https://discord.gg/harmonia" target="_blank">
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
                      href="https://buymeacoffee.com/thiagogritti"
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
                      href="https://github.com/thiagogritti/harmonia"
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
                      href="https://github.com/thiagogritti/harmonia/contribute"
                      target="_blank"
                    >
                      <GitPullRequest className="mr-2 h-4 w-4" />
                      Contribute
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="hover:text-primary"
                  >
                    <Link href="#" target="_blank">
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
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
