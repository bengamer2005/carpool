import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
// servicios
import { getAllAcceptedReq } from "../services/passengerService"
// componentes
import { CardAcceptedReq } from "../components/cards"
// img
import noSolicitudes from "../img/noSolicitudesFeedBack.png"

const AcceptedReq = () => {
    // usamos useQuery para asignarle el servicio a una queryKey para poder invalidar el query de las de ida
    const { data: acceptedReq = [] } = useQuery({
        queryKey: ["acceptedReq"],
        queryFn: getAllAcceptedReq
    })

    // le asignamos un estado a las const y ponemos un limite de cards por pagina
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 3

    // logica de la paginacion 
    const totalPages = Math.ceil(acceptedReq.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentAcceptedReq = acceptedReq.slice(startIndex, endIndex)

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

    return (
        <>
            <h2 className="title">MIS SOLICITUDES ACEPTADAS</h2>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "20px", margin: "0.5%" }}>

                {/* botones para la paginacion IZQ*/}
                <div style={{ position: "sticky", top: "100px" }}>
                    <button className="button-acceptedReq" onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))} disabled={currentAcceptedReq === 1}>
                        <div className="button-box-acceptedReq">
                            <span className="button-elem-acceptedReq">
                                <svg viewBox="0 0 46 40" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M46 20.038c0-.7-.3-1.5-.8-2.1l-16-17c-1.1-1-3.2-1.4-4.4-.3-1.2 1.1-1.2 3.3 0 4.4l11.3 11.9H3c-1.7 0-3 1.3-3 3s1.3 3 3 3h33.1l-11.3 11.9c-1 1-1.2 3.3 0 4.4 1.2 1.1 3.3.8 4.4-.3l16-17c.5-.5.8-1.1.8-1.9z"></path>
                                </svg>
                            </span>
                            <span className="button-elem-acceptedReq">
                                <svg viewBox="0 0 46 40">
                                    <path d="M46 20.038c0-.7-.3-1.5-.8-2.1l-16-17c-1.1-1-3.2-1.4-4.4-.3-1.2 1.1-1.2 3.3 0 4.4l11.3 11.9H3c-1.7 0-3 1.3-3 3s1.3 3 3 3h33.1l-11.3 11.9c-1 1-1.2 3.3 0 4.4 1.2 1.1 3.3.8 4.4-.3l16-17c.5-.5.8-1.1.8-1.9z"></path>
                                </svg>
                            </span>
                        </div>
                    </button>
                </div>

                {/* se muestran los datos del array con CardAcceptedReq */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center", flexGrow: 1 }}>
                    {currentAcceptedReq.map((req) => (
                        <CardAcceptedReq
                        key={req.idReq}
                        nameDriver={req.nameDriver}
                        start={req.start}
                        arrival={req.arrival}
                        startTime={time(req.startTime)}
                        arrivalTime={time(req.arrivalTime)}                    
                        nameStatus={req.nameStatus}
                        routeWay={req.routeWay}
                        dayReq={req.dayReq}
                        emailDriver={req.emailDriver}/>
                    ))}
                </div>

                {/* botones para la paginacion DER*/}
                <div style={{ position: "sticky", top: "100px" }}>
                    <button className="button-acceptedReq" style={{ transform: "rotate(180deg)" }} onClick={() => setCurrentPage((page) => Math.min(page + 1, totalPages))} disabled={currentAcceptedReq === totalPages} >
                        <div className="button-box-acceptedReq">
                            <span className="button-elem-acceptedReq">
                                <svg viewBox="0 0 46 40" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M46 20.038c0-.7-.3-1.5-.8-2.1l-16-17c-1.1-1-3.2-1.4-4.4-.3-1.2 1.1-1.2 3.3 0 4.4l11.3 11.9H3c-1.7 0-3 1.3-3 3s1.3 3 3 3h33.1l-11.3 11.9c-1 1-1.2 3.3 0 4.4 1.2 1.1 3.3.8 4.4-.3l16-17c.5-.5.8-1.1.8-1.9z"></path>
                                </svg>
                            </span>
                            <span className="button-elem-acceptedReq">
                                <svg viewBox="0 0 46 40">
                                    <path d="M46 20.038c0-.7-.3-1.5-.8-2.1l-16-17c-1.1-1-3.2-1.4-4.4-.3-1.2 1.1-1.2 3.3 0 4.4l11.3 11.9H3c-1.7 0-3 1.3-3 3s1.3 3 3 3h33.1l-11.3 11.9c-1 1-1.2 3.3 0 4.4 1.2 1.1 3.3.8 4.4-.3l16-17c.5-.5.8-1.1.8-1.9z"></path>
                                </svg>
                            </span>
                        </div>
                    </button>
                </div>

            </div>

        </>
    )
}

export default AcceptedReq