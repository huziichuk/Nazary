import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useNavigate} from "react-router-dom";
import type {ILoginDto} from "@/types/authTypes.ts";
import {apiLogin} from "@/api/auth.ts";
import {AxiosError} from "axios";

export const useLogin = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: (dto: ILoginDto) =>
            apiLogin(dto),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ["me"]});
            navigate("/dashboard");
        },
        onError: (e:unknown) => {
            if (e instanceof AxiosError ) {
                if (e.response?.status === 403) {
                    navigate("/verify-email");
                }
            }
        },
    });

    return {
        login: mutation.mutate,
        loginAsync: mutation.mutateAsync,
        isLoading: mutation.status === "pending",
        isSuccess: mutation.status === "success",
        isError: mutation.status === "error",
        error: mutation.error,
    };
};
