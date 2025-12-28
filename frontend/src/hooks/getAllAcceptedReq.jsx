import { useState } from "react"
import { Calendar, momentLocalizer } from "react-big-calendar"
import moment from "moment"
import Swal from "sweetalert2"
import { useQuery } from "@tanstack/react-query"
import { Notyf } from "notyf"
// servicios
import { getAllAcceptedReq } from "../services/passengerService"
import { useConfirmRide } from "./getMutations"
// img
import noSolicitudes from "../img/noSolicitudesFeedBack.png"

const notyf = new Notyf({
    position: { x: "right", y: "bottom" },
    duration: 5000
})

moment.locale("es")
const localizer = momentLocalizer(moment)

const AcceptedReq = () => {
    const mutation = useConfirmRide()
    const [completed, setCompleted] = useState({})

    // conseguimos toda la info del user en pantalla
    const userData = JSON.parse(localStorage.getItem("user"))

    // usamos useQuery para asignarle el servicio a una queryKey para poder invalidar el query de las de ida
    const { data: acceptedReq = [] } = useQuery({
        queryKey: ["acceptedReq"],
        queryFn: () => getAllAcceptedReq(userData.idUsers),
        enabled: !!userData.idUsers
    })

    // le damos formato a la hora
    const time = (timeString) => {
        const date = new Date(timeString)
        const hour = date.getUTCHours().toString().padStart(2, '0')
        const min = date.getUTCMinutes().toString().padStart(2, '0')

        return `${hour}:${min}`
    }

    // en caso de que no hayan datos se le da feedback al usuario
    if(acceptedReq.length === 0) {
        return (
            <>
                <h2 className="title">MIS SOLICITUDES ACEPTADAS</h2>
                <div className="feedback-wrapper">
                    <div className="image-feedback">
                        <img src={noSolicitudes} alt="no solicitudes pendientes feed back"/>
                    </div>
                    <h2 className="feedback-message">No hay solicitudes aceptadas por aquí</h2>
                </div>
            </>
        )
    }

    // se agrega como eventos todos los viajes aceptados del pasajero
    const events = acceptedReq.map((req) => ({
        id: req.idReq,
        title: `Viaje: ${req.nameDriver}`,
        start: new Date(`${req.fechaViaje}T00:00:00`),
        end: new Date(`${req.fechaViaje}T23:59:59`),
        reqData: req,
        isConfirmed: req.confirmation === 1,
        date: req.fechaViaje,
        tipo: req.routeWay
    }))

    const handleEventClick = (event) => {
        Swal.fire({
            title: "Información del viaje",
            // usamos la clase driverName para capitalizar el nombre del solicitante y toLowerCase para pasarlo a minusculas
            html: `
            <style>
                .driverName {
                    text-transform: capitalize;
                }
            </style>
            
            <br></br> Conductor: <strong class="driverName">${event.reqData.nameDriver.toLowerCase()}</strong>  
            <br></br> Fecha solicitada: <strong>${event.reqData.dayReq}</strong>
            <br></br> Punto de salida: <strong>${event.reqData.start}</strong>
            <br></br> Punto de llegada: <strong>${event.reqData.arrival}</strong>
            <br></br> Hora de salida: <strong>${time(event.reqData.startTime)}</strong>
            <br></br> Hora de llegada estimada: <strong>${time(event.reqData.arrivalTime)}</strong>
            <br></br> Tipo de viaje: <strong>${event.reqData.routeWay}</strong>`,

            confirmButtonText: "Contactar conductor",
            showCancelButton: true,
            cancelButtonText: "Cerrar",
            icon: "info"
        }).then((result) => {
            if(result.isConfirmed) {
                window.open(`https://teams.microsoft.com/l/chat/0/0?users=${encodeURIComponent(event.reqData.emailDriver)}&topicName=${encodeURIComponent("Viaje pendiente en Carpool")}`)
            }
        })
    }

    // agregamos el handle para los checkbox
    const handleCheckboxChange = (id, checked, date, tipo, isConfirmed) => {
        setCompleted((prev) => {
            const updated = { ...prev }

            if(isConfirmed) {
                return notyf.error("No se puede confirmar ya que confirmaste otra del mismo tipo")
            }

            // desmarcar otros viajes del mismo día y mismo tipo
            for (const key in updated) {
                const ev = events.find(e => e.id == key)

                if (ev && ev.date === date && ev.tipo === tipo) {
                    updated[key] = false
                }
            }

            // marcar solo el que dio clic
            updated[id] = checked

            return updated
        })
    }

    // agregamos un evento con el checkbox
    const CustomEvent = ({ event }) => (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {!event.isConfirmed && (
                <input type="checkbox" checked={completed[event.id] || false} onChange={(e) => handleCheckboxChange(event.id, e.target.checked, event.date, event.tipo, event.isConfirmed)} onClick={(e) => e.stopPropagation()}/>
            )}
            <span style={{ textDecoration: completed[event.id] ? "line-through" : "none", opacity: completed[event.id] ? 0.6 : 1, }}>
                {event.title}
            </span>
        </div>
    )
    
    const handleMarkCompleted = () => {
        const marked = Object.keys(completed).filter((id) => completed[id])

        if(marked.length === 0) {
            return notyf.error("Marca al menos un viaje como completado")
        }

        Swal.fire({
            title: "Confirmando viajes...",
            text: "Por favor espere un momento",
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                Swal.showLoading()
            }
        })

        // hacemos el llamado a la api mandando los datos
        const rides = marked
        
        mutation.mutate(rides, {
            onSuccess: () => {
                Swal.fire({
                    title: "Viajes confirmados",
                    text: `Haz marcado ${marked.length} viaje(s) como completados.`,
                    icon: "success"
                }).then(() => {
                    // sse limpian los estados al final
                    setCompleted({})
                })
            },
            onError: (error) => {
                Swal.fire({
                    title: "Error",
                    text: error.message || "Ocurrió un problema al querer confirmar los viajes.",
                    icon: "error",
                    confirmButtonText: "Cerrar"
                })
                console.error("Error al hacer el refetch de las solicitudes de los conductores: ", error)
            }
        })
    }

    return (
        <>
            <h2 className="title">MIS SOLICITUDES ACEPTADAS</h2>

            <div style={{ position: "relative" }}>
                <div className="rbc-toolbar" style={{ position: "absolute", top: 0, right: "10%", zIndex: 10}}>
                    <button type="button" className="rbc-button-link" onClick={handleMarkCompleted}>
                        Marcar completados
                    </button>
                </div>

                <div style={{ height: 600, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Calendar
                    localizer={localizer}
                    events={events}
                    views={["month"]}
                    defaultView="month"
                    selectable
                    onSelectSlot={handleEventClick}
                    onSelectEvent={handleEventClick}
                    showAllEvents
                    components={{
                        event: CustomEvent
                    }}
                    eventPropGetter={(event) => {
                        let backgroundColor = ""

                        if (event.tipo === "entrada") {
                            backgroundColor = "#8AD3F8"
                            if(event.isConfirmed) {
                                backgroundColor = "#c8f8a3ff"
                            }
                        } else if (event.tipo === "salida") {
                            backgroundColor = "#F8A3C9"
                            if(event.isConfirmed) {
                                backgroundColor = "#c8f8a3ff"
                            }
                        }

                        return {
                            style: {
                                backgroundColor,
                                borderRadius: "8px",
                                border: "none",
                                color: "#000",
                                padding: "4px",
                                fontWeight: 600
                            }
                        }
                    }}
                    style={{ height: "100%", width: "80%" }}/>
                </div>

                <div className="calendar-legend">
                    <div className="legend-item">
                        <span className="legend-color entrada"></span>
                        Entrada
                    </div>
                    <div className="legend-item">
                        <span className="legend-color salida"></span>
                        Salida
                    </div>
                    <div className="legend-item">
                        <span className="legend-color aprobada"></span>
                        Confirmadas
                    </div>
                </div>

            </div>
        </>
    )
}

export default AcceptedReq