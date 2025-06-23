import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
// servicios
import { getGoingRoutes, getReturnRoutes } from "../services/handleRouteType" 
// componentes
import RouteTable from "../components/routesTable"

const Drivers = () => {
    const [search, setSearch] = useState("")
    const [showReturn, setShowReturn] = useState(false)
    
    const { data: driversGoing = [], isLoading: loadingGoing, error: errorGoing, refetch: refetchGoing} = useQuery({
        queryKey: ["goingRoutes"],
        queryFn: getGoingRoutes
    })

    const { data: driversReturn = [], isLoading: loadingReturn, error: errorReturn, refetch: refetchReturn} = useQuery({
        queryKey: ["returnRoutes"],
        queryFn: getReturnRoutes
    })

    const valueToSearch = driversGoing.filter((driver) => {
        const value = search.toLowerCase()

        return (
            driver.name.toLowerCase().includes(value) || 
            driver.startingPoint.toLowerCase().includes(value) || 
            driver.arrivalPoint.toLowerCase().includes(value) || 
            driver.startTime.toLowerCase().includes(value) ||
            driver.arrivalTime.toLowerCase().includes(value)
        )
    })

    const valueToSearchReturn = driversReturn.filter((driver) => {
        const value = search.toLowerCase()

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
            <div className="slider2" style={{ transform: showReturn ? 'translateX(-100vw)' : 'translateX(0)' }}>

                <div className="container-route">
                    <h2 className="title-routeStart">CONDUCTORES DISPONIBLES DE ENTRADA</h2>
                    
                    <div className="route-container">
                        <div className="car-full">
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

                        <div className="search-bar">
                            <label htmlFor="input" className="text">Buscar:</label>
                            <input type="text" name="input" className="input" placeholder="Escribe algo..." value={search} onChange={(event) => setSearch(event.target.value)} style={{ marginBottom: "1rem", padding: "0.5rem", width: "87%" }}/>
                        </div>
                    </div>

                    <RouteTable drivers={valueToSearch}/>
                </div>

                <div className="container-route">
                    <h2 className="title-routeReturn">CONDUCTORES DISPONIBLES DE SALIDA</h2>
                    
                    <div className="route-container">
                        <div className="car-full">
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

                        <div className="search-bar">
                            <label htmlFor="input" className="text">Buscar:</label>
                            <input type="text" name="input" className="input" placeholder="Escribe algo..." value={search} onChange={(event) => setSearch(event.target.value)} style={{ marginBottom: "1rem", padding: "0.5rem", width: "87%" }}/>
                        </div>

                    </div>

                    <RouteTable drivers={valueToSearchReturn}/>
                </div>
            </div>
        </div>
    )
}

export default Drivers