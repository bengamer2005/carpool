import { useMutation, useQueryClient } from '@tanstack/react-query'
import RegisterRoute from "../services/handleRegisterRoute"

export const useRegisterRoute = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: RegisterRoute,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["userRoutes"] })
        },
        onError: (error) => {
            console.error("Error al hacer el refetch de registrar la ruta: ", error)
        }
    })
}