"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { usePlaylist } from "@/hooks/use-playlist";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

const AddSyncPlaylistSchema = z.object({
  url: z
    .string()
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
          "URL deve ser uma playlist válida do YouTube (deve conter 'list=' na URL)",
      }
    ),
  playlistName: z.string().optional(),
  syncType: z.enum(["manual", "automatic"]).default("manual"),
});

type AddSyncPlaylistData = z.infer<typeof AddSyncPlaylistSchema>;

export default function NovaPage() {
  const { isLoading, postSyncPlaylist } = usePlaylist();

  const form = useForm<AddSyncPlaylistData>({
    resolver: zodResolver(AddSyncPlaylistSchema),
    defaultValues: {
      url: "",
      playlistName: "",
      syncType: "manual",
    },
  });

  const onSubmit = async (data: AddSyncPlaylistData) => {
    const urlObj = new URL(data.url);
    const playlistId = urlObj.searchParams.get("list") || "";

    await postSyncPlaylist({ youtubePlaylistId: playlistId });
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Nova Sincronização</h1>
        <p className="text-muted-foreground mt-1">
          Adicione uma nova playlist do YouTube para sincronizar com o Spotify
        </p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Configurar Sincronização</CardTitle>
          <CardDescription>
            Cole a URL da playlist do YouTube que você deseja sincronizar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL da Playlist do YouTube</FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="https://www.youtube.com/playlist?list=..."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Cole o link completo da playlist pública do YouTube
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* <FormField
                control={form.control}
                name="playlistName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Nome da Playlist no Spotify (opcional)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Deixe em branco para usar o nome original"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="syncType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Tipo de Sincronização</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="manual" />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            Manual - Sincronizar apenas quando solicitado
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="automatic" />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            Automática - Sincronizar automaticamente a cada 24
                            horas
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormDescription>
                      A sincronização automática está disponível nos planos Pro
                      e Premium
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

              <Button disabled={isLoading} type="submit" className="w-full">
                Iniciar Sincronização
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
