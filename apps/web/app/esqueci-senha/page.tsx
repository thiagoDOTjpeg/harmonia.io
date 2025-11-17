"use client";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthContext } from "@/context/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, CheckCircle2, Mail } from "lucide-react";
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
    console.log(result?.error);
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
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center py-16 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

        <Card className="w-full max-w-md mx-4 card-neo relative z-10">
          {step === "input" ? (
            <>
              <CardHeader className="space-y-1">
                <div className="flex items-center gap-2 mb-2">
                  <Link href="/login">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                  </Link>
                  <div className="h-12 w-12 rounded-xl bg-linear-to-r from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-3xl font-display tracking-tight">
                  Esqueceu sua senha?
                </CardTitle>
                <CardDescription className="leading-relaxed">
                  Digite seu email e enviaremos um código de verificação para
                  redefinir sua senha
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="font-display uppercase tracking-wider text-xs"
                    >
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      {...register("email")}
                      className="bg-muted/50 border-border focus:border-primary transition-colors"
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-linear-to-r from-primary to-secondary text-primary-foreground hover:opacity-90 glow-primary font-display uppercase tracking-wider"
                  >
                    Continuar
                  </Button>
                  <div className="text-center">
                    <Link
                      href="/login"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      Voltar para o login
                    </Link>
                  </div>
                </form>
              </CardContent>
            </>
          ) : (
            <>
              <CardHeader className="space-y-1">
                <div className="flex items-center gap-2 mb-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={handleGoBack}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <div className="h-12 w-12 rounded-xl bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20">
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-3xl font-display tracking-tight">
                  Confirmar email
                </CardTitle>
                <CardDescription className="leading-relaxed">
                  Você confirma que deseja enviar o código de recuperação para
                  este email?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-3 p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <Mail className="h-5 w-5 text-primary shrink-0" />
                  <span className="font-semibold break-all">
                    {formData?.email}
                  </span>
                </div>

                <div className="flex flex-col gap-3">
                  <Button
                    onClick={handleConfirm}
                    disabled={isLoading}
                    className="w-full bg-linear-to-r from-primary to-secondary text-primary-foreground hover:opacity-90 glow-primary font-display uppercase tracking-wider"
                  >
                    Sim, enviar código
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleGoBack}
                    className="w-full bg-transparent border-border hover:bg-muted"
                  >
                    Não, corrigir email
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
