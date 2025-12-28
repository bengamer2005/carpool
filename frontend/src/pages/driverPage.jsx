import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { motion, AnimatePresence } from "framer-motion"
import { Notyf } from "notyf"
// hook
import DriversRoute from "../hooks/getAllRoutes"
import { useRegisterRoute } from "../hooks/getMutations"
import DriverRequests from "../hooks/getAllRequests"
import GetAllRides from "../hooks/getAllRides"
// componentes
import Header from "../components/header"
import RouteForm from "../components/routeRegisterForm"
import Navbar from "../components/navbar"
// servicios
import { reverseGeocode, geocodeAddress } from "../services/handleDirection"
import { getAllRides } from "../services/driverService"
import { AllDriverRequest } from "../services/driverService"
import useSSEListen from "../services/sseService"
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
    // conseguimos la info del user desde localStorage
    const userData = JSON.parse(localStorage.getItem("user"))
    useSSEListen(userData.idUsers)

    // se manda notificacion de bienvenida
    useEffect(() => {
        notyf.success(`Bienvenido al apartado de conductores ${userData.username}`)
    }, [])

    // se consigue el id del usuario en pantalla
    const [formRouteType, setFormRouteType] = useState("entrada")
    const [showReturn, setShowReturn] = useState(false)

    // se declara una constante regresar si es entrada o salida el cambio de ruta
    const toogleRouteType = () => {
        setFormRouteType((prev) => (prev === "entrada" ? "salida" : "entrada"))
    }

    // se pone por default las LatLon del condominio acero y centro guadalupe
    const condominioAcero = [25.66571198706896, -100.31137067509901]
    const centroGuadalupe = [25.674436353053647, -100.2151261657441]

    // para entrada
    const [startingPoint, setStartingPoint] = useState({ coords: centroGuadalupe, address: "" })
    const [arrivalPoint, setArrivalPoint] = useState({ coords: condominioAcero, address: "" })
    const [startTime, setStartTime] = useState("")
    const [arrivalTime, setArrivalTime] = useState("")
    const [routeInfo, setRouteInfo] = useState("")
    const idRouteWayGoing = 1

    // para salida
    const [startingPointReturn, setStartingPointReturn] = useState({ coords: condominioAcero, address: "" })
    const [arrivalPointReturn, setArrivalPointReturn] = useState({ coords: centroGuadalupe, address: "" })
    const [startTimeReturn, setStartTimeReturn] = useState("")
    const [arrivalTimeReturn, setArrivalTimeReturn] = useState("")
    const [routeInfoReturn, setRouteInfoReturn] = useState("")
    const idRouteWayReturn = 2
    const idStatus = 1
    const active = 1

    const handleWaypointChange = async (waypoints, setStartFn, setArrivalFn) => {
        const [startLatLng, endLatLng] = waypoints

        // se almacena las direcciones en base a las LatLon obtenidas
        const startAddress = await reverseGeocode(startLatLng.lat, startLatLng.lng)
        const endAddress = await reverseGeocode(endLatLng.lat, endLatLng.lng)

        setStartFn({ coords: [startLatLng.lat, startLatLng.lng], address: startAddress })
        setArrivalFn({ coords: [endLatLng.lat, endLatLng.lng], address: endAddress })
    }

    // se le asigna a una constante el post
    const mutation = useRegisterRoute()

    const handleCreateRoute = ({startingPoint, arrivalPoint, startTime, arrivalTime, idRouteWay, routeInfo}) => async (event) => {
        event.preventDefault()

        // se agrupan todos los campos a mandar para el post
        const data = {
            startingPoint: startingPoint.address,
            arrivalPoint: arrivalPoint.address,
            idStatus,
            startTime,
            arrivalTime,
            idUsers: userData.idUsers,
            idRouteWay,
            routeInfo,
            active
        }

        try {
            
            // se hace el post de la ruta
            await mutation.mutateAsync({
                data, idUsers: userData.idUsers
            })

            // vaciamos los campos 
            setStartTime("")
            setStartTimeReturn("")
            setArrivalTime("")
            setArrivalTimeReturn("")
            setRouteInfo("")
            setRouteInfoReturn("")

            // se le notifica al usuario el exito 
            notyf.success("Ruta registrada con exito")
        } catch (error) {

            // en caso de que falle le decimos con los mensajes del backend
            notyf.error(error.message || "Ocurrió un error al registrar la ruta")
            console.error("Error en handleCreateRoute:", error)
        }
    }

    // usamos useQuery para asignarle el servicio a una queryKey para poder invalidar el query
    const { data: rides = [], refetch } = useQuery({
        queryKey: ["userRides"],
        queryFn: () => getAllRides(userData.idUsers),
        enabled: !!userData.idUsers
    })

    // usamos useQuery para asignarle el servicio a una queryKey para poder invalidar el query
    const { data: requests = [], refetch: refetchReq } = useQuery({
        queryKey: ["request"],
        queryFn: () => AllDriverRequest(userData.idUsers),
        enabled: !!userData.idUsers
    })

    return (
        <>
            <Header/>
            <Navbar/>

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
                            idUsers={userData.idUsers}
                            geocodeAddress={geocodeAddress}
                            startTime={startTime}
                            setStartTime={setStartTime}
                            arrivalTime={arrivalTime}
                            setArrivalTime={setArrivalTime}
                            handleCreateRoute={(e) => handleCreateRoute({
                                startingPoint, arrivalPoint, startTime, arrivalTime, idRouteWay: idRouteWayGoing, routeInfo
                            })(e)}
                            handleWaypointChange={(waypoints) => {
                                handleWaypointChange(waypoints, setStartingPoint, setArrivalPoint)}
                            }
                            maps={maps}
                            idRouteWay={idRouteWayGoing}
                            routeInfo={routeInfo}
                            setRouteInfo={setRouteInfo}
                        />

                        <div className="center">¿Quieres cambiar el tipo de ruta?{' '}
                            <div className="button-padding">       
                                <button className="button-change-route" onClick={toogleRouteType}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left-right" viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 11H1.5a.5.5 0 0 0-.5.5m14-7a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H14.5a.5.5 0 0 1 .5.5"/>
                                    </svg>
                                    {" "}CAMBIAR A SALIDA
                                </button>
                            </div>
                        </div>
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
                            idUsers={userData.idUsers}
                            geocodeAddress={geocodeAddress}
                            startTime={startTimeReturn}
                            setStartTime={setStartTimeReturn}
                            arrivalTime={arrivalTimeReturn}
                            setArrivalTime={setArrivalTimeReturn}
                            handleCreateRoute={(e) => handleCreateRoute({
                                startingPoint: startingPointReturn,
                                arrivalPoint: arrivalPointReturn,
                                startTime: startTimeReturn,
                                arrivalTime: arrivalTimeReturn,
                                idRouteWay: idRouteWayReturn,
                                routeInfo: routeInfoReturn
                            })(e)}
                            handleWaypointChange={(waypoints) => {
                                handleWaypointChange(waypoints, setStartingPointReturn, setArrivalPointReturn)}
                            }
                            maps={maps}
                            idRouteWay={idRouteWayReturn}
                            routeInfo={routeInfoReturn}
                            setRouteInfo={setRouteInfoReturn}
                        />

                        <div className="center">¿Quieres cambiar el tipo de ruta?{' '}
                            <div className="button-padding">       
                                <button className="button-change-route" onClick={toogleRouteType}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left-right" viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 11H1.5a.5.5 0 0 0-.5.5m14-7a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H14.5a.5.5 0 0 1 .5.5"/>
                                    </svg>
                                    {" "}CAMBIAR A ENTRADA
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* RUTAS */}
            <h2 className="title">MIS RUTAS</h2>
            <DriversRoute></DriversRoute>

            {/* SOLICITUDES Y VIAJES PENDIENTES */}
            <div className="main-slider-container">
                <div className="slider2" style={{ transform: showReturn ? 'translateX(-50%)' : 'translateX(0)' }}>
                    <div className="container-route">

                        <div style={{ position: "relative", width: "100%" }}>
                            <div>
                                <DriverRequests requests={requests}/>
                            </div>

                            <button className="cssbuttons-io-button-vertical" style={{ position: "absolute", right: "-60px", top: "65%", transform: "translateY(-50%) rotate(90deg)", transformOrigin: "center", zIndex: 10 }} onClick={() => {setShowReturn(true), refetchReq()}}>
                                Ver viajes pendientes
                                <div className="icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-up-short" viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5"/>
                                    </svg>
                                </div>
                            </button>
                        </div>
                    </div>

                    <div className="container-route">
                        <div style={{ position: "relative", width: "100%" }}>
                            <button className="cssbuttons-io-button-vertical" style={{ position: "absolute", left:"-60px", top: "60%", transform: "translateY(-50%) rotate(270deg)", transformOrigin: "center", zIndex: 10 }} onClick={() => {setShowReturn(false), refetch()}}>
                                Ver solicitudes pendientes
                                <div className="icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-up-short" viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5"/>
                                    </svg>
                                </div>
                            </button>

                            <div>
                                <GetAllRides rides={rides}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Driver