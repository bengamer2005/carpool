import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Notyf } from "notyf"
// hook
import DriversRoute from "../hooks/getAllRoutes"
import GetUserInfo from "../hooks/getUserInfo"
import { useRegisterRoute } from "../hooks/getRoutesInfo"
// componentes
import Header from "../components/header"
import Navbar from "../components/navbar"
import RouteForm from "../components/routeRegisterForm"
// servicios
import { reverseGeocode, geocodeAddress } from "../services/handleDirection" 
import "notyf/notyf.min.css"
import "leaflet/dist/leaflet.css"

const maps = {
  base: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
}

const notyf = new Notyf({
    position: { x: "right", y: "bottom" },
    duration: 5000
})

const Driver = () => {
    const { idUsers } = GetUserInfo()
    const [formRouteType, setFormRouteType] = useState("entrada")

    const toogleRouteType = () => {
        setFormRouteType((prev) => (prev === "entrada" ? "salida" : "entrada"))
    }

    // PARA ENTRADA
    const [startingPoint, setStartingPoint] = useState({ coords: [25.67807842347003, -100.25897326440125], address: "" })
    const [arrivalPoint, setArrivalPoint] = useState({ coords: [25.665771, -100.311216], address: "" })
    // PARA SALIDA
    const [startingPointReturn, setStartingPointReturn] = useState({ coords: [25.665771, -100.311216], address: "" })
    const [arrivalPointReturn, setArrivalPointReturn] = useState({ coords: [25.67807842347003, -100.25897326440125], address: "" })

    const [startTime, setStartTime] = useState("")
    const [arrivalTime, setArrivalTime] = useState("")
    const [routeInfo, setRouteInfo] = useState("")
    const idRouteWayGoing = 1
    const idRouteWayReturn = 2
    const idStatus = 1

    const handleWaypointChange = async (waypoints) => {
        const [startLatLng, endLatLng] = waypoints

        const startAddress = await reverseGeocode(startLatLng.lat, startLatLng.lng)
        const endAddress = await reverseGeocode(endLatLng.lat, endLatLng.lng)

        setStartingPoint({ coords: [startLatLng.lat, startLatLng.lng], address: startAddress })
        setArrivalPoint({ coords: [endLatLng.lat, endLatLng.lng], address: endAddress })
    }

    const mutation = useRegisterRoute()

    const handleCreateRoute = (idRouteWay) => async (event) => {
        event.preventDefault()

        const data = {
            startingPoint: startingPoint.address,
            arrivalPoint: arrivalPoint.address,
            idStatus,
            startTime,
            arrivalTime,
            idUsers,
            idRouteWay,
            routeInfo
        }

        console.log(data)

        try {
            await mutation.mutateAsync(data)
            notyf.success("RUTA registrada con exito")
        } catch (error) {
            notyf.error("Faltan datos para registar")
            console.error("Error en handleCreateRoute:", error)
        }
    }

    return (
        <>
            <Header />
            <Navbar />

            {/* FORMULARIOS */}
            <AnimatePresence mode="wait">
                {formRouteType === "entrada" ? (
                    <motion.div
                        key="entrada"
                        initial={{ opacity: 0, x: 60 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -60 }}
                        transition={{ duration: 0.4 }}
                    >
                        <h2 className="title-routeStart">AGREGAR RUTAS DE ENTRADA</h2>
                        <RouteForm
                            startingPoint={startingPoint}
                            setStartingPoint={setStartingPoint}
                            arrivalPoint={arrivalPoint}
                            setArrivalPoint={setArrivalPoint}
                            idUsers={idUsers}
                            geocodeAddress={geocodeAddress}
                            startTime={startTime}
                            setStartTime={setStartTime}
                            arrivalTime={arrivalTime}
                            setArrivalTime={setArrivalTime}
                            handleCreateRoute={handleCreateRoute}
                            handleWaypointChange={handleWaypointChange}
                            maps={maps}
                            idRouteWay={idRouteWayGoing}
                            routeInfo={routeInfo}
                            setRouteInfo={setRouteInfo}
                        />

                        <p className="center">¿Quieres cambiar el tipo de ruta?{' '}
                            <div className="button-padding">       
                                <button className="button-change-route" onClick={toogleRouteType}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left-right" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 11H1.5a.5.5 0 0 0-.5.5m14-7a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H14.5a.5.5 0 0 1 .5.5"/>
                                    </svg>
                                    {" "}CAMBIAR A SALIDA
                                </button>
                            </div>
                        </p>
                    </motion.div>
                ) : (
                    <motion.div
                        key="salida"
                        initial={{ opacity: 0, x: 60 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -60 }}
                        transition={{ duration: 0.4 }}
                    >
                        <h2 className="title-routeReturn">AGREGAR RUTAS DE SALIDA</h2>
                        <RouteForm
                            startingPoint={startingPointReturn}
                            setStartingPoint={setStartingPointReturn}
                            arrivalPoint={arrivalPointReturn}
                            setArrivalPoint={setArrivalPointReturn}
                            idUsers={idUsers}
                            geocodeAddress={geocodeAddress}
                            startTime={startTime}
                            setStartTime={setStartTime}
                            arrivalTime={arrivalTime}
                            setArrivalTime={setArrivalTime}
                            handleCreateRoute={handleCreateRoute}
                            handleWaypointChange={handleWaypointChange}
                            maps={maps}
                            idRouteWay={idRouteWayReturn}
                        />

                        <p className="center">¿Quieres cambiar el tipo de ruta?{' '}
                            <div className="button-padding">       
                                <button className="button-change-route" onClick={toogleRouteType}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left-right" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 11H1.5a.5.5 0 0 0-.5.5m14-7a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H14.5a.5.5 0 0 1 .5.5"/>
                                    </svg>
                                    {" "}CAMBIAR A ENTRADA
                                </button>
                            </div>
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* RUTAS */}
            <h2 className="title">MIS RUTAS</h2>
            <DriversRoute></DriversRoute>
        </>
    )
}

export default Driver