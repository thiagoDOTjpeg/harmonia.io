"use client";

import { AuthShowcase } from "@/components/auth-showcase";
import { useAuthContext } from "@/context/AuthContext";
import { OAuthMethod, ServiceProvider } from "@harmonia/shared";
import { HarmoniaLogo, HarmoniaMark } from "@harmonia/ui";
import { Button } from "@harmonia/ui/components/button";
import { Input } from "@harmonia/ui/components/input";
import { Label } from "@harmonia/ui/components/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader2, Lock, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import z from "zod";

const LoginFormSchema = z.object({
  email: z.string().email("Insira um endereço de email válido"),
  password: z.string().min(8, "A senha deve conter no mínimo 8 caracteres"),
});

type LoginFormData = z.infer<typeof LoginFormSchema>;

export default function LoginPage() {
  const { isLoading, login, openOAuthPopup } = useAuthContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (
    data: LoginFormData,
    e?: React.BaseSyntheticEvent
  ) => {
    e?.preventDefault();
    await login(data);
  };

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 bg-background">
      {/* Left Column: Live Audio Engine Showcase (No Navbar, No Footer) */}
      <AuthShowcase />

      {/* Right Column: Clean Enterprise Sign-In */}
      <div className="flex flex-col justify-between p-6 sm:p-10 lg:p-14 bg-background relative overflow-y-auto">
        {/* Mobile Header & Top Action */}
        <div className="flex items-center justify-between w-full mb-8">
          <Link
            href="/"
            className="flex items-center gap-2 lg:hidden hover:opacity-90 transition-opacity"
            aria-label="Harmonia Início"
          >
            <HarmoniaLogo className="h-6 w-auto text-harmonia-lime" />
          </Link>
          <div className="hidden lg:block" />

          <div className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium ml-auto">
            <span>Não tem conta?</span>
            <Link
              href="/cadastro"
              className="text-harmonia-lime hover:underline font-semibold"
            >
              Cadastre-se grátis →
            </Link>
          </div>
        </div>

        {/* Center Form Container */}
        <div className="w-full max-w-sm sm:max-w-md mx-auto my-auto space-y-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-8 w-8 rounded-lg bg-harmonia-lime/10 border border-harmonia-lime/20 flex items-center justify-center text-harmonia-lime">
                <HarmoniaMark className="h-4.5 w-auto" />
              </div>
              <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-harmonia-lime/10 text-harmonia-lime border border-harmonia-lime/30 uppercase tracking-wider">
                Enterprise SSO
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Entrar no Console
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Acesse o console de sincronização contínua e controle suas playlists.
            </p>
          </div>

          {/* OAuth SSO Quick Providers */}
          <div className="space-y-2.5">
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-muted-foreground">
              Acesso Instantâneo
            </span>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                type="button"
                className="w-full border-border/80 bg-background/80 hover:bg-muted/80 hover:border-zinc-700 text-xs font-semibold cursor-pointer transition-colors h-10"
                onClick={() =>
                  openOAuthPopup(ServiceProvider.GOOGLE, OAuthMethod.login)
                }
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                ) : (
                  <svg className="mr-2 h-3.5 w-3.5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M12 0C5.372 0 0 5.373 0 12s5.372 12 12 12c6.627 0 12-5.373 12-12S18.627 0 12 0zm.14 19.018c-3.868 0-7-3.14-7-7.018c0-3.878 3.132-7.018 7-7.018c1.89 0 3.47.697 4.682 1.829l-1.974 1.978v-.004c-.735-.702-1.667-1.062-2.708-1.062c-2.31 0-4.187 1.956-4.187 4.273c0 2.315 1.877 4.277 4.187 4.277c2.096 0 3.522-1.202 3.816-2.852H12.14v-2.737h6.585c.088.47.135.96.135 1.474c0 4.01-2.677 6.86-6.72 6.86z"
                    />
                  </svg>
                )}
                Google
              </Button>

              <Button
                variant="outline"
                type="button"
                className="w-full border-border/80 bg-background/80 hover:bg-muted/80 hover:border-zinc-700 text-xs font-semibold cursor-pointer transition-colors h-10"
                onClick={() =>
                  openOAuthPopup(ServiceProvider.SPOTIFY, OAuthMethod.login)
                }
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                ) : (
                  <svg className="mr-2 h-3.5 w-3.5 text-emerald-400" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.495 17.303c-.216.353-.674.468-1.027.253c-2.815-1.72-6.359-2.109-10.533-1.155c-.404.092-.809-.163-.901-.567c-.092-.404.163-.809.567-.901c4.571-1.045 8.494-.602 11.641 1.343c.353.216.468.674.253 1.027zm1.468-3.264c-.272.443-.85.583-1.293.311c-3.222-1.98-8.134-2.553-11.946-1.396c-.498.152-1.027-.134-1.179-.633c-.152-.498.134-1.027.633-1.179c4.359-1.323 9.775-.684 13.474 1.594c.443.272.583.85.311 1.293zm.126-3.41c-3.864-2.295-10.238-2.506-13.918-1.388c-.593.18-1.22-.162-1.4-.755c-.18-.593.162-1.22.755-1.4c4.237-1.286 11.28-1.042 15.727 1.597c.533.316.708 1.008.392 1.541c-.316.533-1.008.708-1.541.392z"
                    />
                  </svg>
                )}
                Spotify
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/80" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-background px-3 text-muted-foreground font-mono">
                Ou credenciais de email
              </span>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(onSubmit)(e);
            }}
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold text-zinc-300">
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
                className="bg-card/70 border-border/80 text-xs sm:text-sm focus-visible:ring-harmonia-lime h-10"
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-xs font-semibold text-zinc-300"
                >
                  Senha de acesso
                </Label>
                <Link
                  href="/esqueci-senha"
                  className="text-xs text-harmonia-lime hover:underline font-medium transition-colors"
                >
                  Esqueceu a senha?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                {...register("password")}
                disabled={isLoading}
                required
                className="bg-card/70 border-border/80 text-xs sm:text-sm focus-visible:ring-harmonia-lime h-10"
              />
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-harmonia-lime text-harmonia-green font-bold hover:brightness-105 active:scale-[0.99] transition-all text-xs sm:text-sm h-11 shadow-sm cursor-pointer"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Autenticando...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Entrar no Console
                  <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </form>
        </div>

        {/* Bottom Security Assurance (Minimalist) */}
        <div className="w-full max-w-sm sm:max-w-md mx-auto pt-8 flex items-center justify-between text-[11px] font-mono text-zinc-500 border-t border-border/50">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-harmonia-lime" />
            OAuth 2.0 PKCE • TLS 1.3
          </span>
          <span className="text-zinc-600">Harmonia Cloud</span>
        </div>
      </div>
    </div>
  );
}
