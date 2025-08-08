import Swal from "sweetalert2"
import styled from "styled-components"
// hooks
import { useUdateRequestStatus } from '../hooks/getMutations'

// card para las solicitudes
export const CardRequest = ({ username, idReq, idRoute, dayRequest }) => {
    const { mutate } = useUdateRequestStatus()

    const handleStatusChange = (action) => {
        Swal.fire({
            title: "Procesado solicitud ...",
            text: "Por favor espere un momento en lo que le notificamos al pasajero su respuesta",
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                // se usa el showLoading para dar feedback al conductor que se esta procesando su respuesta 
                Swal.showLoading()
            }
        })

        // se hace el put de la solicitud
        mutate({
            idRequest: idReq, action
        }, {
            // si todo sale bien le decimos al conductor que todo salio bien y cual fue su accion 
            onSuccess: () => {
                Swal.fire({
                    title: "Solicitud procesada",
                    text: `La solicitud fue ${action === "accepted" ? "aceptada" : "rechazada"} correctamente`,
                    icon: "success",
                    allowOutsideClick: false,
                    confirmButtonText: "Aceptar"
                })
            }, 
            onError: (error) => {
                Swal.fire({
                    title: "Error",
                    text: error.message || "Ocurrio un error al procesar una solicitud",
                    icon: "error",
                    confirmButtonText: "Cerrar"
                })
                console.error("Error en el componente CardRequest")
            }
        })
    }

    return (
        <RequestCard>
            <div style={{ padding: "20px" }}>
                <div className="card">
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-bell" viewBox="0 0 16 16">
                        <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2M8 1.918l-.797.161A4 4 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4 4 0 0 0-3.203-3.92zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5 5 0 0 1 13 6c0 .88.32 4.2 1.22 6"/>
                    </svg>

                    <p className="reqHeading">¡Solicitud de ruta!</p>
                    <p className="reqDescription">El usuario <strong style={{ textTransform: "capitalize" }}>{username.toLowerCase()}</strong> ha solicitado su ruta con id: <strong>{idRoute}</strong></p>
                    <p className="reqDescription">Para el día: <strong style={{ textTransform: "capitalize" }}>{dayRequest}</strong></p>

                    <div className="buttonContainer">
                        {/* se le asigna a cada boton su respectiva accion */}
                        <button className="declineButton" onClick={() => handleStatusChange("rejected")}>Rechazar</button>
                        <button className="acceptButton" onClick={() => handleStatusChange("accepted")}>Aceptar</button>
                    </div>
                </div>
            </div>
        </RequestCard>
    )
}

// card para los viajes pendientes
export const CardRides = ({ username, idRoute, dayRequest, startTime, arrivalTime, routeWay }) => {

    // usamos swal para mostar datos extras del viaje
    const moreInfo = () => {
        Swal.fire({
            title: "Informacion del viaje",
            // usamos la clase driverName para capitalizar el nombre del solicitante y toLowerCase para pasarlo a minusculas
            html: `
                <style>
                    .driverName {
                        text-transform: capitalize;
                    }
                </style>
                
                Ruta del viaje: <strong>${idRoute}</strong>
                <br></br> Tipo de viaje: <strong class="driverName">${routeWay.toLowerCase()}</strong> 
                <br></br> Solicitante: <strong class="driverName">${username.toLowerCase()}</strong> 
                <br></br> Fecha del viaje: <strong>${dayRequest}</strong>
                <br></br> Hora de inicio de viaje: <strong>${startTime}</strong>
                <br></br> Hora de llegada: <strong>${arrivalTime}</strong>`,

            confirmButtonText: "Cerrar",
            icon: "info"
        })
    }

    return (
        <RidesCard>
            <div className="card-rides" style={{ marginBottom: "25px" }}>
                <div className="details-rides">
                    <p className="title-rides">{username}</p>
                    <p className="date-rides">{dayRequest}</p>
                </div>

                {/* le asignamos al boton la funcion moreInfo para mostrar la info del viaje */}
                <button className="button-rides" onClick={() => moreInfo()}>Mas Info</button>
            </div>
        </RidesCard>
    )
}

// card para los viajes aceptados
export const CardAcceptedReq = ({ idReq, dayReq, nameDriver, emailDriver, start, arrival, startTime, arrivalTime, nameStatus, routeWay  }) => {

    // usamos swal para mostar la info del viaje
    const moreInfo = () => {
        Swal.fire({
            title: "Informacion del viaje",
            // usamos la clase driverName para capitalizar el nombre del solicitante y toLowerCase para pasarlo a minusculas
            html: `
            <style>
                .driverName {
                    text-transform: capitalize;
                }
            </style>
            
            <br></br>Conductor: <strong class="driverName">${nameDriver.toLowerCase()}</strong>  
            <br></br> Punto de partida: <strong>${start}</strong> 
            <br></br> Punto de llegada: <strong>${arrival}</strong> 
            <br></br> Hora de inicio de viaje: <strong>${startTime}</strong> 
            <br></br> Hora de llegada: <strong>${arrivalTime}</strong>
            <br></br> Dia del viaje: <strong>${dayReq}</strong>`,
            
            confirmButtonText: "Cerrar",
            icon: "info"
        })
    }

    // guardamos la url a teams en una constante, pasandole el correo del conductor, usamos encodeURIComponent para que se encargue de la sintaxis de la url
    const teamsUrl = `https://teams.microsoft.com/l/chat/0/0?users=${encodeURIComponent(emailDriver)}&topicName=${encodeURIComponent("Solicitud de ruta Carpool")}`

    return (
        <AcceptedReqCard>
            <div className="card-accepted-req">
                <div className="header-accepted-req">
                    <span className="icon-accepted-req">
                        <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path clipRule="evenodd" d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z" fillRule="evenodd"></path>
                        </svg>
                    </span>

                    <p className="alert-accepted-req">¡Solicitud aceptada!</p>
                </div>

                <p className="message-accepted-req">Tu solicitud para la ruta de <strong>{routeWay}</strong> del conductor <strong style={{ textTransform: "capitalize" }}>{nameDriver.toLowerCase()}</strong> fue <strong>{nameStatus}</strong></p>

                <div className="actions-accepted-req">
                    <a className="teams-accepted-req" href={teamsUrl} target="_blank" rel="noopener noreferrer">Mandar mensaje</a>
                    <button className="info-accepted-req" onClick={() => moreInfo()}>Ver info</button>
                </div>
            </div>
        </AcceptedReqCard>
    )
}
// estilos
const RequestCard = styled.div `
    .card {
        width: 300px;
        height: 220px;
        background-color: rgb(237, 237, 237);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 20px 30px;
        position: relative;
        overflow: hidden;
        box-shadow: 2px 2px 20px rgba(0, 0, 0, 0.062);
    }

    #cookieSvg {
        width: 50px;
    }

    #cookieSvg g path {
        fill: rgb(97, 81, 81);
    }

    .reqHeading {
        font-size: 1.2em;
        font-weight: 800;
        color: rgb(26, 26, 26);
    }

    .reqDescription {
        text-align: center;
        font-size: 0.75em;
        font-weight: 600;
        color: rgb(89, 89, 89);
    }

    .buttonContainer {
        padding-top: 8px;
        display: flex;
        gap: 25px;
        flex-direction: row;
    }

    .declineButton {
        width: 80px;
        height: 30px;
        background-color:rgb(255, 87, 87);
        transition-duration: .2s;
        border: none;
        color: rgb(241, 241, 241);
        cursor: pointer;
        font-weight: 600;
        border-radius: 20px;
    }

    .acceptButton {
        width: 80px;
        height: 30px;
        background-color: rgba(52, 203, 72, 0.8);
        transition-duration: .2s;
        color: rgb(241, 241, 241);
        border: none;
        cursor: pointer;
        font-weight: 600;
        border-radius: 20px;
    }

    .acceptButton:hover {
        background-color: rgb(54, 185, 71);
        transition-duration: .2s;
    }

    .declineButton:hover {
        background-color:rgb(255, 40, 40);
        transition-duration: .2s;
    }
`

const RidesCard = styled.div`
    .card-rides {
        width: 150px;
        height: 100px;
        border-radius: 20px;
        background: #f5f5f5;
        position: relative;
        padding: 1.8rem;
        border: 2px solid #c3c6ce;
        transition: 0.5s ease-out;
        overflow: visible;
    }

    .details-rides {
        color: black;
        height: 100%;
        display: grid;
        place-content: center;
    }

    .button-rides {
        transform: translate(-50%, 125%);
        width: 60%;
        border-radius: 1rem;
        border: none;
        background-color: #7099f0;
        color: #fff;
        font-size: 1rem;
        padding: .5rem 1rem;
        position: absolute;
        left: 50%;
        bottom: 0;
        opacity: 0;
        transition: 0.3s ease-out;
        cursor: pointer;
    }

    /*Text*/
    .title-rides {
        font-size: 1em;
        font-weight: bold;
        color: rgb(134, 134, 134);
    }

    .date-rides {
        color: rgb(134, 134, 134);
    }

    /*Hover*/
    .card-rides:hover {
        border-color: #008bf8;
        box-shadow: 0 4px 18px 0 rgba(0, 0, 0, 0.25);
    }

    .card-rides:hover .button-rides {
        transform: translate(-50%, 50%);
        opacity: 1;
    }
`

const AcceptedReqCard = styled.div`
    .card-accepted-req {
        max-width: 320px;
        border-width: 1px;
        border-color: rgba(0, 0, 0, 1);
        border-radius: 1rem;
        background-color: rgba(227, 227, 227, 1);
        padding: 1rem;
    }

    .header-accepted-req {
        display: flex;
        align-items: center;
        grid-gap: 1rem;
        gap: 1rem;
    }

    .icon-accepted-req {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 9999px;
        background-color: rgba(81, 81, 81, 1);
        padding: 0.5rem;
        color: rgba(255, 255, 255, 1);
    }

    .icon-accepted-req svg {
        height: 1rem;
        width: 1rem;
    }

    .alert-accepted-req {
        font-weight: 600;
        color: rgba(107, 114, 128, 1);
    }

    .message-accepted-req {
        margin-top: 1rem;
        color: rgba(107, 114, 128, 1);
    }

    .actions-accepted-req {
        margin-top: 1.5rem;
    }

    .actions-accepted-req a {
        text-decoration: none;
    }

    .info-accepted-req, .teams-accepted-req {
        display: inline-block;
        border-radius: 0.5rem;
        width: 100%;
        padding-top: 0.40rem;
        padding-bottom: 0.40rem;
        text-align: center;
        font-size: 0.875rem;
        line-height: 1.25rem;
        font-weight: 600;
    }

    .teams-accepted-req {
        background-color: #444791;
        color: rgba(255, 255, 255, 1);
        cursor: pointer;
    }

    .info-accepted-req {
        margin-top: 0.5rem;
        background-color: rgba(255, 255, 255, 1);
        color: rgba(107, 114, 128, 1);
        transition: all .15s ease;
        border-color: rgba(0, 0, 0, 1);
        border: none;
        cursor: pointer;
    }

    .info-accepted-req:hover {
        background-color: rgba(227, 227, 227, 1);
    }
`
