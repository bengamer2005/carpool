import { useEffect } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import Swal from "sweetalert2"
// hook

// componentes
import Header from "../components/header"
// servicios
import { updateRequestStatus } from "../services/driverService"

const ConfirmRequest = () => {
    const [searchParams] = useSearchParams()
    const changePage = useNavigate()
    
    
    useEffect(() => {
        const idRequest = searchParams.get("idRequest")
        const action = searchParams.get("action")
        
        const handleRequest = async () => {
            try {
                
                // para darle feedback al user que se esta procesando su respuesta
                Swal.fire({
                    title: "Procesando solicitud",
                    text: "Espere un momento . . .",
                    allowEscapeKey: false,
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading()
                    }
                })

                // si faltan parametros lanzamos un nuevo error 
                if(!idRequest || !action) {
                    throw new Error("Paramentros invalidos | faltantes")
                }

                // actualizamos la solicitud con la action correspondiente
                await updateRequestStatus(idRequest, action)

                // le notificamos la actualizacion
                await Swal.fire({
                    title: "Solicitud procesada",
                    text: `La solicitud fue ${action === "accepted" ? "aceptada" : "rechazada"} correctamente`,
                    icon: "success",
                    confirmButtonText: "Ir al inicio",
                })

                changePage("/")
            } catch (error) {

                // si pasa algun error se lo notificamos con la respuesta del backend
                await Swal.fire({
                    title: "ERROR",
                    text: error.message,
                    icon: "error",
                    confirmButtonText: "Volver al inicio"
                })

                changePage("/")
            }
        }

        handleRequest()
    }, [])
     
    return (
        <>
            <Header></Header>
        </>
    )
}

export default ConfirmRequest