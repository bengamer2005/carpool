import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
// servicios
import { getGoingRoutes, getReturnRoutes } from "../services/passengerService" 
// componentes
import RouteTable from "../components/routesTable"

const Drivers = () => {
    const [search, setSearch] = useState("")
    const [showReturn, setShowReturn] = useState(false)

    // obtenemos toda la info del usuario en pantalla
    const userData = JSON.parse(localStorage.getItem("user"))
    
    // usamos useQuery para asignarle el servicio a una queryKey para poder invalidar el query de las de ida
    const { data: driversGoing = [], refetch: refetchGoing} = useQuery({
        queryKey: ["goingRoutes"],
        queryFn: () => getGoingRoutes(userData.idUsers),
        enabled: !!userData.idUsers
    })

    // usamos useQuery para asignarle el servicio a una queryKey para poder invalidar el query de las de regreso
    const { data: driversReturn = [], refetch: refetchReturn} = useQuery({
        queryKey: ["returnRoutes"],
        queryFn: () => getReturnRoutes(userData.idUsers),
        enabled: !!userData.idUsers
    })

    // hacemos la logica del buscador para ambos ida y regreso 
    const valueToSearch = driversGoing.filter((driver) => {
        const value = search.toLowerCase().trim()

        // buscamos en todas las columnas de la tabla de ida
        return (
            driver.name.toLowerCase().includes(value) || 
            driver.startingPoint.toLowerCase().includes(value) || 
            driver.arrivalPoint.toLowerCase().includes(value) || 
            driver.startTime.toLowerCase().includes(value) ||
            driver.arrivalTime.toLowerCase().includes(value)
        )
    })

    const valueToSearchReturn = driversReturn.filter((driver) => {
        const value = search.toLowerCase().trim()

        // buscamos en todas las columnas de la tabla de regreso
        return (
            driver.name.toLowerCase().includes(value) || 
            driver.startingPoint.toLowerCase().includes(value) || 
            driver.arrivalPoint.toLowerCase().includes(value) || 
            driver.startTime.toLowerCase().includes(value) ||
            driver.arrivalTime.toLowerCase().includes(value)
        )
    })

    return (
        <div className="main-slider-container">
            
            {/* si showReturn es true se traslada -50% para mostarar la otra tabla escondida*/}
            <div className="slider2" style={{ transform: showReturn ? 'translateX(-50%)' : 'translateX(0)' }}>

                <div className="container-route">
                    <h2 className="title-routeStart">CONDUCTORES DISPONIBLES DE ENTRADA</h2>
                    
                    <div className="route-container">
                        <div className="car-full">
                            
                            {/* le asignamos al boton setShowReturn a true, y le asignamos un refetch a las rutas de regreso */}
                            <button className="cssbuttons-io-button" onClick={() => {setShowReturn(true), refetchReturn()}}>
                                Ver rutas de salida
                                <div className="icon">
                                    <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M0 0h24v24H0z" fill="none"></path>
                                        <path d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z" fill="currentColor"></path>
                                    </svg>
                                </div>
                            </button>
                        </div>

                        {/* inpput para buscar */}
                        <div className="search-bar">
                            <label htmlFor="input-search" className="text-search">Buscar:</label>
                            <input type="text" name="input-search" className="input-search" placeholder="Escribe algo..." value={search} onChange={(event) => setSearch(event.target.value)} style={{ marginBottom: "1rem", padding: "0.5rem", width: "87%" }}/>
                        </div>
                    </div>

                    {/* se llama al componente RouteTable y se llena con valueToSearch */}
                    <RouteTable drivers={valueToSearch} refetch={refetchGoing}/>
                </div>

                <div className="container-route">
                    <h2 className="title-routeReturn">CONDUCTORES DISPONIBLES DE SALIDA</h2>
                    
                    <div className="route-container">
                        <div className="car-full">

                            {/* le asignamos al boton setShowReturn a false, y le asignamos un refetch a las rutas de ida */}
                            <button className="cssbuttons-io-button" onClick={() => {setShowReturn(false), refetchGoing()}} >
                                Ver rutas de entrada
                                <div className="icon">
                                    <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M0 0h24v24H0z" fill="none"></path>
                                        <path d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z" fill="currentColor" transform="scale(-1,1) translate(-24,0)"/>
                                    </svg>
                                </div>
                            </button>
                        </div>

                        {/* inpput para buscar */}
                        <div className="search-bar">
                            <label htmlFor="input-search" className="text-search">Buscar:</label>
                            <input type="text" name="input-search" className="input-search" placeholder="Escribe algo..." value={search} onChange={(event) => setSearch(event.target.value)} style={{ marginBottom: "1rem", padding: "0.5rem", width: "87%" }}/>
                        </div>

                    </div>

                    {/* se llama al componente RouteTable y se llena con valueToSearchReturn */}
                    <RouteTable drivers={valueToSearchReturn} refetch={refetchReturn}/>
                </div>
            </div>
        </div>
    )
}

export default Drivers