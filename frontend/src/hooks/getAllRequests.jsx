import { useState } from "react"
import { Notyf } from "notyf"
import Swal from "sweetalert2"
// commponentes
import { RequestButtons } from "../components/requestButtons"
// hooks
import { useUdateRequestStatus } from "./getMutations"
// img
import noSolicitudes from "../img/noSolicitudesFeedBack.png"

const notyf = new Notyf({
    position: { x: "right", y: "bottom" },
    duration: 5000,
})

const DriverRequests = ({ requests }) => {
    const [reqAccepted, setReqAccepted] = useState([])
    const [reqRejected, setReqRejected] = useState([])

    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 7

    const totalPages = Math.ceil(requests.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentReq = requests.slice(startIndex, endIndex)

    const mutation = useUdateRequestStatus()

    // en caso de que no hayan datos se le da feedback al usuario
    if(requests.length === 0) {
        return (
            <>
                <h2 className="title-white">MIS SOLICITUDES PENDIENTES</h2>
                <div className="feedback-wrapper">
                    <div className="image-feedback">
                        <img src={noSolicitudes} alt="no solicitudes pendientes feed back"/>
                    </div>
                    <h2 className="feedback-message">No hay solicitudes pendientes por aquí</h2>
                </div>
            </>
        )
    }

    // handle para los checkbox
    const handleCheckboxChange = (idReq, type) => {
        if(type === "accepted") {
            if(reqAccepted.includes(idReq)) {
                setReqAccepted(reqAccepted.filter(id => id !== idReq))
            } else {
                setReqRejected(reqRejected.filter(id => id !== idReq))
                setReqAccepted([...reqAccepted, idReq])
            }
        } else if(type === "rejected") {
            if (reqRejected.includes(idReq)) {
                setReqRejected(reqRejected.filter(id => id !== idReq))
            } else {
                setReqAccepted(reqAccepted.filter(id => id !== idReq))
                setReqRejected([...reqRejected, idReq])
            }
        }
    }

    // verifica si una solicitud esta seleccionada
    const isAccepted = (idReq) => reqAccepted.includes(idReq)
    const isRejected = (idReq) => reqRejected.includes(idReq)

    // handle para el cambio de estatus+
    const handleStatusChange = () => {
        if(reqAccepted.length === 0 && reqRejected.length === 0) {
            return notyf.error("Debes seleccionar al menos una solicitud para poder Aceptarla/Rechazarla")
        }

        Swal.fire({
            title: "Procesando solicitudes...",
            text: "Por favor espere un momento",
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                Swal.showLoading()
            }
        })

        // hacemos el llamado a la api y mandamos los datos
        const data = { reqAccepted, reqRejected }
        const totalReq = reqAccepted.length + reqRejected.length

        mutation.mutate(data, {
            onSuccess: () => {
                Swal.fire({
                    title: "Solicitudes procesadas",
                    html: `
                        <p><strong>Aceptadas:</strong> ${reqAccepted.length}</p>
                        <p><strong>Rechazadas:</strong> ${reqRejected.length}</p>
                        <p><strong>Total:</strong> ${totalReq}</p>
                    `,
                    icon: "success",
                    confirmButtonText: "Aceptar"
                }).then(() => {
                    // sse limpian los estados al final
                    setReqAccepted([])
                    setReqRejected([])
                })
            }, 
            onError: (error) => {
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

    return (
        <>
            <h2 className="title-white">MIS SOLICITUDES PENDIENTES</h2>
            
            <table className="users-table" border={1} cellPadding={8}>
                <thead>
                    <tr>
                        <th>Ruta Id</th>
                        <th>Día Solicitado</th>
                        <th>Solicitante</th>
                        <th>Contactar</th>
                        <th>Rechazar/Aceptar</th>
                    </tr>
                </thead>

                <tbody>
                    {currentReq.map((req) => {
                        const accepted = isAccepted(req.idReq)
                        const rejected = isRejected(req.idReq)
                        const hasSelection = accepted || rejected

                        return (
                            <tr key={req.idReq}>
                                <td>{req.idRoute}</td>
                                <td>{req.dayReq}</td>
                                <td style={{ textTransform: "capitalize" }}>{req.reqOwner.toLowerCase()}</td>
                                <td>
                                    {(() => {
                                        const { icon, label } = RequestButtons["teams"]

                                        return (
                                            <button className={`fill-hover-button-teams`} onClick={() => window.open(`https://teams.microsoft.com/l/chat/0/0?users=${encodeURIComponent(req.reqEmail)}&topicName=${encodeURIComponent("Viaje pendiente en Carpool")}`)}>
                                                    {icon}
                                                    <span>{label}</span>
                                            </button>
                                        )
                                    })()}
                                </td>
                                <td style={{ padding: 0 }}>
                                    <div style={{ display: "flex", alignItems: "stretch",height: "100%",minHeight: "50px" }}>
                                        {/* Zona Rechazar */}
                                        <div
                                            onClick={() => handleCheckboxChange(req.idReq, "rejected")}
                                            style={{
                                                width: rejected ? "75%" : (hasSelection ? "25%" : "50%"),
                                                backgroundColor: rejected ? "#ef5350" : "#ffcdd2",
                                                cursor: "pointer",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                transition: "all 0.3s ease",
                                                borderRight: "2px solid white",
                                                fontSize: "20px",
                                                userSelect: "none"
                                            }}
                                        >
                                            <input type="checkbox" name="reqRejected" id={`reject-${req.idReq}`}checked={rejected} onChange={() => {}}style={{ display: "none" }}/>
                                            <span></span>
                                        </div>

                                        {/* Zona Aceptar */}
                                        <div
                                            onClick={() => handleCheckboxChange(req.idReq, "accepted")}
                                            style={{
                                                width: accepted ? "75%" : (hasSelection ? "25%" : "50%"),
                                                backgroundColor: accepted ? "#66bb6a" : "#c8e6c9",
                                                cursor: "pointer",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                transition: "all 0.3s ease",
                                                fontSize: "20px",
                                                userSelect: "none"
                                            }}
                                        >
                                            <input type="checkbox" name="reqAccepted" id={`accept-${req.idReq}`}checked={accepted}onChange={() => {}}style={{ display: "none" }}/>
                                            <span></span>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>

            <div style={{ marginTop: "15px", display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", flexWrap: "wrap"}}>
                <button className="paginacion1" onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
                    </svg>
                    <span>Anterior</span>
                </button>

                <span style={{ margin: "0 10px" }}>
                    Pagina {currentPage} de {totalPages}
                </span>

                <button className="paginacion2" onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>
                    <span>Siguiente</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-right" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"/>
                    </svg>
                </button>
            </div>
            <div className="button-container-send-answer">
                <button className="button-send-response" onClick={handleStatusChange}>
                    <span className="button-send-response-text">Mandar respuestas</span>
                    <span className="button-send-response-icon">
                        <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" data-icon="paper-plane" width="20px" aria-hidden="true">
                            <path d="M476 3.2L12.5 270.6c-18.1 10.4-15.8 35.6 2.2 43.2L121 358.4l287.3-253.2c5.5-4.9 13.3 2.6 8.6 8.3L176 407v80.5c0 23.6 28.5 32.9 42.5 15.8L282 426l124.6 52.2c14.2 6 30.4-2.9 33-18.2l72-432C515 7.8 493.3-6.8 476 3.2z" fill="currentColor"></path>
                        </svg>
                    </span>
                </button>
            </div>
        </>
    )
}

export default DriverRequests