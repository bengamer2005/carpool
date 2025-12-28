import { useEffect, useRef } from "react"
import { useQueryClient } from '@tanstack/react-query'
import { Notyf } from "notyf"
const APIs = import.meta.env.VITE_API_URL

const notyf = new Notyf({
    position: { x: "right", y: "bottom" },
    // ponemos dismissible en true para que se habilite que el usuario quite manualmente la notificacion
    dismissible: true,
    // y usamos duration 0 para que o tenga limite de tiempo
    duration: 0
})

const useSSEListen = (userId) => {
    const queryClient = useQueryClient()
    const eventSourceRef = useRef(null)

    useEffect(() => {
        
        // en caso de que no exisa iserId notificamos por consola
        if(!userId) {
            console.warn("SSE no se conecto por falta del userId en localStorage")
            return
        }

        // mandamos el evento y pasamos el userId
        const eventSource = new EventSource(`${APIs}/sse/events?userId=${userId}`)
        eventSourceRef.current = eventSource

        eventSource.onmessage = (event) => {
            try {
                // parseamos los datos
                const data = JSON.parse(event.data)

                // si el tipo es new-request invalidamos las querys que se deben invalidar con el evento
                if(data.type === "new-request" && data.userId === String(userId)) {
                    queryClient.invalidateQueries({ queryKey: ["goingRoutes"] })
                    queryClient.invalidateQueries({ queryKey: ["returnRoutes"] })
                    queryClient.invalidateQueries({ queryKey: ["request"] })
        
                    // mandamos notificacion con notyf para notificar al conductor
                    notyf.success("Se ha solicitado una ruta tuya!")
                }

                // si el tipo es acceted-request invalidamos las correspondientes querys 
                if(data.type === "accepted-request" && data.userId === String(userId)) {
                    queryClient.invalidateQueries({ queryKey: ["goingRoutes"] })
                    queryClient.invalidateQueries({ queryKey: ["returnRoutes"] })
                    queryClient.invalidateQueries({ queryKey: ["request"] })
                    queryClient.invalidateQueries({ queryKey: ["acceptedReq"] })
                    queryClient.invalidateQueries({ queryKey: ["userRides"] })

                    // notificamos al pasajero de su solicitud aceptada
                    notyf.success("Han aceptado una solicitud tuya!")
                }
                
            } catch (error) {
                console.error("fallo al parsear la data de la conexion SSE: ", error)
            }
        }

        // si llega a pasar un error lo notificamos
        eventSource.onerror = (error) => {
            console.error("error en la conexion SSE: ", error)
        }

        // cerramos la sesion
        return () => {
            eventSource.close()
            eventSource.current = null
        }
    }, [userId, queryClient])
}

export default useSSEListen