"use client";

import { AuthShowcase } from "@/components/auth-showcase";
import { useAuthContext } from "@/context/AuthContext";
import { OAuthMethod, ServiceProvider } from "@harmonia/shared";
import { HarmoniaLogo, HarmoniaMark } from "@harmonia/ui";
import { Alert, AlertDescription } from "@harmonia/ui/components/alert";
import { Button } from "@harmonia/ui/components/button";
import { Checkbox } from "@harmonia/ui/components/checkbox";
import { Input } from "@harmonia/ui/components/input";
import { Label } from "@harmonia/ui/components/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, ArrowRight, Loader2, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import z from "zod";

const RegisterFormSchema = z.object({
  name: z.string().min(2, "Insira seu nome completo"),
  email: z.string().email("Insira um endereço de email válido"),
  password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "Você deve aceitar os termos de serviço",
  }),
});

type RegisterFormData = z.infer<typeof RegisterFormSchema>;

export default function CadastroPage() {
  const {
    isLoading,
    openOAuthPopup,
    register: registerUser,
  } = useAuthContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      acceptTerms: false,
    },
  });

  const acceptTerms = watch("acceptTerms");

  const onSubmit = async (
    data: RegisterFormData,
    e?: React.BaseSyntheticEvent
  ) => {
    e?.preventDefault();
    const { acceptTerms: _, ...registerData } = data;
    await registerUser(registerData);
  };

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 bg-background">
      {/* Left Column: Live Audio Engine Showcase (No Navbar, No Footer) */}
      <AuthShowcase />

      {/* Right Column: Clean Enterprise Sign-Up */}
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
            <span>Já possui uma conta?</span>
            <Link
              href="/login"
              className="text-harmonia-lime hover:underline font-semibold"
            >
              Fazer login →
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
                Novo Registro
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Criar Conta no Console
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Comece gratuitamente. Sincronize suas primeiras playlists em segundos.
            </p>
          </div>

          {/* OAuth Quick Register */}
          <div className="space-y-2.5">
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-muted-foreground">
              Cadastro Instantâneo com SSO
            </span>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                type="button"
                className="w-full border-border/80 bg-background/80 hover:bg-muted/80 hover:border-zinc-700 text-xs font-semibold cursor-pointer transition-colors h-10"
                onClick={() =>
                  openOAuthPopup(ServiceProvider.GOOGLE, OAuthMethod.register)
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
                  openOAuthPopup(ServiceProvider.SPOTIFY, OAuthMethod.register)
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
                Ou preencha seus dados
              </span>
            </div>
          </div>

          {/* Registration Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(onSubmit)(e);
            }}
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs font-semibold text-zinc-300">
                Nome completo
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Ex: Ana Souza"
                autoComplete="name"
                {...register("name")}
                disabled={isLoading}
                className="bg-card/70 border-border/80 text-xs sm:text-sm focus-visible:ring-harmonia-lime h-10"
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>

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
                className="bg-card/70 border-border/80 text-xs sm:text-sm focus-visible:ring-harmonia-lime h-10"
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-semibold text-zinc-300">
                Senha de acesso
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Mínimo 8 caracteres"
                autoComplete="new-password"
                {...register("password")}
                disabled={isLoading}
                className="bg-card/70 border-border/80 text-xs sm:text-sm focus-visible:ring-harmonia-lime h-10"
              />
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>

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
                className="mt-0.5 border-border/80 data-[state=checked]:bg-harmonia-lime data-[state=checked]:text-harmonia-green"
              />
              <label
                htmlFor="terms"
                className="text-xs text-muted-foreground leading-normal cursor-pointer select-none"
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
              <p className="text-xs text-destructive">{errors.acceptTerms.message}</p>
            )}

            {errors.root && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errors.root.message}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-harmonia-lime text-harmonia-green font-bold hover:brightness-105 active:scale-[0.99] transition-all text-xs sm:text-sm h-11 shadow-sm cursor-pointer"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Criando conta...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Criar Conta no Console
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
            Sem cartão de crédito • 100% Gratuito
          </span>
          <span className="text-zinc-600">Harmonia Cloud</span>
        </div>
      </div>
    </div>
  );
}
