import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, X } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Gratuito",
    price: "R$ 0",
    period: "/mês",
    description: "Perfeito para começar",
    features: [
      { text: "1 playlist sincronizável", included: true },
      { text: "Até 50 músicas por playlist", included: true },
      { text: "Sincronização manual", included: true },
      { text: 'Sincronização de vídeos "Gostei"', included: false },
      { text: "Velocidade padrão", included: true },
      { text: "Ver histórico de sincronias", included: false },
      { text: "Suporte por email", included: true },
    ],
    cta: "Começar Grátis",
    href: "/cadastro",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "R$ 9,90",
    period: "/mês",
    description: "Para usuários frequentes",
    features: [
      { text: "5 playlists sincronizáveis", included: true },
      { text: "Até 200 músicas por playlist", included: true },
      { text: "Sincronização automática", included: true },
      { text: 'Sincronização de vídeos "Gostei"', included: true },
      { text: "Velocidade 2x mais rápida", included: true },
      { text: "Ver histórico de sincronias", included: true },
      { text: "Suporte prioritário", included: true },
    ],
    cta: "Assinar Pro",
    href: "/cadastro?plan=pro",
    highlighted: true,
  },
  {
    name: "Premium",
    price: "R$ 19,90",
    period: "/mês",
    description: "Para power users",
    features: [
      { text: "Playlists ilimitadas", included: true },
      { text: "Músicas ilimitadas por playlist", included: true },
      { text: "Sincronização automática", included: true },
      { text: 'Sincronização de vídeos "Gostei"', included: true },
      { text: "Velocidade 5x mais rápida", included: true },
      { text: "Histórico completo de sincronias", included: true },
      { text: "Suporte VIP 24/7", included: true },
    ],
    cta: "Assinar Premium",
    href: "/cadastro?plan=premium",
    highlighted: false,
  },
];

export default function PlanosPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 m-auto">
        <section className="container py-16 md:py-24">
          <div className="mx-auto max-w-6xl space-y-12">
            <div className="text-center space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold font-display tracking-tight">
                Escolha o plano <span className="text-gradient">ideal</span>{" "}
                para você
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Comece grátis e faça upgrade quando precisar de mais recursos
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map((plan) => (
                <Card
                  key={plan.name}
                  className={`relative flex flex-col card-neo transition-all duration-300 hover:-translate-y-2 ${
                    plan.highlighted
                      ? "border-primary/50 shadow-xl shadow-primary/20"
                      : ""
                  }`}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-[0.2] left-1/2 -translate-x-1/2">
                      <span className="bg-linear-to-r from-primary to-secondary text-primary-foreground text-sm font-bold px-6 py-1.5 rounded-full font-display uppercase tracking-wider shadow-lg shadow-primary/30">
                        Recomendado
                      </span>
                    </div>
                  )}

                  <CardHeader>
                    <CardTitle className="text-2xl font-display">
                      {plan.name}
                    </CardTitle>
                    <CardDescription className="leading-relaxed">
                      {plan.description}
                    </CardDescription>
                    <div className="mt-4">
                      <span className="text-5xl font-bold font-display text-gradient">
                        {plan.price}
                      </span>
                      <span className="text-muted-foreground">
                        {plan.period}
                      </span>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1">
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          {feature.included ? (
                            <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                          ) : (
                            <X className="h-5 w-5 text-muted-foreground/50 shrink-0 mt-0.5" />
                          )}
                          <span
                            className={
                              feature.included
                                ? "text-foreground leading-relaxed"
                                : "text-muted-foreground/70 leading-relaxed"
                            }
                          >
                            {feature.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  <CardFooter>
                    <Button
                      className={`w-full font-display uppercase tracking-wider ${
                        plan.highlighted
                          ? "bg-linear-to-r from-primary to-secondary text-primary-foreground hover:opacity-90 glow-primary"
                          : ""
                      }`}
                      variant={plan.highlighted ? "default" : "outline"}
                      asChild
                    >
                      <Link href={plan.href}>{plan.cta}</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            <div className="mt-16">
              <h2 className="text-3xl font-bold font-display text-center mb-8 tracking-tight">
                Comparação Detalhada
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-4 px-4 font-semibold font-display uppercase tracking-wider text-sm">
                        Funcionalidade
                      </th>
                      <th className="text-center py-4 px-4 font-semibold font-display uppercase tracking-wider text-sm">
                        Gratuito
                      </th>
                      <th className="text-center py-4 px-4 font-semibold font-display uppercase tracking-wider text-sm">
                        Pro
                      </th>
                      <th className="text-center py-4 px-4 font-semibold font-display uppercase tracking-wider text-sm">
                        Premium
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border">
                      <td className="py-4 px-4">Playlists Sincronizáveis</td>
                      <td className="text-center py-4 px-4">1</td>
                      <td className="text-center py-4 px-4">5</td>
                      <td className="text-center py-4 px-4">Ilimitadas</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-4 px-4">Tamanho da Playlist</td>
                      <td className="text-center py-4 px-4">50 músicas</td>
                      <td className="text-center py-4 px-4">200 músicas</td>
                      <td className="text-center py-4 px-4">Ilimitado</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-4 px-4">Tipo de Sincronização</td>
                      <td className="text-center py-4 px-4">Manual</td>
                      <td className="text-center py-4 px-4">Automática</td>
                      <td className="text-center py-4 px-4">Automática</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-4 px-4">
                        Sincronia de Vídeos "Gostei"
                      </td>
                      <td className="text-center py-4 px-4">
                        <X className="h-5 w-5 text-muted-foreground mx-auto" />
                      </td>
                      <td className="text-center py-4 px-4">
                        <Check className="h-5 w-5 text-primary mx-auto" />
                      </td>
                      <td className="text-center py-4 px-4">
                        <Check className="h-5 w-5 text-primary mx-auto" />
                      </td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-4 px-4">Velocidade da Sincronização</td>
                      <td className="text-center py-4 px-4">Padrão</td>
                      <td className="text-center py-4 px-4">2x</td>
                      <td className="text-center py-4 px-4">5x</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-4 px-4">Ver Histórico de Sincronias</td>
                      <td className="text-center py-4 px-4">
                        <X className="h-5 w-5 text-muted-foreground mx-auto" />
                      </td>
                      <td className="text-center py-4 px-4">
                        <Check className="h-5 w-5 text-primary mx-auto" />
                      </td>
                      <td className="text-center py-4 px-4">
                        <Check className="h-5 w-5 text-primary mx-auto" />
                      </td>
                    </tr>
                    <tr>
                      <td className="py-4 px-4">Suporte</td>
                      <td className="text-center py-4 px-4">Email</td>
                      <td className="text-center py-4 px-4">Prioritário</td>
                      <td className="text-center py-4 px-4">VIP 24/7</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
