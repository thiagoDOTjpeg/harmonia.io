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
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Mail,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

export type AuthMode = "login" | "register" | "forgot";

/* ---------------- Schemas ---------------- */
const LoginFormSchema = z.object({
  email: z.string().email("Insira um endereço de email válido"),
  password: z.string().min(8, "A senha deve conter no mínimo 8 caracteres"),
  rememberMe: z.boolean().optional(),
});
type LoginFormData = z.infer<typeof LoginFormSchema>;

const CadastroFormSchema = z.object({
  name: z.string().min(2, "Insira seu nome completo"),
  email: z.string().email("Insira um endereço de email válido"),
  password: z.string().min(8, "A senha deve conter no mínimo 8 caracteres"),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "Você deve aceitar os termos de serviço e privacidade",
  }),
});
type CadastroFormData = z.infer<typeof CadastroFormSchema>;

const ForgotPasswordSchema = z.object({
  email: z.string().email("Insira um endereço de email válido"),
});
type ForgotPasswordData = z.infer<typeof ForgotPasswordSchema>;

interface AuthScreenProps {
  initialMode?: AuthMode;
}

export function AuthScreen({ initialMode = "login" }: AuthScreenProps) {
  const router = useRouter();
  const { isLoading, login, register: registerUser, openOAuthPopup } = useAuthContext();

  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");

  // Senhas
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  // Esqueci senha etapa
  const [forgotStep, setForgotStep] = useState<"input" | "confirm">("input");
  const [forgotEmail, setForgotEmail] = useState("");
  const [isSendingCode, setIsSendingCode] = useState(false);

  // Sincronização com histórico do navegador
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.includes("cadastro")) {
        setDirection("forward");
        setMode("register");
      } else if (path.includes("esqueci-senha")) {
        setDirection("forward");
        setMode("forgot");
      } else {
        setDirection("backward");
        setMode("login");
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const switchMode = (newMode: AuthMode) => {
    if (newMode === mode) return;

    // Determina a direção da transição
    const isForward =
      (mode === "login" && (newMode === "register" || newMode === "forgot")) ||
      (mode === "forgot" && newMode === "register");

    setDirection(isForward ? "forward" : "backward");
    setMode(newMode);

    const targetUrl =
      newMode === "login"
        ? "/login"
        : newMode === "register"
        ? "/cadastro"
        : "/esqueci-senha";

    if (typeof window !== "undefined") {
      window.history.pushState({ authMode: newMode }, "", targetUrl);
    }
  };

  /* ---------------- Form Hooks ---------------- */
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  const cadastroForm = useForm<CadastroFormData>({
    resolver: zodResolver(CadastroFormSchema),
    defaultValues: { name: "", email: "", password: "", acceptTerms: false },
  });

  const forgotForm = useForm<ForgotPasswordData>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: { email: "" },
  });

  /* ---------------- Submits ---------------- */
  const onLoginSubmit = async (data: LoginFormData) => {
    await login({ email: data.email, password: data.password });
  };

  const onCadastroSubmit = async (data: CadastroFormData) => {
    await registerUser({
      name: data.name,
      email: data.email,
      password: data.password,
    });
  };

  const onForgotSubmit = (data: ForgotPasswordData) => {
    setForgotEmail(data.email);
    setForgotStep("confirm");
  };

  const onConfirmForgotCode = async () => {
    if (!forgotEmail) return;
    setIsSendingCode(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      router.push(`/esqueci-senha/verificar?email=${encodeURIComponent(forgotEmail)}`);
    } catch (e) {
      console.error(e);
      setIsSendingCode(false);
    }
  };

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 bg-background">
      {/* Coluna Esquerda: Showcase Estático (Sem flicker, transição contínua) */}
      <AuthShowcase />

      {/* Coluna Direita: Formulários Interativos com Transição Fluida */}
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

          {mode === "forgot" && (
            <button
              type="button"
              onClick={() => switchMode("login")}
              className="text-sm text-zinc-300 hover:text-white inline-flex items-center gap-1.5 ml-auto font-medium transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para o login
            </button>
          )}
        </div>

        {/* Container do Formulário Ativo com Animação Direcional */}
        <div
          key={mode}
          className={`w-full max-w-sm sm:max-w-md mx-auto my-auto ${
            direction === "forward"
              ? "animate-auth-slide-right"
              : "animate-auth-slide-left"
          }`}
        >
          {/* ======================= MODO: LOGIN ======================= */}
          {mode === "login" && (
            <div className="space-y-7">
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-display">
                  Acessar sua conta
                </h1>
                <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans">
                  Gerencie suas playlists sincronizadas e configure novas automações.
                </p>
              </div>

              {/* SSO Instantâneo */}
              <div className="space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 font-mono">
                  Entrar rapidamente com
                </span>

                <div className="grid grid-cols-2 gap-3">
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
                      <svg className="mr-2 h-4 w-4 shrink-0" viewBox="0 0 24 24">
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

              {/* Divisor */}
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

              {/* Form */}
              <form
                onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                className="space-y-4"
              >
                <div className="space-y-1.5">
                  <Label htmlFor="login-email" className="text-sm font-medium text-zinc-200">
                    Email
                  </Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="seu@email.com"
                    autoComplete="email"
                    {...loginForm.register("email")}
                    disabled={isLoading}
                    className="h-11 bg-zinc-900/90 border-zinc-700 hover:border-zinc-500 focus-visible:border-harmonia-lime focus-visible:ring-2 focus-visible:ring-harmonia-lime/30 text-sm text-white placeholder:text-zinc-500 transition-colors"
                  />
                  {loginForm.formState.errors.email && (
                    <p className="text-xs text-red-400 font-medium">
                      {loginForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="login-password" className="text-sm font-medium text-zinc-200">
                      Senha
                    </Label>
                    <button
                      type="button"
                      onClick={() => switchMode("forgot")}
                      className="text-xs sm:text-sm text-harmonia-lime hover:underline font-medium transition-colors cursor-pointer"
                    >
                      Esqueceu a senha?
                    </button>
                  </div>

                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showLoginPassword ? "text" : "password"}
                      placeholder="Digite sua senha"
                      autoComplete="current-password"
                      {...loginForm.register("password")}
                      disabled={isLoading}
                      className="h-11 bg-zinc-900/90 border-zinc-700 hover:border-zinc-500 focus-visible:border-harmonia-lime focus-visible:ring-2 focus-visible:ring-harmonia-lime/30 text-sm text-white placeholder:text-zinc-500 pr-10 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors cursor-pointer p-1"
                      aria-label={showLoginPassword ? "Ocultar senha" : "Exibir senha"}
                    >
                      {showLoginPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {loginForm.formState.errors.password && (
                    <p className="text-xs text-red-400 font-medium">
                      {loginForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label
                    htmlFor="login-rememberMe"
                    className="flex items-center gap-2 text-xs sm:text-sm text-zinc-300 cursor-pointer select-none"
                  >
                    <input
                      id="login-rememberMe"
                      type="checkbox"
                      {...loginForm.register("rememberMe")}
                      className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-harmonia-lime accent-[#d9f27a] focus:ring-harmonia-lime/30 cursor-pointer"
                    />
                    <span>Lembrar de mim neste dispositivo</span>
                  </label>
                </div>

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

              {/* Botão de Transição para Cadastro */}
              <div className="pt-2 text-center text-sm text-zinc-300">
                <span>Não tem uma conta? </span>
                <button
                  type="button"
                  onClick={() => switchMode("register")}
                  className="text-harmonia-lime hover:underline font-semibold transition-colors cursor-pointer"
                >
                  Cadastre-se gratuitamente
                </button>
              </div>
            </div>
          )}

          {/* ======================= MODO: CADASTRO ======================= */}
          {mode === "register" && (
            <div className="space-y-7">
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-display">
                  Criar sua conta
                </h1>
                <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans">
                  Comece gratuitamente e sincronize suas primeiras playlists em segundos.
                </p>
              </div>

              {/* SSO Instantâneo */}
              <div className="space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 font-mono">
                  Cadastro instantâneo com
                </span>

                <div className="grid grid-cols-2 gap-3">
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
                      <svg className="mr-2 h-4 w-4 shrink-0" viewBox="0 0 24 24">
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

              {/* Divisor */}
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

              {/* Form */}
              <form
                onSubmit={cadastroForm.handleSubmit(onCadastroSubmit)}
                className="space-y-4"
              >
                <div className="space-y-1.5">
                  <Label htmlFor="cadastro-name" className="text-sm font-medium text-zinc-200">
                    Nome completo
                  </Label>
                  <Input
                    id="cadastro-name"
                    type="text"
                    placeholder="Ex: Ana Souza"
                    autoComplete="name"
                    {...cadastroForm.register("name")}
                    disabled={isLoading}
                    className="h-11 bg-zinc-900/90 border-zinc-700 hover:border-zinc-500 focus-visible:border-harmonia-lime focus-visible:ring-2 focus-visible:ring-harmonia-lime/30 text-sm text-white placeholder:text-zinc-500 transition-colors"
                  />
                  {cadastroForm.formState.errors.name && (
                    <p className="text-xs text-red-400 font-medium">
                      {cadastroForm.formState.errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="cadastro-email" className="text-sm font-medium text-zinc-200">
                    Email
                  </Label>
                  <Input
                    id="cadastro-email"
                    type="email"
                    placeholder="seu@email.com"
                    autoComplete="email"
                    {...cadastroForm.register("email")}
                    disabled={isLoading}
                    className="h-11 bg-zinc-900/90 border-zinc-700 hover:border-zinc-500 focus-visible:border-harmonia-lime focus-visible:ring-2 focus-visible:ring-harmonia-lime/30 text-sm text-white placeholder:text-zinc-500 transition-colors"
                  />
                  {cadastroForm.formState.errors.email && (
                    <p className="text-xs text-red-400 font-medium">
                      {cadastroForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="cadastro-password" className="text-sm font-medium text-zinc-200">
                    Senha
                  </Label>
                  <div className="relative">
                    <Input
                      id="cadastro-password"
                      type={showRegisterPassword ? "text" : "password"}
                      placeholder="Mínimo 8 caracteres"
                      autoComplete="new-password"
                      {...cadastroForm.register("password")}
                      disabled={isLoading}
                      className="h-11 bg-zinc-900/90 border-zinc-700 hover:border-zinc-500 focus-visible:border-harmonia-lime focus-visible:ring-2 focus-visible:ring-harmonia-lime/30 text-sm text-white placeholder:text-zinc-500 pr-10 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors cursor-pointer p-1"
                      aria-label={showRegisterPassword ? "Ocultar senha" : "Exibir senha"}
                    >
                      {showRegisterPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {cadastroForm.formState.errors.password && (
                    <p className="text-xs text-red-400 font-medium">
                      {cadastroForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <div className="flex items-start space-x-2 pt-1">
                  <Checkbox
                    id="cadastro-terms"
                    checked={cadastroForm.watch("acceptTerms")}
                    onCheckedChange={(checked) =>
                      cadastroForm.setValue("acceptTerms", checked as boolean, {
                        shouldValidate: true,
                      })
                    }
                    disabled={isLoading}
                    className="mt-0.5 border-zinc-600 data-[state=checked]:bg-harmonia-lime data-[state=checked]:text-harmonia-green"
                  />
                  <label
                    htmlFor="cadastro-terms"
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
                {cadastroForm.formState.errors.acceptTerms && (
                  <p className="text-xs text-red-400 font-medium">
                    {cadastroForm.formState.errors.acceptTerms.message}
                  </p>
                )}

                {cadastroForm.formState.errors.root && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {cadastroForm.formState.errors.root.message}
                    </AlertDescription>
                  </Alert>
                )}

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

              {/* Botão de Transição para Login */}
              <div className="pt-2 text-center text-sm text-zinc-300">
                <span>Já possui uma conta? </span>
                <button
                  type="button"
                  onClick={() => switchMode("login")}
                  className="text-harmonia-lime hover:underline font-semibold transition-colors cursor-pointer"
                >
                  Fazer login
                </button>
              </div>
            </div>
          )}

          {/* ======================= MODO: ESQUECI A SENHA ======================= */}
          {mode === "forgot" && (
            <div className="space-y-7">
              {forgotStep === "input" ? (
                <>
                  <div className="space-y-2">
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-display">
                      Recuperação de Acesso
                    </h1>
                    <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans">
                      Informe o email cadastrado para enviarmos um código de verificação.
                    </p>
                  </div>

                  <form
                    onSubmit={forgotForm.handleSubmit(onForgotSubmit)}
                    className="space-y-4"
                  >
                    <div className="space-y-1.5">
                      <Label htmlFor="forgot-email" className="text-sm font-medium text-zinc-200">
                        Email cadastrado
                      </Label>
                      <Input
                        id="forgot-email"
                        type="email"
                        placeholder="seu@email.com"
                        {...forgotForm.register("email")}
                        className="h-11 bg-zinc-900/90 border-zinc-700 hover:border-zinc-500 focus-visible:border-harmonia-lime focus-visible:ring-2 focus-visible:ring-harmonia-lime/30 text-sm text-white placeholder:text-zinc-500 transition-colors"
                      />
                      {forgotForm.formState.errors.email && (
                        <p className="text-xs text-red-400 font-medium">
                          {forgotForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-11 bg-harmonia-lime text-harmonia-green font-bold text-sm hover:brightness-105 active:scale-[0.99] transition-all shadow-sm cursor-pointer mt-2"
                    >
                      <span className="flex items-center justify-center gap-2">
                        Continuar
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </Button>
                  </form>

                  <div className="pt-2 text-center text-sm text-zinc-300">
                    <button
                      type="button"
                      onClick={() => switchMode("login")}
                      className="text-harmonia-lime hover:underline font-semibold transition-colors cursor-pointer"
                    >
                      ← Voltar para o login
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-zinc-400 hover:text-white cursor-pointer"
                        onClick={() => setForgotStep("input")}
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                      <h1 className="text-2xl font-bold tracking-tight text-white font-display">
                        Confirmar Endereço
                      </h1>
                    </div>
                    <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans">
                      Confirma o envio do código de recuperação para o email abaixo?
                    </p>
                  </div>

                  <div className="space-y-5">
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-zinc-900/90 border border-zinc-700 text-sm font-mono text-white">
                      <Mail className="h-5 w-5 text-harmonia-lime shrink-0" />
                      <span className="font-semibold break-all">{forgotEmail}</span>
                    </div>

                    <div className="flex flex-col gap-2.5">
                      <Button
                        onClick={onConfirmForgotCode}
                        disabled={isSendingCode}
                        className="w-full h-11 bg-harmonia-lime text-harmonia-green font-bold text-sm hover:brightness-105 active:scale-[0.99] transition-all shadow-sm cursor-pointer"
                      >
                        {isSendingCode ? (
                          <span className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Disparando código...
                          </span>
                        ) : (
                          "Sim, enviar código de verificação"
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setForgotStep("input")}
                        className="w-full h-11 border-zinc-700/80 bg-zinc-900/60 hover:bg-zinc-800 text-sm text-zinc-300 font-medium cursor-pointer"
                      >
                        Corrigir email
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Rodapé Sutil da Coluna Direita */}
        <div className="w-full max-w-sm sm:max-w-md mx-auto pt-6 flex items-center justify-between text-xs font-mono text-zinc-400 border-t border-zinc-800/60">
          <span className="flex items-center gap-1.5 text-zinc-300">
            <ShieldCheck className="h-3.5 w-3.5 text-harmonia-lime" />
            Autenticação Segura
          </span>
          <span>Harmonia • Open Source</span>
        </div>
      </div>
    </div>
  );
}
