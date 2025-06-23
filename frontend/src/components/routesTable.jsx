import React from "react"
import Swal from "sweetalert2"

const RouteTable = ({drivers}) => {
    const time = (timeString) => {
        const date = new Date(timeString)
        const hour = date.getUTCHours().toString().padStart(2, '0')
        const min = date.getUTCMinutes().toString().padStart(2, '0')

        return `${hour}:${min}`
    }

    const openRouteinfo = (info) => {
        Swal.fire({
            title: "Comentarios de la ruta",
            text: info,
            confirmButtonText: "cerrar"
        })
    }

    return (
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
                {drivers.map((driver) => (
                    <tr key={driver.idUserRoutes}>
                        <td>{driver.name}</td>
                        <td>{driver.startingPoint}</td>
                        <td>{driver.arrivalPoint}</td>
                        <td>{time(driver.startTime)}</td>
                        <td>{time(driver.arrivalTime)}</td>
                        <td>
                            <button className="fill-hover-button">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-geo-alt-fill" viewBox="0 0 16 16">
                                    <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6"/>
                                </svg>
                                <span>SOLICITAR</span>
                            </button>
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
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">
                                            <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
                                        </svg>
                                    </span>
                                </div>
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default RouteTable