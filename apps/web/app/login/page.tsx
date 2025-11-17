"use client";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthContext } from "@/context/AuthContext";
import { OAuthMethod, ServiceProvider } from "@harmonia/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import z from "zod";

const LoginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "A senha possui no mínimo 8 caracteres"),
});

type LoginFormData = z.infer<typeof LoginFormSchema>;

export default function LoginPage() {
  const { isLoading, login, openOAuthPopup } = useAuthContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
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
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center py-16 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] animate-pulse-smooth pointer-events-none" />

        <Card className="w-full max-w-md mx-4 card-neo relative z-10">
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-display tracking-tight">
              Entrar na sua conta
            </CardTitle>
            <CardDescription className="leading-relaxed">
              Digite seu email e senha para acessar o dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(onSubmit)(e);
              }}
              className="space-y-4"
            >
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
                  autoComplete="email"
                  {...register("email")}
                  disabled={isLoading}
                  required
                  className="bg-muted/50 border-border focus:border-primary transition-colors"
                />
                {errors.email && (
                  <p className="text-sm text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="password"
                    className="font-display uppercase tracking-wider text-xs"
                  >
                    Senha
                  </Label>
                  <Link
                    href="/esqueci-senha"
                    className="text-sm text-primary hover:text-primary/80 transition-colors"
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
                  className="bg-muted/50 border-border focus:border-primary transition-colors"
                />
                {errors.password && (
                  <p className="text-sm text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full bg-linear-to-r from-primary to-secondary text-primary-foreground hover:opacity-90 glow-primary font-display uppercase tracking-wider"
              >
                Entrar
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground font-display tracking-wider">
                  Ou continue com
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                type="button"
                className="hover:border-primary/50 hover:bg-primary/5 transition-colors bg-transparent"
                onClick={() =>
                  openOAuthPopup(ServiceProvider.GOOGLE, OAuthMethod.login)
                }
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
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
                className="hover:border-primary/50 hover:bg-primary/5 transition-colors bg-transparent"
                onClick={() =>
                  openOAuthPopup(ServiceProvider.SPOTIFY, OAuthMethod.login)
                }
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <svg
                    className="mr-2 h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6.273 17.15c-.273.409-.773.545-1.182.273-2.682-1.636-6.091-2-10.045-1.091-.455.091-.818-.273-.909-.727-.091-.455.273-.818.727-.909 4.364-1 8.273-.545 11.273 1.364.409.273.545.773.273 1.182zm1.636-3.818c-.364.545-.909.727-1.455.364-3.182-1.909-7.273-2.364-11.818-1.091-.545.091-.909-.364-1-.909-.091-.545.364-.909.909-1 4.727-1.364 9.364-.818 12.818 1.364.545.273.727.818.364 1.364zm.455-4.091c-.455.636-1.182.818-1.818.364-3.636-2.182-8.182-2.727-12.727-1.455-.636.091-1.091-.364-1.182-.909-.091-.636.364-1.091.909-1.182 5.091-1.364 10.182-.818 14.364 1.727.636.273.818.909.455 1.545z" />
                  </svg>
                )}
                Spotify
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-muted-foreground text-center">
              Não tem uma conta?{" "}
              <Link
                href="/cadastro"
                className="text-primary hover:text-primary/80 transition-colors font-medium"
              >
                Cadastre-se gratuitamente
              </Link>
            </div>
          </CardFooter>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
