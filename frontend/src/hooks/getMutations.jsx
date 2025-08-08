import { useMutation, useQueryClient } from '@tanstack/react-query'
// servicios
import { RegisterRoute } from '../services/driverService'
import { sendRequest } from "../services/passengerService"
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
        mutationFn: ({ idRequest, action }) => updateRequestStatus(idRequest, action),
        onSuccess: () => {
            // se invalidan las query de las solicitudes y de las aceptadas, ademas de los viajes pendientes
            queryClient.invalidateQueries({ queryKey: ["request"] })
            queryClient.invalidateQueries({ queryKey: ["acceptedReq"] })
            queryClient.invalidateQueries({ queryKey: ["userRides"] })
        },
        onError: (error) => {
            // si falla le notificamos al usuario con los mensajes del backend
            Swal.fire({
                title: "Error",
                text: error.message || "Ocurrió un problema al aceptar/rechazar la solicitud.",
                icon: "error",
                confirmButtonText: "Cerrar"
            })
            console.error("Error al hacer el refetch de las solicitudes de los conductores: ", error)
        }
    })
}