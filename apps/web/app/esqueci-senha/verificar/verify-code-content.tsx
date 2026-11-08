"use client";

import { AuthShowcase } from "@/components/auth-showcase";
import { HarmoniaLogo, HarmoniaMark } from "@harmonia/ui";
import { Button } from "@harmonia/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@harmonia/ui/components/form";
import { Input } from "@harmonia/ui/components/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Mail, Shield, ShieldCheck } from "lucide-react";
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

export default function VerifyCodeContent() {
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
    inputRefs.current[0]?.focus();
  }, []);

  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    const fullCode = newCode.join("");
    verifyForm.setValue("code", fullCode);

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

  const handleVerifyCode = async (data: VerifyCodeFormData) => {
    setStep("password");
  };

  const handleResetPassword = async (data: ResetPasswordFormData) => {
    router.push("/login?reset=success");
  };

  const handleResendCode = async () => {
    setCode(["", "", "", "", "", ""]);
    verifyForm.setValue("code", "");
    inputRefs.current[0]?.focus();
  };

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 bg-background">
      <AuthShowcase />

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
            href="/esqueci-senha"
            className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 ml-auto font-medium"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Voltar
          </Link>
        </div>

        <div className="w-full max-w-sm sm:max-w-md mx-auto my-auto space-y-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-8 w-8 rounded-lg bg-harmonia-lime/10 border border-harmonia-lime/20 flex items-center justify-center text-harmonia-lime">
                <HarmoniaMark className="h-4.5 w-auto" />
              </div>
              <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-harmonia-lime/10 text-harmonia-lime border border-harmonia-lime/30 uppercase tracking-wider">
                Verificação
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              {step === "code" ? "Verificar Código" : "Criar Nova Senha"}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {step === "code"
                ? `Digite o código de 6 dígitos enviado para ${email}`
                : "Defina sua nova senha para acessar o console."}
            </p>
          </div>

          {step === "code" ? (
            <Form {...verifyForm}>
              <form
                onSubmit={verifyForm.handleSubmit(handleVerifyCode)}
                className="space-y-6"
              >
                <FormField
                  control={verifyForm.control}
                  name="code"
                  render={() => (
                    <FormItem className="space-y-3">
                      <FormControl>
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
                              className="w-11 sm:w-12 h-14 text-center text-2xl font-mono font-bold bg-card/70 border-border/80 focus-visible:ring-harmonia-lime"
                            />
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage className="text-center text-xs" />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={code.some((digit) => !digit)}
                  className="w-full bg-harmonia-lime text-harmonia-green font-bold hover:brightness-105 active:scale-[0.99] transition-all text-xs sm:text-sm h-11 shadow-sm cursor-pointer"
                >
                  Verificar Código e Avançar
                  <ArrowRight className="h-4 w-4 ml-1.5" />
                </Button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={handleResendCode}
                    className="text-xs text-muted-foreground hover:text-harmonia-lime transition-colors cursor-pointer"
                  >
                    Não recebeu o código? <span className="font-semibold underline">Reenviar</span>
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
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-xs font-semibold text-zinc-300">Nova Senha</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Mínimo 8 caracteres"
                          className="bg-card/70 border-border/80 text-xs sm:text-sm focus-visible:ring-harmonia-lime h-10"
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
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-xs font-semibold text-zinc-300">Confirmar Nova Senha</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Repita sua nova senha"
                          className="bg-card/70 border-border/80 text-xs sm:text-sm focus-visible:ring-harmonia-lime h-10"
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
                  className="w-full bg-harmonia-lime text-harmonia-green font-bold hover:brightness-105 active:scale-[0.99] transition-all text-xs sm:text-sm h-11 shadow-sm cursor-pointer"
                >
                  Salvar Nova Senha e Conectar
                  <ArrowRight className="h-4 w-4 ml-1.5" />
                </Button>
              </form>
            </Form>
          )}
        </div>

        <div className="w-full max-w-sm sm:max-w-md mx-auto pt-8 flex items-center justify-between text-[11px] font-mono text-zinc-500 border-t border-border/50">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-harmonia-lime" />
            Criptografia Ponta a Ponta
          </span>
          <span className="text-zinc-600">Harmonia Cloud</span>
        </div>
      </div>
    </div>
  );
}
