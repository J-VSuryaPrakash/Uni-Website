import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { getMe, login,logout,registerAdmin } from "../api/auth.api";
import type { loginPayload, registerPayload } from "../api/auth.api";

export const useAuth = () => {
    const queryClient = useQueryClient();

    const {
		data: user,
		isLoading,
		isFetching,
	} = useQuery({
		queryKey: ["auth"],
		queryFn: getMe,
		retry: false,
		staleTime: 1000 * 60 * 2,
	});
    
    
    const loginMutation = useMutation({
        mutationFn: (data: loginPayload) => login(data),
        onSuccess: (userData) => {
            queryClient.setQueryData(["auth"], userData);
            queryClient.invalidateQueries({ queryKey: ["auth"] });
        },
    });

    const logoutMutation = useMutation({
        mutationFn: () => logout(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["auth"] });
        },
    });

    const registerMutation = useMutation({
        mutationFn: (data: registerPayload) => registerAdmin(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["auth"] });
        },
    });

    return {
		user,
		isAuthenticated: !!user,
		isLoading: isLoading || isFetching,
		login: loginMutation,
		logout: logoutMutation,
		register: registerMutation,
	};
}