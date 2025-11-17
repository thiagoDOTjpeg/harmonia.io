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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Mail, Shield } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const verifyCodeSchema = z.object({
  code: z
    .string()
    .length(6, "O código deve ter 6 dígitos")
    .regex(/^\d+$/, "O código deve conter apenas números"),
});

const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
    confirmPassword: z
      .string()
      .min(8, "A senha deve ter no mínimo 8 caracteres"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type VerifyCodeFormData = z.infer<typeof verifyCodeSchema>;
type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function VerifyCodePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") || "";

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [step, setStep] = useState<"code" | "password">("code");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const verifyForm = useForm<VerifyCodeFormData>({
    resolver: zodResolver(verifyCodeSchema),
    defaultValues: {
      code: "",
    },
  });

  const resetForm = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (step === "code") {
      inputRefs.current[0]?.focus();
    } else if (step === "password") {
      setTimeout(() => {
        resetForm.setFocus("newPassword");
      }, 100);
    }
  }, [step, resetForm]);

  useEffect(() => {
    verifyForm.setValue("code", code.join(""));
  }, [code, verifyForm]);

  const handleCodeChange = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyCode = (data: VerifyCodeFormData) => {
    console.log("[v0] Verifying code:", data.code);
    setStep("password");
  };

  const handleResetPassword = (data: ResetPasswordFormData) => {
    console.log("[v0] Resetting password for:", email);
    router.push("/login");
  };

  const handleResendCode = () => {
    console.log("[v0] Resending code to:", email);
    setCode(["", "", "", "", "", ""]);
    verifyForm.reset();
    inputRefs.current[0]?.focus();
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center pt-32 pb-16 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />

        <Card className="w-full max-w-md mx-4 card-neo relative z-20">
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2 mb-2">
              <Link href="/esqueci-senha">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div className="h-12 w-12 rounded-xl bg-linear-to-br from-secondary/20 to-secondary/5 flex items-center justify-center border border-secondary/20">
                <Shield className="h-6 w-6 text-secondary" />
              </div>
            </div>
            <CardTitle className="text-3xl font-display tracking-tight">
              {step === "code" ? "Verificar código" : "Nova senha"}
            </CardTitle>
            <CardDescription className="leading-relaxed">
              {step === "code"
                ? "Digite o código de 6 dígitos que foi enviado para seu email"
                : "Crie uma nova senha segura para sua conta"}
            </CardDescription>
          </CardHeader>

          <CardContent key={step}>
            {step === "code" ? (
              <Form {...verifyForm}>
                <form
                  onSubmit={verifyForm.handleSubmit(handleVerifyCode)}
                  className="space-y-6"
                >
                  <FormField
                    control={verifyForm.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-display uppercase tracking-wider text-xs text-center block">
                          Código de verificação
                        </FormLabel>
                        <FormControl>
                          <div className="space-y-4">
                            <div className="flex gap-2 justify-center">
                              {code.map((digit, index) => (
                                <Input
                                  key={index}
                                  ref={(el) => {
                                    inputRefs.current[index] = el;
                                  }}
                                  type="text"
                                  inputMode="numeric"
                                  maxLength={1}
                                  value={digit}
                                  onChange={(e) =>
                                    handleCodeChange(index, e.target.value)
                                  }
                                  onKeyDown={(e) => handleKeyDown(index, e)}
                                  className="w-12 h-14 text-center text-2xl font-bold bg-muted/50 border-border focus:border-secondary transition-colors"
                                />
                              ))}
                            </div>
                            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                              <Mail className="h-4 w-4 text-secondary" />
                              <span>
                                Código enviado para <strong>{email}</strong>
                              </span>
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    disabled={code.some((digit) => !digit)}
                    className="w-full bg-linear-to-r from-secondary to-accent text-secondary-foreground hover:opacity-90 glow-secondary font-display uppercase tracking-wider"
                  >
                    Verificar código
                  </Button>
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={handleResendCode}
                      className="text-sm text-muted-foreground hover:text-secondary transition-colors"
                    >
                      Não recebeu o código?{" "}
                      <span className="font-semibold">Reenviar</span>
                    </button>
                  </div>
                </form>
              </Form>
            ) : (
              <Form {...resetForm}>
                <form
                  onSubmit={resetForm.handleSubmit(handleResetPassword)}
                  className="space-y-4"
                >
                  <FormField
                    control={resetForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-display uppercase tracking-wider text-xs">
                          Nova senha
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Digite sua nova senha"
                            className="bg-muted/50 border-border focus:border-secondary transition-colors"
                            autoComplete="new-password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={resetForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-display uppercase tracking-wider text-xs">
                          Confirmar senha
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Digite novamente sua nova senha"
                            className="bg-muted/50 border-border focus:border-secondary transition-colors"
                            autoComplete="new-password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full bg-linear-to-r from-secondary to-accent text-secondary-foreground hover:opacity-90 glow-secondary font-display uppercase tracking-wider"
                  >
                    Redefinir senha
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
