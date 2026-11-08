"use client";

import { AuthShowcase } from "@/components/auth-showcase";
import { useAuthContext } from "@/context/AuthContext";
import { OAuthMethod, ServiceProvider } from "@harmonia/shared";
import { HarmoniaLogo } from "@harmonia/ui";
import { Button } from "@harmonia/ui/components/button";
import { Input } from "@harmonia/ui/components/input";
import { Label } from "@harmonia/ui/components/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const LoginFormSchema = z.object({
  email: z.string().email("Insira um endereço de email válido"),
  password: z.string().min(8, "A senha deve conter no mínimo 8 caracteres"),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof LoginFormSchema>;

export default function LoginPage() {
  const { isLoading, login, openOAuthPopup } = useAuthContext();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (
    data: LoginFormData,
    e?: React.BaseSyntheticEvent
  ) => {
    e?.preventDefault();
    await login({ email: data.email, password: data.password });
  };

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 bg-background">
      {/* Coluna Esquerda: Showcase do Produto (Mostrar > Explicar) */}
      <AuthShowcase />

      {/* Coluna Direita: Formulário de Autenticação */}
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
          {/* Título e Subtítulo Acolhedores */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-display">
              Acessar sua conta
            </h1>
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans">
              Gerencie suas playlists sincronizadas e configure novas automações.
            </p>
          </div>

          {/* Login Social / Instantâneo (Google Oficial & Spotify) */}
          <div className="space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 font-mono">
              Entrar rapidamente com
            </span>

            <div className="grid grid-cols-2 gap-3">
              {/* Botão Spotify */}
              <Button
                variant="outline"
                type="button"
                className="w-full h-11 border-zinc-700/90 bg-zinc-900/80 hover:bg-zinc-800 hover:border-zinc-500 text-white text-xs sm:text-sm font-semibold cursor-pointer transition-all shadow-xs"
                onClick={() =>
                  openOAuthPopup(ServiceProvider.SPOTIFY, OAuthMethod.login)
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
                  openOAuthPopup(ServiceProvider.GOOGLE, OAuthMethod.login)
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

          {/* Divisor Visual Legível */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-zinc-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-3 text-zinc-400 font-mono font-medium">
                Ou credenciais de email
              </span>
            </div>
          </div>

          {/* Formulário com Alto Contraste e Estados Claros */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(onSubmit)(e);
            }}
            className="space-y-4"
          >
            {/* Campo Email */}
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
                required
                className="h-11 bg-zinc-900/90 border-zinc-700 hover:border-zinc-500 focus-visible:border-harmonia-lime focus-visible:ring-2 focus-visible:ring-harmonia-lime/30 text-sm text-white placeholder:text-zinc-500 transition-colors"
              />
              {errors.email && (
                <p className="text-xs text-red-400 font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Campo Senha com Alternância de Visibilidade */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-zinc-200"
                >
                  Senha
                </Label>
                <Link
                  href="/esqueci-senha"
                  className="text-xs sm:text-sm text-harmonia-lime hover:underline font-medium transition-colors"
                >
                  Esqueceu a senha?
                </Link>
              </div>

              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha"
                  autoComplete="current-password"
                  {...register("password")}
                  disabled={isLoading}
                  required
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

            {/* Checkbox "Lembrar de mim" */}
            <div className="flex items-center justify-between pt-1">
              <label
                htmlFor="rememberMe"
                className="flex items-center gap-2 text-xs sm:text-sm text-zinc-300 cursor-pointer select-none"
              >
                <input
                  id="rememberMe"
                  type="checkbox"
                  {...register("rememberMe")}
                  className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-harmonia-lime accent-[#d9f27a] focus:ring-harmonia-lime/30 cursor-pointer"
                />
                <span>Lembrar de mim neste dispositivo</span>
              </label>
            </div>

            {/* Botão de Submissão com Estado de Loading */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-harmonia-lime text-harmonia-green font-bold text-sm hover:brightness-105 active:scale-[0.99] transition-all shadow-sm cursor-pointer mt-2"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Acessando sua conta...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Entrar
                  <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </form>

          {/* Link para Criar Conta posicionado diretamente abaixo do formulário */}
          <div className="pt-2 text-center text-sm text-zinc-300">
            <span>Não tem uma conta? </span>
            <Link
              href="/cadastro"
              className="text-harmonia-lime hover:underline font-semibold transition-colors"
            >
              Cadastre-se gratuitamente
            </Link>
          </div>
        </div>

        {/* Rodapé Sutil da Coluna Direita */}
        <div className="w-full max-w-sm sm:max-w-md mx-auto pt-6 text-center text-xs text-zinc-400 font-mono">
          <span>Harmonia • Sincronização inteligente de playlists</span>
        </div>
      </div>
    </div>
  );
}
