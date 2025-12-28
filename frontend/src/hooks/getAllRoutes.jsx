import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Notyf } from "notyf"
import { DisableAllRoutes, ChangeStatusRoute, UserRoutes } from "../services/driverService"
import { useSetNotVisibleRoute } from "./getMutations"
import Swal from "sweetalert2"

const notyf = new Notyf({
    position: { x: "right", y: "bottom" },
    duration: 5000,
})

const DriversRoute = () => {
    const [search, setSearch] = useState("")
    const [carfullChecked, setCarfullChecked] = useState(false)

    // obtenemos toda la info del usuario en pantalla
    const userData = JSON.parse(localStorage.getItem("user"))

    const { mutate } = useSetNotVisibleRoute()

    // hacemos una funcion con swal para mostrar los comentarios de una ruta en forma de modal
    const openRouteinfo = (info) => {
        Swal.fire({
            title: "Comentarios de la ruta",
            text: info,
            confirmButtonText: "cerrar"
        })
    }

    // handle para eliminar ruta
    const handleDeleteRoute = async (idUserRoutes) => {
        Swal.fire({
            icon: "warning",
            title: "¿Deseas eliminar esta ruta?",
            text: "Al eliminar la ruta ya no se podrá recuperar",
            confirmButtonColor: "#ef4444",
            confirmButtonText: "Eliminar",
            showCancelButton: true,
            cancelButtonText: "Conservar ruta",
            cancelButtonColor: "#818181ff",
            iconColor: "#ef4444"
        }).then((result) => {
            if(result.isConfirmed) {
                mutate({
                    idUserRoute: idUserRoutes
                }, {
                    // si todo sale bien le decimos al conductor que todo salio bien y cual fue su accion 
                    onSuccess: () => {
                        notyf.success("Ruta eliminada con éxito")
                    }
                })
            }
        })
    }

    // usamos useQuery para asignarle el servicio a una queryKey para poder invalidar el query  
    const { data: drivers = [], refetch } = useQuery({
        queryKey: ["userRoutes"],
        queryFn: () => UserRoutes(userData.idUsers),
        enabled: !!userData.idUsers
    })

    // desactivamos el estado del slider de carfull si se activa una ruta 
    useEffect(() => {
        const actveRoutes = drivers.some(driver => driver.nameStatus === "activa")
        if(actveRoutes) {
            setCarfullChecked(false)
        }
    }, [drivers])

    // hacemos la logica del buscador
    const valueToSearch = drivers.filter((driver) => {
        // pasamos los parametros a buscar y los ponemos en minusculas y quitamos espacios 
        const value = search.toLowerCase().trim()
        
        // buscamos en todas las columnas el parametro a buscar
        return (
            driver.idUserRoutes.toString().includes(value) || 
            driver.startingPoint.toLowerCase().includes(value) || 
            driver.arrivalPoint.toLowerCase().includes(value) || 
            driver.startTime.toLowerCase().includes(value) ||
            driver.arrivalTime.toLowerCase().includes(value) ||
            driver.routeWay.toLowerCase().includes(value)
        )
    })

    // le damos un formato a la hora
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

                    {/* slider para desactivar todas las rutas, carfull */}
                    <div className="car-full">
                        <p>CAR FULL</p>
                        <label className="switch2">
                            <input type="checkbox" checked={carfullChecked} onChange={async (event) => {
                                // le asignamos el estatus del checkbox a una constante
                                const checked = event.target.checked
                                
                                setCarfullChecked(checked)

                                // solo si checked se pasa a true deshabilita las rutas y hace el refetch
                                if(checked) {
                                    await DisableAllRoutes(userData.idUsers)
                                    refetch()
                                }
                            }}/>
                            <span className="slider"></span>
                        </label>       
                    </div>

                    {/* input para buscar en la tabla */}
                    <div className="search-bar">
                        <label htmlFor="input-search" className="text-search">Buscar:</label>
                        <input type="text" name="input-search" className="input-search" placeholder="Escribe algo..." value={search} onChange={(event) => setSearch(event.target.value)} style={{ marginBottom: "1rem", padding: "0.5rem", width: "87%" }}/>
                    </div>
                </div>

                {/* tabla con todas las rutas y su info */}
                <table className="users-table-driver" border={1} cellPadding={10}>
                    <thead>
                        <tr>
                            <th>ID </th>
                            <th>PUNTO DE SALIDA</th>
                            <th>PUNTO DE LLEGADA</th>
                            <th>HORARIO SALIDA</th>
                            <th>HORARIO LLEGADA ESTIMADA</th>
                            <th>TIPO DE RUTA</th>
                            <th>ACTIVAR / DESACTIVAR</th>
                            <th>VER RUTA</th>
                            <th>COMENTARIOS</th>
                        </tr>
                    </thead>

                    <tbody>
                        {valueToSearch.map((driver) => (
                            <tr key={driver.idUserRoutes}>
                                <td>
                                    <div className="id-cell-container" onClick={() => handleDeleteRoute(driver.idUserRoutes)}>
                                        <div className="id-content">
                                            <span className="id-number">{driver.idUserRoutes}</span>
                                            <span className="delete-icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                                                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                                                </svg>
                                            </span>
                                        </div>
                                    </div>
                                </td>

                                <td>{driver.startingPoint}</td>
                                <td>{driver.arrivalPoint}</td>
                                <td>{time(driver.startTime)}</td>
                                <td>{time(driver.arrivalTime)}</td>
                                <td>{driver.routeWay}</td>

                                {/* checkbox para activar y desactivar rutas */}
                                <td>
                                    <div className="active-container">
                                        <input type="checkbox" id={`checkbox-${driver.idUserRoutes}`} className="checkbox-hidden" checked={driver.nameStatus === "activa"} onChange={async () => { await ChangeStatusRoute(driver.idUserRoutes), await refetch()}}/>
                                        <label htmlFor={`checkbox-${driver.idUserRoutes}`} className="switch">ACTIVA</label>
                                    </div>
                                </td>

                                {/* link a google maps pasandole las direcciones de ida y regreso */}
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

                                {/* boton para poder ver los comentarios */}
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
            </div>
        </>
    )
}

export default DriversRoute