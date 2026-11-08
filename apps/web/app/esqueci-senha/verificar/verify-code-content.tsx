"use client";

import { AuthShowcase } from "@/components/auth-showcase";
import { HarmoniaLogo } from "@harmonia/ui";
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
import { ArrowLeft, ArrowRight, Eye, EyeOff, ShieldCheck } from "lucide-react";
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
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
            href="/esqueci-senha"
            className="text-sm text-zinc-300 hover:text-white inline-flex items-center gap-1.5 ml-auto font-medium transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>
        </div>

        <div className="w-full max-w-sm sm:max-w-md mx-auto my-auto space-y-7">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-display">
              {step === "code" ? "Verificar Código" : "Criar Nova Senha"}
            </h1>
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans">
              {step === "code"
                ? `Digite o código de 6 dígitos enviado para ${email}`
                : "Defina sua nova senha de acesso."}
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
                              className="w-11 sm:w-12 h-14 text-center text-2xl font-mono font-bold bg-zinc-900/90 border-zinc-700 text-white hover:border-zinc-500 focus-visible:border-harmonia-lime focus-visible:ring-2 focus-visible:ring-harmonia-lime/30 transition-colors"
                            />
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage className="text-center text-xs text-red-400" />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={code.some((digit) => !digit)}
                  className="w-full h-11 bg-harmonia-lime text-harmonia-green font-bold text-sm hover:brightness-105 active:scale-[0.99] transition-all shadow-sm cursor-pointer mt-2"
                >
                  <span className="flex items-center justify-center gap-2">
                    Verificar Código e Avançar
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={handleResendCode}
                    className="text-sm text-zinc-400 hover:text-harmonia-lime transition-colors cursor-pointer"
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
                      <FormLabel className="text-sm font-medium text-zinc-200">Nova Senha</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showNewPassword ? "text" : "password"}
                            placeholder="Mínimo 8 caracteres"
                            className="h-11 bg-zinc-900/90 border-zinc-700 hover:border-zinc-500 focus-visible:border-harmonia-lime focus-visible:ring-2 focus-visible:ring-harmonia-lime/30 text-sm text-white placeholder:text-zinc-500 pr-10 transition-colors"
                            autoComplete="new-password"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors cursor-pointer p-1"
                            aria-label={showNewPassword ? "Ocultar senha" : "Exibir senha"}
                          >
                            {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
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
                      <FormLabel className="text-sm font-medium text-zinc-200">Confirmar Nova Senha</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Repita sua nova senha"
                            className="h-11 bg-zinc-900/90 border-zinc-700 hover:border-zinc-500 focus-visible:border-harmonia-lime focus-visible:ring-2 focus-visible:ring-harmonia-lime/30 text-sm text-white placeholder:text-zinc-500 pr-10 transition-colors"
                            autoComplete="new-password"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors cursor-pointer p-1"
                            aria-label={showConfirmPassword ? "Ocultar senha" : "Exibir senha"}
                          >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full h-11 bg-harmonia-lime text-harmonia-green font-bold text-sm hover:brightness-105 active:scale-[0.99] transition-all shadow-sm cursor-pointer mt-2"
                >
                  <span className="flex items-center justify-center gap-2">
                    Salvar Nova Senha e Conectar
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Button>
              </form>
            </Form>
          )}
        </div>

        <div className="w-full max-w-sm sm:max-w-md mx-auto pt-6 flex items-center justify-between text-xs font-mono text-zinc-400 border-t border-zinc-800/60">
          <span className="flex items-center gap-1.5 text-zinc-300">
            <ShieldCheck className="h-3.5 w-3.5 text-harmonia-lime" />
            Criptografia Ponta a Ponta
          </span>
          <span>Harmonia • Open Source</span>
        </div>
      </div>
    </div>
  );
}
