"use client";

import { AuthShowcase } from "@/components/auth-showcase";
import { useAuthContext } from "@/context/AuthContext";
import { HarmoniaLogo, HarmoniaMark } from "@harmonia/ui";
import { Button } from "@harmonia/ui/components/button";
import { Input } from "@harmonia/ui/components/input";
import { Label } from "@harmonia/ui/components/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Loader2, Mail, ShieldCheck } from "lucide-react";
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
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 bg-background">
      {/* Left Column: Live Audio Engine Showcase */}
      <AuthShowcase />

      {/* Right Column: Password Recovery Form */}
      <div className="flex flex-col justify-between p-6 sm:p-10 lg:p-14 bg-background relative overflow-y-auto">
        <div className="flex items-center justify-between w-full mb-8">
          <Link
            href="/"
            className="flex items-center gap-2 lg:hidden hover:opacity-90 transition-opacity"
            aria-label="Harmonia Início"
          >
            <HarmoniaLogo className="h-6 w-auto text-harmonia-lime" />
          </Link>
          <div className="hidden lg:block" />

          <Link
            href="/login"
            className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 ml-auto font-medium"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Voltar para o login
          </Link>
        </div>

        <div className="w-full max-w-sm sm:max-w-md mx-auto my-auto space-y-6">
          {step === "input" ? (
            <>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-8 w-8 rounded-lg bg-harmonia-lime/10 border border-harmonia-lime/20 flex items-center justify-center text-harmonia-lime">
                    <HarmoniaMark className="h-4.5 w-auto" />
                  </div>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                  Recuperação de Acesso
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Informe o email corporativo ou pessoal cadastrado para enviarmos um token de autorização.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-semibold text-zinc-300">
                    Email cadastrado
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    {...register("email")}
                    className="bg-card/70 border-border/80 text-xs sm:text-sm focus-visible:ring-harmonia-lime h-10"
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive">{errors.email.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-harmonia-lime text-harmonia-green font-bold hover:brightness-105 active:scale-[0.99] transition-all text-xs sm:text-sm h-11 shadow-sm cursor-pointer"
                >
                  Continuar
                  <ArrowRight className="h-4 w-4 ml-1.5" />
                </Button>
              </form>
            </>
          ) : (
            <>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 mb-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-muted-foreground"
                    onClick={handleGoBack}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    Confirmar Endereço
                  </h1>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Confirma o envio do código de autorização para o endereço abaixo?
                </p>
              </div>

              <div className="space-y-5">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border/80 font-mono text-xs text-foreground">
                  <Mail className="h-4 w-4 text-harmonia-lime shrink-0" />
                  <span className="font-semibold break-all">{formData?.email}</span>
                </div>

                <div className="flex flex-col gap-2.5">
                  <Button
                    onClick={handleConfirm}
                    disabled={isLoading}
                    className="w-full bg-harmonia-lime text-harmonia-green font-bold hover:brightness-105 active:scale-[0.99] transition-all text-xs sm:text-sm h-11 shadow-sm cursor-pointer"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Disparando código...
                      </span>
                    ) : (
                      "Sim, enviar código de verificação"
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleGoBack}
                    className="w-full border-border/80 bg-background/60 hover:bg-muted/80 text-xs h-10 font-medium"
                  >
                    Corrigir email
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="w-full max-w-sm sm:max-w-md mx-auto pt-8 flex items-center justify-between text-[11px] font-mono text-zinc-500 border-t border-border/50">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-harmonia-lime" />
            TLS 1.3 • Autenticação Segura
          </span>
          <span className="text-zinc-600">Harmonia Cloud</span>
        </div>
      </div>
    </div>
  );
}
