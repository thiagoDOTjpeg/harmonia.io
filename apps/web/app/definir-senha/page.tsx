"use client";

import { AuthShowcase } from "@/components/auth-showcase";
import { useAuthContext } from "@/context/AuthContext";
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
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, Eye, EyeOff, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const passwordSchema = z
  .object({
    password: z
      .string()
      .min(8, "A senha deve ter no mínimo 8 caracteres")
      .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
      .regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula")
      .regex(/[0-9]/, "A senha deve conter pelo menos um número"),
    confirmPassword: z.string().min(1, "Por favor, confirme sua senha"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não correspondem",
    path: ["confirmPassword"],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

export default function DefinirSenhaPage() {
  const { setPassword } = useAuthContext();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    mode: "onChange",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const password = form.watch("password");
  const confirmPassword = form.watch("confirmPassword");

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasMinLength = password.length >= 8;
  const passwordsMatch = password === confirmPassword && password.length > 0;

  const onSubmit = async (data: PasswordFormData) => {
    await setPassword({ password: data.password });
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
            href="/dashboard"
            className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 ml-auto font-medium"
          >
            Pular para o console →
          </Link>
        </div>

        <div className="w-full max-w-sm sm:max-w-md mx-auto my-auto space-y-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-8 w-8 rounded-lg bg-harmonia-lime/10 border border-harmonia-lime/20 flex items-center justify-center text-harmonia-lime">
                <HarmoniaMark className="h-4.5 w-auto" />
              </div>
              <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-harmonia-lime/10 text-harmonia-lime border border-harmonia-lime/30 uppercase tracking-wider">
                Credencial
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Defina sua Senha
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
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
                    <FormLabel className="text-xs font-semibold text-zinc-300">Nova Senha</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Mínimo 8 caracteres"
                          className="bg-card/70 border-border/80 text-xs sm:text-sm focus-visible:ring-harmonia-lime h-10 pr-10"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
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
                    <FormLabel className="text-xs font-semibold text-zinc-300">Confirmar Nova Senha</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Digite a senha novamente"
                          className="bg-card/70 border-border/80 text-xs sm:text-sm focus-visible:ring-harmonia-lime h-10 pr-10"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="p-3 rounded-lg border border-border/80 bg-muted/20 space-y-1.5 text-xs font-mono">
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
                className="w-full bg-harmonia-lime text-harmonia-green font-bold hover:brightness-105 active:scale-[0.99] transition-all text-xs sm:text-sm h-11 shadow-sm cursor-pointer"
              >
                Definir Senha e Acessar
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            </form>
          </Form>
        </div>

        <div className="w-full max-w-sm sm:max-w-md mx-auto pt-8 flex items-center justify-between text-[11px] font-mono text-zinc-500 border-t border-border/50">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-harmonia-lime" />
            Criptografia Bcrypt com Salt
          </span>
          <span className="text-zinc-600">Harmonia Cloud</span>
        </div>
      </div>
    </div>
  );
}

function PasswordRequirement({ met, text }: { met: boolean; text: string }) {
  return (
    <div className="flex items-center gap-2 text-[11px]">
      {met ? (
        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
      ) : (
        <AlertCircle className="h-3.5 w-3.5 text-muted-foreground" />
      )}
      <span className={met ? "text-foreground font-medium" : "text-muted-foreground"}>
        {text}
      </span>
    </div>
  );
}
