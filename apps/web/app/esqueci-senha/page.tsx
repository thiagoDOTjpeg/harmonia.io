"use client";

import { AuthShowcase } from "@/components/auth-showcase";
import { HarmoniaLogo } from "@harmonia/ui";
import { Button } from "@harmonia/ui/components/button";
import { Input } from "@harmonia/ui/components/input";
import { Label } from "@harmonia/ui/components/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Loader2, Mail, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const ForgotPasswordSchema = z.object({
  email: z.string().email("Insira um endereço de email válido"),
});

type ForgotPasswordData = z.infer<typeof ForgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<"input" | "confirm">("input");
  const [formData, setFormData] = useState<ForgotPasswordData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordData>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: ForgotPasswordData) => {
    setFormData(data);
    setStep("confirm");
  };

  const handleConfirm = async () => {
    if (!formData) return;
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      router.push(
        `/esqueci-senha/verificar?email=${encodeURIComponent(formData.email)}`
      );
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    setStep("input");
  };

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 bg-background">
      {/* Coluna Esquerda: Showcase */}
      <AuthShowcase />

      {/* Coluna Direita: Recuperação */}
      <div className="flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16 bg-background relative overflow-y-auto">
        <div className="flex items-center justify-between w-full mb-6 lg:mb-0">
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
            className="text-sm text-zinc-300 hover:text-white inline-flex items-center gap-1.5 ml-auto font-medium transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para o login
          </Link>
        </div>

        <div className="w-full max-w-sm sm:max-w-md mx-auto my-auto space-y-7">
          {step === "input" ? (
            <>
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-display">
                  Recuperação de Acesso
                </h1>
                <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans">
                  Informe o email cadastrado para enviarmos um código de verificação.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-zinc-200"
                  >
                    Email cadastrado
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    {...register("email")}
                    className="h-11 bg-zinc-900/90 border-zinc-700 hover:border-zinc-500 focus-visible:border-harmonia-lime focus-visible:ring-2 focus-visible:ring-harmonia-lime/30 text-sm text-white placeholder:text-zinc-500 transition-colors"
                  />
                  {errors.email && (
                    <p className="text-xs text-red-400 font-medium">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 bg-harmonia-lime text-harmonia-green font-bold text-sm hover:brightness-105 active:scale-[0.99] transition-all shadow-sm cursor-pointer mt-2"
                >
                  <span className="flex items-center justify-center gap-2">
                    Continuar
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Button>
              </form>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-zinc-400 hover:text-white"
                    onClick={handleGoBack}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <h1 className="text-2xl font-bold tracking-tight text-white font-display">
                    Confirmar Endereço
                  </h1>
                </div>
                <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans">
                  Confirma o envio do código de recuperação para o email abaixo?
                </p>
              </div>

              <div className="space-y-5">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-zinc-900/90 border border-zinc-700 text-sm font-mono text-white">
                  <Mail className="h-5 w-5 text-harmonia-lime shrink-0" />
                  <span className="font-semibold break-all">{formData?.email}</span>
                </div>

                <div className="flex flex-col gap-2.5">
                  <Button
                    onClick={handleConfirm}
                    disabled={isLoading}
                    className="w-full h-11 bg-harmonia-lime text-harmonia-green font-bold text-sm hover:brightness-105 active:scale-[0.99] transition-all shadow-sm cursor-pointer"
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
                    className="w-full h-11 border-zinc-700/80 bg-zinc-900/60 hover:bg-zinc-800 text-sm text-zinc-300 font-medium"
                  >
                    Corrigir email
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="w-full max-w-sm sm:max-w-md mx-auto pt-6 flex items-center justify-between text-xs font-mono text-zinc-400 border-t border-zinc-800/60">
          <span className="flex items-center gap-1.5 text-zinc-300">
            <ShieldCheck className="h-3.5 w-3.5 text-harmonia-lime" />
            Recuperação Segura
          </span>
          <span>Harmonia • Open Source</span>
        </div>
      </div>
    </div>
  );
}
