"use client";

import { AuthShowcase } from "@/components/auth-showcase";
import { useAuthContext } from "@/context/AuthContext";
import { OAuthMethod, ServiceProvider } from "@harmonia/shared";
import { HarmoniaLogo } from "@harmonia/ui";
import { Alert, AlertDescription } from "@harmonia/ui/components/alert";
import { Button } from "@harmonia/ui/components/button";
import { Checkbox } from "@harmonia/ui/components/checkbox";
import { Input } from "@harmonia/ui/components/input";
import { Label } from "@harmonia/ui/components/label";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const CadastroFormSchema = z.object({
  name: z.string().min(2, "Insira seu nome completo"),
  email: z.string().email("Insira um endereço de email válido"),
  password: z.string().min(8, "A senha deve conter no mínimo 8 caracteres"),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "Você deve aceitar os termos de serviço e privacidade",
  }),
});

type CadastroFormData = z.infer<typeof CadastroFormSchema>;

export default function CadastroPage() {
  const { isLoading, register: registerUser, openOAuthPopup } = useAuthContext();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CadastroFormData>({
    resolver: zodResolver(CadastroFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      acceptTerms: false,
    },
  });

  const acceptTerms = watch("acceptTerms");

  const onSubmit = async (
    data: CadastroFormData,
    e?: React.BaseSyntheticEvent
  ) => {
    e?.preventDefault();
    await registerUser({
      name: data.name,
      email: data.email,
      password: data.password,
    });
  };

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 bg-background">
      {/* Coluna Esquerda: Showcase Visual do Produto */}
      <AuthShowcase />

      {/* Coluna Direita: Formulário de Registro */}
      <div className="flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16 bg-background relative overflow-y-auto">
        {/* Header Superior Mobile */}
        <div className="flex items-center justify-between w-full mb-6 lg:mb-0">
          <Link
            href="/"
            className="flex items-center gap-2 lg:hidden hover:opacity-90 transition-opacity"
            aria-label="Harmonia Início"
          >
            <HarmoniaLogo className="h-6 w-auto text-harmonia-lime" />
          </Link>
          <div className="hidden lg:block" />
        </div>

        {/* Container Centralizado do Formulário */}
        <div className="w-full max-w-sm sm:max-w-md mx-auto my-auto space-y-7">
          {/* Título e Subtítulo */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-display">
              Criar sua conta
            </h1>
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans">
              Comece gratuitamente e sincronize suas primeiras playlists em segundos.
            </p>
          </div>

          {/* Cadastro Rápido com SSO (Google Oficial & Spotify) */}
          <div className="space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 font-mono">
              Cadastro instantâneo com
            </span>

            <div className="grid grid-cols-2 gap-3">
              {/* Botão Spotify */}
              <Button
                variant="outline"
                type="button"
                className="w-full h-11 border-zinc-700/90 bg-zinc-900/80 hover:bg-zinc-800 hover:border-zinc-500 text-white text-xs sm:text-sm font-semibold cursor-pointer transition-all shadow-xs"
                onClick={() =>
                  openOAuthPopup(ServiceProvider.SPOTIFY, OAuthMethod.register)
                }
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin text-zinc-400" />
                ) : (
                  <svg
                    className="mr-2 h-4 w-4 shrink-0 text-white"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.495 17.303c-.216.353-.674.468-1.027.253c-2.815-1.72-6.359-2.109-10.533-1.155c-.404.092-.809-.163-.901-.567c-.092-.404.163-.809.567-.901c4.571-1.045 8.494-.602 11.641 1.343c.353.216.468.674.253 1.027zm1.468-3.264c-.272.443-.85.583-1.293.311c-3.222-1.98-8.134-2.553-11.946-1.396c-.498.152-1.027-.134-1.179-.633c-.152-.498.134-1.027.633-1.179c4.359-1.323 9.775-.684 13.474 1.594c.443.272.583.85.311 1.293zm.126-3.41c-3.864-2.295-10.238-2.506-13.918-1.388-.593.18-1.22-.162-1.4-.755-.18-.593.162-1.22.755-1.4c4.237-1.286 11.28-1.042 15.727 1.597c.533.316.708 1.008.392 1.541c-.316.533-1.008.708-1.541.392z" />
                  </svg>
                )}
                Spotify
              </Button>

              {/* Botão Google (Logo Oficial 4-Cores) */}
              <Button
                variant="outline"
                type="button"
                className="w-full h-11 border-zinc-700/90 bg-zinc-900/80 hover:bg-zinc-800 hover:border-zinc-500 text-white text-xs sm:text-sm font-semibold cursor-pointer transition-all shadow-xs"
                onClick={() =>
                  openOAuthPopup(ServiceProvider.GOOGLE, OAuthMethod.register)
                }
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin text-zinc-400" />
                ) : (
                  <svg
                    className="mr-2 h-4 w-4 shrink-0"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24Z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15Z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"
                    />
                  </svg>
                )}
                Google
              </Button>
            </div>
          </div>

          {/* Divisor Visual */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-zinc-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-3 text-zinc-400 font-mono font-medium">
                Ou preencha seus dados
              </span>
            </div>
          </div>

          {/* Formulário com Alto Contraste */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(onSubmit)(e);
            }}
            className="space-y-4"
          >
            {/* Nome */}
            <div className="space-y-1.5">
              <Label
                htmlFor="name"
                className="text-sm font-medium text-zinc-200"
              >
                Nome completo
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Ex: Ana Souza"
                autoComplete="name"
                {...register("name")}
                disabled={isLoading}
                className="h-11 bg-zinc-900/90 border-zinc-700 hover:border-zinc-500 focus-visible:border-harmonia-lime focus-visible:ring-2 focus-visible:ring-harmonia-lime/30 text-sm text-white placeholder:text-zinc-500 transition-colors"
              />
              {errors.name && (
                <p className="text-xs text-red-400 font-medium">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-zinc-200"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                autoComplete="email"
                {...register("email")}
                disabled={isLoading}
                className="h-11 bg-zinc-900/90 border-zinc-700 hover:border-zinc-500 focus-visible:border-harmonia-lime focus-visible:ring-2 focus-visible:ring-harmonia-lime/30 text-sm text-white placeholder:text-zinc-500 transition-colors"
              />
              {errors.email && (
                <p className="text-xs text-red-400 font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Senha com alternância */}
            <div className="space-y-1.5">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-zinc-200"
              >
                Senha
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Mínimo 8 caracteres"
                  autoComplete="new-password"
                  {...register("password")}
                  disabled={isLoading}
                  className="h-11 bg-zinc-900/90 border-zinc-700 hover:border-zinc-500 focus-visible:border-harmonia-lime focus-visible:ring-2 focus-visible:ring-harmonia-lime/30 text-sm text-white placeholder:text-zinc-500 pr-10 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors cursor-pointer p-1"
                  aria-label={showPassword ? "Ocultar senha" : "Exibir senha"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-400 font-medium">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Termos de Serviço */}
            <div className="flex items-start space-x-2 pt-1">
              <Checkbox
                id="terms"
                checked={acceptTerms}
                onCheckedChange={(checked) =>
                  setValue("acceptTerms", checked as boolean, {
                    shouldValidate: true,
                  })
                }
                disabled={isLoading}
                className="mt-0.5 border-zinc-600 data-[state=checked]:bg-harmonia-lime data-[state=checked]:text-harmonia-green"
              />
              <label
                htmlFor="terms"
                className="text-xs sm:text-sm text-zinc-300 leading-normal cursor-pointer select-none"
              >
                Concordo com os{" "}
                <Link href="#" className="text-harmonia-lime hover:underline font-medium">
                  Termos de Serviço
                </Link>{" "}
                e a{" "}
                <Link href="#" className="text-harmonia-lime hover:underline font-medium">
                  Política de Privacidade
                </Link>
                .
              </label>
            </div>
            {errors.acceptTerms && (
              <p className="text-xs text-red-400 font-medium">
                {errors.acceptTerms.message}
              </p>
            )}

            {errors.root && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errors.root.message}</AlertDescription>
              </Alert>
            )}

            {/* Botão de Submissão */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-harmonia-lime text-harmonia-green font-bold text-sm hover:brightness-105 active:scale-[0.99] transition-all shadow-sm cursor-pointer mt-2"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Criando sua conta...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Criar conta
                  <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </form>

          {/* Link para Login posicionado diretamente abaixo do formulário */}
          <div className="pt-2 text-center text-sm text-zinc-300">
            <span>Já possui uma conta? </span>
            <Link
              href="/login"
              className="text-harmonia-lime hover:underline font-semibold transition-colors"
            >
              Fazer login
            </Link>
          </div>
        </div>

        {/* Rodapé Sutil */}
        <div className="w-full max-w-sm sm:max-w-md mx-auto pt-6 flex items-center justify-between text-xs font-mono text-zinc-400 border-t border-zinc-800/60">
          <span className="flex items-center gap-1.5 text-zinc-300">
            <ShieldCheck className="h-3.5 w-3.5 text-harmonia-lime" />
            100% Gratuito
          </span>
          <span>Harmonia • Open Source</span>
        </div>
      </div>
    </div>
  );
}
