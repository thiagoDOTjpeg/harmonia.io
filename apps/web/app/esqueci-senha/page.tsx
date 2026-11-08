"use client";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { useAuthContext } from "@/context/AuthContext";
import { HarmoniaLogo } from "@harmonia/ui";
import { Button } from "@harmonia/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@harmonia/ui/components/card";
import { Input } from "@harmonia/ui/components/input";
import { Label } from "@harmonia/ui/components/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, Mail, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email é obrigatório")
    .email("Email inválido")
    .toLowerCase(),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const { requestResetPassword, isLoading } = useAuthContext();
  const [step, setStep] = useState<"input" | "confirm">("input");
  const [formData, setFormData] = useState<ForgotPasswordFormData | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    setFormData(data);
    setStep("confirm");
  };

  const handleConfirm = async () => {
    if (!formData) return;

    const result = await requestResetPassword(formData);
    if (!result?.error) {
      router.push(
        `/esqueci-senha/verificar?email=${encodeURIComponent(formData.email)}`
      );
    }
  };

  const handleGoBack = () => {
    setStep("input");
  };

  return (
    <div className="flex min-h-screen flex-col bg-background bg-grid-subtle">
      <Header />

      <main className="flex-1 flex items-center justify-center py-10 sm:py-16 px-4 relative">
        <Card className="w-full max-w-md card-sculpted border border-white/[0.08] shadow-2xl relative z-10 rounded-2xl">
          {step === "input" ? (
            <>
              <CardHeader className="space-y-2 pb-6 border-b border-border/60">
                <div className="flex items-center justify-between">
                  <HarmoniaLogo className="h-6 w-auto text-harmonia-lime" />
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-harmonia-lime/10 text-harmonia-lime border border-harmonia-lime/30 uppercase tracking-wider">
                    Segurança
                  </span>
                </div>
                <div>
                  <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                    Recuperação de Acesso
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    Informe seu email cadastrado para enviarmos um token de validação.
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-semibold text-zinc-300">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      {...register("email")}
                      className="bg-background/80 border-border/80 text-xs sm:text-sm focus-visible:ring-harmonia-lime h-9.5"
                    />
                    {errors.email && (
                      <p className="text-xs text-destructive">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-harmonia-lime text-harmonia-green font-bold hover:brightness-105 active:scale-[0.99] transition-all text-xs h-10 shadow-sm cursor-pointer"
                  >
                    Continuar
                    <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Button>
                  <div className="text-center pt-2">
                    <Link
                      href="/login"
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
                    >
                      <ArrowLeft className="h-3 w-3" />
                      Voltar para o login
                    </Link>
                  </div>
                </form>
              </CardContent>
            </>
          ) : (
            <>
              <CardHeader className="space-y-2 pb-6 border-b border-border/60">
                <div className="flex items-center gap-2 mb-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-muted-foreground"
                    onClick={handleGoBack}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <CardTitle className="text-lg font-bold text-foreground">
                    Confirmar Endereço
                  </CardTitle>
                </div>
                <CardDescription className="text-xs text-muted-foreground leading-relaxed">
                  Confirma o envio do código de autorização para o endereço abaixo?
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-5">
                <div className="flex items-center gap-3 p-3.5 rounded-lg bg-background/80 border border-border/80 font-mono text-xs text-foreground">
                  <Mail className="h-4 w-4 text-harmonia-lime shrink-0" />
                  <span className="font-semibold break-all">
                    {formData?.email}
                  </span>
                </div>

                <div className="flex flex-col gap-2.5">
                  <Button
                    onClick={handleConfirm}
                    disabled={isLoading}
                    className="w-full bg-harmonia-lime text-harmonia-green font-bold hover:brightness-105 active:scale-[0.99] transition-all text-xs h-10 shadow-sm cursor-pointer"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Disparando código...
                      </span>
                    ) : (
                      "Sim, enviar código"
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleGoBack}
                    className="w-full border-border/80 bg-background/60 hover:bg-muted/80 text-xs h-9 font-medium"
                  >
                    Corrigir email
                  </Button>
                </div>
              </CardContent>
            </>
          )}
        </Card>
      </main>

      <Footer />
    </div>
  );
}
