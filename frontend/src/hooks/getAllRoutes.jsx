import { useState, useEffect, useRef } from "react"
import { useQuery } from "@tanstack/react-query"
import { DisableAllRoutes, ChangeStatusRoute } from "../services/handleActivationRoute"
import Swal from "sweetalert2"

const DriversRoute = () => {
    const [search, setSearch] = useState("")

    const openRouteinfo = (info) => {
        Swal.fire({
            title: "Comentarios de la ruta",
            text: info,
            confirmButtonText: "cerrar"
        })
    }

    const fetchUserRoutes = async () => {
        const response = await fetch("http://localhost:3000/carpool/driver/getUserRoute")
        const data = await response.json()
        return data[0]
    }

    const { data: drivers = [], isLoading, error, refetch } = useQuery({
        queryKey: ["userRoutes"],
        queryFn: fetchUserRoutes
    })

    const valueToSearch = drivers.filter((driver) => {
        const value = search.toLowerCase()
        
        return (
            driver.name.toLowerCase().includes(value) || 
            driver.startingPoint.toLowerCase().includes(value) || 
            driver.arrivalPoint.toLowerCase().includes(value) || 
            driver.startTime.toLowerCase().includes(value) ||
            driver.arrivalTime.toLowerCase().includes(value)
        )
    })

    const time = (timeString) => {
        const date = new Date(timeString)
        const hour = date.getUTCHours().toString().padStart(2, '0')
        const min = date.getUTCMinutes().toString().padStart(2, '0')

        return `${hour}:${min}`
    }

    return (
        <>
            <div>
                <div className="route-container">
                    <div className="car-full">
                        <p>CAR FULL</p>
                        <label className="switch2">
                            <input type="checkbox" onChange={async () => {
                                await DisableAllRoutes()
                                refetch()
                            }}/>
                            <span className="slider"></span>
                        </label>       
                    </div>

                    <div className="search-bar">
                        <label htmlFor="input" className="text">Buscar:</label>
                        <input type="text" name="input" className="input" placeholder="Escribe algo..." value={search} onChange={(event) => setSearch(event.target.value)} style={{ marginBottom: "1rem", padding: "0.5rem", width: "87%" }}/>
                    </div>
                </div>

                <table className="users-table" border={1} cellPadding={10}>
                    <thead>
                        <tr>
                            <th>ID </th>
                            <th>PUNTO DE SALIDA</th>
                            <th>PUNTO DE LLEGADA</th>
                            <th>TIEMPO DE SALIDA</th>
                            <th>TIEMPO DE LLEGADA ESTIMADA</th>
                            <th>TIPO DE RUTA</th>
                            <th>ACTIVAR / DESACTIVAR</th>
                            <th>VER RUTA</th>
                            <th>COMENTARIOS</th>
                        </tr>
                    </thead>

                    <tbody>
                        {valueToSearch.map((driver) => (
                            <tr key={driver.idUserRoutes}>
                                <td>{driver.idUserRoutes}</td>
                                <td>{driver.startingPoint}</td>
                                <td>{driver.arrivalPoint}</td>
                                <td>{time(driver.startTime)}</td>
                                <td>{time(driver.arrivalTime)}</td>
                                <td>{driver.routeWay}</td>
                                <td>
                                    <div className="active-container">
                                        <input type="checkbox" id={`checkbox-${driver.idUserRoutes}`} className="checkbox-hidden" checked={driver.nameStatus === "activa"} onChange={async () => { await ChangeStatusRoute(driver.idUserRoutes), await refetch()}}/>
                                        <label htmlFor={`checkbox-${driver.idUserRoutes}`} className="switch">ACTIVA</label>
                                    </div>
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
            </div>
        </>
    )
}

export default DriversRoute