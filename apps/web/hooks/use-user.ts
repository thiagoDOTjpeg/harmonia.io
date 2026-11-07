import { useRevokeConnectionMutation } from "@/hooks/mutations/use-revoke-connection";
import { useCurrentUser } from "@/hooks/queries/use-current-user";
import { useQueryClient } from "@tanstack/react-query";

export function useUser() {
  const queryClient = useQueryClient();
  const { data: user, isLoading: isLoadingUser } = useCurrentUser();
  const revokeConnectionMutation = useRevokeConnectionMutation();

  const revokeConnection = async (serviceConnectionId: string) => {
    try {
      await revokeConnectionMutation.mutateAsync(serviceConnectionId);
    } catch {
      return null;
    }
  };

  const clearUser = () => {
    queryClient.clear();
  };

  return {
    user: user ?? null,
    isLoading: isLoadingUser || revokeConnectionMutation.isPending,
    revokeConnection,
    clearUser,
  };
}
