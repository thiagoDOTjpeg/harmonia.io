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
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const SetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "A senha deve ter pelo menos 8 caracteres")
      .regex(/[A-Z]/, "Deve conter pelo menos uma letra maiúscula")
      .regex(/[a-z]/, "Deve conter pelo menos uma letra minúscula")
      .regex(/[0-9]/, "Deve conter pelo menos um número"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type SetPasswordFormData = z.infer<typeof SetPasswordSchema>;

export default function DefinirSenhaPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<SetPasswordFormData>({
    resolver: zodResolver(SetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const password = form.watch("password");
  const confirmPassword = form.watch("confirmPassword");

  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

  const onSubmit = async (data: SetPasswordFormData) => {
    try {
      console.log("Definindo nova senha:", data.password);
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 bg-background">
      {/* Coluna Esquerda: Showcase */}
      <AuthShowcase />

      {/* Coluna Direita: Definir Senha */}
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
            href="/dashboard"
            className="text-sm text-zinc-300 hover:text-white inline-flex items-center gap-1.5 ml-auto font-medium transition-colors"
          >
            Pular para o painel →
          </Link>
        </div>

        <div className="w-full max-w-sm sm:max-w-md mx-auto my-auto space-y-7">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-display">
              Defina sua Senha
            </h1>
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans">
              Você acessou via provedor OAuth. Crie uma senha para acessar diretamente com email.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-sm font-medium text-zinc-200">Nova Senha</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Mínimo 8 caracteres"
                          className="h-11 bg-zinc-900/90 border-zinc-700 hover:border-zinc-500 focus-visible:border-harmonia-lime focus-visible:ring-2 focus-visible:ring-harmonia-lime/30 text-sm text-white placeholder:text-zinc-500 pr-10 transition-colors"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors cursor-pointer p-1"
                          aria-label={showPassword ? "Ocultar senha" : "Exibir senha"}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-sm font-medium text-zinc-200">Confirmar Nova Senha</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Digite a senha novamente"
                          className="h-11 bg-zinc-900/90 border-zinc-700 hover:border-zinc-500 focus-visible:border-harmonia-lime focus-visible:ring-2 focus-visible:ring-harmonia-lime/30 text-sm text-white placeholder:text-zinc-500 pr-10 transition-colors"
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

              <div className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-900/60 space-y-2 text-xs font-mono">
                <PasswordRequirement met={hasMinLength} text="Pelo menos 8 caracteres" />
                <PasswordRequirement met={hasUpperCase} text="Uma letra maiúscula" />
                <PasswordRequirement met={hasLowerCase} text="Uma letra minúscula" />
                <PasswordRequirement met={hasNumber} text="Um número" />
                {confirmPassword && (
                  <PasswordRequirement met={passwordsMatch} text="As senhas correspondem" />
                )}
              </div>

              <Button
                type="submit"
                disabled={!form.formState.isValid}
                className="w-full h-11 bg-harmonia-lime text-harmonia-green font-bold text-sm hover:brightness-105 active:scale-[0.99] transition-all shadow-sm cursor-pointer mt-2"
              >
                <span className="flex items-center justify-center gap-2">
                  Definir Senha e Acessar
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Button>
            </form>
          </Form>
        </div>

        <div className="w-full max-w-sm sm:max-w-md mx-auto pt-6 flex items-center justify-between text-xs font-mono text-zinc-400 border-t border-zinc-800/60">
          <span className="flex items-center gap-1.5 text-zinc-300">
            <ShieldCheck className="h-3.5 w-3.5 text-harmonia-lime" />
            Criptografia Bcrypt com Salt
          </span>
          <span>Harmonia • Open Source</span>
        </div>
      </div>
    </div>
  );
}

function PasswordRequirement({ met, text }: { met: boolean; text: string }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      {met ? (
        <CheckCircle2 className="h-3.5 w-3.5 text-harmonia-lime shrink-0" />
      ) : (
        <AlertCircle className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
      )}
      <span className={met ? "text-zinc-200 font-medium" : "text-zinc-500"}>
        {text}
      </span>
    </div>
  );
}
