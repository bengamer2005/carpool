import { useState } from "react"
import ReactDOM from "react-dom/client"
import Swal from "sweetalert2"
import { Calendar } from "react-multi-date-picker"
// hooks
import { useSendRequest } from "../hooks/getMutations"
// componentes
import { RequestButtons } from "./requestButtons"

const RouteTable = ({drivers, refetch}) => {
    // conseguimos toda la info del usuario en pantalla
    const userData = JSON.parse(localStorage.getItem("user"))
    
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5

    const totalPages = Math.ceil(drivers.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const ccurrentDrivers = drivers.slice(startIndex, endIndex)

    const time = (timeString) => {
        const date = new Date(timeString)
        const hour = date.getUTCHours().toString().padStart(2, '0')
        const min = date.getUTCMinutes().toString().padStart(2, '0')

        return `${hour}:${min}`
    }

    const addDays = (date, days) => {
        const result = new Date(date)
        result.setDate(result.getDate() + days)
        return result
    }

    const openRouteinfo = (info) => {
        Swal.fire({
            title: "Comentarios de la ruta",
            text: info,
            confirmButtonText: "cerrar"
        })
    }

    const mutation = useSendRequest()

    const openCalendar = (driver) => {
        const container = document.createElement("div")

        container.style.display = "flex"
        container.style.justifyContent = "center"
        container.style.alignItems = "center"
        container.style.height = "300px"

        const root = ReactDOM.createRoot(container)
        let selectedDate = null

        root.render(<Calendar multiple minDate={new Date()} maxDate={addDays(new Date(), 20)} style={{ fontSize: "1.5rem", padding: "20px" }} onChange={(daysSelected) => {
            selectedDate = Array.isArray(daysSelected) ? daysSelected.map((day) => day.toDate()) : [daysSelected.toDate()]
        }}/>)

        Swal.fire({
            title: "Selecciona el dia del trayecto",
            html: container,
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonText: "Solicitar",
            cancelButtonText: "Cancelar",
            allowOutsideClick: false,
            allowEscapeKey: false,

            willClose: () => root.unmount(),
            preConfirm: async () =>  {
                if(!selectedDate || selectedDate.length === 0) {
                    Swal.showValidationMessage("Debe seleccionar una fecha")
                    return false
                }              

                Swal.showLoading()

                await new Promise((resolve, reject) => {
                    const formatDate = (date) => {
                        return date.toISOString().split("T")[0]
                    }

                    mutation.mutate({
                        idRoute: driver.idUserRoutes, dayRequest: selectedDate.map(formatDate), userId: userData.idUsers
                    }, {
                        onSuccess: () => resolve(),
                        onError: (error) => reject(error)
                    })
                })

                refetch()
                Swal.fire("Solicitud enviada", "La solicitud fue enviada al conductor exitosamente", "success")

                return false
            }
        })
    }

    return (
        <>
            <table className="users-table" border={1} cellPadding={8}>
                <thead>
                    <tr>
                        <th>CONDUCTOR</th>
                        <th>PUNTO DE SALIDA</th>
                        <th>PUNTO DE LLEGADA</th>
                        <th>HORA SALIDA</th>
                        <th>HORA LLEGADA</th>
                        <th>SOLICITAR</th>
                        <th>VER RUTA</th>
                        <th>COMENTARIOS</th>
                    </tr>
                </thead>

                <tbody>
                    {ccurrentDrivers.map((driver) => (
                        <tr key={driver.idUserRoutes}>
                            <td>{driver.name}</td>
                            <td>{driver.startingPoint}</td>
                            <td>{driver.arrivalPoint}</td>
                            <td>{time(driver.startTime)}</td>
                            <td>{time(driver.arrivalTime)}</td>
                            <td>
                                {(() => {
                                    const { icon, label } = RequestButtons[null]

                                    return (
                                        <button className={`fill-hover-button-null`} onClick={() => openCalendar(driver)}>
                                            {icon}
                                            <span>{label}</span>
                                        </button>
                                    )
                                })()}
                            </td> 
                            <td>
                                <a href={`https://www.google.com/maps/dir/${driver.startingPoint}/${driver.arrivalPoint}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="icon-button"
                                    aria-label="Abrir en Google Maps">
                                    
                                    <svg xmlns="http://www.w3.org/2000/svg" aria-label="Google Maps" role="img" viewBox="0 0 512 512">
                                        <rect width="512" height="512" rx="15%" fill="#ffffff"/>
                                        <clipPath id="a">
                                            <path d="M375 136a133 133 0 00-79-66 136 136 0 00-40-6 133 133 0 00-103 48 133 133 0 00-31 86c0 38 13 64 13 64 15 32 42 61 61 86a399 399 0 0130 45 222 222 0 0117 42c3 10 6 13 13 13s11-5 13-13a228 228 0 0116-41 472 472 0 0145-63c5-6 32-39 45-64 0 0 15-29 15-68 0-37-15-63-15-63z"/>
                                        </clipPath>
                                        <g strokeWidth="130" clipPath="url(#a)">
                                            <path stroke="#fbbc04" d="M104 379l152-181"/>
                                            <path stroke="#4285f4" d="M256 198L378 53"/>
                                            <path stroke="#34a853" d="M189 459l243-290"/>
                                            <path stroke="#1a73e8" d="M255 120l-79-67"/>
                                            <path stroke="#ea4335" d="M76 232l91-109"/>
                                        </g>
                                        <circle cx="256" cy="198" r="51" fill="#ffffff"/>
                                    </svg>
                                </a>
                            </td>
                            <td>
                                <button className="button-comentarios" data-tooltip="Ver comentarios" type="button" onClick={() => openRouteinfo(driver.routeInfo)}>
                                    <div className="button-comentarios-wrapper">
                                        <div className="text-comentarios ">Ver mas</div>
                                        <span className="icon-comentarios ">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-lg" viewBox="0 0 16 16">
                                                <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
                                            </svg>
                                        </span>
                                    </div>
                                </button>
                            </td>
                        </tr>
                    ))}
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
        </>
        
    )
}

export default RouteTable