import type { RequestAccessDTO } from "@harmonia/shared";
import { toast } from "@harmonia/ui";

const RAW_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export function getApiUrl(): string {
  if (typeof window === "undefined") {
    return RAW_API_URL;
  }

  try {
    const url = new URL(RAW_API_URL);
    const currentHost = window.location.hostname;

    const isLoopbackUrl =
      url.hostname === "localhost" || url.hostname === "127.0.0.1";
    const isLoopbackWindow =
      currentHost === "localhost" || currentHost === "127.0.0.1";

    if (isLoopbackUrl && isLoopbackWindow && url.hostname !== currentHost) {
      url.hostname = currentHost;
      return url.origin;
    }

    return url.origin;
  } catch {
    return RAW_API_URL;
  }
}

export async function requestAccess(data: RequestAccessDTO) {
  try {
    const response = await fetch(`${getApiUrl()}/auth/request-access`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Erro ao solicitar acesso");
    }

    toast({
      title: "Pedido enviado!",
      description: "Seu pedido de acesso foi registrado com sucesso.",
      duration: 4000,
    });
  } catch {
    toast({
      variant: "destructive",
      title: "Erro ao fazer o pedido de acesso",
      description: "Ocorreu um erro fazer o pedido de acesso ao sistema",
      duration: 5000,
    });
    return { error: true };
  }
}

