"use client";

import { usePlaylist } from "@/hooks/use-playlist";
import { HarmoniaMark } from "@harmonia/ui";
import { Badge } from "@harmonia/ui/components/badge";
import { Button } from "@harmonia/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@harmonia/ui/components/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@harmonia/ui/components/form";
import { Input } from "@harmonia/ui/components/input";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ClipboardPaste,
  HelpCircle,
  Link2,
  Music2,
  RefreshCw,
  Sparkles,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const AddSyncPlaylistSchema = z.object({
  url: z
    .string()
    .min(1, "Insira a URL da playlist do YouTube")
    .url("URL inválida")
    .refine(
      (url) => {
        try {
          const urlObj = new URL(url);
          return (
            urlObj.hostname.includes("youtube.com") &&
            urlObj.searchParams.has("list")
          );
        } catch {
          return false;
        }
      },
      {
        message:
          "A URL deve ser uma playlist válida do YouTube (contendo 'list=' no link)",
      }
    ),
  playlistName: z.string().optional(),
  syncType: z.enum(["automatic", "manual"]).default("automatic"),
});

type AddSyncPlaylistData = z.infer<typeof AddSyncPlaylistSchema>;

const educationalSteps = [
  {
    icon: Link2,
    number: "1",
    title: "Leitura da Playlist",
    description: "Extraímos os vídeos, títulos e artistas da playlist pública do YouTube.",
  },
  {
    icon: Sparkles,
    number: "2",
    title: "Correspondência Inteligente",
    description:
      "Limpamos ruídos de videoclipe e encontramos a versão oficial em estúdio no Spotify.",
  },
  {
    icon: Zap,
    number: "3",
    title: "Sincronização Contínua",
    description:
      "A playlist é criada no Spotify e novas músicas são adicionadas automaticamente.",
  },
];

export default function NovaPage() {
  const router = useRouter();
  const { isLoading, postSyncPlaylist } = usePlaylist();
  const [pasteError, setPasteError] = useState(false);

  const form = useForm<AddSyncPlaylistData>({
    resolver: zodResolver(AddSyncPlaylistSchema),
    defaultValues: {
      url: "",
      playlistName: "",
      syncType: "automatic",
    },
    mode: "onChange",
  });

  const watchedUrl = form.watch("url");

  // Detect YouTube playlist ID in real-time
  const detectedPlaylistId = useMemo(() => {
    if (!watchedUrl) return null;
    try {
      const parsed = new URL(watchedUrl);
      if (parsed.hostname.includes("youtube.com")) {
        return parsed.searchParams.get("list");
      }
    } catch {
      return null;
    }
    return null;
  }, [watchedUrl]);

  const handlePasteClipboard = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        const text = await navigator.clipboard.readText();
        if (text) {
          form.setValue("url", text.trim(), { shouldValidate: true });
          setPasteError(false);
          return;
        }
      }
    } catch {
      setPasteError(true);
    }
  };

  const onSubmit = async (data: AddSyncPlaylistData) => {
    try {
      const urlObj = new URL(data.url);
      const playlistId = urlObj.searchParams.get("list") || "";

      const res = await postSyncPlaylist({ youtubePlaylistId: playlistId });
      if (res) {
        router.push("/dashboard/playlists");
      }
    } catch {
      // Error handled by mutation
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-8 max-w-4xl mx-auto">
      {/* Navigation & Header */}
      <div className="space-y-3">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Voltar para a Visão Geral
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Nova Sincronização
          </h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl leading-relaxed">
            Importe qualquer playlist do YouTube e sincronize com a sua conta do
            Spotify. O Harmonia cuidará do matching das faixas de forma contínua.
          </p>
        </div>
      </div>

      {/* Main Form Card */}
      <Card className="card-sculpted border border-white/[0.08] shadow-xl">
        <CardHeader className="pb-4 border-b border-border/60">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-harmonia-lime/10 border border-harmonia-lime/20 flex items-center justify-center text-harmonia-lime">
              <HarmoniaMark className="h-4.5 w-auto" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold">
                Configurar Sincronização
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Preencha os detalhes da playlist para iniciar a importação
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
              {/* Passo 1: URL da Playlist */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-harmonia-lime text-harmonia-green text-[11px] font-bold">
                      1
                    </span>
                    <h3 className="text-sm font-semibold text-foreground">
                      Playlist de Origem (YouTube)
                    </h3>
                  </div>
                  {detectedPlaylistId && (
                    <Badge
                      variant="outline"
                      className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[11px] font-mono font-medium py-0.5"
                    >
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      ID: {detectedPlaylistId}
                    </Badge>
                  )}
                </div>

                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-foreground">
                        URL da Playlist do YouTube
                      </FormLabel>
                      <div className="relative flex items-center">
                        <FormControl>
                          <Input
                            type="url"
                            placeholder="https://www.youtube.com/playlist?list=PLxxxx..."
                            className="pr-24 font-mono text-xs sm:text-sm bg-background/80 border-border/80 focus-visible:ring-harmonia-lime"
                            {...field}
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handlePasteClipboard}
                          className="absolute right-1.5 h-7 px-2 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                          <ClipboardPaste className="h-3.5 w-3.5 mr-1 text-harmonia-lime" />
                          Colar
                        </Button>
                      </div>
                      <FormDescription className="text-[11px] text-muted-foreground">
                        Cole o link completo de uma playlist pública ou não listada do
                        YouTube.
                      </FormDescription>
                      <FormMessage className="text-xs text-destructive" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="playlistName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-foreground">
                        Nome personalizado no Spotify (opcional)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Ex: Minhas Favoritas do YouTube"
                          className="bg-background/80 border-border/80 focus-visible:ring-harmonia-lime text-xs sm:text-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-[11px] text-muted-foreground">
                        Deixe em branco para usar o mesmo título original da playlist no
                        YouTube.
                      </FormDescription>
                      <FormMessage className="text-xs text-destructive" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Passo 2: Modo de Sincronização (Seleção Interativa) */}
              <div className="space-y-4 pt-2 border-t border-border/60">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-harmonia-lime text-harmonia-green text-[11px] font-bold">
                    2
                  </span>
                  <h3 className="text-sm font-semibold text-foreground">
                    Modo de Sincronização
                  </h3>
                </div>

                <FormField
                  control={form.control}
                  name="syncType"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          {/* Card Automática */}
                          <div
                            role="button"
                            tabIndex={0}
                            onClick={() => field.onChange("automatic")}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                field.onChange("automatic");
                              }
                            }}
                            className={`p-4 rounded-xl border text-left transition-all duration-150 cursor-pointer relative ${
                              field.value === "automatic"
                                ? "border-harmonia-lime/80 bg-harmonia-lime/5 shadow-sm ring-1 ring-harmonia-lime/30"
                                : "border-border/70 bg-card hover:bg-muted/40 hover:border-border"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div
                                className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                                  field.value === "automatic"
                                    ? "bg-harmonia-lime text-harmonia-green"
                                    : "bg-muted text-muted-foreground"
                                }`}
                              >
                                <Zap className="h-4 w-4" />
                              </div>
                              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-harmonia-lime/20 text-harmonia-lime border border-harmonia-lime/30">
                                Recomendado
                              </span>
                            </div>
                            <h4 className="text-sm font-semibold text-foreground mb-1">
                              Sincronização 24/7 (Automática)
                            </h4>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              O Harmonia monitora a playlist a cada 24 horas e adiciona
                              novas faixas detectadas no Spotify sem você precisar
                              intervir.
                            </p>
                          </div>

                          {/* Card Manual */}
                          <div
                            role="button"
                            tabIndex={0}
                            onClick={() => field.onChange("manual")}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                field.onChange("manual");
                              }
                            }}
                            className={`p-4 rounded-xl border text-left transition-all duration-150 cursor-pointer relative ${
                              field.value === "manual"
                                ? "border-harmonia-lime/80 bg-harmonia-lime/5 shadow-sm ring-1 ring-harmonia-lime/30"
                                : "border-border/70 bg-card hover:bg-muted/40 hover:border-border"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div
                                className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                                  field.value === "manual"
                                    ? "bg-harmonia-lime text-harmonia-green"
                                    : "bg-muted text-muted-foreground"
                                }`}
                              >
                                <RefreshCw className="h-4 w-4" />
                              </div>
                              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                                Pontual
                              </span>
                            </div>
                            <h4 className="text-sm font-semibold text-foreground mb-1">
                              Sincronização Manual
                            </h4>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              Importa as faixas agora e só atualiza novamente quando
                              você clicar em "Sincronizar" no painel.
                            </p>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Informações de Reafirmação */}
              <div className="rounded-xl border border-white/[0.06] bg-muted/20 p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                  <Sparkles className="h-3.5 w-3.5 text-harmonia-lime" />
                  Garantia de Qualidade de Áudio e Metadados
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Para cada música do YouTube, pesquisamos prioritariamente a gravação
                  original de estúdio no Spotify, descartando introduções de clipes,
                  entrevistas e palmas ao vivo. Se alguma música tiver múltiplos
                  resultados, você poderá escolher o match ideal manualmente.
                </p>
              </div>

              {/* Botão de Disparo */}
              <Button
                disabled={isLoading}
                type="submit"
                size="lg"
                className="w-full bg-harmonia-lime text-harmonia-green hover:brightness-105 active:scale-[0.99] transition-all font-bold text-sm h-11 cursor-pointer shadow-md"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Iniciando Sincronização...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Iniciar Sincronização
                    <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Como funciona (Cards educativos) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs uppercase font-bold tracking-wider text-muted-foreground">
            Como funciona a sincronização
          </h3>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <HelpCircle className="h-3.5 w-3.5" />
            Processamento em segundo plano
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {educationalSteps.map((step) => (
            <div
              key={step.number}
              className="p-4 rounded-xl border border-border/60 bg-card/60 backdrop-blur-xs flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="h-9 w-9 rounded-lg bg-harmonia-lime/10 border border-harmonia-lime/20 flex items-center justify-center text-harmonia-lime">
                  <step.icon className="h-4.5 w-4.5" />
                </div>
                <span className="text-xs font-mono font-bold text-muted-foreground/60">
                  0{step.number}
                </span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground mb-1">
                  {step.title}
                </h4>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
