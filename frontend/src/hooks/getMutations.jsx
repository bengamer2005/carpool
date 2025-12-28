import { useMutation, useQueryClient } from '@tanstack/react-query'
// servicios
import { RegisterRoute, setNotVisibleRoute } from '../services/driverService'
import { sendRequest, confirmRide } from "../services/passengerService"
import { updateRequestStatus } from '../services/driverService'
import Swal from 'sweetalert2'

// hacemos la mutacion para cuando se haga un post de una ruta
export const useRegisterRoute = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: RegisterRoute,
        onSuccess: () => {
            // invalidamos la query de las rutas del conductor para que se haga el refetch
            queryClient.invalidateQueries({ queryKey: ["userRoutes"] })
        },
        onError: (error) => {
            console.error("Error al hacer el refetch de registrar la ruta: ", error)
        }
    })
}

// hacemos la mutacion para cuando se mande una solicitud
export const useSendRequest = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: sendRequest,
        onSuccess: () => {
            // si se manda correctamente la solicitud notificamos al usuario
            Swal.fire({
                title: "¡Solicitud enviada!",
                text: "Tu solicitud fue enviada al conductor correctamente.",
                icon: "success",
                confirmButtonText: "Aceptar"
            })

            // invalidamos las query para las rutas de ida y de regreso, ademas de las solicitudes
            queryClient.invalidateQueries({ queryKey: ["goingRoutes"] })
            queryClient.invalidateQueries({ queryKey: ["returnRoutes"] })
            queryClient.invalidateQueries({ queryKey: ["request"] })
        },
        onError: (error) => {
            // si falla le notificamos al usuario con los mensajes del backend
            Swal.fire({
                title: "Error",
                text: error.message || "Ocurrió un problema al enviar la solicitud.",
                icon: "error",
                confirmButtonText: "Cerrar"
            })
            console.error("Error al hacer el refetch de una solicitud: ", error)
        }
    })
}

// hacemos la mutacion para cuando se actualiza el estatus de una solicitud
export const useUdateRequestStatus = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: updateRequestStatus,
        onSuccess: () => {
            // se invalidan las query de las solicitudes y de las aceptadas, ademas de los viajes pendientes
            queryClient.invalidateQueries({ queryKey: ["request"] })
            queryClient.invalidateQueries({ queryKey: ["acceptedReq"] })
            queryClient.invalidateQueries({ queryKey: ["userRides"] })
        }
    })
}

export const useSetNotVisibleRoute = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ idUserRoute }) => setNotVisibleRoute(idUserRoute),
        onSuccess: () => {
            // se invalidan las query de las solicitudes y de las aceptadas, ademas de los viajes pendientes
            queryClient.invalidateQueries({ queryKey: ["goingRoutes"] })
            queryClient.invalidateQueries({ queryKey: ["returnRoutes"] })
            queryClient.invalidateQueries({ queryKey: ["userRoutes"] })
        },
        onError: (error) => {
            // si falla le notificamos al usuario con los mensajes del backend
            Swal.fire({
                title: "Error",
                text: error.message || "Ocurrió un problema querer eliminar tu ruta.",
                icon: "error",
                confirmButtonText: "Cerrar"
            })
            console.error("Error al hacer una eliminacion de ruta: ", error)
        }
    })
}

export const useConfirmRide = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: confirmRide,
        onSuccess: () => {
            // se invalidan las query de las solicitudes y de las aceptadas, ademas de los viajes pendientes
            queryClient.invalidateQueries({ queryKey: ["request"] })
            queryClient.invalidateQueries({ queryKey: ["acceptedReq"] })
            queryClient.invalidateQueries({ queryKey: ["userRides"] })
        }
    })
}