import { Calendar, momentLocalizer } from "react-big-calendar"
import moment from "moment"
import Swal from "sweetalert2"
import "moment/locale/es"
import "react-big-calendar/lib/css/react-big-calendar.css"

moment.locale("es")
const localizer = momentLocalizer(moment)

const GetAllRides = ({ rides }) => {
    const events = rides.map((ride) => ({
        id: ride.idReq,
        title: `Viaje: ${ride.solicitante}`,
        start: new Date(`${ride.fechaViaje}T00:00:00`),
        end: new Date(`${ride.fechaViaje}T23:59:59`),
        rideData: ride
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
            
            <br></br> Solicitante: <strong class="driverName">${event.rideData.solicitante.toLowerCase()}</strong>  
            <br></br> Fecha solicitada: <strong>${event.rideData.fechaSolicitada}</strong>
            <br></br> Id de ruta: <strong>${event.rideData.idRutaDelViaje}</strong>`,

            confirmButtonText: "Contactar pasajero",
            showCancelButton: true,
            cancelButtonText: "Cerrar",
            icon: "info"
        }).then((result) => {
            if(result.isConfirmed) {
                window.open(`https://teams.microsoft.com/l/chat/0/0?users=${encodeURIComponent(event.rideData.solicitanteCorreo)}&topicName=${encodeURIComponent("Viaje pendiente en Carpool")}`)
            }
        })
    }

    return (
        <>
            <h2 className="title">MIS VIAJES PENDIENTES</h2>

            <div style={{ height: 600, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Calendar
                localizer={localizer}
                events={events}
                views={["month"]}
                defaultView="month"
                selectable
                onSelectSlot={handleEventClick}
                onSelectEvent={handleEventClick}
                style={{ height: "100%", width: "80%" }}/>
            </div>
        </>
    )
}

export default GetAllRides