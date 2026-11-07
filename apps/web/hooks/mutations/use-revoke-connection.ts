import { queryKeys } from "@/hooks/queries/query-keys";
import { toast } from "@harmonia/ui/hooks/use-toast";
import { ApiError } from "@/lib/services/api";
import { userService } from "@/lib/services/user-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function useRevokeConnectionMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (serviceConnectionId: string) =>
      userService.revokeConnection(serviceConnectionId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.user.connections() }),
        queryClient.invalidateQueries({ queryKey: queryKeys.user.summary() }),
      ]);
    },
    onError: (error) => {
      if (error instanceof ApiError && error.status === 401) {
        toast({ variant: "destructive", title: "Não autenticado" });
        router.push("/login");
        return;
      }
      const message =
        error instanceof Error ? error.message : "Erro desconhecido";
      toast({ variant: "destructive", title: "Erro", description: message });
    },
  });
}
